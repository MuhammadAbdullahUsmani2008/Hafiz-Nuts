import type { Metadata } from "next";

import { ContactBlock, ContactList } from "@/components/PolicyContent";
import PolicyPage from "@/components/PolicyPage";
import { CONTACT_EMAIL, CONTACT_PHONE, DELIVERY_FEE_PKR, formatPkr } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/shipping-returns`.
 *
 * Two policy documents on one route, each with its own numbering: the
 * Shipping & Delivery Policy, and the Returns, Refunds & Replacements Policy
 * (anchored at `#returns`, which the Terms link to). One URL keeps the
 * footer's "Shipping & Returns" link and any existing bookmarks working.
 *
 * Text follows the approved drafts with drafting notes and unfilled
 * placeholders removed - for example the unconfirmed reporting window, refund
 * timing, and failed-delivery procedure are stated as "we will tell you"
 * rather than published as brackets. The delivery fee is read from
 * `lib/catalog.ts`, the same constant checkout adds to the total.
 */

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Returns",
  description: `Nationwide delivery across Pakistan in an estimated 5–7 business days for a flat ${formatPkr(DELIVERY_FEE_PKR)} per order, plus how we handle damaged, missing or incorrect items, refunds and replacements.`,
  path: "/shipping-returns",
});

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      title="Shipping & Returns"
      parts={[
        {
          title: "Shipping & Delivery Policy",
          id: "shipping",
          sections: [
            {
              heading: "Delivery coverage",
              body: (
                <>
                  <p>
                    HAFIZ NUTS offers delivery throughout Pakistan, subject to
                    courier service availability at the customer&rsquo;s
                    destination.
                  </p>
                  <p>
                    An order may require additional confirmation if the
                    destination is not serviceable by the selected courier.
                  </p>
                </>
              ),
            },
            {
              heading: "Delivery charges",
              body: (
                <>
                  <p>
                    Our standard delivery fee is{" "}
                    <strong>{formatPkr(DELIVERY_FEE_PKR)} per order</strong>.
                  </p>
                  <p>
                    The delivery fee and total amount payable are shown at
                    checkout and confirmed before your order is accepted. Any
                    future promotion or exception will be subject to its clearly
                    disclosed terms.
                  </p>
                </>
              ),
            },
            {
              heading: "Estimated delivery time",
              body: (
                <>
                  <p>
                    Our current estimated delivery time is{" "}
                    <strong>5–7 business days</strong>.
                  </p>
                  <p>
                    The estimate may vary due to destination, courier operations,
                    weather, public holidays or other circumstances outside our
                    reasonable control. It is an estimate rather than a
                    guaranteed delivery date unless we expressly confirm
                    otherwise.
                  </p>
                  <p>
                    If we become aware of a material delay, we will communicate
                    it where reasonably practicable.
                  </p>
                </>
              ),
            },
            {
              heading: "Order confirmation",
              body: (
                <>
                  <p>
                    Orders are manually confirmed through the contact details
                    provided by the customer. A submitted website order or
                    initial message is not, by itself, confirmation that the
                    order has been accepted.
                  </p>
                  <p>
                    We will confirm the products, quantities, delivery address,
                    delivery fee and total payable amount before accepting the
                    order.
                  </p>
                </>
              ),
            },
            {
              heading: "Payment",
              body: (
                <>
                  <p>
                    <strong>Cash on Delivery:</strong> pay the confirmed order
                    total, including the disclosed delivery fee, when the parcel
                    is delivered.
                  </p>
                  <p>
                    <strong>EasyPaisa:</strong> transfer the confirmed total in
                    advance and send the payment receipt on WhatsApp. EasyPaisa
                    orders are dispatched once the receipt has been verified.
                  </p>
                </>
              ),
            },
            {
              heading: "Accurate delivery details",
              body: (
                <>
                  <p>
                    Customers should provide a complete and accurate delivery
                    address and a working contact number. Please ensure that
                    someone can receive the parcel at the agreed address.
                  </p>
                  <p>
                    If the courier cannot complete delivery, we will review the
                    situation and contact the customer where reasonably possible.
                    Any redelivery or return-to-sender charges will be explained
                    to you in advance.
                  </p>
                </>
              ),
            },
            {
              heading: "Damaged, missing or incorrect parcels",
              body: (
                <>
                  <p>
                    If a parcel arrives damaged, an item is missing or the order
                    differs from what was confirmed, contact us promptly.
                  </p>
                  <p>
                    Please provide the order details and photographs of the
                    parcel or product if available. Keep the packaging where
                    practical while the issue is reviewed.
                  </p>
                  <ContactList />
                  <p>
                    Eligible complaints will be handled under our{" "}
                    <a href="#returns">
                      Returns, Refunds &amp; Replacements Policy
                    </a>{" "}
                    and applicable law.
                  </p>
                </>
              ),
            },
            {
              heading: "Contact",
              body: (
                <p>
                  For delivery enquiries, contact HAFIZ NUTS at{" "}
                  <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a> or{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              ),
            },
          ],
        },
        {
          title: "Returns, Refunds & Replacements Policy",
          id: "returns",
          sections: [
            {
              heading: "Our commitment",
              body: (
                <>
                  <p>
                    HAFIZ NUTS aims to deliver the products customers order in an
                    acceptable condition. If there is a problem with an order,
                    contact us so we can investigate.
                  </p>
                  <ContactList />
                </>
              ),
            },
            {
              heading: "When to contact us",
              body: (
                <>
                  <p>Please contact us promptly if:</p>
                  <ul>
                    <li>The parcel or product arrives damaged.</li>
                    <li>The wrong product or pack size is delivered.</li>
                    <li>An item or part of an order is missing.</li>
                    <li>
                      The product appears defective, unsafe or materially
                      different from its confirmed description.
                    </li>
                  </ul>
                  <p>
                    Please report the issue as soon as possible after delivery.
                    Report suspected food-safety concerns immediately and do not
                    consume a product you reasonably suspect is unsafe.
                  </p>
                  <p>
                    Reporting promptly helps us investigate; it does not remove
                    rights or remedies that apply under law.
                  </p>
                </>
              ),
            },
            {
              heading: "How to submit a complaint",
              body: (
                <>
                  <p>Please provide, where available:</p>
                  <ul>
                    <li>Your name and order details.</li>
                    <li>A description of the problem.</li>
                    <li>
                      Photographs of the parcel, packaging, seal, label or
                      product, if relevant.
                    </li>
                    <li>The affected product size and quantity.</li>
                  </ul>
                  <p>
                    We may ask reasonable follow-up questions to investigate.
                    Keep the packaging and remaining product where practical,
                    especially if there is a safety concern.
                  </p>
                </>
              ),
            },
            {
              heading: "Food hygiene and change-of-mind requests",
              body: (
                <>
                  <p>
                    Because these are packaged food products, voluntary
                    change-of-mind returns are generally limited to sealed,
                    unopened products in their original condition, subject to
                    applicable law.
                  </p>
                  <p>
                    This does not mean that a genuine complaint about damage, an
                    incorrect order, a defect, a safety issue or a material
                    difference from the product description will automatically
                    be refused. Each such complaint will be reviewed on its
                    facts.
                  </p>
                </>
              ),
            },
            {
              heading: "Possible resolutions",
              body: (
                <>
                  <p>
                    Depending on the circumstances, availability and applicable
                    law, an eligible complaint may be resolved by:
                  </p>
                  <ul>
                    <li>Replacing the affected product.</li>
                    <li>Refunding the relevant amount.</li>
                    <li>
                      Another appropriate remedy agreed with the customer, where
                      lawful.
                    </li>
                  </ul>
                  <p>We will explain the proposed resolution to the customer.</p>
                </>
              ),
            },
            {
              heading: "Refunds",
              body: (
                <>
                  <p>
                    If a refund is approved, it will be paid by bank transfer or
                    mobile-wallet transfer agreed with the customer - for both
                    Cash on Delivery and EasyPaisa orders.
                  </p>
                  <p>
                    The customer&rsquo;s refund destination and amount will be
                    confirmed directly. Customers should never provide
                    passwords, PINs or one-time security codes to receive a
                    refund.
                  </p>
                  <p>
                    We will tell you the expected refund timing once the
                    complaint and refund method have been confirmed.
                  </p>
                </>
              ),
            },
            {
              heading: "Return shipping and collection",
              body: (
                <>
                  <p>
                    Return shipping, collection arrangements and responsibility
                    for any return-delivery cost will depend on the
                    circumstances and applicable law, and will be agreed with you
                    before anything is sent back.
                  </p>
                  <p>
                    Please contact us before sending a product back so we can
                    give instructions. Do not send a parcel to an address that we
                    have not confirmed.
                  </p>
                </>
              ),
            },
            {
              heading: "Food-safety concerns",
              body: (
                <>
                  <p>
                    If you suspect a product is unsafe, stop consuming it and
                    contact us promptly. Preserve the packaging and relevant
                    product details where practical.
                  </p>
                  <p>
                    We will review the issue and take appropriate action,
                    including cooperating with relevant authorities where
                    required.
                  </p>
                </>
              ),
            },
            {
              heading: "Contact",
              body: <ContactBlock />,
            },
          ],
        },
      ]}
    />
  );
}
