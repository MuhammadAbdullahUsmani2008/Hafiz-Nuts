import type { Metadata } from "next";

import PolicyPage from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/terms`.
 *
 * The payment terms mirror what the checkout actually offers: COD is the
 * default, EasyPaisa is the manual alternative, and an EasyPaisa order is not
 * dispatched until the receipt has been checked. Stating the verification
 * step here matters - it is the one term that could otherwise surprise
 * someone who has already transferred the money.
 *
 * The EasyPaisa account details are repeated from `EASYPAISA` in
 * `CheckoutClient`; if that account ever changes it must be updated in both
 * places.
 */

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "Stock confirmation on WhatsApp, prices in PKR, and payment by Cash on Delivery or EasyPaisa with receipt verification before dispatch.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro={
        <>
          The terms that apply when you order from HAFIZ NUTS. They are short
          by design - every one of them reflects what the checkout already does.
        </>
      }
      sections={[
        {
          heading: "General Terms",
          items: [
            {
              label: "Product Availability",
              body: "All product and bundle orders are subject to stock confirmation upon WhatsApp receipt.",
            },
            {
              label: "Pricing",
              body: "All prices are listed in PKR (Pakistani Rupees).",
            },
            {
              label: "Payment Terms",
              body: (
                <>
                  Cash on Delivery (COD) or advance transfer via EasyPaisa
                  (Account Name:{" "}
                  <strong className="font-semibold text-[#2A170D]">
                    Hafiz Abdul Rehman
                  </strong>
                  , Account Number:{" "}
                  <strong className="font-semibold text-[#7A451F] tabular-nums">
                    03480660406
                  </strong>
                  ). For EasyPaisa payments,{" "}
                  <strong className="font-semibold text-[#2A170D]">
                    receipt verification is required prior to order dispatch
                  </strong>
                  .
                </>
              ),
            },
          ],
        },
      ]}
    />
  );
}
