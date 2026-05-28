import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types/database";

export async function getCustomerOrders(userId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as OrderWithItems[];
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as OrderWithItems[];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OrderWithItems;
}
