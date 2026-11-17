import type { NextConfig } from "next";

/**
 * Security headers for every page.
 *
 * Deliberately NOT included: a `script-src` / `connect-src` Content-Security-
 * Policy. The site loads Google Tag Manager and the TikTok Pixel, and GTM can
 * pull in any other vendor's script from the dashboard, so a strict script
 * allow-list would silently break tracking the next time a tag is added. The
 * directives below cover the attacks that do not depend on that list:
 * clickjacking, base-tag and form hijacking, plugin content and plain HTTP.
 */
const SECURITY_HEADERS = [
  /* Pages can't be framed by other sites (clickjacking). */
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
  },
  /* Browsers must stay on HTTPS for a year once they've seen it. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** The admin page and every API route: never cached, never indexed. */
const PRIVATE_HEADERS = [
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  /* Don't advertise the framework in an `X-Powered-By` header. */
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/admin", headers: PRIVATE_HEADERS },
      { source: "/api/:path*", headers: PRIVATE_HEADERS },
    ];
  },
  /* config options here */
  // cacheComponents: true,
  // partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
