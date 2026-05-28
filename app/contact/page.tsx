import { ContactForm } from "@/components/contact-form";
import { SectionHeader } from "@/components/section-header";
import { getCurrentUserWithRole } from "@/lib/auth/roles";

export default async function ContactPage() {
  const { user, profile } = await getCurrentUserWithRole();

  return (
    <main className="page">
      <section className="sec">
        <SectionHeader
          tag="Get in Touch"
          title="Contact Nanay Nely's"
          description="For inquiries, custom orders, and partnerships, send us a message."
        />
      </section>

      <section className="contact-grid">
        <article className="glass-card">
          <h3 className="a-title">Contact Details</h3>
          <p className="a-text">Purok Durian Brgy, Gumian, Infanta, Quezon</p>
          <p className="a-text">
            <a href="tel:09635406801" style={{ color: "inherit", textDecoration: "none" }}>
              0963 540 6801
            </a>
          </p>
          <p className="a-text">
            <a
              href="https://www.facebook.com/search/top?q=Nelita+Auditor"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--honey)", textDecoration: "none" }}
            >
              Nelita Auditor on Facebook
            </a>
          </p>
        </article>
        <ContactForm
          defaultName={profile?.full_name ?? ""}
          defaultEmail={user?.email ?? ""}
        />
      </section>
    </main>
  );
}
