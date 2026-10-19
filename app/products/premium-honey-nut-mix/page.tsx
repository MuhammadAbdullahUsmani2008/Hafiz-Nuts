import { redirect } from "next/navigation";

import { DEFAULT_PRODUCT_SLUG } from "@/lib/catalog";

/**
 * HAFIZ NUTS - legacy product URL.
 *
 * `/products/premium-honey-nut-mix` is the slug from the pre-catalog build,
 * when a single detail page represented the product. Per-size routes replaced
 * it, so this path forwards to the 200g pack - the size that page always
 * showed - rather than 404ing any link or bookmark still using the old URL.
 *
 * A static segment outranks the dynamic `[slug]` route, so this wins without
 * any special handling.
 */
export default function LegacyProductPage() {
  redirect(`/products/${DEFAULT_PRODUCT_SLUG}`);
}
