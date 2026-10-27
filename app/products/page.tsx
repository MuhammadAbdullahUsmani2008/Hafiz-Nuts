import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import ProductGrid from "@/components/ProductGrid";
import {
  PRODUCT_LINES,
  PRODUCTS,
  productsInLine,
  type ProductLine,
} from "@/lib/catalog";
import { pageMetadata, productListJsonLd } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/products`, the full catalog listing.
 *
 * Every pack, grouped by product line - Honey & Nut Mix, then Pure Sidr
 * Honey - using the same cards as the homepage. Each group has an anchor
 * (`#honey-nut-mix`, `#honey`) that the chips at the top, product-page
 * breadcrumbs and the footer link to. The header's
 * "Products" link and the homepage's "All Products" button land here.
 *
 * Server component and fully static: the cards are the only client code, and
 * their images are resolved at prerender time by `ProductGrid`.
 */

export const metadata: Metadata = pageMetadata({
  title: "All Products",
  description:
    "Shop Hafiz Nuts premium honey & dry fruit mix and pure Sidr (Beri) honey in every size - from the 30g tub to the 1kg jar. 100% natural, Cash on Delivery all over Pakistan.",
  path: "/products",
});

/* Display order of the groups, with each one's short intro line. */
const GROUPS: readonly { line: ProductLine; intro: string }[] = [
  {
    line: "mix",
    intro: "Honey with hand-picked nuts and dry fruits - from a 30g taster tub to the 1kg family jar.",
  },
  {
    line: "honey",
    intro: "Pure, natural Sidr (Beri) honey - rich, golden, and naturally sweet.",
  },
];

/* Pill styling shared with the pack-size selector on product pages. */
const CHIP =
  "rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-xs font-semibold text-[#5C4333] transition-colors hover:border-[#8C5228] hover:text-[#2A170D] md:text-sm";

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
            Every size, every jar
          </p>

          <h1 className="mt-1 font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
            All Products
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5C4333] md:text-base">
            Our premium honey &amp; dry fruit mix and pure Sidr honey, in
            every pack size.
          </p>

          {/* Jump links to each group below. */}
          <nav aria-label="Product lines" className="mt-6 flex flex-wrap justify-center gap-2.5">
            {GROUPS.map(({ line }) => (
              <a
                key={line}
                href={`#${PRODUCT_LINES[line].anchor}`}
                className={`${CHIP} ${FOCUS_RING}`}
              >
                {PRODUCT_LINES[line].name}
              </a>
            ))}
          </nav>
        </header>

        {GROUPS.map(({ line, intro }) => (
          <section
            key={line}
            id={PRODUCT_LINES[line].anchor}
            aria-labelledby={`${line}-heading`}
            className="mt-14 scroll-mt-24"
          >
            <div className="border-b border-[#E8DFC8] pb-3">
              <h2
                id={`${line}-heading`}
                className="font-display text-2xl font-bold text-[#2A170D] md:text-3xl"
              >
                {PRODUCT_LINES[line].name}
              </h2>
              <p className="mt-1 text-sm text-[#5C4333]">{intro}</p>
            </div>

            <ProductGrid
              products={productsInLine(line)}
              className="mt-6 lg:grid-cols-3"
            />
          </section>
        ))}

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
