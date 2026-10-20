import type { Metadata } from "next";
import Link from "next/link";

import { ContactBlock, ContactList } from "@/components/PolicyContent";
import PolicyPage from "@/components/PolicyPage";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/privacy`.
 *
 * Text follows the approved policy draft. Where the draft left a fact "to be
 * verified" (third-party services, cookies, technical data), the wording here
 * states what the codebase actually does, as audited on the policy date:
 *
 * - No analytics, advertising, or tracking scripts are loaded.
 * - No cookies are set by the site's code. Fonts are self-hosted by
 *   `next/font`, so no request goes to Google Fonts.
 * - The cart is the only thing persisted, in this browser's localStorage
 *   under `hafiz_nuts_cart` (see `context/CartContext.tsx`). Checkout and
 *   inquiry form fields live in component state and are never stored.
 * - Orders and inquiries leave the site only as a pre-filled WhatsApp message
 *   the customer sends themselves. There is no server-side customer record.
 *
 * If any of that changes - an analytics tag, an order database, a newsletter
 * - this page and `/cookies` must change with it.
 */

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How HAFIZ NUTS collects, uses and protects your personal information when you visit our website, place an order or contact us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      parts={[
        {
          sections: [
            {
              heading: "Introduction",
              body: (
                <>
                  <p>
                    This Privacy Policy explains how HAFIZ NUTS handles personal
                    information when customers visit our website, place an
                    order, contact us or submit a complaint.
                  </p>
                  <p>
                    HAFIZ NUTS is an individually operated business based in
                    Rahim Yar Khan, Punjab, Pakistan.
                  </p>
                  <p>Privacy contact:</p>
                  <ContactList />
                </>
              ),
            },
            {
              heading: "Information we may collect",
              body: (
                <>
                  <p>
                    Depending on how you interact with us, we may collect:
                  </p>
                  <ul>
                    <li>Name.</li>
                    <li>Phone number.</li>
                    <li>Email address, if provided.</li>
                    <li>Delivery address and instructions.</li>
                    <li>Items ordered, quantities, prices and order history.</li>
                    <li>Order confirmation and delivery records.</li>
                    <li>
                      EasyPaisa payment receipt screenshots, if you pay by
                      EasyPaisa.
                    </li>
                    <li>Customer messages, enquiries and complaints.</li>
                    <li>
                      Basic technical information (such as IP address and
                      browser type) that our website hosting provider processes
                      to deliver the website.
                    </li>
                  </ul>
                  <p>
                    We offer Cash on Delivery and EasyPaisa. We do not collect
                    card details, and we never ask for your EasyPaisa PIN or
                    one-time codes. If other payment methods are introduced, this
                    Policy will be updated as necessary.
                  </p>
                </>
              ),
            },
            {
              heading: "How we use information",
              body: (
                <>
                  <p>Customer information may be used to:</p>
                  <ul>
                    <li>Confirm and fulfil orders.</li>
                    <li>
                      Contact customers about orders, delivery or changes.
                    </li>
                    <li>Provide customer support.</li>
                    <li>
                      Investigate complaints and process eligible refunds or
                      replacements.
                    </li>
                    <li>Maintain appropriate business records.</li>
                    <li>
                      Protect the website and business against fraud or misuse.
                    </li>
                    <li>Meet applicable legal obligations.</li>
                    <li>
                      Operate and improve the website where relevant and lawful.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              heading: "Sharing information",
              body: (
                <>
                  <p>
                    Information may be shared with a courier or service provider
                    to the extent necessary to deliver an order or operate the
                    business. Information may also be disclosed where required by
                    law or necessary to address fraud, security or legal claims.
                  </p>
                  <p>
                    Orders and enquiries placed on the website are sent to us as
                    a WhatsApp message that you send yourself. The website does
                    not use analytics or advertising services, and we do not
                    sell, rent or share customer personal information with third
                    parties for marketing purposes.
                  </p>
                </>
              ),
            },
            {
              heading: "Phone, email and WhatsApp",
              body: (
                <>
                  <p>
                    When you contact us by phone, email or WhatsApp, the relevant
                    service provider may process information under its own terms
                    and privacy practices.
                  </p>
                  <p>
                    Please avoid sending sensitive information that is not
                    necessary to handle your enquiry or order.
                  </p>
                </>
              ),
            },
            {
              heading: "Cookies and tracking technologies",
              body: (
                <p>
                  The website does not use analytics, advertising cookies or
                  tracking pixels. Your shopping cart is saved in your own
                  browser&rsquo;s local storage so it is still there when you
                  return; it is not sent to us. See our{" "}
                  <Link href="/cookies">Cookie &amp; Tracking Notice</Link> for
                  details.
                </p>
              ),
            },
            {
              heading: "Data security",
              body: (
                <>
                  <p>
                    We will take reasonable steps appropriate to our business to
                    protect customer information from unauthorized access, loss,
                    misuse or disclosure.
                  </p>
                  <p>
                    No electronic storage or transmission method can be
                    guaranteed completely secure. Access to customer information
                    is limited to those who need it for legitimate business
                    purposes.
                  </p>
                </>
              ),
            },
            {
              heading: "Data retention",
              body: (
                <p>
                  We may retain information for as long as reasonably necessary
                  for order fulfilment, customer support, business records,
                  security and applicable legal obligations.
                </p>
              ),
            },
            {
              heading: "Customer requests",
              body: (
                <>
                  <p>
                    For privacy questions or requests relating to personal
                    information, contact us at{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or{" "}
                    <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>.
                  </p>
                  <p>
                    We will review requests in light of applicable law, the
                    information held and any legal requirement to retain
                    particular records.
                  </p>
                </>
              ),
            },
            {
              heading: "Children",
              body: (
                <p>
                  Our website is intended for general customers and is not
                  specifically directed at children. If you believe a child has
                  provided unnecessary personal information, contact us so that
                  we can review the matter.
                </p>
              ),
            },
            {
              heading: "Updates",
              body: (
                <p>
                  We may update this Policy when our data practices, website
                  tools or legal obligations change. The current version will
                  display its last updated date.
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
