"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions/orders";
import { useToast } from "@/components/ui/toast-provider";
import { formatPrice } from "@/lib/utils/format";
import { formatDate, formatOrderId, formatOrderStatus, orderStatusBadgeClass } from "@/lib/utils/order-status";
import { ORDER_STATUSES, type OrderWithItems } from "@/lib/types/database";

type Props = {
  orders: OrderWithItems[];
};

export function OrderManager({ orders }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(orderId: string, status: string) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status as (typeof ORDER_STATUSES)[number]);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("Order status updated.", "success");
    });
  }

  if (orders.length === 0) {
    return (
      <article className="dc">
        <p style={{ color: "var(--w55)", textAlign: "center", padding: "1rem" }}>No orders yet.</p>
      </article>
    );
  }

  return (
    <div className="admin-orders-list">
      {orders.map((order) => (
        <article key={order.id} className="dc admin-order-card">
          <div className="admin-order-header">
            <div>
              <h3 className="a-title">{formatOrderId(order.id)}</h3>
              <p className="a-text">
                {order.customer_name} · {order.contact_number} · {formatDate(order.created_at)}
              </p>
            </div>
            <div className="admin-order-status">
              <span className={orderStatusBadgeClass(order.status)}>{formatOrderStatus(order.status)}</span>
              <select
                className="fi admin-status-select"
                value={order.status}
                disabled={isPending}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatOrderStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="ot" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(Number(item.unit_price))}</td>
                  <td>{formatPrice(Number(item.line_total))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-order-footer">
            <div>
              <strong>Delivery:</strong> {order.delivery_address || "—"}
            </div>
            <div>
              <strong>Notes:</strong> {order.notes || "—"}
            </div>
            <div className="admin-order-total">
              <strong>Total: {formatPrice(Number(order.total))}</strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
