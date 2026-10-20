import type { Metadata } from "next";

import CheckoutClient from "@/components/CheckoutClient";

/**
 * HAFIZ NUTS - `/checkout`.
 *
 * Server component shell. Everything on this route reads the cart, so the
 * real work lives in `CheckoutClient`; this file exists to set the page
 * metadata and own the layout wrapper.
 *
 * There is no payment gateway: orders are confirmed by WhatsApp, and payment
 * is Cash on Delivery. The page's job is to collect delivery details and hand
 * the customer a pre-filled, correctly totalled message.
 */

/*
 * `noindex, follow`: a crawler has no cart, so this page only ever renders
 * "Your cart is empty" to it - nothing worth a search listing. `follow`
 * keeps the links on it (home, products) crawlable. It is also left out of
 * `app/sitemap.ts`.
 */
export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Confirm your HAFIZ NUTS order on WhatsApp. Cash on Delivery available across Pakistan.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      {/* Clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-6xl pt-16 md:pt-8">
        <CheckoutClient />
      </div>
    </main>
  );
}
