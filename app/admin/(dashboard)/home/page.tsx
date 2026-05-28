import { AdminSidebar } from "@/components/admin-sidebar";
import { HomeManager } from "@/components/admin/home-manager";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminHomePage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="home" />
        <section className="dash-main">
          <h1 className="dash-hello">Home Screen</h1>
          <p className="dash-hi-sub">Edit the content and images displayed on the storefront home page.</p>
          <HomeManager settings={settings} />
        </section>
      </div>
    </main>
  );
}
