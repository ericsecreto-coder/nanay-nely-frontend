import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminNotificationList } from "@/components/admin/notification-list";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminNotifications } from "@/lib/notifications";

export default async function AdminNotificationsPage() {
  await requireAdmin();
  const notifications = await getAdminNotifications();

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="notifications" />
        <section className="dash-main">
          <h1 className="dash-hello">Notifications</h1>
          <p className="dash-hi-sub">Stay updated on new orders and customer activity.</p>
          <AdminNotificationList notifications={notifications} />
        </section>
      </div>
    </main>
  );
}
