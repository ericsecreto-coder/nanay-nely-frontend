import { AdminSidebar } from "@/components/admin-sidebar";
import { OrderManager } from "@/components/admin/order-manager";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllOrders } from "@/lib/orders";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAllOrders();

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="orders" />
        <section className="dash-main">
          <h1 className="dash-hello">Manage Orders</h1>
          <p className="dash-hi-sub">View customer orders and update their status.</p>
          <OrderManager orders={orders} />
        </section>
      </div>
    </main>
  );
}
