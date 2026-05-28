import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { formatPrice } from "@/lib/utils/format";
import { getSiteSettings } from "@/lib/settings";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <main className="page">
      {settings.meet_the_maker.is_active && (
        <section className="maker">
          <div>
            <Image
              className="maker-img"
              src={settings.meet_the_maker.image_url}
              width={550}
              height={560}
              alt="Nanay Nely"
            />
          </div>
          <div>
            <div className="section-tag">{settings.meet_the_maker.tag}</div>
            <h1 className="maker-name">
              Nanay <em>Nely</em>
            </h1>
            <p className="maker-role">{settings.meet_the_maker.role}</p>
            <div className="maker-divider" />
            {settings.meet_the_maker.paragraphs.map((p, i) => (
              <p key={i} className="maker-desc">{p}</p>
            ))}
            <div className="hero-actions">
              <Link href="/about" className="btn btn-ghost">
                Read Her Story
              </Link>
            </div>
          </div>
        </section>
      )}

      {settings.hero.is_active && (
        <section className="hero">
          <div>
            <div className="section-tag">{settings.hero.tag}</div>
            <h1 className="hero-title">
              {settings.hero.title.split("'")[0]}&apos;s <em>Lambanog</em>
            </h1>
            <p className="hero-subtitle">{settings.hero.subtitle}</p>
            <p className="hero-desc">{settings.hero.description}</p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-amber">
                Explore Products
              </Link>
              <Link href="/about" className="btn btn-ghost">
                Our Story
              </Link>
            </div>
          </div>
          <div>
            <img
              className="hero-img"
              src={settings.hero.image_url}
              alt="Lambanog bottle"
            />
          </div>
        </section>
      )}

      {settings.why_choose_us.is_active && (
        <section className="sec">
          <SectionHeader
            tag={settings.why_choose_us.tag}
            title={settings.why_choose_us.title}
            description={settings.why_choose_us.description}
          />
          <div className="features-grid" style={{ marginTop: "2rem" }}>
            {settings.why_choose_us.items.map((item) => (
              <article className="f-card" key={item.title}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.65rem" }}>{item.icon}</div>
                <h3 className="a-title">{item.title}</h3>
                <p className="f-desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {settings.the_process.is_active && (
        <section className="sec" style={{ paddingTop: 0 }}>
          <SectionHeader
            tag={settings.the_process.tag}
            title={settings.the_process.title}
            description={settings.the_process.description}
          />
          <div className="process-grid">
            {settings.the_process.steps.map((step, i) => (
              <article className="p-step" key={step.title}>
                <div className="p-step-img-wrap">
                  <img src={step.image_url} alt={step.title} />
                </div>
                <div className="p-step-body">
                  <div className="p-step-num">{i + 1}</div>
                  <h3 className="p-step-title">{step.title}</h3>
                  <p className="p-step-desc">{step.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {settings.featured_product.is_active && (
        <section className="sec featured-product">
          <div className="fp-content">
            <div className="section-tag">{settings.featured_product.tag}</div>
            <h2 className="section-title">{settings.featured_product.title}</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>{settings.featured_product.description}</p>
            <div className="fp-details">
              <h3 className="fp-name">{settings.featured_product.product_name}</h3>
              <p className="fp-origin">{settings.featured_product.product_origin}</p>
              <p className="fp-desc">{settings.featured_product.product_description}</p>
              <div className="fp-price">{formatPrice(settings.featured_product.product_price)}</div>
              <div className="hero-actions">
                <Link href="/products" className="btn btn-amber">View Product</Link>
                <Link href="/order" className="btn btn-ghost">Order Now</Link>
              </div>
            </div>
          </div>
          <div className="fp-image-wrap">
            <img
              className="fp-image"
              src={settings.featured_product.image_url}
              alt={settings.featured_product.product_name}
            />
          </div>
        </section>
      )}
    </main>
  );
}
