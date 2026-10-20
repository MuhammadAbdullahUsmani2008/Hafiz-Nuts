import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/catalog";

/** HAFIZ NUTS - `/robots.txt`. Generated at build time and served static. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
