import type { Metadata } from "next";

import { ContactList } from "@/components/PolicyContent";
import PolicyPage from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/cookies`, the Cookie & Tracking Notice.
 *
 * The approved draft left the actual configuration "to confirm through a
 * technical audit". This page states the result of auditing the codebase on
 * the policy date:
 *
 * - The site's code sets no cookies.
 * - No analytics, advertising, retargeting, or pixel scripts are loaded.
 * - Fonts are self-hosted by `next/font` (no third-party font requests).
 * - The only stored data is the cart, in localStorage under
 *   `hafiz_nuts_cart` (`context/CartContext.tsx`). It never leaves the
 *   browser.
 *
 * Adding any analytics or ad tag, or a cookie of any kind, makes this page
 * inaccurate - update it (and `/privacy`) in the same change.
 */

export const metadata: Metadata = pageMetadata({
  title: "Cookie & Tracking Notice",
  description:
    "HAFIZ NUTS does not use analytics, advertising cookies or tracking pixels. Your cart is saved only in your own browser.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PolicyPage
      title="Cookie & Tracking Notice"
      parts={[
        {
          sections: [
            {
              heading: "About cookies",
              body: (
                <p>
                  Cookies and similar technologies may be used to operate
                  websites, maintain security, remember preferences, measure
                  performance or support advertising.
                </p>
              ),
            },
            {
              heading: "Technologies used",
              body: (
                <>
                  <p>The HAFIZ NUTS website:</p>
                  <ul>
                    <li>Does not set cookies.</li>
                    <li>
                      Does not use analytics, advertising pixels, retargeting
                      tools or similar tracking technologies.
                    </li>
                    <li>
                      Uses your browser&rsquo;s <strong>local storage</strong>{" "}
                      to remember the items in your shopping cart.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              heading: "Essential website functions",
              body: (
                <>
                  <p>
                    Your cart is saved in your browser&rsquo;s local storage so
                    that it is still there if you refresh the page or come back
                    later. It stays on your device and is not sent to us; we only
                    receive your order when you send it on WhatsApp.
                  </p>
                  <p>
                    Our website hosting provider may process basic technical
                    information, such as your IP address, in order to deliver
                    the website and keep it secure.
                  </p>
                </>
              ),
            },
            {
              heading: "Analytics and advertising",
              body: (
                <p>
                  We do not currently use analytics services, advertising
                  pixels, retargeting tools or similar technologies. If we
                  introduce any, this Notice will be updated to identify them,
                  explain their purposes and describe the choices available to
                  you.
                </p>
              ),
            },
            {
              heading: "Managing preferences",
              body: (
                <>
                  <p>
                    You can remove your saved cart at any time by using
                    &ldquo;Clear Cart&rdquo;, or by clearing this site&rsquo;s
                    data in your browser settings.
                  </p>
                  <p>
                    If you block local storage, the website still works, but your
                    cart will not be remembered between visits.
                  </p>
                </>
              ),
            },
            {
              heading: "Contact",
              body: (
                <>
                  <p>For privacy questions, contact HAFIZ NUTS:</p>
                  <ContactList />
                </>
              ),
            },
          ],
        },
      ]}
    />
  );
}
