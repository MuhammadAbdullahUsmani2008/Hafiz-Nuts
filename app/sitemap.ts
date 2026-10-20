import type { MetadataRoute } from "next";

import { PRODUCTS, SITE_URL } from "@/lib/catalog";

/**
 * HAFIZ NUTS - `/sitemap.xml`.
 *
 * Product entries come straight from the catalog, so adding a pack size to
 * `lib/catalog.ts` lists it here with no further change. The legacy redirect
 * `/products/premium-honey-nut-mix` is left out on purpose: a sitemap should
 * list only canonical, 200-status URLs. `/checkout`
 * is excluded too - it is a transactional page that renders an empty cart for
 * every crawler, so there is nothing on it worth indexing.
 *
 * ## Why there is no `lastModified`
 *
 * Nothing in the project records when a page actually changed, and under
 * `cacheComponents` a `new Date()` here either makes the route dynamic or,
 * cached, re-stamps it on every revalidation. Either way `<lastmod>` would
 * read "just now" on every crawl, which search engines learn to ignore. Leaving
 * it out keeps the route fully static and the signal honest; add it back
 * per entry once a real modification date exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}/shipping-returns`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.3 },
    {
      url: `${SITE_URL}/product-info`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    { url: `${SITE_URL}/cookies`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
