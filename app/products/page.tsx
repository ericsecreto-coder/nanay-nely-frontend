import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { getActiveProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <main className="page">
      <section className="sec">
        <SectionHeader
          tag="Our Collection"
          title="Featured Products"
          description="Explore handcrafted blends and crowd favorites from Nanay Nely's."
          center
        />
      </section>
      {products.length === 0 ? (
        <section className="sec" style={{ paddingTop: 0, textAlign: "center" }}>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Products are being updated. Please check back soon.
          </p>
        </section>
      ) : (
        <section className="products-grid">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              origin={item.origin}
              desc={item.description}
              price={Number(item.price)}
              image={item.image_url}
              stock={item.stock}
            />
          ))}
        </section>
      )}
      <section className="sec" style={{ paddingTop: 0, textAlign: "center", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/cart" className="btn btn-ghost">
          View Cart
        </Link>
        <Link href="/order" className="btn btn-amber">
          Checkout
        </Link>
      </section>
    </main>
  );
}
