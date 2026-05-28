import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
