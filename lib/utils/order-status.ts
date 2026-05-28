import type { OrderStatus } from "@/lib/types/database";

export function formatOrderStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function orderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "sbadge s-del";
    case "cancelled":
      return "sbadge s-pend";
    case "pending":
      return "sbadge s-pend";
    default:
      return "sbadge s-proc";
  }
}

export function formatOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
