import Link from "next/link";
import { formatDate } from "@/lib/utils/order-status";
import type { Notification } from "@/lib/types/database";

type Props = {
  notifications: Notification[];
};

function notifIcon(type: string) {
  switch (type) {
    case "new_order":
      return "🛒";
    case "order_confirmed":
      return "✅";
    case "order_status":
      return "📦";
    default:
      return "🔔";
  }
}

export function DashboardNotifications({ notifications }: Props) {
  if (notifications.length === 0) {
    return (
      <p style={{ color: "var(--w55)", fontSize: "0.88rem" }}>
        No notifications yet.
      </p>
    );
  }

  return (
    <div className="dash-notif-list">
      {notifications.map((n) => (
        <div key={n.id} className={`dash-notif-item ${n.is_read ? "" : "dash-notif-unread"}`}>
          <span className="dash-notif-icon">{notifIcon(n.type)}</span>
          <div className="dash-notif-body">
            <div className="dash-notif-title">{n.title}</div>
            <div className="dash-notif-msg">{n.message}</div>
            <div className="dash-notif-time">{formatDate(n.created_at)}</div>
          </div>
        </div>
      ))}
      <Link href="/admin/notifications" className="dash-notif-all">
        View all notifications →
      </Link>
    </div>
  );
}
