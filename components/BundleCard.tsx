"use client";

import Image from "next/image";
import { Package, Tag } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { formatPkr, type Bundle } from "@/lib/catalog";

/**
 * HAFIZ NUTS - bundle card.
 *
 * Client component, split out of `BundleOffersSection` (which stays a server
 * component) because it calls `addItem()` from the cart context. The section
 * resolves the photograph at prerender time and passes the URL in as a prop,
 * so nothing here touches the filesystem.
 *
 * The savings pill is computed from the catalog rather than stored: with
 * `compareAtPricePkr` and `pricePkr` both canonical, a "Save PKR X" label can
 * never drift from the two prices beside it.
 */
export default function BundleCard({
  bundle,
  image,
}: {
  bundle: Bundle;
  image: string | null;
}) {
  const { addItem } = useCart();

  const savingsPkr = bundle.compareAtPricePkr - bundle.pricePkr;

  const handleOrderBundle = () => {
    addItem({
      id: bundle.id,
      name: bundle.title,
      size: `${bundle.unitCount} × ${bundle.unitSize}`,
      pricePkr: bundle.pricePkr,
      image: image ?? bundle.image,
    });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8]/70 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-t-xl bg-[#FAF6F0] p-4">
        {image ? (
          <Image
            src={image}
            alt={bundle.title}
            width={320}
            height={320}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Deliberate placeholder until the bundle photography is added. */
          <div className="flex flex-col items-center gap-2 text-center">
            <Package
              className="h-10 w-10 text-[#8C5228]/35 transition-transform duration-300 group-hover:scale-105"
              aria-hidden
            />
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#8C5228]/60">
              Bundle Image Coming Soon
            </span>
          </div>
        )}

        {/*
          Savings pill - floats over the top-left corner of the image.
          Deep green reads as "deal" against the warm cream and bronze card,
          and the drop shadow keeps it legible over any photograph.
        */}
        <span className="absolute top-3 left-3 rounded-full bg-[#1B4332] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
          Save {formatPkr(savingsPkr)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <h3 className="mt-3 text-base font-semibold text-[#2A170D]">
          {bundle.title}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-[#8C5228]">
          {bundle.pack}
        </p>

        {/*
          Compare-at price struck through in muted gray, then the offer price
          beside it in brand brown. `gap-2` keeps them from running together.
        */}
        <div className="mt-2 flex items-baseline gap-2">
          <del className="text-[13px] font-medium text-[#717171] md:text-[14px]">
            {formatPkr(bundle.compareAtPricePkr)}
          </del>
          <span className="text-base font-bold text-[#2A1810] md:text-lg">
            {formatPkr(bundle.pricePkr)}
          </span>
        </div>

        {/* `mt-auto` keeps every button on one line across the row, whatever the title wraps to. */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleOrderBundle}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A451F] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F] md:text-sm"
          >
            <Tag className="h-4 w-4" aria-hidden />
            Order Bundle
          </button>
        </div>
      </div>
    </article>
  );
}
