import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import ProductGrid from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/catalog";
import { pageMetadata, productListJsonLd } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/products`, the full catalog listing.
 *
 * Every pack size, in catalog order, using the same cards as the homepage's
 * featured grid. This route used to be a 307 redirect to the 200g detail
 * page; it is now the page the header, breadcrumbs, and the homepage's
 * "View All Products & Sizes" CTA point at.
 *
 * Server component and fully static: the cards are the only client code, and
 * their images are resolved at prerender time by `ProductGrid`.
 */

export const metadata: Metadata = pageMetadata({
  title: "All Products",
  description:
    "Shop every size of Hafiz Nuts premium honey & dry fruit mix - from the 30g tub to the 1kg jar. 100% natural, Cash on Delivery all over Pakistan.",
  path: "/products",
});

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

export default function ProductsPage() {
  return (
    <main className="flex-1 bg-[#FDFBF7] px-4 py-8 md:px-8 md:py-12">
      <JsonLd data={productListJsonLd(PRODUCTS)} />

      {/* pt-16 clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-7xl pt-16 sm:px-2 md:pt-8">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#8C5228] transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to home
        </Link>

        <header className="mt-6 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8C5228] ring-1 ring-[#E8DFC8]/70">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>

          <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#8C5228] uppercase">
            Every size, one recipe
          </p>

          <h1 className="mt-1 font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
            All Products
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5C4333] md:text-base">
            Our premium honey &amp; dry fruit mix in every pack size - from a
            30g taster tub to the 1kg family jar.
          </p>
        </header>

        <ProductGrid products={PRODUCTS} className="mt-10 lg:grid-cols-3" />

        {/* Bundles are not products, so point at them rather than listing them. */}
        <p className="mt-10 text-center text-sm text-[#5C4333]">
          Buying for the family?{" "}
          <Link
            href="/#bundles"
            className={`font-semibold text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
          >
            See our bundle offers
          </Link>{" "}
          and save more.
        </p>
      </div>
    </main>
  );
}
