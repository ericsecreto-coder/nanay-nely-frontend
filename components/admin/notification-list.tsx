"use client";

import { useTransition } from "react";
import Link from "next/link";
import { markAdminNotificationReadAction, markAllAdminNotificationsReadAction } from "@/app/actions/notifications";
import { useToast } from "@/components/ui/toast-provider";
import { formatDate } from "@/lib/utils/order-status";
import type { Notification } from "@/lib/types/database";

type Props = {
  notifications: Notification[];
};

function notificationIcon(type: string) {
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

export function AdminNotificationList({ notifications }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleMarkRead(id: string) {
    startTransition(async () => {
      const result = await markAdminNotificationReadAction(id);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("Marked as read.", "success");
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      const result = await markAllAdminNotificationsReadAction();
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("All notifications marked as read.", "success");
    });
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="notif-list-wrap">
      <div className="notif-toolbar">
        <span className="notif-count">{unreadCount} unread</span>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" disabled={isPending} onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <article className="dc">
          <p style={{ color: "var(--w55)", textAlign: "center", padding: "1rem" }}>No notifications yet.</p>
        </article>
      ) : (
        <div className="notif-list">
          {notifications.map((notif) => (
            <article key={notif.id} className={`notif-item ${notif.is_read ? "notif-read" : "notif-unread"}`}>
              <div className="notif-icon">{notificationIcon(notif.type)}</div>
              <div className="notif-body">
                <div className="notif-title-row">
                  <strong className="notif-title">{notif.title}</strong>
                  <span className="notif-time">{formatDate(notif.created_at)}</span>
                </div>
                <p className="notif-msg">{notif.message}</p>
                <div className="notif-actions">
                  {notif.related_order_id && (
                    <Link href={`/admin/orders`} className="notif-link">
                      View Order
                    </Link>
                  )}
                  {!notif.is_read && (
                    <button
                      className="notif-link"
                      disabled={isPending}
                      onClick={() => handleMarkRead(notif.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
