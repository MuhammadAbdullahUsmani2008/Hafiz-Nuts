import { Leaf } from "lucide-react";

import BundleCard from "@/components/BundleCard";
import { BUNDLES } from "@/lib/catalog";
import { resolvePublicImage } from "@/lib/resolveImage";

/**
 * HAFIZ NUTS - "Special Bundle Offers".
 *
 * Server component, mirroring `ProductsSection`: bundle photography is
 * resolved from disk at prerender time (see `lib/resolveImage.ts`), so this
 * must not be marked `"use client"`. The cards are client components - they
 * wire the cart's `addItem()` - and receive the resolved image URL as a prop.
 *
 * The catalog (`lib/catalog.ts`) is the single source of truth for pack
 * compositions and pricing; nothing is duplicated inline here.
 *
 * Headings pick up Playfair Display from the `h2`/`h3` rules in `globals.css`;
 * body text and prices stay on Inter.
 */

export default function BundleOffersSection() {
  return (
    <section
      id="bundles"
      className="scroll-mt-24 border-t border-[#E8DFC8]/70 bg-[#FAF6F0] py-16 md:py-20"
    >
      <div className="px-4 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8C5228] ring-1 ring-[#E8DFC8]/70">
          <Leaf className="h-5 w-5" aria-hidden />
        </span>

        <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#8C5228] uppercase">
          Save more with packs
        </p>

        <h2 className="mt-1 text-3xl font-bold text-[#2A170D] md:text-4xl">
          Special Bundle Offers
        </h2>

        <p className="mx-auto mt-2 mb-10 max-w-xl text-sm text-[#5C4333] md:text-base">
          Exclusive value bundles crafted for families, gifts, and daily
          wellness.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {BUNDLES.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            image={resolvePublicImage(bundle.imageCandidates)}
          />
        ))}
      </div>
    </section>
  );
}
