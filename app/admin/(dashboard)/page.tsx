import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getAllOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { getAdminNotifications } from "@/lib/notifications";
import { requireAdmin } from "@/lib/auth/require-admin";
import { DashboardNotifications } from "@/components/admin/dashboard-notifications";

export default async function AdminDashboardPage() {
  const { profile } = await requireAdmin();
  const products = await getAllProducts();
  const orders = await getAllOrders();
  const notifications = await getAdminNotifications();
  const activeCount = products.filter((product) => product.is_active).length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="overview" />
        <section className="dash-main">
          <h1 className="dash-hello">Admin Dashboard</h1>
          <p className="dash-hi-sub">Welcome, {profile?.full_name || "Administrator"}.</p>

          <div className="dash-stats">
            <article className="ds">
              <div className="ds-lbl">Total Products</div>
              <div className="ds-val">{products.length}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Active on Store</div>
              <div className="ds-val">{activeCount}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Hidden</div>
              <div className="ds-val">{products.length - activeCount}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Total Orders</div>
              <div className="ds-val">{orders.length}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Pending Orders</div>
              <div className="ds-val">{pendingOrders}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Unread Notifications</div>
              <div className="ds-val">{unreadNotifs}</div>
            </article>
          </div>

          <div className="dash-grid">
            <article className="dc">
              <h2 className="dc-title">Quick Actions</h2>
              <div className="qa-list">
                <Link className="qa" href="/admin/orders">
                  📦 Manage Orders
                </Link>
                <Link className="qa" href="/admin/messages">
                  ✉️ Contact Messages
                </Link>
                <Link className="qa" href="/admin/products">
                  🍶 Manage Products
                </Link>
                <Link className="qa" href="/admin/notifications">
                  🔔 Notifications
                </Link>
                <Link className="qa" href="/products">
                  🛒 View Public Products Page
                </Link>
              </div>
            </article>

            <article className="dc">
              <h2 className="dc-title">Recent Notifications</h2>
              <DashboardNotifications notifications={notifications.slice(0, 5)} />
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
