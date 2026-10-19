import type { ReactNode } from "react";

/**
 * HAFIZ NUTS - shared shell for the three policy pages.
 *
 * `/shipping-returns`, `/privacy`, and `/terms` are all the same document
 * shape: a title, a short intro, then labelled sections. Rendering them from
 * one component means a theme or spacing change lands in all three at once,
 * and the pages themselves reduce to their content.
 *
 * ## Why `<dl>` rather than a list
 *
 * Every body is a definition - "Coverage:", "Dispatch Time:", "Pricing:" - so
 * the markup is `<dt>`/`<dd>`. That gives assistive technology the label/value
 * relationship for free instead of leaving it to be inferred from bold text,
 * and the two-column grid falls out of it naturally.
 *
 * The sections are server-rendered with no client component anywhere in the
 * tree: these documents are pure content, so the whole route stays static.
 */

/** One labelled paragraph inside a section. */
type PolicyItem = {
  label: string;
  body: ReactNode;
};

type PolicySection = {
  heading: string;
  items: readonly PolicyItem[];
};

type PolicyPageProps = {
  /** Rendered as the `<h1>`; the route sets its own `<title>` separately. */
  title: string;
  intro: ReactNode;
  sections: readonly PolicySection[];
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

export default function PolicyPage({ title, intro, sections }: PolicyPageProps) {
  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      {/* pt-16 clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-4xl pt-16 md:pt-8">
        <header>
          <h1 className="font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5C4333] md:text-base">
            {intro}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm"
            >
              <h2 className="font-display text-xl font-bold text-[#2A170D]">
                {section.heading}
              </h2>

              <dl className="mt-4 space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-x-5"
                  >
                    <dt className="text-sm font-semibold text-[#2A170D]">
                      {item.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-[#5C4333]">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-[#8C5228]">
          Questions about this page?{" "}
          <a
            href="mailto:info@hafiznuts.com"
            className={`font-medium text-[#7A451F] underline underline-offset-2 transition-colors hover:text-[#2A170D] ${FOCUS_RING}`}
          >
            info@hafiznuts.com
          </a>
        </p>
      </div>
    </main>
  );
}
