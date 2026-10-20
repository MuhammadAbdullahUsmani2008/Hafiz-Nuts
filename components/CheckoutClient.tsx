"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";
import {
  DELIVERY_FEE_PKR,
  EASYPAISA_ACCOUNT,
  formatPkr,
  WHATSAPP_NUMBER,
} from "@/lib/catalog";

/**
 * HAFIZ NUTS - checkout.
 *
 * Client component: it reads the cart, owns the form state, and builds the
 * WhatsApp order message on submit.
 *
 * There is no backend and no payment gateway. The flow is deliberately
 * front-end only - collect delivery details, validate them, then open
 * `wa.me` with a pre-filled, correctly totalled order message for the brand
 * to confirm. Payment is Cash on Delivery.
 *
 * ## Validation approach
 *
 * Fields are validated on submit, and each field re-validates on edit once it
 * has been touched. That avoids shouting at someone for an empty form they
 * have only just opened, while still correcting them the moment they try to
 * order.
 *
 * ## Why the cart IS cleared on submit
 *
 * Opening WhatsApp does not prove anything was sent - the user can dismiss
 * the app chooser, lose signal, or close the tab. So the totals are
 * snapshotted into `receipt` state *before* `clearCart()` runs: the
 * confirmation screen keeps showing the real item count and subtotal even
 * though the cart behind it is already empty, and the customer can start over
 * without hunting for a "clear cart" control. "Open WhatsApp again" stays
 * available precisely because `window.open(..., "noopener,noreferrer")`
 * reports nothing back, so a blocked popup cannot be detected after the fact.
 */

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Other",
] as const;

const FIELD =
  "w-full rounded-md border border-[#E8DFC8] bg-white px-3 py-2.5 text-sm text-[#2A170D] placeholder:text-[#8C5228]/50 focus:ring-1 focus:ring-[#7A451F] focus:outline-none";

const LABEL = "mb-1 block text-xs font-semibold text-[#5C4333]";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

/**
 * The two payment routes offered at checkout.
 *
 * EasyPaisa is a manual bank/wallet transfer rather than an integrated
 * gateway: the customer sends the money themselves and pastes a receipt
 * screenshot into the WhatsApp thread. There is no callback to verify it, so
 * the order is only confirmed once the brand sees and trusts the receipt -
 * which is why the WhatsApp message says so explicitly when it is chosen.
 */
const PAYMENT_METHODS = {
  cod: {
    label: "Cash on Delivery (COD)",
    blurb: "Pay in cash when your order arrives",
    /* Text that goes into the WhatsApp order message. */
    messageLabel: "Cash on Delivery",
  },
  easypaisa: {
    label: "EasyPaisa / Online Mobile Transfer",
    blurb: "Transfer in advance, send the receipt on WhatsApp",
    messageLabel: "EasyPaisa (Online Mobile Transfer)",
  },
} as const;

type PaymentMethod = keyof typeof PAYMENT_METHODS;

/**
 * EasyPaisa receiving account, shown once the customer picks this method. The
 * account itself comes from the catalog, which the Terms page also quotes.
 */
const EASYPAISA = {
  ...EASYPAISA_ACCOUNT,
  instructions:
    "Please complete the transfer to the EasyPaisa account above and attach a screenshot of your payment receipt in WhatsApp after confirming your order.",
} as const;

type FormErrors = Partial<Record<"name" | "phone" | "address" | "city", string>>;

/**
 * Accepts the two forms a Pakistani customer is likely to type: `03XX XXXXXXX`
 * and `+92 3XX XXXXXXX`. Anything that is not 10–15 digits after stripping
 * separators is rejected.
 */
function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  return /^\d{10,15}$/.test(digits);
}

/**
 * Collapses a user-entered value onto one line.
 *
 * The message is line-structured, so a stray newline in a pasted address or
 * note would splice a new line into the middle of a labelled field and make
 * the order harder to read. Runs of whitespace - including tabs, CRLF, and
 * pasted non-breaking spaces - collapse to a single space.
 */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Builds the order message for WhatsApp.
 *
 * ## Why there is no emoji here
 *
 * The original version prefixed every field with an emoji (📦, 👤, 💰 …).
 * Those code points sit in emoji presentation ranges that several WhatsApp
 * clients - and more importantly some older Android fonts and the desktop
 * app's fallback renderer - substitute with tofu boxes. The result is a
 * message the brand has to squint at to fulfil.
 *
 * So the format is plain text throughout, with no emoji anywhere. The
 * separators are ASCII `|` and `-` rather than a typographic dash, so the
 * only non-ASCII characters that can reach the message are the `•` bullet,
 * the `×` in pack names (for example "6 × 100g"), and the `→` on the
 * EasyPaisa reminder. Each is an ordinary typographic mark in every basic
 * font, none is subject to emoji substitution, and `encodeURIComponent`
 * percent-encodes them as plain UTF-8 (the bullet becomes `%E2%80%A2`),
 * which is what `wa.me` expects.
 *
 * `*bold*` is kept deliberately: WhatsApp renders single-asterisk runs as
 * bold, so the headings still carry weight in the thread.
 */
function buildOrderMessage(input: {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: PaymentMethod;
  items: readonly { name: string; size: string; quantity: number; pricePkr: number }[];
  subtotalPkr: number;
  deliveryFeePkr: number;
}): string {
  const name = oneLine(input.name);
  const phone = oneLine(input.phone);
  const address = oneLine(input.address);
  const city = oneLine(input.city);
  const notes = oneLine(input.notes);
  const payment = PAYMENT_METHODS[input.paymentMethod].messageLabel;

  const lines = [
    "HAFIZ NUTS | *New Order Request*",
    "",
    "*Customer Details:*",
    `• Name: ${name}`,
    `• Phone: ${phone}`,
    `• Address: ${address}, ${city}`,
    `• Payment Method: ${payment}`,
  ];

  /* Only shown when the customer actually wrote something. */
  if (notes) lines.push(`• Notes: ${notes}`);

  lines.push(
    "",
    "*Order Summary:*",
    ...input.items.map(
      (item) =>
        `• ${item.name} (${item.size}) x ${item.quantity} | ${formatPkr(item.pricePkr * item.quantity)}`,
    ),
    "",
    `• Subtotal: ${formatPkr(input.subtotalPkr)}`,
    `• Delivery: ${formatPkr(input.deliveryFeePkr)}`,
    `*Total Amount:* ${formatPkr(input.subtotalPkr + input.deliveryFeePkr)}`,
  );

  /*
   * Prepended with an arrow rather than left to the customer: an EasyPaisa
   * order is not confirmed until the receipt arrives, so the reminder rides
   * along with the order instead of depending on them remembering it.
   */
  if (input.paymentMethod === "easypaisa") {
    lines.push(
      "",
      "→ Note: I will attach my EasyPaisa payment receipt screenshot right after sending this message.",
    );
  }

  lines.push("", "Please confirm my order and dispatch timeline.");

  return lines.join("\n");
}

export default function CheckoutClient() {
  const { items, subtotalPkr, totalItems, clearCart } = useCart();

  /*
   * The flat delivery fee from the Shipping & Delivery Policy. It is shown and
   * added here, before the customer confirms, because the policy promises the
   * full payable total up front - no charge appears for the first time on
   * WhatsApp.
   */
  const totalPkr = subtotalPkr + DELIVERY_FEE_PKR;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "" as (typeof CITIES)[number] | "",
    notes: "",
  });
  /* COD first - it needs no advance action from the customer. */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [ordered, setOrdered] = useState(false);

  /*
   * Order summary captured at submit time.
   *
   * The cart is cleared the moment the order goes out, so `totalItems` and
   * `subtotalPkr` read 0 from then on. Keeping a copy here lets the thank-you
   * screen still say what was ordered - "3 items · PKR 2,200" - instead of
   * congratulating the customer on buying nothing.
   *
   * The WhatsApp URL is stored verbatim so the reopen link offers exactly the
   * message that was built, not a bare chat with an empty thread. `window.open`
   * cannot be used to detect a blocked popup here: passing `noopener` makes it
   * return `null` even on success, so a "was it blocked?" check would report
   * blocked every time. A visible link is the only reliable fallback.
   */
  const [receipt, setReceipt] = useState<null | {
    itemCount: number;
    totalPkr: number;
    paymentMethod: PaymentMethod;
    whatsappUrl: string;
  }>(null);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));

    /* Re-validate a field once the customer is already correcting it. */
    if (submitted) setErrors(validate({ ...form, [key]: value }));
  };

  function validate(current: typeof form): FormErrors {
    const next: FormErrors = {};

    if (!current.name.trim()) next.name = "Please enter your full name.";
    if (!current.phone.trim()) {
      next.phone = "Please enter your phone or WhatsApp number.";
    } else if (!isValidPhone(current.phone)) {
      next.phone = "Enter a valid number, e.g. 0300 1234567 or +92 300 1234567.";
    }
    if (!current.address.trim())
      next.address = "Please enter your complete delivery address.";
    if (!current.city) next.city = "Please select your city.";

    return next;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const message = buildOrderMessage({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city,
      notes: form.notes,
      paymentMethod,
      items,
      subtotalPkr,
      deliveryFeePkr: DELIVERY_FEE_PKR,
    });

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    /*
     * Order of operations matters. `window.open` must run synchronously here
     * or popup blockers eat it; the snapshot is taken before `clearCart()`
     * because clearing zeroes the values the thank-you screen reads; and
     * `clearCart()` runs regardless of whether the popup survives, so
     * localStorage is purged and the cart badge drops in the same tick.
     */
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setReceipt({
      itemCount: totalItems,
      totalPkr,
      paymentMethod,
      whatsappUrl,
    });
    clearCart();
    setOrdered(true);
  };

  /*
   * Confirmation shown after the WhatsApp hand-off.
   *
   * This guard must come BEFORE the empty-cart check below. The cart is now
   * emptied on submit, so `items.length === 0` is true the instant an order is
   * placed - leaving the empty-cart branch first would greet a customer who
   * just ordered with "Your cart is empty".
   */
  if (ordered && receipt) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[#E8DFC8]/70 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/12 text-[#1B4332] ring-1 ring-[#25D366]/40">
          <PackageCheck className="h-6 w-6" aria-hidden />
        </span>

        <h1 className="mt-4 font-display text-2xl font-bold text-[#2A170D]">
          Order Sent to WhatsApp!
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#5C4333]">
          Please make sure to press Send in your WhatsApp chat to confirm
          dispatch with our team.
        </p>

        <p className="mt-3 text-xs font-semibold text-[#8C5228]">
          {receipt.itemCount} item{receipt.itemCount === 1 ? "" : "s"} ·{" "}
          {formatPkr(receipt.totalPkr)}{" "}
          ({PAYMENT_METHODS[receipt.paymentMethod].messageLabel})
        </p>

        {/* An EasyPaisa order is not complete until the receipt arrives. */}
        {receipt.paymentMethod === "easypaisa" ? (
          <p className="mt-2 text-[11px] leading-relaxed text-[#5C4333]">
            Don&rsquo;t forget to attach your EasyPaisa payment receipt
            screenshot in the chat.
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className={`rounded-full bg-[#7A451F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#603516] ${FOCUS_RING}`}
          >
            Back to Home
          </Link>

          {/*
            Secondary, but load-bearing: if the popup was blocked the customer
            is left with no order at all, so this must stay reachable. It
            reuses the exact pre-filled URL rather than the bare number.
          */}
          <a
            href={receipt.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 text-xs font-medium text-[#25D366] transition-opacity hover:opacity-80 ${FOCUS_RING}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Open WhatsApp again
          </a>
        </div>
      </div>
    );
  }

  /* Empty-cart protection. */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[#E8DFC8]/70 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8C5228] ring-1 ring-[#E8DFC8]/70">
          <ShoppingBag className="h-6 w-6" aria-hidden />
        </span>

        <h1 className="mt-4 font-display text-2xl font-bold text-[#2A170D]">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-[#5C4333]">
          Add a pack or a bundle to your cart and your order summary will appear
          here.
        </p>

        <p className="mt-3 text-[11px] leading-relaxed text-[#8C5228]">
          We deliver all over Pakistan via standard courier services · Cash on
          Delivery and EasyPaisa accepted
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/products"
            className={`rounded-full bg-[#7A451F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#603516] ${FOCUS_RING}`}
          >
            Browse Products
          </Link>
          <Link
            href="/"
            className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#8C5228] transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/"
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#8C5228] transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to home
      </Link>

      <h1 className="mt-3 font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-[#5C4333]">
        We deliver all over Pakistan via standard courier services · Confirm
        your order on WhatsApp
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left - delivery details. */}
        <form
          onSubmit={handleSubmit}
          noValidate
          id="checkout-form"
          className="lg:col-span-7"
          aria-label="Delivery details"
        >
          <div className="rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[#2A170D]">
              Delivery Details
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="checkout-name">
                  Full Name<span aria-hidden className="text-[#7A451F]">*</span>
                </label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "checkout-name-error" : undefined
                  }
                  className={FIELD}
                />
                {errors.name ? (
                  <p
                    id="checkout-name-error"
                    role="alert"
                    className="mt-1 text-[11px] font-medium text-[#B42318]"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="checkout-phone">
                  Phone / WhatsApp Number
                  <span aria-hidden className="text-[#7A451F]">*</span>
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="03XX XXXXXXX  or  +92 3XX XXXXXXX"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "checkout-phone-error" : undefined
                  }
                  className={FIELD}
                />
                {errors.phone ? (
                  <p
                    id="checkout-phone-error"
                    role="alert"
                    className="mt-1 text-[11px] font-medium text-[#B42318]"
                  >
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="checkout-address">
                  Complete Delivery Address
                  <span aria-hidden className="text-[#7A451F]">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  required
                  rows={3}
                  placeholder="Street, house / apartment no., area"
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={
                    errors.address ? "checkout-address-error" : undefined
                  }
                  className={`${FIELD} resize-y`}
                />
                {errors.address ? (
                  <p
                    id="checkout-address-error"
                    role="alert"
                    className="mt-1 text-[11px] font-medium text-[#B42318]"
                  >
                    {errors.address}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={LABEL} htmlFor="checkout-city">
                  City<span aria-hidden className="text-[#7A451F]">*</span>
                </label>
                <select
                  id="checkout-city"
                  name="city"
                  required
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={
                    errors.city ? "checkout-city-error" : undefined
                  }
                  className={FIELD}
                >
                  <option value="">Select your city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city ? (
                  <p
                    id="checkout-city-error"
                    role="alert"
                    className="mt-1 text-[11px] font-medium text-[#B42318]"
                  >
                    {errors.city}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={LABEL} htmlFor="checkout-notes">
                  Delivery Instructions{" "}
                  <span className="font-normal text-[#8C5228]">(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  rows={3}
                  placeholder="Landmark, preferred timing…"
                  value={form.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  className={`${FIELD} resize-y`}
                />
              </div>
            </div>

            {/* Payment method selection. */}
            <fieldset className="mt-6 rounded-xl border border-[#E8DFC8] bg-[#FAF6F0] p-4">
              <legend className={LABEL}>Payment Method</legend>

              <div className="mt-2 space-y-2">
                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((key) => {
                  const method = PAYMENT_METHODS[key];
                  const selected = paymentMethod === key;
                  const Icon = key === "cod" ? Wallet : Smartphone;

                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        selected
                          ? "border-[#7A451F] bg-white ring-1 ring-[#7A451F]"
                          : "border-transparent hover:bg-white/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={key}
                        checked={selected}
                        onChange={() => setPaymentMethod(key)}
                        className="h-4 w-4 accent-[#7A451F]"
                      />
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#7A451F] ring-1 ring-[#E8DFC8]">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#2A170D]">
                          {method.label}
                        </span>
                        <span className="block text-[11px] text-[#5C4333]">
                          {method.blurb}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {/*
                EasyPaisa receiving details. Rendered only when selected -
                showing both sets of instructions at once invites the wrong
                transfer - and kept in the same card language as the payment
                picker so it reads as part of it.
              */}
              {paymentMethod === "easypaisa" ? (
                <div className="mt-2 rounded-xl border border-[#E8DFC8] bg-[#FAF6F0] p-4 text-xs md:text-sm">
                  <div className="space-y-1">
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-[#5C4333]">
                        Account Name
                      </span>
                      <span className="text-right font-bold text-[#2A170D]">
                        {EASYPAISA.accountName}
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-[#5C4333]">
                        Account Number
                      </span>
                      {/* `tabular-nums` keeps the digits evenly spaced for reading aloud. */}
                      <span className="text-right font-bold text-[#7A451F] tabular-nums">
                        {EASYPAISA.accountNumber}
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-[#5C4333]">
                        Bank / Wallet
                      </span>
                      <span className="text-right font-bold text-[#2A170D]">
                        {EASYPAISA.wallet}
                      </span>
                    </p>
                  </div>

                  <p className="mt-3 border-t border-[#E8DFC8] pt-3 text-[11px] leading-relaxed text-[#5C4333] md:text-xs">
                    {EASYPAISA.instructions}
                  </p>
                </div>
              ) : null}
            </fieldset>
          </div>
        </form>

        {/* Right - order summary. */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[#2A170D]">
              Order Summary
            </h2>

            <ul className="mt-5 divide-y divide-[#E8DFC8]/70">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FAF6F0] ring-1 ring-[#E8DFC8]/70">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain p-1"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2A170D]">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-medium text-[#8C5228]">
                      {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[#2A170D]">
                    {formatPkr(item.pricePkr * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Totals. */}
            <div className="mt-4 space-y-2 border-t border-[#E8DFC8] pt-4 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-[#5C4333]">Subtotal</span>
                <span className="font-semibold text-[#2A170D]">
                  {formatPkr(subtotalPkr)}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[#5C4333]">Delivery Charge</span>
                <span className="font-semibold text-[#2A170D]">
                  {formatPkr(DELIVERY_FEE_PKR)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-[#E8DFC8] pt-3">
                <span className="text-base font-bold text-[#2A170D]">
                  Grand Total
                </span>
                <span className="text-xl font-bold text-[#7A451F]">
                  {formatPkr(totalPkr)}
                </span>
              </div>

              <p className="text-[11px] text-[#8C5228]">
                Flat delivery fee per order, all over Pakistan. Estimated
                delivery 5–7 business days.{" "}
                {paymentMethod === "cod"
                  ? "Payable in cash on delivery."
                  : "Transfer to the EasyPaisa account, then send the receipt on WhatsApp."}
              </p>
            </div>

            {/* WhatsApp trigger. */}
            <button
              type="submit"
              form="checkout-form"
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-[#0B2E1A] transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Confirm Order on WhatsApp
              <span aria-hidden>→</span>
            </button>

            <button
              type="button"
              onClick={clearCart}
              className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-medium text-[#8C5228] transition-colors hover:text-[#B42318] ${FOCUS_RING}`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Clear cart
            </button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-[#5C4333]">
              {paymentMethod === "cod"
                ? "This opens WhatsApp with your order pre-filled. Nothing is charged now - you confirm the order in the chat."
                : "This opens WhatsApp with your order pre-filled. Please complete the EasyPaisa transfer first, then attach your receipt screenshot in the chat."}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
