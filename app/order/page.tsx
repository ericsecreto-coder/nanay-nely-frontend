import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { SectionHeader } from "@/components/section-header";
import { getCurrentUserWithRole } from "@/lib/auth/roles";

export default async function OrderPage() {
  const { user, profile } = await getCurrentUserWithRole();

  return (
    <main className="page">
      <section className="sec">
        <SectionHeader
          tag="Place an Order"
          title="Checkout"
          description="Submit your order request. We'll confirm availability and delivery within 24 hours."
        />
      </section>
      <section className="order-grid">
        <CheckoutForm defaultName={profile?.full_name ?? ""} isLoggedIn={Boolean(user)} />
        <article className="glass-card">
          <h3 className="a-title">How it works</h3>
          <p className="a-text">1. Add products to your cart from the products page.</p>
          <p className="a-text">2. Review your cart and proceed to checkout.</p>
          <p className="a-text">3. Submit your order while logged in.</p>
          <p className="a-text">4. Track status updates in your dashboard.</p>
          <Link href="/cart" className="btn btn-ghost" style={{ marginTop: "1rem" }}>
            View Cart
          </Link>
        </article>
      </section>
    </main>
  );
}
