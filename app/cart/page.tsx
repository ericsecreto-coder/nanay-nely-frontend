import { CartPageClient } from "@/components/cart/cart-page-client";
import { SectionHeader } from "@/components/section-header";

export default function CartPage() {
  return (
    <main className="page">
      <section className="sec">
        <SectionHeader tag="Your Cart" title="Shopping Cart" description="Review items before checkout." />
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <CartPageClient />
      </section>
    </main>
  );
}
