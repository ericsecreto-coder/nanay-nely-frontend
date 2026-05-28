import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { OrderHistoryTable } from "@/components/order-history-table";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { getCustomerOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils/format";
import type { OrderStatus } from "@/lib/types/database";

function countByStatus(orders: { status: OrderStatus }[], status: OrderStatus) {
  return orders.filter((order) => order.status === status).length;
}

export default async function DashboardPage() {
  const { user, profile, role } = await getCurrentUserWithRole();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  if (isAdminRole(role)) {
    redirect("/admin");
  }

  const orders = await getCustomerOrders(user.id);
  const fullName = profile?.full_name || user.email?.split("@")[0] || "Customer";
  const pendingCount = countByStatus(orders, "pending") + countByStatus(orders, "confirmed");
  const deliveredCount = countByStatus(orders, "delivered");

  return (
    <main className="page">
      <div className="dash-wrap">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-title">Customer Portal</div>
            <div className="sb-sub">Nanay Nely&apos;s</div>
          </div>
          <ul className="sb-nav">
            <li>
              <Link className="active" href="/dashboard">
                <span className="sb-ic">📦</span> My Orders
              </Link>
            </li>
            <li>
              <Link href="/cart">
                <span className="sb-ic">🛒</span> Cart
              </Link>
            </li>
            <li>
              <Link href="/order">
                <span className="sb-ic">🍶</span> Checkout
              </Link>
            </li>
            <li>
              <Link href="/products">
                <span className="sb-ic">🛍️</span> Products
              </Link>
            </li>
          </ul>
          <div style={{ padding: "1rem 1.5rem 0" }}>
            <LogoutButton className="btn btn-ghost" label="Logout" />
          </div>
        </aside>

        <section className="dash-main">
          <h1 className="dash-hello">Welcome back, {fullName}! 👋</h1>
          <p className="dash-hi-sub">Here&apos;s your order summary.</p>

          <div className="dash-stats">
            <article className="ds">
              <div className="ds-lbl">Total Orders</div>
              <div className="ds-val">{orders.length}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Pending / Confirmed</div>
              <div className="ds-val">{pendingCount}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Delivered</div>
              <div className="ds-val">{deliveredCount}</div>
            </article>
            <article className="ds">
              <div className="ds-lbl">Lifetime Spend</div>
              <div className="ds-val" style={{ fontSize: "1.35rem" }}>
                {formatPrice(orders.reduce((sum, order) => sum + Number(order.total), 0))}
              </div>
            </article>
          </div>

          <div className="dash-grid">
            <article className="dc">
              <h2 className="dc-title">Order History</h2>
              <OrderHistoryTable orders={orders} />
            </article>

            <article className="dc">
              <h2 className="dc-title">Quick Actions</h2>
              <div className="qa-list">
                <Link className="qa" href="/products">
                  🛒 Browse Products
                </Link>
                <Link className="qa" href="/cart">
                  🧺 View Cart
                </Link>
                <Link className="qa" href="/order">
                  🍶 Checkout
                </Link>
                <Link className="qa" href="/contact">
                  📞 Contact Support
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
