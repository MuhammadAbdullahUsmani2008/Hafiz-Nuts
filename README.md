# Hafiz Nuts

Landing page for a premium dry fruits e-commerce brand - hand-picked almonds,
pistachios, cashews and dates.

## Stack

| Piece      | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 16.4 (App Router, Turbopack)                        |
| Language   | TypeScript                                                  |
| Styling    | Tailwind CSS v4 via `@tailwindcss/turbopack` (no PostCSS)   |
| Icons      | `lucide-react`                                              |
| Fonts      | `next/font/google` - Playfair Display (headings) + Inter    |

## Getting started

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (also typechecks)
npm run lint
```

## Design tokens

All brand tokens live in [`tailwind.config.ts`](tailwind.config.ts).

Tailwind v4 is CSS-first and does **not** read a config file by default, so this
project opts in explicitly. [`app/globals.css`](app/globals.css) starts with:

```css
@config "../tailwind.config.ts";
@import "tailwindcss";
```

`@config` must come **before** the `@import`. Because this is the legacy-config
compatibility path, the values are inlined into the generated utilities rather
than registered as `--color-*` / `--font-*` CSS variables - reference the
utilities (`bg-walnut-900`), not variable names. There is also no `content` key:
v4 detects source files automatically.

### Palette

| Token family | Role                                       | Anchor value |
| ------------ | ------------------------------------------ | ------------ |
| `walnut`     | Deep walnut / chocolate - primary brand    | `#3d2314`    |
| `gold`       | Gold / bronze accent (prices, ratings)     | `#c59b27`    |
| `cream`      | Soft cream / beige backgrounds             | `#fdfbf7`    |

Full 50–950 scales are defined for `walnut` and `gold`, plus a `cream` ramp.

### Semantic aliases

Prefer these in components so the palette can shift without a search-and-replace:

| Utility                                                | Value     |
| ------------------------------------------------------ | --------- |
| `bg-background` / `text-foreground`                    | `#fdfbf7` / `#3d2314` |
| `bg-card` `border-card-border` `bg-card-muted`         | `#fffdf9` / `#efe7d9` / `#faf6ee` |
| `border-border`                                        | `#e8dfd0` |
| `bg-muted` / `text-muted-foreground`                   | `#faf6ee` / `#8a7359` |
| `bg-primary` / `text-primary-foreground` / `bg-primary-hover` | `#3d2314` / `#fdfbf7` / `#4a3020` |
| `bg-accent` / `text-accent-foreground`                 | `#c59b27` / `#241309` |

Plus two warm shadows - `shadow-soft` and `shadow-card` - tuned for the cream
canvas instead of pure black.

### Typography

Fonts are self-hosted by `next/font` (no request to Google at runtime) and
exposed as CSS variables on `<html>`:

- `--font-playfair` → `font-display` utility
- `--font-inter` → `font-sans` utility

[`app/globals.css`](app/globals.css) applies Inter to `body` and Playfair Display
to `h1`–`h4`, so headings are serif by default. Override with `font-sans` where a
heading should be sans.

## Structure

```
app/
  globals.css   # @config + base layer (body, headings, ::selection)
  layout.tsx    # fonts + metadata
  page.tsx      # landing starter: header, hero, highlights, footer
  icon.svg      # favicon
public/         # static assets
```

`app/page.tsx` is a starting scaffold, not a finished landing page: the nav
targets, cart button and product rows are placeholders to wire up to real data.

## Notes

- The theme is intentionally light-only. The create-next-app dark-mode
  `prefers-color-scheme` block was removed because it fought the cream canvas;
  re-add it deliberately if dark mode is wanted.
- Next.js 16 has Cache Components enabled (`next.config.ts`). Values like
  `new Date()` cannot be read during prerendering - the build fails if they are.

## Operations

### Deploying (Cloudflare Workers via OpenNext)

```bash
npm run deploy   # generates images, builds, uploads to Cloudflare
npm run preview  # same build, served locally first
```

Live site: https://hafiz-nuts.hafiznuts435.workers.dev (worker `hafiz-nuts`,
configured in [`wrangler.jsonc`](wrangler.jsonc)). Deploy from a clean, committed
`master` so what is live matches what is in git. `NEXT_PUBLIC_*` values are
inlined at **build** time, so changing one needs a redeploy.

### Environment variables (`.env`, git-ignored)

| Variable                       | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID`  | TikTok Pixel (events in `lib/tiktokPixel`) |
| `NEXT_PUBLIC_GTM_ID`           | Google Tag Manager container; unset = off |
| `ORDERS_SCRIPT_URL` (secret)   | Google Apps Script web app that stores orders |
| `ORDERS_SECRET` (secret)       | Shared secret, must match `SECRET` in `google-sheet/Code.gs` |
| `ADMIN_PASSWORD` (secret)      | Password for `/admin` |

Secrets are runtime values set with `npx wrangler secret put <NAME>`, not read
from `.env` on Cloudflare. See [`.env.example`](.env.example).

### Order log and admin page

Checkout still hands the order to WhatsApp, and also saves it to a Google Sheet
through `/api/orders` -> Apps Script. `/admin` (password-protected, read-only)
shows order counts, sales and the latest orders. One request per order / per
admin refresh, no polling. Setup: [`google-sheet/SETUP.md`](google-sheet/SETUP.md).

### Everyday edits

- **Add a customer review:** append to `REVIEWS` in
  [`components/TestimonialsSection.tsx`](components/TestimonialsSection.tsx)
  (set `rtl: true` for Urdu). Quote it exactly as sent; skip duplicates.
- **Change featured homepage products:** flip `featured` in `lib/catalog.ts`.
- **Homepage layout:** products are 2 x 2 on phones (`compactMobile` on
  `ProductGrid`); testimonials are a swipe carousel on phones, arrows from `md`.

### Open items

- [ ] Next.js `16.4.x` is flagged by `npm audit` (moderate, "use cache" +
      `unstable_cache` info disclosure). Fix is `next@16.4.6`; upgrade, then
      rebuild and redeploy.
- [ ] Finish the order sheet setup (`google-sheet/SETUP.md`), then place a test order.
- [ ] Customer avatars are initials only - no photography in `public/`.
- [ ] Verify GTM/TikTok events fire on the live site (Tag Assistant / Pixel Helper).

## Security

In the code (see `next.config.ts`, `lib/adminAuth.ts`):
- Security headers on every page: anti-framing, HSTS, `nosniff`, referrer and
  permissions policies. No `script-src` CSP on purpose - GTM/TikTok load third-party
  scripts, and a strict list would silently break tracking.
- `/admin` and `/api/*`: `no-store`, `noindex`. Admin sessions are signed, expire
  after 12 hours and die when `ADMIN_PASSWORD` changes. Cookies are HttpOnly,
  Secure, SameSite=Strict. Status changes also check the request's origin.
- `/api/orders` only accepts same-origin posts, caps sizes and recomputes totals;
  the Google Sheet stores customer text as plain text (no formula injection).
- Secrets live only in Cloudflare secrets / local `.env` (git-ignored) - none are
  in git history.

Outside the code (Cloudflare / Google / GitHub dashboards) - keep these on:
- [ ] Two-step verification on Cloudflare, Google, GitHub and the domain registrar.
- [ ] Cloudflare Access (free) in front of `/admin*` and `/api/admin/*`.
- [ ] Cloudflare rate-limit rules on `/api/admin/login` and `/api/orders`.
- [ ] Google Sheet kept private; Apps Script deployed as "Execute as: Me".
- [ ] Run `npm audit --omit=dev` monthly; upgrade Next.js patch releases.
