"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminUnreadCountAction } from "@/app/actions/notifications";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      const c = await getAdminUnreadCountAction();
      if (mounted) setCount(c);
    }
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/admin/notifications" className="notif-bell" title="Notifications">
      <span className="sb-ic">🔔</span> Notifications
      {count > 0 && <span className="notif-badge">{count > 99 ? "99+" : count}</span>}
    </Link>
  );
}
