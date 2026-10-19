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

export type Product = {
  /** Stable identifier - also the cart line-item key. */
  id: string;
  name: string;
  /** Reserved for future `/products/[slug]` detail routes. */
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
 * Canonical WhatsApp order line. The same number the contact section dials, in
 * international form without the `+`, which is what `wa.me` expects.
 */
export const WHATSAPP_NUMBER = "923047677019";

export const PRODUCTS: readonly Product[] = [
  {
    id: "hn-mix-30g",
    name: "30g Tub",
    slug: "honey-nut-mix-30g",
    size: "30g",
    pricePkr: 100,
    image: "/30g.jpg",
    imageCandidates: ["30g-tub", "30g"],
    description:
      "Single-serve tub of our premium honey & nut mix - a handy first taste or an on-the-go snack.",
    inStock: true,
  },
  {
    id: "hn-mix-100g",
    name: "100g Jar",
    slug: "honey-nut-mix-100g",
    size: "100g",
    pricePkr: 350,
    image: "/100g.jpg",
    imageCandidates: ["100g-jar", "100g"],
    description:
      "Everyday jar size for daily snacking, lunchboxes and the office desk.",
    inStock: true,
  },
  {
    id: "hn-mix-200g",
    name: "200g Jar",
    slug: "honey-nut-mix-200g",
    size: "200g",
    pricePkr: 650,
    image: "/200g.jpg",
    imageCandidates: ["200g-jar", "200g-tub", "200g"],
    description:
      "Shareable jar of the honey & nut mix - sized for families and gifting.",
    inStock: true,
  },
  {
    id: "hn-mix-500g",
    name: "500g Jar",
    slug: "honey-nut-mix-500g",
    size: "500g",
    pricePkr: 1550,
    image: "/500g.jpg",
    imageCandidates: ["500g-jar", "500g"],
    description:
      "Our largest jar - the best value for households and daily wellness routines.",
    inStock: true,
  },
];

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
