import { SectionHeader } from "@/components/section-header";

export default function AboutPage() {
  return (
    <main className="page">
      <section className="about-layout">
        <img
          className="about-img"
          src="/maker/nanay-nely.jpg"
          alt="Nanay Nely"
        />
        <div className="bio-card">
          <SectionHeader
            tag="Our Story"
            title="Built from Family Tradition"
            description="Nanay Nely started with one small distilling setup and a passion for preserving local craftsmanship."
          />
          <p style={{ marginTop: "1rem", color: "var(--w75)" }}>
            Mother Nelita Auditor, more popularly known as &ldquo;Nanay Nely,&rdquo; is the wife of Sulpicio Auditor,
            also known as &ldquo;Tatay Ompe.&rdquo; Nanay Nely&rsquo;s goal is to provide quality service to her
            customers. One of the reasons she chose this business is because the product does not expire and is long
            lasting &mdash; making lambanog not just a craft, but a reliable and enduring livelihood rooted in the
            heart of Infanta, Quezon. Since 2003, she has been distilling pure Sasa Wine the traditional way with
            patience, care, and deep respect for the Sasa palms that make it all possible. Every bottle carries her
            commitment to quality and the warmth of a family business built with love.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <SectionHeader
          tag="Our History"
          title="The Story of Nanay Nely"
          description="How a mother&rsquo;s passion for tradition became a legacy in every bottle."
        />
        <div className="about-layout" style={{ padding: "1.5rem 0 0" }}>
          <div className="bio-card">
            <p className="a-text" style={{ marginBottom: "1rem" }}>
              Mother Nelita Auditor, more popularly known as &ldquo;Nanay Nely,&rdquo; is the wife of Sulpicio Auditor,
              also known as &ldquo;Tatay Ompe.&rdquo; Nanay Nely&rsquo;s goal is to provide quality service to her
              customers. One of the reasons she chose this business is because the product does not expire and is long
              lasting &mdash; making lambanog not just a craft, but a reliable and enduring livelihood rooted in the
              heart of Infanta, Quezon.
            </p>
            <p className="a-text" style={{ marginBottom: 0 }}>
              Since 2003, she has been distilling pure Sasa Wine the traditional way with patience, care, and deep
              respect for the Sasa palms that make it all possible. Every bottle carries her commitment to quality
              and the warmth of a family business built with love.
            </p>
          </div>
          <img
            className="about-img"
            src="/maker/nanay-nely.jpg"
            alt="Nanay Nely distilling"
          />
        </div>
      </section>

      <section className="cards-3">
        {[
          ["Vision", "To keep authentic lambanog culture alive for the next generation."],
          ["Mission", "Deliver trusted quality with responsible handcrafted production."],
          ["Values", "Integrity, local pride, and customer-first service in every order."]
        ].map(([title, text]) => (
          <article className="a-card" key={title}>
            <h3 className="a-title">{title}</h3>
            <p className="a-text">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
