import { AdminSidebar } from "@/components/admin-sidebar";
import { ContactMessageManager } from "@/components/admin/contact-message-manager";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllContactMessages } from "@/lib/contact";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await getAllContactMessages();
  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="messages" />
        <section className="dash-main">
          <h1 className="dash-hello">Contact Messages</h1>
          <p className="dash-hi-sub">
            {newCount > 0 ? `${newCount} new message(s) awaiting review.` : "All caught up."}
          </p>
          <ContactMessageManager messages={messages} />
        </section>
      </div>
    </main>
  );
}
