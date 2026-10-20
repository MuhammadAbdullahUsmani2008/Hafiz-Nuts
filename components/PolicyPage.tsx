import type { ReactNode } from "react";

import { CONTACT_EMAIL, CONTACT_PHONE, POLICY_DATE } from "@/lib/catalog";

/**
 * HAFIZ NUTS - shared shell for the policy pages.
 *
 * `/terms`, `/privacy`, `/shipping-returns`, `/product-info`, and `/cookies`
 * are all the same document shape: a title, the effective / last-updated
 * dates, then numbered sections of prose and bullet lists. Rendering them
 * from one component means a theme or spacing change lands everywhere at
 * once, and the pages themselves reduce to their content.
 *
 * ## Parts
 *
 * A page is one or more `parts`. Most pages have a single untitled part, whose
 * sections become the `<h2>`s. `/shipping-returns` carries two separate
 * documents (Shipping & Delivery, and Returns, Refunds & Replacements), each
 * with its own section numbering, so each part gets an `<h2>` title and its
 * sections drop to `<h3>` - keeping the heading outline valid.
 *
 * ## Section bodies
 *
 * Bodies are plain `<p>` / `<ul>` / `<li>` markup. The wrapper styles those
 * descendants (spacing, bullets), so the page files stay free of class
 * names and read like the documents they are.
 *
 * Server-rendered with no client component anywhere in the tree: these
 * documents are pure content, so every route stays static.
 */

export type PolicySection = {
  heading: string;
  body: ReactNode;
};

export type PolicyPart = {
  /** Shown only when a page holds more than one document. */
  title?: string;
  /** Anchor for linking to this part, e.g. `/shipping-returns#returns`. */
  id?: string;
  sections: readonly PolicySection[];
};

type PolicyPageProps = {
  /** Rendered as the `<h1>`; the route sets its own `<title>` separately. */
  title: string;
  intro?: ReactNode;
  parts: readonly PolicyPart[];
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

/* Typography for the plain markup inside a section body. */
const BODY =
  "mt-3 space-y-3 text-sm leading-relaxed text-[#5C4333] [&_a]:font-medium [&_a]:text-[#7A451F] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#2A170D] [&_strong]:font-semibold [&_strong]:text-[#2A170D] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:marker:text-[#8C5228]";

export default function PolicyPage({ title, intro, parts }: PolicyPageProps) {
  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      {/* pt-16 clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-4xl pt-16 md:pt-8">
        <header>
          <h1 className="font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
            {title}
          </h1>

          <p className="mt-3 text-xs font-medium text-[#8C5228]">
            Effective date: {POLICY_DATE} · Last updated: {POLICY_DATE}
          </p>

          {intro ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5C4333] md:text-base">
              {intro}
            </p>
          ) : null}
        </header>

        <div className="mt-8 space-y-10">
          {parts.map((part, partIndex) => {
            const SectionHeading = part.title ? "h3" : "h2";

            return (
              <section
                key={part.title ?? partIndex}
                id={part.id}
                className="scroll-mt-24"
              >
                {part.title ? (
                  <h2 className="mb-4 font-display text-2xl font-bold text-[#2A170D]">
                    {part.title}
                  </h2>
                ) : null}

                <div className="space-y-4">
                  {part.sections.map((section, index) => (
                    <div
                      key={section.heading}
                      className="rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm"
                    >
                      <SectionHeading className="font-display text-lg font-bold text-[#2A170D]">
                        {index + 1}. {section.heading}
                      </SectionHeading>
                      <div className={BODY}>{section.body}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-[#8C5228]">
          Questions about this page? Call or WhatsApp{" "}
          <a
            href={`tel:${CONTACT_PHONE}`}
            className={`font-medium text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
          >
            {CONTACT_PHONE}
          </a>{" "}
          or email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`font-medium text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
