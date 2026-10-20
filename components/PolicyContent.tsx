import {
  BUNDLES,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  formatPkr,
  PRODUCTS,
} from "@/lib/catalog";

/**
 * HAFIZ NUTS - fragments shared by the policy pages.
 *
 * Contact details and the price lists recur across several documents. Reading
 * them from `lib/catalog.ts` here means a new pack size, a price change, or a
 * new phone number reaches every policy at once instead of leaving one page
 * quoting stale figures.
 */

/** Phone and email as a bullet list, the way every document closes. */
export function ContactList() {
  return (
    <ul>
      <li>
        Phone/WhatsApp: <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
      </li>
      <li>
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </li>
    </ul>
  );
}

/** Business name, location, and contact details - the closing "Contact" block. */
export function ContactBlock() {
  return (
    <p>
      <strong>HAFIZ NUTS</strong>
      <br />
      Rahim Yar Khan, Punjab, Pakistan
      <br />
      Phone/WhatsApp: <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
      <br />
      Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </p>
  );
}

/** "30g - PKR 100" for every pack size, in catalog order. */
export function ProductPriceList() {
  return (
    <ul>
      {PRODUCTS.map((product) => (
        <li key={product.id}>
          {product.size} - {formatPkr(product.pricePkr)}
        </li>
      ))}
    </ul>
  );
}

export function BundlePriceList() {
  return (
    <ul>
      {BUNDLES.map((bundle) => (
        <li key={bundle.id}>
          {bundle.unitCount} × {bundle.unitSize} - {formatPkr(bundle.pricePkr)}
        </li>
      ))}
    </ul>
  );
}

/** "30g, 100g, …, 500g and 1kg" - the pack sizes as running text. */
export function packSizesText(): string {
  const sizes = PRODUCTS.map((product) => product.size);
  return `${sizes.slice(0, -1).join(", ")} and ${sizes[sizes.length - 1]}`;
}
