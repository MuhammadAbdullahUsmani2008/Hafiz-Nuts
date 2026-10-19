import { Leaf } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/catalog";
import { resolvePublicImage } from "@/lib/resolveImage";

/**
 * HAFIZ NUTS - "Our Premium Products".
 *
 * Server component: it resolves product photography from disk at prerender
 * time (see `lib/resolveImage.ts`), so it must not be marked `"use client"`.
 * The cards themselves are client components - they wire the cart's
 * `addItem()` - and receive the already-resolved image URL as a prop.
 *
 * The catalog (`lib/catalog.ts`) is the single source of truth for names,
 * sizes, and prices; nothing is duplicated inline here.
 *
 * Palette and fonts come from the surrounding design language: headings pick up
 * Playfair Display from the `h2`/`h3` rule in `globals.css`, body and prices fall
 * back to Inter.
 *
 * ## Why there is no "view all" link
 *
 * This grid renders the entire catalog - all four pack sizes, straight from
 * `PRODUCTS` - so there is nothing further to page through. The section used
 * to carry a "View All Products" link pointing at `#products`, its own id:
 * clicking it re-scrolled to the section you were already reading, and the
 * only other candidate (`/products`) is a deliberate 307 redirect to a single
 * pack's detail page, which would not honour the label either. With every
 * product already on screen, the honest fix was to drop the control.
 */

export default function ProductsSection() {
  return (
    <section id="products" className="scroll-mt-24 bg-[#FDFBF7] py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Section header - centred; the grid below shows every catalog product. */}
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
            Handpicked premium honey and nut mixes packed for freshness and
            health.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              image={resolvePublicImage(product.imageCandidates)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
