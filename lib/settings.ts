import { createClient } from "@/lib/supabase/server";

export type MakerSection = {
  tag: string;
  title: string;
  role: string;
  image_url: string;
  paragraphs: string[];
  is_active: boolean;
};

export type HeroSection = {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  is_active: boolean;
};

export type FeatureItem = {
  title: string;
  desc: string;
  icon: string;
};

export type WhyChooseUsSection = {
  tag: string;
  title: string;
  description: string;
  items: FeatureItem[];
  is_active: boolean;
};

export type StepItem = {
  title: string;
  desc: string;
  image_url: string;
};

export type ProcessSection = {
  tag: string;
  title: string;
  description: string;
  steps: StepItem[];
  is_active: boolean;
};

export type FeaturedProductSection = {
  tag: string;
  title: string;
  description: string;
  product_name: string;
  product_origin: string;
  product_description: string;
  product_price: number;
  image_url: string;
  is_active: boolean;
};

export type SiteSettings = {
  meet_the_maker: MakerSection;
  hero: HeroSection;
  why_choose_us: WhyChooseUsSection;
  the_process: ProcessSection;
  featured_product: FeaturedProductSection;
};

const defaults: SiteSettings = {
  meet_the_maker: {
    tag: "Meet the Maker",
    title: "Nanay Nely",
    role: "Master Lambanog Distiller \u2014 Infanta, Quezon",
    image_url: "/maker/nanay-nely.jpg",
    paragraphs: [
      "For over four decades, Nanay Nely has been perfecting the art of lambanog distilling using methods handed down by her elders. Every bottle begins in the nipa palm groves behind her home, where she still harvests sap by hand before sunrise.",
      "Her small-batch spirit carries the soul of Infanta \u2014 earthy, smooth, and deeply authentic. Nanay Nely believes lambanog is more than a drink; it is a story of family, patience, and Filipino craftsmanship."
    ],
    is_active: true
  },
  featured_product: {
    tag: "Featured Product",
    title: "Try Our Best Seller",
    description: "Handcrafted with pride in Infanta, Quezon \u2014 experience the authentic taste of traditional lambanog.",
    product_name: "Classic Lambanog",
    product_origin: "Infanta, Quezon",
    product_description: "Smooth and balanced with a clean finish. Our signature spirit, distilled using traditional methods passed down through generations.",
    product_price: 180,
    image_url: "/products/classic.jpg",
    is_active: true
  },
  hero: {
    tag: "Authentic Filipino Spirit",
    title: "Nanay Nely's Lambanog",
    subtitle: "Crafted in Infanta, Quezon",
    description: "Premium local lambanog with rich heritage, smooth flavor, and handcrafted quality for every celebration.",
    image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1100&q=80",
    is_active: true
  },
  why_choose_us: {
    tag: "Why Choose Us",
    title: "Heritage, Taste, and Craftsmanship",
    description: "A proudly local product rooted in tradition and served with modern quality standards.",
    items: [
      { title: "Traditional Distilling", desc: "Handcrafted with generations of Infanta, Quezon knowledge.", icon: "\uD83C\uDF76" },
      { title: "Natural Ingredients", desc: "Premium nipa sap and time-honored fermentation process.", icon: "\uD83C\uDF3F" },
      { title: "Small Batch Quality", desc: "Every bottle follows a consistent, careful production standard.", icon: "\u2728" }
    ],
    is_active: true
  },
  the_process: {
    tag: "From Sap to Spirit",
    title: "The Process",
    description: "Every bottle of Nanay Nely's lambanog sasa follows a time-honored journey from the nipa palm to your glass.",
    steps: [
      { title: "Harvesting the Sap", desc: "Nipa palm sap is carefully hand-tapped at dawn from stout stalks in the mangrove forests of Infanta, Quezon.", image_url: "/maker/made sasa.jpg" },
      { title: "Natural Fermentation", desc: "The fresh sap is collected in containers and left to ferment naturally, developing its signature character.", image_url: "/maker/made2.jpg" },
      { title: "Traditional Distillation", desc: "Fermented sap is distilled in small pots over wood fire \u2014 a method passed down through generations.", image_url: "/maker/made3.jpg" },
      { title: "Collecting the Spirit", desc: "The clear distillate is carefully collected drop by drop, preserving the pure essence of lambanog sasa.", image_url: "/maker/made5.avif" },
    ],
    is_active: true
  }
};

function getDefaultSection<K extends keyof SiteSettings>(key: K): SiteSettings[K] {
  return defaults[key];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("section_key, value");

  if (error || !data || data.length === 0) {
    return defaults;
  }

  const result = { ...defaults };

  for (const row of data) {
    const key = row.section_key as keyof SiteSettings;
    if (key in defaults) {
      result[key] = { ...getDefaultSection(key), ...row.value };
    }
  }

  return result;
}

export async function getSection<K extends keyof SiteSettings>(key: K): Promise<SiteSettings[K]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("section_key", key)
    .maybeSingle();

  if (error || !data) {
    return getDefaultSection(key);
  }

  return { ...getDefaultSection(key), ...data.value as Partial<SiteSettings[K]> };
}
