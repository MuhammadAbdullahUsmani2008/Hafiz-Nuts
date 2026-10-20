import type { Metadata } from "next";
import Link from "next/link";

import {
  BundlePriceList,
  ContactBlock,
  ContactList,
  ProductPriceList,
} from "@/components/PolicyContent";
import PolicyPage from "@/components/PolicyPage";
import { DELIVERY_FEE_PKR, EASYPAISA_ACCOUNT, formatPkr } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/terms`.
 *
 * Text follows the approved policy draft, with three deliberate departures:
 *
 * - Drafting notes ("must be confirmed before publication") and unfilled
 *   placeholders are removed rather than published.
 * - Payment lists EasyPaisa alongside COD, because checkout offers both.
 * - Prices, pack sizes, the delivery fee, contact details, and the EasyPaisa
 *   account are read from `lib/catalog.ts`, so this page cannot drift from
 *   the checkout that charges them.
 */

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms for ordering from HAFIZ NUTS: products and prices in PKR, manual order confirmation, Cash on Delivery or EasyPaisa, delivery, cancellation and returns.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      parts={[
        {
          sections: [
            {
              heading: "About the business",
              body: (
                <>
                  <p>
                    HAFIZ NUTS is an individually operated business based in
                    Rahim Yar Khan, Punjab, Pakistan.
                  </p>
                  <p>Contact details:</p>
                  <ContactList />
                </>
              ),
            },
            {
              heading: "Acceptance of these Terms",
              body: (
                <>
                  <p>
                    These Terms apply to visitors and customers using the HAFIZ
                    NUTS website or placing orders through the website, phone or
                    WhatsApp.
                  </p>
                  <p>
                    Please review the product details, total price, delivery
                    information and return policy before confirming an order.
                    Nothing in these Terms is intended to exclude a right or
                    legal protection that cannot lawfully be excluded.
                  </p>
                </>
              ),
            },
            {
              heading: "Products and prices",
              body: (
                <>
                  <p>
                    HAFIZ NUTS offers Premium Honey &amp; Nut Mix in these pack
                    sizes:
                  </p>
                  <ProductPriceList />
                  <p>Current bundle offers are:</p>
                  <BundlePriceList />
                  <p>
                    Prices are stated in Pakistani rupees. Product availability
                    is confirmed before an order is accepted. Any change to
                    prices or offers applies to new orders only and will be shown
                    clearly before you confirm a new order.
                  </p>
                  <p>
                    Product images are illustrative. A photograph does not
                    replace the confirmed pack size, quantity, price, ingredient
                    information or other material product details. See our{" "}
                    <Link href="/product-info">
                      Product Information &amp; Allergen Notice
                    </Link>
                    .
                  </p>
                </>
              ),
            },
            {
              heading: "Order placement and acceptance",
              body: (
                <>
                  <p>
                    Customers may place orders through the website or by
                    phone/WhatsApp.
                  </p>
                  <p>
                    Orders are manually confirmed. Submitting an order form,
                    receiving an automated acknowledgement or sending a WhatsApp
                    message does not alone guarantee that the order has been
                    accepted.
                  </p>
                  <p>
                    HAFIZ NUTS will confirm availability, item quantities,
                    delivery details, delivery charges and the total payable
                    amount before accepting the order. We may contact the
                    customer to clarify incomplete information or confirm the
                    delivery address.
                  </p>
                  <p>
                    If an order cannot be fulfilled, we will notify the customer
                    and explain the available options.
                  </p>
                </>
              ),
            },
            {
              heading: "Payment",
              body: (
                <>
                  <p>The currently available payment methods are:</p>
                  <ul>
                    <li>
                      <strong>Cash on Delivery (COD)</strong> - pay the
                      confirmed total in cash when your parcel arrives.
                    </li>
                    <li>
                      <strong>EasyPaisa (online mobile transfer)</strong> -
                      transfer the total in advance to Account Name:{" "}
                      <strong>{EASYPAISA_ACCOUNT.accountName}</strong>, Account
                      Number:{" "}
                      <strong className="tabular-nums">
                        {EASYPAISA_ACCOUNT.accountNumber}
                      </strong>
                      , and send the payment receipt screenshot on WhatsApp. An
                      EasyPaisa order is dispatched only after the receipt has
                      been verified.
                    </li>
                  </ul>
                  <p>
                    The customer will be shown the total amount payable before
                    confirming the order. No undisclosed delivery or handling
                    charge will be added after confirmation.
                  </p>
                </>
              ),
            },
            {
              heading: "Delivery",
              body: (
                <>
                  <p>
                    HAFIZ NUTS offers nationwide courier delivery, subject to the
                    destination being serviceable by the selected courier.
                  </p>
                  <p>
                    The standard delivery fee is{" "}
                    <strong>{formatPkr(DELIVERY_FEE_PKR)} per order</strong>,
                    unless a clearly disclosed offer or written order-specific
                    arrangement states otherwise.
                  </p>
                  <p>
                    The current estimated delivery period is{" "}
                    <strong>5–7 business days</strong>. Delivery estimates are
                    not guarantees unless expressly confirmed as such.
                  </p>
                  <p>
                    Delivery can be affected by courier operations, weather,
                    public holidays, incorrect addresses and other circumstances
                    outside the business&rsquo;s reasonable control. We will
                    communicate material known delays where reasonably possible.
                    See our{" "}
                    <Link href="/shipping-returns">
                      Shipping &amp; Delivery Policy
                    </Link>
                    .
                  </p>
                </>
              ),
            },
            {
              heading: "Cancellation",
              body: (
                <>
                  <p>
                    Customers should request cancellation as soon as possible
                    through phone/WhatsApp or email.
                  </p>
                  <p>
                    Cancellation requests will be reviewed according to the
                    order&rsquo;s stage. Cancellation may be possible before
                    dispatch, but cannot be guaranteed after a parcel has been
                    handed to the courier.
                  </p>
                  <p>
                    Any consequences of refusing a dispatched parcel will be
                    explained to you in advance. We will not impose an
                    undisclosed fee.
                  </p>
                </>
              ),
            },
            {
              heading: "Returns, refunds and replacements",
              body: (
                <>
                  <p>
                    If an order arrives damaged, incorrect, incomplete, defective
                    or materially different from what was confirmed, please
                    contact us promptly.
                  </p>
                  <p>
                    We will review the complaint and determine an appropriate
                    remedy in accordance with our published{" "}
                    <Link href="/shipping-returns#returns">
                      Returns, Refunds &amp; Replacements Policy
                    </Link>{" "}
                    and applicable law. Depending on the circumstances, this may
                    include a replacement or refund.
                  </p>
                  <p>
                    Food hygiene considerations may affect voluntary
                    change-of-mind returns, but this does not mean that genuine
                    product complaints or remedies required by law can be
                    automatically refused.
                  </p>
                </>
              ),
            },
            {
              heading: "Customer responsibilities",
              body: (
                <>
                  <p>
                    Customers must provide accurate contact details and delivery
                    information, review their order before confirmation and make
                    reasonable arrangements to receive the parcel.
                  </p>
                  <p>
                    Customers should check ingredient and allergen information
                    before ordering and follow the product label&rsquo;s storage
                    instructions.
                  </p>
                </>
              ),
            },
            {
              heading: "Website use and intellectual property",
              body: (
                <>
                  <p>
                    Website content, branding, logos, photographs and original
                    written material may not be copied or commercially reused
                    without permission from the relevant rights holder.
                  </p>
                  <p>
                    Users must not misuse the website, attempt unauthorized
                    access, interfere with its operation or place fraudulent
                    orders.
                  </p>
                </>
              ),
            },
            {
              heading: "Complaints and contact",
              body: (
                <>
                  <p>For order enquiries, complaints or other concerns:</p>
                  <ContactList />
                  <p>
                    We will review complaints and respond as reasonably
                    practicable.
                  </p>
                </>
              ),
            },
            {
              heading: "Applicable law and disputes",
              body: (
                <p>
                  These Terms are intended for a business operating in Rahim Yar
                  Khan, Punjab, Pakistan. They are subject to applicable
                  Pakistani and Punjab laws. Any dispute will be handled by a
                  court, authority or other forum with jurisdiction under
                  applicable law.
                </p>
              ),
            },
            {
              heading: "Changes to these Terms",
              body: (
                <p>
                  We may update these Terms when our products, business
                  operations or legal obligations change. The latest version will
                  display its effective or updated date. Changes will not remove
                  rights that customers have already acquired under applicable
                  law.
                </p>
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
