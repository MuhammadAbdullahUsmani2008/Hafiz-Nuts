import type { Metadata } from "next";

import PolicyPage from "@/components/PolicyPage";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/shipping-returns`.
 *
 * Static content route. The delivery windows below are the numbers the brand
 * quotes on WhatsApp, so keeping them in one place here means the checkout
 * copy and the support replies can point at a single source rather than
 * restating them.
 *
 * The 48-hour claim window is deliberately prominent: it is the one term on
 * this page that a customer has to act on, so it is stated in full rather
 * than summarised.
 */

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Returns",
  description:
    "Nationwide delivery across Pakistan in 2–4 working days, dispatched within 24–48 hours. See our freshness guarantee and damaged-item replacement policy.",
  path: "/shipping-returns",
});

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      title="Shipping & Returns"
      intro={
        <>
          How we pack, dispatch, and stand behind every order - from the moment
          it is confirmed on WhatsApp to the moment it reaches your door.
        </>
      }
      sections={[
        {
          heading: "Shipping Information",
          items: [
            {
              label: "Coverage",
              body: "Nationwide delivery across all major cities and towns in Pakistan via courier services.",
            },
            {
              label: "Dispatch Time",
              body: "Orders are processed and dispatched within 24–48 hours of confirmation via WhatsApp.",
            },
            {
              label: "Delivery Timeline",
              body: "2–4 working days after dispatch, depending on the destination city.",
            },
            {
              label: "Shipping Charges",
              body: "A standard flat shipping rate, calculated at order confirmation - with periodic free shipping promotions on select bundles.",
            },
          ],
        },
        {
          heading: "Returns, Replacements & Damaged Goods",
          items: [
            {
              label: "Freshness & Quality Guarantee",
              body: "Every jar/tub of HAFIZ NUTS products is packed under strict hygiene standards.",
            },
            {
              label: "Damaged / Wrong Items",
              body: (
                <>
                  If an item arrives damaged, unsealed, or incorrect, contact us
                  within <strong className="font-semibold text-[#2A170D]">48 hours of delivery</strong>{" "}
                  with a photo or video proof, on{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
                  >
                    WhatsApp (+92 304 7677019)
                  </a>{" "}
                  or by{" "}
                  <a
                    href="mailto:info@hafiznuts.com"
                    className="font-medium text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
                  >
                    email (info@hafiznuts.com)
                  </a>
                  .
                </>
              ),
            },
            {
              label: "Replacement Process",
              body: "Immediate free replacement or full refund for verified damaged or incorrect shipments.",
            },
          ],
        },
      ]}
    />
  );
}
