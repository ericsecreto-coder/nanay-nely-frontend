import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { NotificationBell } from "@/components/admin/notification-bell";

type Props = {
  active: "overview" | "products" | "orders" | "messages" | "home" | "admins" | "notifications";
};

export function AdminSidebar({ active }: Props) {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-title">Admin Panel</div>
        <div className="sb-sub">Nanay Nely&apos;s</div>
      </div>
      <ul className="sb-nav">
        <li>
          <Link className={active === "overview" ? "active" : ""} href="/admin">
            <span className="sb-ic">📊</span> Dashboard
          </Link>
        </li>
        <li>
          <Link className={active === "products" ? "active" : ""} href="/admin/products">
            <span className="sb-ic">🍶</span> Manage Products
          </Link>
        </li>
        <li>
          <Link className={active === "orders" ? "active" : ""} href="/admin/orders">
            <span className="sb-ic">📦</span> Manage Orders
          </Link>
        </li>
        <li>
          <Link className={active === "home" ? "active" : ""} href="/admin/home">
            <span className="sb-ic">🏠</span> Home Screen
          </Link>
        </li>
        <li>
          <Link className={active === "messages" ? "active" : ""} href="/admin/messages">
            <span className="sb-ic">✉️</span> Messages
          </Link>
        </li>
        <li>
          <Link className={active === "admins" ? "active" : ""} href="/admin/admins">
            <span className="sb-ic">🔐</span> Admin Accounts
          </Link>
        </li>
        <li className={active === "notifications" ? "" : ""}>
          <NotificationBell />
        </li>
        <li>
          <Link href="/products">
            <span className="sb-ic">🛒</span> View Storefront
          </Link>
        </li>
      </ul>
      <div style={{ padding: "1rem 1.5rem 0" }}>
        <LogoutButton className="btn btn-ghost" label="Logout" />
      </div>
    </aside>
  );
}
