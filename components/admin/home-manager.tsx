"use client";

import { useState, useTransition } from "react";
import { updateSectionAction } from "@/app/actions/settings";
import { useToast } from "@/components/ui/toast-provider";
import type { SiteSettings, MakerSection, HeroSection, WhyChooseUsSection, ProcessSection, FeaturedProductSection } from "@/lib/settings";

type Props = {
  settings: SiteSettings;
};

type SectionKey = keyof SiteSettings;

export function HomeManager({ settings }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [maker, setMaker] = useState<MakerSection>(settings.meet_the_maker);
  const [hero, setHero] = useState<HeroSection>(settings.hero);
  const [why, setWhy] = useState<WhyChooseUsSection>(settings.why_choose_us);
  const [process, setProcess] = useState<ProcessSection>(settings.the_process);
  const [featured, setFeatured] = useState<FeaturedProductSection>(settings.featured_product);

  function saveSection(key: SectionKey, value: unknown) {
    startTransition(async () => {
      const result = await updateSectionAction(key, value);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(`${key.replace(/_/g, " ")} section updated.`, "success");
    });
  }

  const sections: { key: SectionKey; label: string; component: React.ReactNode }[] = [
    {
      key: "meet_the_maker",
      label: "Meet the Maker",
      component: (
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Tag</label>
            <input className="fi" value={maker.tag} onChange={(e) => setMaker({ ...maker, tag: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Title</label>
            <input className="fi" value={maker.title} onChange={(e) => setMaker({ ...maker, title: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Role</label>
            <input className="fi" value={maker.role} onChange={(e) => setMaker({ ...maker, role: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Image URL</label>
            <input className="fi" value={maker.image_url} onChange={(e) => setMaker({ ...maker, image_url: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Paragraph 1</label>
            <textarea className="fi" rows={3} value={maker.paragraphs[0] ?? ""} onChange={(e) => setMaker({ ...maker, paragraphs: [e.target.value, maker.paragraphs[1] ?? ""] })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Paragraph 2</label>
            <textarea className="fi" rows={3} value={maker.paragraphs[1] ?? ""} onChange={(e) => setMaker({ ...maker, paragraphs: [maker.paragraphs[0] ?? "", e.target.value] })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={maker.is_active} onChange={(e) => setMaker({ ...maker, is_active: e.target.checked })} />
            Active on home page
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-amber btn-sm" onClick={() => saveSection("meet_the_maker", maker)} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    },
    {
      key: "hero",
      label: "Hero Banner",
      component: (
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Tag</label>
            <input className="fi" value={hero.tag} onChange={(e) => setHero({ ...hero, tag: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Title</label>
            <input className="fi" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Subtitle</label>
            <input className="fi" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Image URL</label>
            <input className="fi" value={hero.image_url} onChange={(e) => setHero({ ...hero, image_url: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Description</label>
            <textarea className="fi" rows={3} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={hero.is_active} onChange={(e) => setHero({ ...hero, is_active: e.target.checked })} />
            Active on home page
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-amber btn-sm" onClick={() => saveSection("hero", hero)} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    },
    {
      key: "why_choose_us",
      label: "Why Choose Us",
      component: (
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Tag</label>
            <input className="fi" value={why.tag} onChange={(e) => setWhy({ ...why, tag: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Section Title</label>
            <input className="fi" value={why.title} onChange={(e) => setWhy({ ...why, title: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Section Description</label>
            <textarea className="fi" rows={2} value={why.description} onChange={(e) => setWhy({ ...why, description: e.target.value })} />
          </div>
          {why.items.map((item, i) => (
            <div key={i} className="admin-form-full" style={{ borderTop: "1px solid var(--w18)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--w55)", marginBottom: "0.5rem" }}>Feature {i + 1}</p>
              <div className="admin-form-grid" style={{ marginBottom: 0 }}>
                <div className="fg">
                  <label className="fl">Title</label>
                  <input className="fi" value={item.title} onChange={(e) => {
                    const items = [...why.items];
                    items[i] = { ...items[i], title: e.target.value };
                    setWhy({ ...why, items });
                  }} />
                </div>
                <div className="fg">
                  <label className="fl">Icon (emoji)</label>
                  <input className="fi" value={item.icon} onChange={(e) => {
                    const items = [...why.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    setWhy({ ...why, items });
                  }} />
                </div>
                <div className="fg admin-form-full">
                  <label className="fl">Description</label>
                  <input className="fi" value={item.desc} onChange={(e) => {
                    const items = [...why.items];
                    items[i] = { ...items[i], desc: e.target.value };
                    setWhy({ ...why, items });
                  }} />
                </div>
              </div>
            </div>
          ))}
          <label className="admin-checkbox">
            <input type="checkbox" checked={why.is_active} onChange={(e) => setWhy({ ...why, is_active: e.target.checked })} />
            Active on home page
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-amber btn-sm" onClick={() => saveSection("why_choose_us", why)} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    },
    {
      key: "the_process",
      label: "The Process",
      component: (
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Tag</label>
            <input className="fi" value={process.tag} onChange={(e) => setProcess({ ...process, tag: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Section Title</label>
            <input className="fi" value={process.title} onChange={(e) => setProcess({ ...process, title: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Section Description</label>
            <textarea className="fi" rows={2} value={process.description} onChange={(e) => setProcess({ ...process, description: e.target.value })} />
          </div>
          {process.steps.map((step, i) => (
            <div key={i} className="admin-form-full" style={{ borderTop: "1px solid var(--w18)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--w55)", marginBottom: "0.5rem" }}>Step {i + 1}</p>
              <div className="admin-form-grid" style={{ marginBottom: 0 }}>
                <div className="fg">
                  <label className="fl">Title</label>
                  <input className="fi" value={step.title} onChange={(e) => {
                    const steps = [...process.steps];
                    steps[i] = { ...steps[i], title: e.target.value };
                    setProcess({ ...process, steps });
                  }} />
                </div>
                <div className="fg">
                  <label className="fl">Image URL</label>
                  <input className="fi" value={step.image_url} onChange={(e) => {
                    const steps = [...process.steps];
                    steps[i] = { ...steps[i], image_url: e.target.value };
                    setProcess({ ...process, steps });
                  }} />
                </div>
                <div className="fg admin-form-full">
                  <label className="fl">Description</label>
                  <textarea className="fi" rows={2} value={step.desc} onChange={(e) => {
                    const steps = [...process.steps];
                    steps[i] = { ...steps[i], desc: e.target.value };
                    setProcess({ ...process, steps });
                  }} />
                </div>
              </div>
            </div>
          ))}
          <label className="admin-checkbox">
            <input type="checkbox" checked={process.is_active} onChange={(e) => setProcess({ ...process, is_active: e.target.checked })} />
            Active on home page
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-amber btn-sm" onClick={() => saveSection("the_process", process)} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    },
    {
      key: "featured_product",
      label: "Featured Product",
      component: (
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Tag</label>
            <input className="fi" value={featured.tag} onChange={(e) => setFeatured({ ...featured, tag: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Section Title</label>
            <input className="fi" value={featured.title} onChange={(e) => setFeatured({ ...featured, title: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Section Description</label>
            <textarea className="fi" rows={2} value={featured.description} onChange={(e) => setFeatured({ ...featured, description: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Product Name</label>
            <input className="fi" value={featured.product_name} onChange={(e) => setFeatured({ ...featured, product_name: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Product Origin</label>
            <input className="fi" value={featured.product_origin} onChange={(e) => setFeatured({ ...featured, product_origin: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Price (PHP)</label>
            <input className="fi" type="number" min="0" step="0.01" value={featured.product_price} onChange={(e) => setFeatured({ ...featured, product_price: Number(e.target.value) })} />
          </div>
          <div className="fg">
            <label className="fl">Image URL</label>
            <input className="fi" value={featured.image_url} onChange={(e) => setFeatured({ ...featured, image_url: e.target.value })} />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Product Description</label>
            <textarea className="fi" rows={3} value={featured.product_description} onChange={(e) => setFeatured({ ...featured, product_description: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={featured.is_active} onChange={(e) => setFeatured({ ...featured, is_active: e.target.checked })} />
            Active on home page
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-amber btn-sm" onClick={() => saveSection("featured_product", featured)} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="admin-products-layout">
      {sections.map((sec) => (
        <section key={sec.key} className="dc">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === sec.key ? null : sec.key)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: 0,
              font: "inherit"
            }}
          >
            <h2 className="dc-title" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>
              {sec.label}
            </h2>
            <span style={{ fontSize: "1.2rem", color: "var(--w55)" }}>
              {openSection === sec.key ? "\u25B2" : "\u25BC"}
            </span>
          </button>
          {openSection === sec.key && (
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--w18)", paddingTop: "1.5rem" }}>
              {sec.component}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
