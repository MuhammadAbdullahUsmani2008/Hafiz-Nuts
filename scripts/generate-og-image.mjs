/**
 * HAFIZ NUTS - builds `public/og-image.jpg`, the 1200x630 site-wide share card.
 *
 * Run once, and again whenever the hero photo or branding changes:
 *
 *     node scripts/generate-og-image.mjs
 *
 * Output is a committed static file rather than an `opengraph-image.tsx`
 * route: a file-based OG image would override the per-product share images
 * set in `app/products/[slug]/page.tsx`, and a static JPEG costs nothing at
 * request time. `sharp` ships with Next, so there is no extra dependency.
 *
 * Composition mirrors the hero: the product photograph on the right, a cream
 * wash over the left, and the mark, wordmark, and tagline on the wash.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (file) => path.join(root, "public", file);

const WIDTH = 1200;
const HEIGHT = 630;

/* A left-weighted cream wash, like the hero's, cleared by x~745 so the jars stay vivid. */
const overlay = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#FAF6F0" stop-opacity="0.97"/>
      <stop offset="0.4" stop-color="#FAF6F0" stop-opacity="0.92"/>
      <stop offset="0.62" stop-color="#FAF6F0" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wash)"/>
  <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="#7A451F"/>

  <text x="72" y="300" font-family="Georgia, serif" font-weight="700" font-size="50" fill="#2A170D">Premium Dry Fruits</text>
  <text x="72" y="366" font-family="Georgia, serif" font-weight="700" font-size="50" fill="#2A170D">Mixed with Honey</text>
  <text x="74" y="422" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#5C4333">100% natural</text>
  <text x="74" y="458" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#5C4333">Cash on Delivery all over Pakistan</text>

  <rect x="72" y="494" width="250" height="56" rx="28" fill="#7A451F"/>
  <text x="197" y="530" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="24" fill="#FFFFFF">hafiznuts.com</text>
</svg>`);

const logo = await sharp(pub("logo.png")).resize(120, 120).toBuffer();
const wordmark = await sharp(pub("typo.png")).resize({ height: 56 }).toBuffer();

/*
 * Scaled to full height (~1487px wide), then cropped from the left only, so the
 * jars land at x~620, right of the text column. Centring the crop would
 * leave them in the middle, under the headline.
 */
const PHOTO_OFFSET = 150;

const photo = await sharp(pub("hero-bg.jpg"))
  .resize({ height: HEIGHT })
  .extract({ left: PHOTO_OFFSET, top: 0, width: WIDTH, height: HEIGHT })
  .toBuffer();

await sharp(photo)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 60, left: 64 },
    { input: wordmark, top: 92, left: 196 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(pub("og-image.jpg"));

console.log("Wrote public/og-image.jpg");
