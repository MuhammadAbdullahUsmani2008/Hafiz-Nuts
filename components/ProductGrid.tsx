import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";
import { resolvePublicImage } from "@/lib/resolveImage";

/**
 * HAFIZ NUTS - responsive grid of product cards.
 *
 * Server component shared by the homepage's featured section and the full
 * `/products` listing, so both render identical cards. Photography is
 * resolved from disk here at prerender time (see `lib/resolveImage.ts`) and
 * handed to the client cards as a prop - which is why this must not be
 * marked `"use client"`.
 *
 * `className` sets the column count, since the two callers want different
 * rhythms: four featured packs fill one row, six packs read better as 3 x 2.
 */
export default function ProductGrid({
  products,
  className,
  compactMobile = false,
}: {
  products: readonly Product[];
  className: string;
  /**
   * Two cards per row on phones (instead of one full-width card), with the
   * cards tightened to fit. Used by the homepage so all four featured packs
   * are visible at once as a 2 x 2 block.
   */
  compactMobile?: boolean;
}) {
  return (
    <div
      className={`grid ${compactMobile ? "grid-cols-2 gap-3" : "grid-cols-1 gap-6"} sm:grid-cols-2 sm:gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          image={resolvePublicImage(product.imageCandidates)}
          compactMobile={compactMobile}
        />
      ))}
    </div>
  );
}
