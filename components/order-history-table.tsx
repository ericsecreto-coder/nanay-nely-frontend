import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";
import { formatDate, formatOrderId, formatOrderStatus, orderStatusBadgeClass } from "@/lib/utils/order-status";
import type { OrderWithItems } from "@/lib/types/database";

type Props = {
  orders: OrderWithItems[];
};

export function OrderHistoryTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "1.5rem", color: "var(--w55)" }}>
        No orders yet.{" "}
        <Link href="/products" style={{ color: "var(--honey)" }}>
          Browse products
        </Link>{" "}
        or{" "}
        <Link href="/cart" style={{ color: "var(--honey)" }}>
          view your cart
        </Link>
        .
      </p>
    );
  }

  return (
    <table className="ot">
      <thead>
        <tr>
          <th>Order</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{formatOrderId(order.id)}</td>
            <td>
              {order.order_items.map((item) => (
                <div key={item.id} style={{ fontSize: "0.82rem" }}>
                  {item.product_name} × {item.quantity}
                </div>
              ))}
            </td>
            <td>{formatPrice(Number(order.total))}</td>
            <td>
              <span className={orderStatusBadgeClass(order.status)}>{formatOrderStatus(order.status)}</span>
            </td>
            <td>{formatDate(order.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
