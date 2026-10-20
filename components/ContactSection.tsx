"use client";

import Image from "next/image";
import { useState } from "react";
import { Send } from "lucide-react";

import { WHATSAPP_NUMBER } from "@/lib/catalog";

/**
 * HAFIZ NUTS - "Place an Order or Send an Inquiry".
 *
 * Client component: the form owns its field state and hands the finished
 * inquiry to WhatsApp on submit.
 *
 * ## Why the button is now `type="submit"`
 *
 * It used to be `type="button"`, which made the form inert: HTML constraint
 * validation only runs as part of a submission, so the `required` attributes
 * on all five fields could never fire. With a real submit button the browser
 * validates first and only raises `onSubmit` once the input is acceptable -
 * `required` covers empty fields and `type="email"` covers malformed
 * addresses, with no hand-rolled validation. The handler therefore only ever
 * sees usable data.
 *
 * `type="tel"` deliberately stays unvalidated beyond `required`: Pakistani
 * numbers arrive as `0300 1234567`, `+92 300 1234567`, and local
 * punctuated variants, and a pattern strict enough to be meaningful would
 * reject valid ones.
 *
 * ## Why WhatsApp rather than an endpoint
 *
 * The site has no API routes, no server actions, and no mail service, so a
 * `mailto:` or fetch would have nowhere to go. This mirrors the checkout flow
 * exactly: build the message, open `wa.me`, and let the brand reply in the
 * thread they already use.
 *
 * ## Message structure
 *
 * The single-line fields come from `<input>`, which cannot hold newlines
 * (browsers strip them), so a pasted line break cannot splice the layout
 * apart. Only the textarea keeps its newlines, which is intended - it is the
 * one free-form block. The four single-line fields are normalised with
 * `oneLine()` and the message is trimmed, matching the checkout's treatment.
 *
 * The title is separated with a plain ASCII `|`, matching the order message,
 * rather than a typographic dash - the rest of the project is ASCII-only for
 * WhatsApp payloads since emoji and dashes rendered inconsistently across
 * clients.
 *
 * ## The corner graphics
 *
 * Flat-lay JPEGs on near-white grounds (edge tone ~235 against this
 * section's `#F7F3EC` at 243), so they sit on the section without a visible
 * seam and need no mask. Their widths are set in CSS rather than by
 * `max-width`: with `width: auto` an `<img>` has no size at all until it
 * loads, so a lazy, below-the-fold graphic would collapse to 0x0 and pop into
 * place on load. A fixed width with `height: auto` reserves the box from the
 * width/height attributes' aspect ratio instead.
 *
 * Both sit at `z-0` behind the `z-10` content and carry
 * `pointer-events-none`, so they cannot obscure or swallow clicks on the form
 * at any breakpoint. The section's `overflow-hidden` keeps them from causing
 * horizontal scroll.
 */

const FIELD =
  "w-full rounded-md border border-[#E8DFC8] bg-white px-3 py-2 text-xs text-[#2A170D] placeholder:text-[#8C5228]/60 focus:ring-1 focus:ring-[#7A451F] focus:outline-none md:text-sm";

const LABEL = "mb-1 block text-[11px] font-semibold text-[#5C4333]";

const INQUIRY_TYPES = ["Retail Order", "Bulk Offer", "General Inquiry"] as const;

/**
 * Collapses a single-line field onto one tidy line.
 *
 * `<input>` strips CR/LF per the HTML value-sanitization rules, so a line
 * break can never splice the message structure apart - this is only about
 * tidiness. Runs of internal spaces survive a paste (`0300   1234567`), and
 * collapsing them matches how the checkout order message normalises its own
 * fields, so both WhatsApp payloads read the same way.
 *
 * Applied to the four single-line fields only; the textarea keeps its
 * newlines, because a multi-line message is the point of it.
 */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

type FormState = typeof EMPTY_FORM;

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  /*
   * The confirmation stays up after a submit so it is readable; it is not
   * cleared as the customer retypes, because the form beneath it is already
   * reset and empty at that point.
   */
  const [sent, setSent] = useState(false);

  const setField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const msg = [
      "HAFIZ NUTS | New Customer Inquiry",
      "",
      "Sender Information:",
      `• Name: ${oneLine(form.name)}`,
      `• Email: ${oneLine(form.email)}`,
      `• Phone: ${oneLine(form.phone)}`,
      `• Inquiry Type: ${oneLine(form.inquiryType)}`,
      "",
      "Message:",
      form.message.trim(),
    ].join("\n");

    /*
     * Must stay synchronous with the click: deferring to a microtask or a
     * state update lets popup blockers classify it as unsolicited and drop
     * it. `noopener` keeps the opened tab from reaching back into this one.
     */
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setForm(EMPTY_FORM);
    setSent(true);
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-[#E8DFC8]/60 bg-[#F7F3EC] px-4 py-12 md:px-8 md:py-16"
    >
      {/* Decorative corner artwork. */}
      <Image
        src="/lower-left-graphic.jpg"
        alt=""
        width={1919}
        height={560}
        sizes="(min-width: 768px) 240px, 160px"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-auto w-[160px] opacity-90 md:w-[240px]"
        aria-hidden
      />
      <Image
        src="/lower-right-graphic.jpg"
        alt=""
        width={1918}
        height={560}
        sizes="(min-width: 768px) 240px, 160px"
        className="pointer-events-none absolute top-1/2 right-0 z-0 h-auto w-[160px] -translate-y-1/2 opacity-90 md:w-[240px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/*
          Two columns: the pitch and the form. Phone, email, and address used
          to sit in a third column here, but this is the last section before
          the footer, which now carries the same details - so they were
          dropped rather than shown twice in a row.
        */}
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-widest text-[#8C5228] uppercase">
            Get in touch
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#2A170D] md:text-3xl">
            Place an Order or Send an Inquiry
          </h2>

          <p className="mt-2 text-xs text-[#5C4333] md:text-sm">
            We&rsquo;d love to hear from you. Reach out for bulk orders, retail
            inquiries or any questions.
          </p>
        </div>

        {/* Right - the form. */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="inquiry-name">
                Your Name<span aria-hidden>*</span>
              </label>
              <input
                id="inquiry-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your Name*"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className={FIELD}
              />
            </div>

            <div>
              <label className={LABEL} htmlFor="inquiry-type">
                Select Inquiry Type<span aria-hidden>*</span>
              </label>
              {/*
                Starts empty rather than pre-selecting "Retail Order". A
                pre-filled value means the `required` attribute can never
                fail, so it decorates the field instead of validating it -
                and the placeholder makes it obvious the choice is theirs.
              */}
              <select
                id="inquiry-type"
                name="inquiryType"
                required
                value={form.inquiryType}
                onChange={(event) => setField("inquiryType", event.target.value)}
                className={FIELD}
              >
                <option value="" disabled>
                  Select Inquiry Type
                </option>
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL} htmlFor="inquiry-email">
                Email Address<span aria-hidden>*</span>
              </label>
              <input
                id="inquiry-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email Address*"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                className={FIELD}
              />
            </div>

            <div>
              <label className={LABEL} htmlFor="inquiry-phone">
                Phone Number<span aria-hidden>*</span>
              </label>
              <input
                id="inquiry-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Phone Number*"
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
                className={FIELD}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL} htmlFor="inquiry-message">
                Your Message<span aria-hidden>*</span>
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                required
                rows={4}
                placeholder="Your Message*"
                value={form.message}
                onChange={(event) => setField("message", event.target.value)}
                className={`${FIELD} resize-y`}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7A451F] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F] md:text-sm sm:w-auto"
              >
                Send Inquiry
                <Send className="h-4 w-4" aria-hidden />
              </button>

              {/*
                Confirmation for the hand-off. `role="status"` with
                `aria-live="polite"` announces it without interrupting, which
                matters because the button itself gives no other feedback
                once the popup opens.
              */}
              {sent ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 inline-flex w-full items-start gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/12 px-3 py-2 text-xs font-semibold text-[#1B4332]"
                >
                  Inquiry sent to WhatsApp! Press send in your chat.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
