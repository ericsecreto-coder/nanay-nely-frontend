"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/cart-provider";
import { LogoutButton } from "@/components/logout-button";
import type { UserRole } from "@/lib/types/database";

const publicNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
  { href: "/order", label: "Order" }
];

export function TopNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const {
        data: { user: currentUser }
      } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setUserName(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", currentUser.id)
        .maybeSingle();
      setRole((profile?.role as UserRole | undefined) ?? "customer");
      setUserName(profile?.full_name ?? currentUser.email ?? null);
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="nav">
      <Link className="nav-brand" href="/">
        <div className="nav-logo">
          <img
            src="https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=300&q=80"
            alt="Nanay Nely logo"
          />
        </div>
        <div>
          <div className="nav-title">Nanay Nely&apos;s</div>
          <div className="nav-subtitle">Lambanog Infanta, Quezon</div>
        </div>
      </Link>
      <ul className="nav-links">
        {publicNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link className={isActive ? "active" : ""} href={item.href}>
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link className={pathname === "/cart" ? "active" : ""} href="/cart">
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </li>
        {user ? (
          <>
            {role === "admin" ? (
              <li className="nav-user-item">
                <Link className={pathname.startsWith("/admin") ? "active" : ""} href="/admin">
                  <span className="role-badge role-admin" title="Administrator">Admin</span>
                  <span className="nav-user-name">{userName}</span>
                </Link>
              </li>
            ) : (
              <li className="nav-user-item">
                <Link className={pathname.startsWith("/dashboard") ? "active" : ""} href="/dashboard">
                  <span className="role-badge role-user" title="Logged in user">User</span>
                  <span className="nav-user-name">{userName}</span>
                </Link>
              </li>
            )}
            <li>
              <LogoutButton className="nav-cta" label="Logout" />
            </li>
          </>
        ) : (
          <li>
            <Link className={`nav-cta ${pathname.startsWith("/login") || pathname.startsWith("/auth") ? "active" : ""}`} href="/login">
              Login / Register
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}
