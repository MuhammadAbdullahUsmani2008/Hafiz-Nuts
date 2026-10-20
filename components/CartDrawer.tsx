"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { DELIVERY_FEE_PKR, formatPkr } from "@/lib/catalog";

/**
 * HAFIZ NUTS - slide-over cart drawer.
 *
 * Mounted once in `app/layout.tsx` inside `<CartProvider>`, so any component
 * can open it via `useCart().addItem()` (which opens it automatically) or
 * `openCart()`/`closeCart()`.
 *
 * It stays in the DOM and slides with `translate-x`, rather than mounting on
 * open, so the transition renders in both directions and the panel keeps its
 * layout. While closed it is `invisible` (out of the tab order and off the
 * accessibility tree) and ignores pointer events via the parent wrapper.
 *
 * The panel is `sticky`-free: the item list scrolls on its own so the
 * subtotal and the checkout button never leave the viewport.
 *
 * ## Focus management
 *
 * The panel declares `role="dialog" aria-modal="true"`, and `aria-modal` is a
 * promise: focus must move in on open, stay inside while open, and come back
 * out on close. Without that a keyboard user opens the cart and keeps tabbing
 * through the page hidden behind the backdrop. So opening stores the element
 * that triggered it (the header cart button, an "Add to Cart" button, or
 * whatever was focused), lands focus on the panel's close control, wraps Tab
 * and Shift+Tab within the panel, and restores the trigger on close - skipping
 * the restore if that element has since left the document, as happens when
 * closing the drawer via "Proceed to Checkout" mid-navigation.
 *
 * The Escape handler and the body scroll lock live in the same effect so they
 * share one open/close lifecycle with the focus work. `closeCart` is a stable
 * `useCallback` from the context, so the effect runs only when `isOpen`
 * actually flips - never on an unrelated re-render, which would otherwise
 * yank focus back to the close button while someone was tabbing the list.
 */

/** Shared focus treatment - matches the header and section buttons. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

const QTY_BUTTON =
  "flex h-7 w-7 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-[#7A451F] transition-colors hover:bg-[#FAF6F0] disabled:cursor-not-allowed disabled:opacity-40";

/** Everything inside the panel that can receive focus, in DOM order. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, totalItems, subtotalPkr, updateQuantity, removeItem } =
    useCart();

  const panelRef = useRef<HTMLElement | null>(null);
  /* The control that opened the drawer, handed focus back on close. */
  const triggerRef = useRef<HTMLElement | null>(null);

  /*
   * One lifecycle for Escape, the body scroll lock, and focus: move focus in
   * when the drawer opens, keep Tab cycling inside it, restore on close.
   */
  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((node) => node.getClientRects().length > 0);

    /* First stop is the header's close control, which is where Tab resumes. */
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = focusables();
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (active === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      } else if (active === first && event.shiftKey) {
        event.preventDefault();
        last.focus();
      } else if (!panelRef.current?.contains(active)) {
        /* Focus escaped to the page behind the backdrop - pull it back. */
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);

      const trigger = triggerRef.current;
      if (trigger && document.contains(trigger)) trigger.focus();
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 bg-[#2A170D]/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      {/*
        Panel. `invisible` (not conditional rendering) keeps the slide
        animation intact in both directions while removing the closed panel
        from the tab order and the a11y tree.
      */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-[#FAF6F0] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "invisible translate-x-full"
        }`}
      >
        {/* Header. */}
        <div className="flex items-center justify-between border-b border-[#E8DFC8] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#7A451F]" aria-hidden />
            <h2 className="text-lg font-bold text-[#2A170D]">Your Cart</h2>
            {totalItems > 0 ? (
              <span className="rounded-full bg-[#7A451F] px-2 py-0.5 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className={`inline-flex text-[#3D2518] transition-colors hover:text-[#7A451F] ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Item list. */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-[#8C5228]/35" aria-hidden />
            <p className="text-sm font-semibold text-[#2A170D]">
              Your cart is empty
            </p>
            <p className="text-xs text-[#5C4333]">
              Add a pack or a bundle to get started.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className={`mt-2 rounded-full border border-[#7A451F] px-5 py-2 text-xs font-semibold text-[#7A451F] transition-colors hover:bg-[#7A451F]/10 ${FOCUS_RING}`}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 border-b border-[#E8DFC8]/70 py-4 last:border-b-0"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-[#E8DFC8]/70">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#2A170D]">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-medium text-[#8C5228]">
                        {item.size}
                      </p>
                      <p className="mt-0.5 text-xs text-[#5C4333]">
                        {formatPkr(item.pricePkr)} each
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className={`shrink-0 text-[#8C5228] transition-colors hover:text-[#7A451F] ${FOCUS_RING}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity stepper. */}
                    <div className="flex items-center gap-2">
                      {/*
                        Disabled at 1: hitting minus there used to delete the
                        line outright, which is a surprising jump from "one
                        fewer" to "gone". The trash control remains the
                        deliberate way to take an item out.
                      */}
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className={QTY_BUTTON}
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#2A170D]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className={QTY_BUTTON}
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-[#2A170D]">
                      {formatPkr(item.pricePkr * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Subtotal + checkout. */}
        {items.length > 0 ? (
          <div className="border-t border-[#E8DFC8] px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#5C4333]">Subtotal</span>
              <span className="text-lg font-bold text-[#2A170D]">
                {formatPkr(subtotalPkr)}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-[#8C5228]">
              Flat {formatPkr(DELIVERY_FEE_PKR)} delivery is added at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A451F] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#603516] ${FOCUS_RING}`}
            >
              Proceed to Checkout
              <span aria-hidden>→</span>
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className={`mt-3 w-full text-center text-xs font-medium text-[#8C5228] transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
            >
              Clear Cart
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
