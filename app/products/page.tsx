import { redirect } from "next/navigation";

import { DEFAULT_PRODUCT_SLUG } from "@/lib/catalog";

/**
 * HAFIZ NUTS - `/products` index.
 *
 * There is no listing page: the homepage grid is the catalog view. This route
 * exists so the bare `/products` URL - the one the header, footer, and
 * breadcrumbs point at - lands on the default 200g pack instead of a 404.
 */
export default function ProductsIndex() {
  redirect(`/products/${DEFAULT_PRODUCT_SLUG}`);
}
