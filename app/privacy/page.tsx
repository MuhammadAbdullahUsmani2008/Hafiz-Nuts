import type { Metadata } from "next";

import PolicyPage from "@/components/PolicyPage";

/**
 * HAFIZ NUTS - `/privacy`.
 *
 * This describes exactly what the checkout collects, which is the whole of it:
 * the four fields on `CheckoutClient`, persisted only to this browser's
 * localStorage under `hafiz_nuts_cart` until the customer sends the order over
 * WhatsApp. There is no account system, no analytics, and no server-side
 * customer record - so the honest description of "what we do with your data"
 * is short.
 *
 * If that ever changes (an order database, a newsletter, a tracking pixel),
 * this page has to change with it. It currently promises more than a
 * back-end would automatically keep.
 */

export const metadata: Metadata = {
  title: "Privacy Policy | HAFIZ NUTS",
  description:
    "HAFIZ NUTS collects only your name, phone, address, and city to process and deliver your order. We never sell or share your data for marketing.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro={
        <>
          We collect as little as possible, and only what is needed to get an
          order to your door. This page sets out precisely what that is.
        </>
      }
      sections={[
        {
          heading: "Data Collection & Usage",
          items: [
            {
              label: "Information Collected",
              body: "Customer Name, Phone Number, Delivery Address, and City - provided during the checkout process.",
            },
            {
              label: "Purpose",
              body: "Strictly used for order processing, delivery fulfillment via courier, and customer service communication on WhatsApp.",
            },
            {
              label: "Data Protection",
              body: "We do not sell, rent, or share customer personal information with third parties for marketing purposes.",
            },
          ],
        },
      ]}
    />
  );
}
