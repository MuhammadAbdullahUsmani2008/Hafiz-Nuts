"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { formatPkr, PLACEHOLDER_IMAGE, type Product } from "@/lib/catalog";

/**
 * HAFIZ NUTS - product card.
 *
 * Client component, split out of `ProductsSection` (which stays a server
 * component) because it calls `addItem()` from the cart context. The section
 * resolves the photograph from disk at prerender time and passes the URL in as
 * a prop, so nothing here touches the filesystem.
 *
 * Adding an item opens the cart drawer automatically - the context does both,
 * so the two stay in sync without this file coordinating state.
 */
export default function ProductCard({
  product,
  image,
}: {
  product: Product;
  image: string | null;
}) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      size: product.size,
      pricePkr: product.pricePkr,
      /* No photograph yet - the cart shows the logo rather than a broken image. */
      image: image ?? PLACEHOLDER_IMAGE,
    });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8]/70 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-xl bg-[#FAF6F0] p-4">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`${product.name} - view details`}
          className="flex h-full w-full items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
        >
          {image ? (
            <Image
              src={image}
              alt={`Hafiz Nuts Premium Honey & Nut Mix - ${product.name}`}
              width={320}
              height={320}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            /* Deliberate placeholder until the product photography is added. */
            <Package
              className="h-10 w-10 text-[#8C5228]/35 transition-transform duration-300 group-hover:scale-105"
              aria-hidden
            />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <h3 className="text-base font-semibold text-[#2A170D]">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-[#7A451F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs font-medium text-[#8C5228]">
          Weight: {product.size}
        </p>
        <p className="mt-2 text-base font-bold text-[#2A170D] md:text-lg">
          {formatPkr(product.pricePkr)}
        </p>

        {/* `mt-auto` keeps every button on one line across the row, whatever the title wraps to. */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A451F] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F] disabled:cursor-not-allowed disabled:bg-[#7A451F]/40 md:text-sm"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
