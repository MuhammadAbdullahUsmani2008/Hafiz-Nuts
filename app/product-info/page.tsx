import type { Metadata } from "next";

import { ContactList, packSizesText } from "@/components/PolicyContent";
import PolicyPage from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/product-info`, the Product Information & Allergen Notice.
 *
 * The approved draft left the ingredient list, allergen statement,
 * cross-contact statement, and storage instructions as placeholders to be
 * filled from the product label. Until those verified facts are supplied, this
 * page points customers to the label and to us rather than publishing
 * brackets - and states the one allergen that is certain from the product
 * itself: it is a nut mix.
 *
 * When the label details arrive, replace the "check the label" wording in
 * sections 2, 3, and 5 with the exact text.
 */

export const metadata: Metadata = pageMetadata({
  title: "Product Information & Allergen Notice",
  description:
    "Product range, ingredients, allergen information, net weight and storage guidance for HAFIZ NUTS Premium Honey & Nut Mix.",
  path: "/product-info",
});

export default function ProductInfoPage() {
  const sizes = packSizesText();

  return (
    <PolicyPage
      title="Product Information & Allergen Notice"
      parts={[
        {
          sections: [
            {
              heading: "Product range",
              body: (
                <>
                  <p>
                    HAFIZ NUTS offers Premium Honey &amp; Nut Mix in {sizes}{" "}
                    packs.
                  </p>
                  <p>
                    The selected pack size, price and other material product
                    details are shown before you confirm an order.
                  </p>
                </>
              ),
            },
            {
              heading: "Ingredients",
              body: (
                <>
                  <p>
                    The complete ingredient list is printed on the product
                    label.
                  </p>
                  <p>
                    If you would like the ingredient list before ordering,
                    please contact us and we will share it with you.
                  </p>
                </>
              ),
            },
            {
              heading: "Allergens",
              body: (
                <>
                  <p>
                    <strong>Contains nuts.</strong> Please check the product
                    label for full allergen information.
                  </p>
                  <p>
                    Customers with food allergies or dietary restrictions should
                    check the product label and contact us before ordering if
                    they require clarification, including about possible
                    cross-contact.
                  </p>
                </>
              ),
            },
            {
              heading: "Net weight",
              body: (
                <p>
                  The pack selected and confirmed by the customer will be{" "}
                  {sizes.replace(" and ", " or ")}, as applicable. The net
                  weight is stated on the product label.
                </p>
              ),
            },
            {
              heading: "Storage and date information",
              body: (
                <>
                  <p>
                    Please follow the storage instructions and date information
                    printed on the product packaging.
                  </p>
                  <p>
                    Do not consume a product that appears contaminated, damaged
                    or otherwise unsafe.
                  </p>
                </>
              ),
            },
            {
              heading: "Product photographs and descriptions",
              body: (
                <>
                  <p>
                    Photographs are intended to help customers understand the
                    product. The actual pack size, quantity and price are stated
                    in the product listing and confirmed with your order.
                  </p>
                  <p>
                    Images do not replace the information on the product label.
                  </p>
                </>
              ),
            },
            {
              heading: "Questions and complaints",
              body: (
                <>
                  <p>
                    For ingredient questions, allergen concerns or product-safety
                    issues, contact:
                  </p>
                  <ContactList />
                  <p>
                    If you suspect a product is unsafe, stop consuming it and
                    contact us promptly.
                  </p>
                </>
              ),
            },
          ],
        },
      ]}
    />
  );
}
