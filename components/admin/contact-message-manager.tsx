"use client";

import { useTransition } from "react";
import { updateContactStatusAction } from "@/app/actions/contact";
import { useToast } from "@/components/ui/toast-provider";
import { formatDate } from "@/lib/utils/order-status";
import { CONTACT_STATUSES, type ContactMessage, type ContactStatus } from "@/lib/types/database";

type Props = {
  messages: ContactMessage[];
};

export function ContactMessageManager({ messages }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(messageId: string, status: ContactStatus) {
    startTransition(async () => {
      const result = await updateContactStatusAction(messageId, status);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("Message status updated.", "success");
    });
  }

  if (messages.length === 0) {
    return (
      <article className="dc">
        <p style={{ color: "var(--w55)", textAlign: "center", padding: "1rem" }}>No messages yet.</p>
      </article>
    );
  }

  return (
    <div className="admin-orders-list">
      {messages.map((msg) => (
        <article key={msg.id} className="dc admin-order-card">
          <div className="admin-order-header">
            <div>
              <h3 className="a-title">{msg.name}</h3>
              <p className="a-text">
                {msg.email} · {formatDate(msg.created_at)}
              </p>
            </div>
            <select
              className="fi admin-status-select"
              value={msg.status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(msg.id, e.target.value as ContactStatus)}
            >
              {CONTACT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <p style={{ marginTop: "0.75rem", color: "var(--w75)", whiteSpace: "pre-wrap" }}>{msg.message}</p>
        </article>
      ))}
    </div>
  );
}
