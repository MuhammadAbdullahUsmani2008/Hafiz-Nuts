/**
 * HAFIZ NUTS - canonical catalog.
 *
 * Single source of truth for every product, bundle, and price on the site.
 * `ProductsSection`, `BundleOffersSection`, and the cart all read from here, so
 * a price or pack change is a one-file edit.
 *
 * This module must stay isomorphic: no `node:fs`, no `window`, no `process`.
 * It is imported by both server components (the sections) and client
 * components (the cards, the cart context). Build-time image resolution lives
 * in `lib/resolveImage.ts`, which is server-only.
 *
 * Prices are stored as numbers (`pricePkr`) and formatted for display with
 * `formatPkr`, so cart maths, totals, and comparisons never parse a string.
 */

/**
 * Product lines. Every pack belongs to one: the line supplies the display
 * name used in page titles, breadcrumbs, and structured data, and keeps a
 * product page's size selector within its own line.
 */
export const PRODUCT_LINES = {
  mix: {
    name: "Premium Honey & Nut Mix",
    /* Anchor of this line's group on `/products`. */
    anchor: "honey-nut-mix",
  },
  honey: {
    name: "Pure Sidr (Beri) Honey",
    anchor: "honey",
  },
} as const;

export type ProductLine = keyof typeof PRODUCT_LINES;

export type Product = {
  /** Stable identifier - also the cart line-item key. */
  id: string;
  line: ProductLine;
  name: string;
  /** URL segment of the detail page: `/products/[slug]`. */
  slug: string;
  /** Display weight, e.g. "30g". */
  size: string;
  pricePkr: number;
  /** Canonical public URL of the product photograph. */
  image: string;
  /**
   * Candidate basenames in `public/`, most specific first, probed at prerender
   * time by `resolvePublicImage`. The bare size is always last so a file
   * simply named `30g.jpg` still matches.
   */
  imageCandidates: readonly string[];
  description: string;
  inStock: boolean;
  /** Shown in the homepage grid; every product is listed on `/products`. */
  featured: boolean;
};

export type Bundle = {
  id: string;
  title: string;
  slug: string;
  unitCount: number;
  unitSize: string;
  /** Short pack-composition line shown under the title. */
  pack: string;
  pricePkr: number;
  /** Compare-at ("regular") price, shown struck through. */
  compareAtPricePkr: number;
  image: string;
  imageCandidates: readonly string[];
};

/**
 * Slug used by the legacy `/products/premium-honey-nut-mix` URL. That route
 * predates the per-size catalog, so it redirects to the 200g variant - the
 * size the old detail page always showed.
 */
export const DEFAULT_PRODUCT_SLUG = "honey-nut-mix-200g";

/**
 * Stand-in for a cart line whose pack has no photograph in `public/` yet.
 * `Product.image` cannot serve here: it is one of the candidates that
 * `resolvePublicImage` already failed to find, so it would render broken.
 */
export const PLACEHOLDER_IMAGE = "/logo.png";

/**
 * Canonical WhatsApp order line. The same number the contact section dials, in
 * international form without the `+`, which is what `wa.me` expects.
 */
export const WHATSAPP_NUMBER = "923047677019";

/** The same number in the local form shown to customers. */
export const CONTACT_PHONE = "03047677019";

export const CONTACT_EMAIL = "info@hafiznuts.com";

/**
 * Flat delivery charge per order, added at checkout. The Shipping & Delivery
 * Policy and Terms quote this figure, so they read it from here too.
 */
export const DELIVERY_FEE_PKR = 300;

/**
 * EasyPaisa receiving account. Shown at checkout when that method is picked
 * and quoted in the Terms; an EasyPaisa order ships only once the transfer
 * receipt has been checked.
 */
export const EASYPAISA_ACCOUNT = {
  accountName: "Hafiz Abdul Rehman",
  accountNumber: "03480660406",
  wallet: "EasyPaisa",
} as const;

/** Effective and last-updated date shown on every policy page. */
export const POLICY_DATE = "October 20, 2026";

/**
 * Canonical production origin, without a trailing slash. Used for absolute
 * URLs in metadata, `robots.txt`, and the sitemap.
 */
export const SITE_URL = "https://hafiznuts.com";

export const PRODUCTS: readonly Product[] = [
  {
    id: "hn-mix-30g",
    line: "mix",
    name: "30g Tub",
    slug: "honey-nut-mix-30g",
    size: "30g",
    pricePkr: 100,
    image: "/30g.jpg",
    imageCandidates: ["30g-tub", "30g"],
    description:
      "Single-serve tub of our premium honey & nut mix - a handy first taste or an on-the-go snack.",
    inStock: true,
    featured: false,
  },
  {
    id: "hn-mix-100g",
    line: "mix",
    name: "100g Jar",
    slug: "honey-nut-mix-100g",
    size: "100g",
    pricePkr: 350,
    image: "/100g.jpg",
    imageCandidates: ["100g-jar", "100g"],
    description:
      "Everyday jar size for daily snacking, lunchboxes and the office desk.",
    inStock: true,
    featured: false,
  },
  {
    id: "hn-mix-200g",
    line: "mix",
    name: "200g Jar",
    slug: "honey-nut-mix-200g",
    size: "200g",
    pricePkr: 650,
    image: "/200g.jpg",
    imageCandidates: ["200g-jar", "200g"],
    description:
      "Shareable jar of the honey & nut mix - sized for families and gifting.",
    inStock: true,
    featured: false,
  },
  {
    id: "hn-mix-250g",
    line: "mix",
    name: "250g Jar",
    slug: "honey-nut-mix-250g",
    size: "250g",
    pricePkr: 800,
    image: "/250g.jpg",
    imageCandidates: ["250g-jar", "250g"],
    description:
      "A generous everyday jar of honey & dry fruit mix - a step up for regular snackers and small families.",
    inStock: true,
    featured: true,
  },
  {
    id: "hn-mix-500g",
    line: "mix",
    name: "500g Jar",
    slug: "honey-nut-mix-500g",
    size: "500g",
    pricePkr: 1550,
    image: "/500g.jpg",
    imageCandidates: ["500g-jar", "500g"],
    description:
      "Big household jar - great value for families and daily wellness routines.",
    inStock: true,
    featured: true,
  },
  {
    id: "hn-mix-1kg",
    line: "mix",
    name: "1kg Jar",
    slug: "honey-nut-mix-1kg",
    size: "1kg",
    pricePkr: 3000,
    image: "/1kg.jpg",
    imageCandidates: ["1kg-jar", "1kg"],
    description:
      "Our largest jar of honey & dry fruit mix - the best value per gram for big households, gifting and stocking up.",
    inStock: true,
    featured: false,
  },

  /*
   * Pure Sidr (Beri) honey. Names carry "Sidr Honey" because the cart,
   * checkout, and WhatsApp order show `name` alone - "500g Jar" would be
   * ambiguous next to the nut mix's 500g jar.
   */
  {
    id: "sidr-honey-100g",
    line: "honey",
    name: "Sidr Honey 100g Jar",
    slug: "sidr-honey-100g",
    size: "100g",
    pricePkr: 450,
    image: "/sidr-honey-100g.jpg",
    imageCandidates: ["Honey/100g", "sidr-honey-100g"],
    description:
      "A taster jar of pure Sidr (Beri) honey - rich, golden, and naturally sweet.",
    inStock: true,
    featured: false,
  },
  {
    id: "sidr-honey-200g",
    line: "honey",
    name: "Sidr Honey 200g Jar",
    slug: "sidr-honey-200g",
    size: "200g",
    pricePkr: 900,
    image: "/sidr-honey-200g.jpg",
    imageCandidates: ["Honey/200g", "sidr-honey-200g"],
    description:
      "A handy jar of pure Sidr (Beri) honey for everyday tea, toast, and wellness routines.",
    inStock: true,
    featured: false,
  },
  {
    id: "sidr-honey-250g",
    line: "honey",
    name: "Sidr Honey 250g Jar",
    slug: "sidr-honey-250g",
    size: "250g",
    pricePkr: 1125,
    image: "/sidr-honey-250g.jpg",
    imageCandidates: ["Honey/250g", "sidr-honey-250g"],
    description:
      "Pure Sidr (Beri) honey in an everyday family size.",
    inStock: true,
    featured: true,
  },
  {
    id: "sidr-honey-500g",
    line: "honey",
    name: "Sidr Honey 500g Jar",
    slug: "sidr-honey-500g",
    size: "500g",
    pricePkr: 2250,
    image: "/sidr-honey-500g.jpg",
    imageCandidates: ["Honey/500g", "sidr-honey-500g"],
    description:
      "A generous jar of pure Sidr (Beri) honey for regular use at home.",
    inStock: true,
    featured: true,
  },
  {
    id: "sidr-honey-1kg",
    line: "honey",
    name: "Sidr Honey 1kg Jar",
    slug: "sidr-honey-1kg",
    size: "1kg",
    pricePkr: 4500,
    image: "/sidr-honey-1kg.jpg",
    imageCandidates: ["Honey/1kg", "sidr-honey-1kg"],
    description:
      "Our largest jar of pure Sidr (Beri) honey - the best value for households and gifting.",
    inStock: true,
    featured: false,
  },
];

/** One line's packs, in catalog order - for size selectors and grouped lists. */
export function productsInLine(line: ProductLine): readonly Product[] {
  return PRODUCTS.filter((product) => product.line === line);
}

export const BUNDLES: readonly Bundle[] = [
  {
    id: "bundle-10x30g",
    title: "10 × 30g Mini Pack",
    slug: "bundle-10x30g",
    unitCount: 10,
    unitSize: "30g",
    pack: "10 Packs of 30g Tubs",
    pricePkr: 950,
    compareAtPricePkr: 1000,
    image: "/30g-bulk-pack.jpg",
    imageCandidates: ["30g-bulk-pack"],
  },
  {
    id: "bundle-6x100g",
    title: "6 × 100g Family Pack",
    slug: "bundle-6x100g",
    unitCount: 6,
    unitSize: "100g",
    pack: "6 Jars of 100g",
    pricePkr: 2000,
    compareAtPricePkr: 2100,
    image: "/100g-bulk-pack.png",
    imageCandidates: ["100g-bulk-pack"],
  },
  {
    id: "bundle-3x200g",
    title: "3 × 200g Value Pack",
    slug: "bundle-3x200g",
    unitCount: 3,
    unitSize: "200g",
    pack: "3 Jars/Tubs of 200g",
    pricePkr: 1850,
    compareAtPricePkr: 1950,
    image: "/200g-bulk-pack.png",
    imageCandidates: ["200g-bulk-pack"],
  },
  {
    id: "bundle-2x500g",
    title: "2 × 500g Mega Saver",
    slug: "bundle-2x500g",
    unitCount: 2,
    unitSize: "500g",
    pack: "2 Big Jars of 500g",
    pricePkr: 3000,
    compareAtPricePkr: 3100,
    image: "/500g-bulk-pack.png",
    imageCandidates: ["500g-bulk-pack"],
  },
];

/**
 * Formats a rupee amount exactly as the site has always displayed it
 * (`PKR 1,550`).
 *
 * Grouping is done with a regex rather than `toLocaleString` so the output is
 * byte-identical on every runtime, including prerendering workers whose ICU
 * data can differ from the browser's.
 */
export function formatPkr(amount: number): string {
  return `PKR ${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
