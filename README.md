# Golden Harvest

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
