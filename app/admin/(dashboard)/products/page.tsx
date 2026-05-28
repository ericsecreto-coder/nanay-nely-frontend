import { AdminSidebar } from "@/components/admin-sidebar";
import { ProductManager } from "@/components/admin/product-manager";
import { getAllProducts } from "@/lib/products";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts();

  return (
    <main className="page">
      <div className="dash-wrap">
        <AdminSidebar active="products" />
        <section className="dash-main">
          <h1 className="dash-hello">Manage Products</h1>
          <p className="dash-hi-sub">Create, update, hide, or delete storefront products.</p>
          <ProductManager products={products} />
        </section>
      </div>
    </main>
  );
}
