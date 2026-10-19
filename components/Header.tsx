"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * HAFIZ NUTS | site header.
 *
 * Colours are the literal brand values from the reference layout rather than
 * the `walnut`/`gold`/`cream` tokens in `tailwind.config.ts`; the two sets are
 * close but not identical, so the header is intentionally self-contained.
 *
 * The nav is absolutely centred rather than merely placed between the brand and
 * the actions: with `justify-between` the nav drifts off-centre whenever the
 * right-hand group is wider than the left. Absolute centring is only safe once
 * there is room for it, so the bar switches to the drawer below `lg`.
 *
 * The header is `fixed`, so it sits over the hero's top edge and the hero starts
 * at y=0. It is transparent until the page scrolls, then fades to cream.
 *
 * ## Anchors are rooted at `/#…`
 *
 * This header renders on every route from `app/layout.tsx`, so a bare
 * `#products` read from `/privacy` or `/checkout` resolved to
 * `/privacy#products` - a target that does not exist, making the link a silent
 * no-op. Prefixing with `/` sends the visitor home first, then the hash scrolls
 * to the section.
 *
 * The targets carry `scroll-mt-24` so the fixed bar does not cover them on
 * arrival; `#benefits` was the one missing it.
 */

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#bundles", label: "Bundles" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Shared focus treatment - the palette has no dark on-cream ring, so ring with the bronze. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

const NAV_ITEM = `text-xs font-medium uppercase tracking-wider text-[#3D2518] transition-colors hover:text-[#8C5228] md:text-sm ${FOCUS_RING}`;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrolled(20);
  const { totalItems, toggleCart } = useCart();

  /*
   * An open drawer over the hero photograph is unreadable, so opening it also
   * forces the opaque bar. Readability in that mode outranks the paused
   * transparent-at-top styling.
   */
  const solid = scrolled || isOpen;

  /* Close the drawer on Escape, but only while it is actually open. */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        solid
          ? "border-[#E8DFC8]/60 bg-[#FAF6F0]/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-12 md:py-4">
        {/* Brand - mark + wordmark, kept at their native aspect ratios. */}
        <Link
          href="/"
          className={`flex shrink-0 items-center gap-3 rounded-sm ${FOCUS_RING}`}
        >
          {/** A soft dark shadow keeps the mid-tone gold artwork crisp over the photo. */}
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className={`h-10 w-auto transition-[filter] duration-300 md:h-12 ${
              solid ? "" : "drop-shadow-[0_2px_4px_rgba(42,23,13,0.35)]"
            }`}
          />
          <Image
            src="/typo.png"
            alt="HAFIZ NUTS"
            width={128}
            height={32}
            priority
            className={`h-7 w-auto transition-[filter] duration-300 md:h-8 ${
              solid ? "" : "drop-shadow-[0_2px_4px_rgba(42,23,13,0.35)]"
            }`}
          />
        </Link>

        {/*
          Centre nav - absolutely centred so it sits on the true midline.
          Six links do not fit the original `gap-8` comfortably at exactly
          `lg`: measured at 1024px the first link cleared the wordmark by
          under 8px. `gap-6` keeps ~28px of air there, and `xl` restores the
          roomier rhythm once the bar has width to spare.
        */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-8"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_ITEM}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-4">
          {/*
            Cart - opens the slide-over drawer. The badge is the live item
            count from the cart context and is hidden entirely when empty,
            so it never renders a floating "0".
          */}
          <button
            type="button"
            onClick={toggleCart}
            aria-label={
              totalItems > 0
                ? `Open cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`
                : "Open cart, cart is empty"
            }
            className={`relative inline-flex cursor-pointer text-[#3D2518] transition-opacity hover:opacity-80 ${FOCUS_RING}`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {totalItems > 0 ? (
              <span
                aria-hidden
                className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A451F] px-1 text-[10px] font-bold text-white"
              >
                {totalItems}
              </span>
            ) : null}
          </button>

          <Link
            href="/#products"
            className={`hidden rounded-full bg-[#8C5228] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#653717] sm:inline-flex md:text-sm ${FOCUS_RING}`}
          >
            Order Now
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className={`inline-flex cursor-pointer text-[#3D2518] transition-opacity hover:opacity-80 lg:hidden ${FOCUS_RING}`}
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/*
        Slide-down drawer. Animating `grid-template-rows` lets the panel take its
        natural height instead of guessing a max-height. The divider lives on the
        inner element so it collapses to nothing while the row is 0fr - otherwise
        a stray 1px line would sit under the header's own border.

        `invisible` while closed matters as much as the collapse: a row of 0fr
        still leaves its links in the tab order, so a keyboard user could focus
        six invisible nav items below `lg`. `visibility` is included in the
        transition so the close animation still plays before the panel drops out
        of the a11y tree.
      */}
      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-[grid-template-rows,visibility] duration-300 ease-out lg:hidden ${
          isOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="border-t border-[#E8DFC8]/60 bg-[#FAF6F0]/95 px-6 pb-4 pt-1 backdrop-blur-md md:px-12">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`border-b border-[#E8DFC8]/60 py-3 last:border-b-0 ${NAV_ITEM} ${FOCUS_RING}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* The bar hides this CTA below `sm`, so surface it here instead. */}
            <Link
              href="/#products"
              onClick={() => setIsOpen(false)}
              className={`mt-4 flex items-center justify-center rounded-full bg-[#8C5228] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#653717] sm:hidden ${FOCUS_RING}`}
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
