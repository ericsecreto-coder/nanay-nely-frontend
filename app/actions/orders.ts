"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { CartItem, OrderStatus } from "@/lib/types/database";
import { ORDER_STATUSES } from "@/lib/types/database";
import { createNotification } from "@/lib/notifications";

type CheckoutInput = {
  customerName: string;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
  items: CartItem[];
};

async function assertCustomer() {
  const { user, role } = await getCurrentUserWithRole();
  if (!user || isAdminRole(role)) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function assertAdmin() {
  const { user, role } = await getCurrentUserWithRole();
  if (!user || !isAdminRole(role)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function submitOrderAction(input: CheckoutInput) {
  try {
    const user = await assertCustomer();

    if (!input.items.length) {
      return { error: "Your cart is empty." };
    }

    if (!input.customerName.trim() || !input.contactNumber.trim()) {
      return { error: "Name and contact number are required." };
    }

    const supabase = await createClient();
    const productIds = input.items.map((item) => item.productId);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      return { error: "Unable to validate products." };
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItems: {
      product_id: string;
      product_name: string;
      unit_price: number;
      quantity: number;
      line_total: number;
    }[] = [];

    let total = 0;

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product || !product.is_active) {
        return { error: `Product "${item.name}" is no longer available.` };
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;
      total += lineTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: unitPrice,
        quantity: item.quantity,
        line_total: lineTotal
      });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: input.customerName.trim(),
        contact_number: input.contactNumber.trim(),
        delivery_address: input.deliveryAddress.trim(),
        notes: input.notes.trim() || null,
        total,
        status: "pending"
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return { error: orderError?.message ?? "Failed to create order." };
    }

    const itemsPayload = orderItems.map((item) => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return { error: itemsError.message };
    }

    await createNotification({
      userId: null,
      type: "new_order",
      title: "New Order Received",
      message: `${input.customerName.trim()} placed an order worth ${new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(total)}.`,
      relatedOrderId: order.id,
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/notifications");

    return { success: true, orderId: order.id };
  } catch {
    return { error: "You must be logged in as a customer to place an order." };
  }
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  try {
    await assertAdmin();

    if (!ORDER_STATUSES.includes(status)) {
      return { error: "Invalid order status." };
    }

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, customer_name, total")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { error: "Order not found." };
    }

    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

    if (error) {
      return { error: error.message };
    }

    if (status === "confirmed") {
      await createNotification({
        userId: order.user_id,
        type: "order_confirmed",
        title: "Order Confirmed",
        message: `Your order has been confirmed by Nanay Nely. We'll notify you when it ships!`,
        relatedOrderId: orderId,
      });
    } else {
      await createNotification({
        userId: order.user_id,
        type: "order_status",
        title: `Order ${STATUS_LABELS[status]}`,
        message: `Your order #${orderId.slice(0, 8)} is now ${STATUS_LABELS[status].toLowerCase()}.`,
        relatedOrderId: orderId,
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/admin/notifications");
    revalidatePath("/dashboard");

    return { success: true };
  } catch {
    return { error: "Unauthorized" };
  }
}
