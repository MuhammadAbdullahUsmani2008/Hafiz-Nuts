import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

import ProductGrid from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/catalog";

/**
 * HAFIZ NUTS - "Our Premium Products" (homepage).
 *
 * Server component. Shows only the catalog entries flagged `featured` in
 * `lib/catalog.ts` - two packs from each product line (mix, then honey); the
 * full range lives on `/products`, which the CTA below
 * the grid links to. Changing what the homepage features is a one-flag edit
 * in the catalog - nothing is selected inline here.
 *
 * The `id="products"` anchor stays on this section: the hero and the header's
 * "Order Now" button jump to `/#products`. The header's "Products" nav link
 * and the footer's "All Products" go to `/products` instead.
 *
 * Palette and fonts come from the surrounding design language: headings pick up
 * Playfair Display from the `h2`/`h3` rule in `globals.css`, body and prices fall
 * back to Inter.
 */

const FEATURED = PRODUCTS.filter((product) => product.featured);

export default function ProductsSection() {
  return (
    <section id="products" className="scroll-mt-24 bg-[#FDFBF7] py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="relative text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8C5228] ring-1 ring-[#E8DFC8]/70">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>

          <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#8C5228] uppercase">
            Explore our collection
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#2A170D] md:text-4xl">
            Our Premium Products
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5C4333] md:text-base">
            Our honey &amp; nut mix and pure Sidr (Beri) honey - packed for
            freshness and health.
          </p>
        </div>

        <ProductGrid products={FEATURED} className="mt-10 lg:grid-cols-4" />

        {/*
          Every size beyond the featured few lives on the full listing. Styled
          exactly as the hero's primary "Explore Our Products" button, so the
          site keeps one primary-button look.
        */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full bg-[#7A451F] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
          >
            All Products
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
