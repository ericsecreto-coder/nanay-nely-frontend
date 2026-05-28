import { Suspense } from "react";
import { AdminAuthUI } from "@/components/admin-auth-ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <AdminAuthUI />
    </Suspense>
  );
}
