import { redirect } from "next/navigation";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";

export async function requireAdmin() {
  const { user, profile, role } = await getCurrentUserWithRole();

  if (!user) {
    redirect("/admin/login?redirect=/admin");
  }

  if (!isAdminRole(role)) {
    redirect("/dashboard?error=admin_only");
  }

  return { user, profile, role };
}
