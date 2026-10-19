import type { Config } from "tailwindcss";

/**
 * Golden Harvest - brand design tokens.
 *
 * Tailwind v4 is CSS-first, so this file is opt-in: it is loaded by the
 * `@config "../tailwind.config.ts";` directive at the top of `app/globals.css`.
 * Values placed here are inlined into the theme rather than registered as
 * `--color-*` / `--font-*` CSS variables, so reference the utilities
 * (`bg-walnut-900`, `font-display`) rather than the variable names.
 *
 * Note: v4 detects source files automatically, so there is no `content` key
 * here. Use `@source` in `globals.css` if you ever need to add extra sources.
 */
const config = {
  theme: {
    extend: {
      colors: {
        /* Deep walnut / chocolate - primary brand colour. */
        walnut: {
          50: "#faf7f3",
          100: "#f1e9df",
          200: "#e2d1bd",
          300: "#cdb195",
          400: "#b48c6a",
          500: "#9c6f4b",
          600: "#7f5738",
          700: "#62422a",
          800: "#4a3020",
          900: "#3d2314",
          950: "#241309",
        },

        /* Gold / bronze - accent, prices, ratings, highlights. */
        gold: {
          50: "#fdf9ec",
          100: "#f9efcd",
          200: "#f2dd97",
          300: "#eac75f",
          400: "#dfb43a",
          500: "#c59b27",
          600: "#a67f1f",
          700: "#83621b",
          800: "#6a4f1c",
          900: "#5a431c",
          950: "#342407",
        },

        /* Soft cream / beige - page and section backgrounds. */
        cream: {
          50: "#fdfbf7",
          100: "#faf6ee",
          200: "#f7f3ec",
          300: "#f0e9dc",
          400: "#e5dac6",
          500: "#d6c6ab",
        },

        /* Semantic aliases - what most components should actually use. */
        background: "#fdfbf7",
        foreground: "#3d2314",
        border: "#e8dfd0",

        /** Warm-white container with a subtle border. */
        card: {
          DEFAULT: "#fffdf9",
          foreground: "#3d2314",
          border: "#efe7d9",
          muted: "#faf6ee",
        },

        muted: {
          DEFAULT: "#faf6ee",
          foreground: "#8a7359",
        },

        primary: {
          DEFAULT: "#3d2314",
          hover: "#4a3020",
          foreground: "#fdfbf7",
        },

        accent: {
          DEFAULT: "#c59b27",
          hover: "#b0881f",
          foreground: "#241309",
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-playfair)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        /* Handwritten accents only - the floating hero note. */
        script: ["var(--font-caveat)", "Segoe Script", "cursive"],
      },

      /* Warm, low-contrast shadows suit the cream canvas better than pure black. */
      boxShadow: {
        soft: "0 1px 2px rgba(61, 35, 20, 0.04), 0 8px 24px -12px rgba(61, 35, 20, 0.14)",
        card: "0 1px 3px rgba(61, 35, 20, 0.05), 0 14px 40px -20px rgba(61, 35, 20, 0.18)",
      },
    },
  },
} satisfies Config;

export default config;
