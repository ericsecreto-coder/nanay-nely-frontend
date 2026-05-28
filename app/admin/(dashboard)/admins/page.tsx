import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminManager } from "@/components/admin/admin-manager";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCandidatesAction } from "@/app/actions/admin";

export default async function AdminAdminsPage() {
  await requireAdmin();
  const result = await getAdminCandidatesAction();

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="admins" />
        <section className="dash-main">
          <h1 className="dash-hello">Admin Accounts</h1>
          <p className="dash-hi-sub">Promote customers to admin or revoke admin privileges.</p>
          {result.error ? (
            <article className="dc">
              <p className="auth-alert auth-alert-error">{result.error}</p>
            </article>
          ) : (
            <AdminManager profiles={result.data ?? []} />
          )}
        </section>
      </div>
    </main>
  );
}
