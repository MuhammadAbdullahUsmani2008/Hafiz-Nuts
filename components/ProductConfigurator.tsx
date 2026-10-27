"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";
import {
  formatPkr,
  PLACEHOLDER_IMAGE,
  PRODUCT_LINES,
  type Product,
} from "@/lib/catalog";

/**
 * HAFIZ NUTS - product detail configurator.
 *
 * Client component, because it drives the cart (`addItem`) and the quantity
 * stepper. The page above it is a server component: it resolves the pack
 * photographs from disk at prerender time and hands the URLs down, so this
 * file never touches the filesystem.
 *
 * Every pack size is its own route (`/products/honey-nut-mix-30g`, …), so the
 * size pills and the gallery thumbnails are real `<Link>`s rather than local
 * state. That keeps the URL, the price, and the document title in agreement -
 * a size change is a navigation, is shareable, and works without JavaScript.
 */

/** A pack size as the configurator sees it, with its image already resolved. */
export type PackOption = {
  slug: string;
  size: string;
  pricePkr: number;
  image: string | null;
};

const HIGHLIGHTS = [
  { icon: Leaf, label: "100% Natural" },
  { icon: BadgeCheck, label: "Premium Quality" },
  { icon: ShieldCheck, label: "No Preservatives" },
  { icon: Wallet, label: "Cash on Delivery" },
] as const;

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

export default function ProductConfigurator({
  product,
  image,
  options,
}: {
  product: Product;
  image: string | null;
  options: readonly PackOption[];
}) {
  const router = useRouter();
  /* Display name and /products anchor of this pack's line (mix or honey). */
  const line = PRODUCT_LINES[product.line];
  const { addItem, openCart, closeCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  /** Keeps the stepper inside a sane range; empty input falls back to 1. */
  const setClampedQuantity = (next: number) => {
    if (Number.isNaN(next)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(99, Math.max(1, Math.trunc(next))));
  };

  /*
   * The name comes from the catalog, exactly as `ProductCard` passes it. It
   * used to read "Premium Honey & Nut Mix" here, so the same pack added from
   * the homepage and from this page landed under two different names - the
   * cart merges lines by `id` and keeps the first name it saw, whichever
   * route the customer used first.
   */
  const cartLine = {
    id: product.id,
    name: product.name,
    size: product.size,
    pricePkr: product.pricePkr,
    image: image ?? PLACEHOLDER_IMAGE,
  };

  /* Adds the configured quantity and opens the drawer. */
  const handleAddToCart = () => {
    addItem(cartLine, quantity);
  };

  /* Adds, closes the drawer the add just opened, and goes straight to checkout. */
  const handleBuyNow = () => {
    addItem(cartLine, quantity);
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Left - gallery. */}
      <div>
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-[#8C5228]/30 bg-white shadow-sm">
          {image ? (
            <Image
              src={image}
              alt={`${line.name} - ${product.size} pack`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="cursor-zoom-in object-contain p-6 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-wider text-[#8C5228]/60">
              Product Image Coming Soon
            </div>
          )}

          {/* Saved-badge style caption, echoing the bundle savings pill. */}
          <span className="absolute top-4 left-4 rounded-full bg-[#1B4332] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            100% Natural
          </span>
        </div>

        <p className="mt-2 text-center text-[11px] text-[#8C5228]/80">
          Hover to zoom · tap a pack size below to switch
        </p>

        {/*
          Thumbnail strip - one thumbnail per pack size, each a real link.
          Six sizes: two rows of three on phones, one row from `sm`.
        */}
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {options.map((option) => {
            const active = option.slug === product.slug;

            return (
              <li key={option.slug}>
                <Link
                  href={`/products/${option.slug}`}
                  aria-current={active ? "true" : undefined}
                  className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-white transition-colors ${
                    active
                      ? "border-[#7A451F] ring-1 ring-[#7A451F]"
                      : "border-[#E8DFC8] hover:border-[#8C5228]/60"
                  } ${FOCUS_RING}`}
                >
                  {option.image ? (
                    <Image
                      src={option.image}
                      alt={`${option.size} pack`}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-[10px] font-semibold text-[#8C5228]/60">
                      {option.size}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right - configurator. */}
      <div>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-xs text-[#8C5228]">
            <li>
              <Link href="/" className={`hover:text-[#2A170D] ${FOCUS_RING}`}>
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link
                href={`/products#${line.anchor}`}
                className={`hover:text-[#2A170D] ${FOCUS_RING}`}
              >
                Products
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-[#2A170D]">
              {line.name} ({product.size})
            </li>
          </ol>
        </nav>

        <h1 className="mt-3 font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
          {line.name}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#5C4333]">
          {product.description}
        </p>

        {/* Price. */}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#7A451F]">
            {formatPkr(product.pricePkr)}
          </span>
          <span className="text-xs font-medium text-[#8C5228]">
            for the {product.size} pack
          </span>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#1B4332]">
          <Truck className="h-3.5 w-3.5" aria-hidden />
          Delivery all over Pakistan · Cash on Delivery available
        </p>

        <hr className="my-6 border-[#E8DFC8]" />

        {/* Pack size selector. */}
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-[#2A170D]">Pack Size</h2>
            <span className="text-xs text-[#8C5228]">{product.size}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {options.map((option) => {
              const active = option.slug === product.slug;

              return (
                <Link
                  key={option.slug}
                  href={`/products/${option.slug}`}
                  aria-current={active ? "true" : undefined}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors md:text-sm ${
                    active
                      ? "border-[#7A451F] bg-[#7A451F] text-white"
                      : "border-[#E8DFC8] bg-white text-[#5C4333] hover:border-[#8C5228] hover:text-[#2A170D]"
                  } ${FOCUS_RING}`}
                >
                  {option.size}
                  <span
                    className={`ml-2 text-[11px] font-medium ${
                      active ? "text-white/80" : "text-[#8C5228]"
                    }`}
                  >
                    {formatPkr(option.pricePkr)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quantity. */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[#2A170D]">Quantity</h2>

          <div className="mt-3 inline-flex items-center rounded-full border border-[#E8DFC8] bg-white">
            <button
              type="button"
              onClick={() => setClampedQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[#7A451F] transition-colors hover:bg-[#FAF6F0] disabled:cursor-not-allowed disabled:text-[#8C5228]/40 ${FOCUS_RING}`}
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>

            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={quantity}
              onChange={(event) => setClampedQuantity(Number(event.target.value))}
              aria-label="Quantity"
              className="w-14 border-x border-[#E8DFC8] bg-transparent py-2 text-center text-sm font-semibold text-[#2A170D] focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setClampedQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[#7A451F] transition-colors hover:bg-[#FAF6F0] ${FOCUS_RING}`}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <p className="mt-2 text-xs text-[#8C5228]">
            Line total:{" "}
            <span className="font-bold text-[#2A170D]">
              {formatPkr(product.pricePkr * quantity)}
            </span>
          </p>
        </div>

        {/* Actions. */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-[#7A451F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#603516] ${FOCUS_RING}`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#7A451F] px-6 py-3 text-sm font-semibold text-[#7A451F] transition-colors hover:bg-[#7A451F]/10 ${FOCUS_RING}`}
          >
            Buy Now
          </button>
        </div>

        <button
          type="button"
          onClick={openCart}
          className={`mt-3 w-full text-center text-xs font-medium text-[#8C5228] transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
        >
          View cart
        </button>

        {/* Highlights. */}
        <ul className="mt-8 grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-xl border border-[#E8DFC8]/70 bg-white px-3 py-2.5"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#7A451F]" aria-hidden />
              <span className="text-xs font-medium text-[#2A170D]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
