import Image from "next/image";
import { Brain, Dumbbell, Heart, Leaf, ShieldCheck, Sprout, Zap } from "lucide-react";

/**
 * HAFIZ NUTS - "Health Benefits".
 *
 * Server component. The section is nothing but the photograph plus one content
 * block: `health-benifits-bg.jpg` already contains the golden brush-stroke disc,
 * the wooden bowl of nuts and the leaves across its left third, so that artwork
 * is never re-rendered as an element. Doing so stacked a second copy of the same
 * scene on top of the backdrop.
 *
 * The photograph covers the section through `<Image fill>` rather than a CSS
 * `background-image`: the same cover/centre behaviour, but the browser gets a
 * responsive `srcset` and an optimised encode instead of the raw 557 KB JPEG on
 * every viewport. Nothing is layered over it - the artwork and the copy share the
 * image's own tone.
 *
 * The layout is an invisible left spacer (`lg:w-1/3`) against a right-hand
 * `lg:w-2/3` content column, so the copy lands on the clean cream area the
 * photograph leaves open and never overlaps the bowl. Below `lg` the columns
 * stack and only the cream centre of the image is in frame, so the spacer is
 * dropped rather than left as a phantom gap.
 *
 * Headings pick up Playfair Display from the `h2`/`h3` rules in `globals.css`.
 */

const BENEFITS = [
  { icon: Heart, label: "Boosts Heart Health" },
  { icon: Brain, label: "Supports Brain Function" },
  { icon: ShieldCheck, label: "Strengthens Immunity" },
  { icon: Leaf, label: "Aids Digestive Health" },
  { icon: Zap, label: "Provides Natural Energy" },
  { icon: Dumbbell, label: "Rich in Essential Nutrients" },
] as const;

export default function HealthBenefitsSection() {
  return (
    <section
      id="benefits"
      className="relative scroll-mt-24 overflow-hidden border-t border-[#E8DFC8]/70 py-10 md:py-14"
    >
      {/* Full-bleed backdrop - the only image in the section. */}
      <Image
        src="/health-benifits-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="z-0 object-cover object-center"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:px-8 lg:flex-row lg:gap-12">
        {/* Invisible spacer holding the left third clear for the backdrop's artwork. */}
        <div className="hidden shrink-0 lg:block lg:w-1/3" aria-hidden />

        {/* Right - title, subtitle and the six benefits in one row from `lg`. */}
        <div className="w-full lg:w-2/3">
          <div className="text-center">
            <Sprout className="mx-auto h-5 w-5 text-[#7A451F]" aria-hidden />

            <h2 className="mt-2 text-2xl font-bold text-[#2A170D] md:text-3xl">
              Health Benefits
            </h2>

            <p className="mt-1 mb-6 text-xs text-[#5C4333] md:text-sm">
              More than just great taste - a natural way to a healthier,
              stronger you.
            </p>
          </div>

          <ul className="grid grid-cols-2 items-start gap-2 text-center sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="px-2 lg:border-r lg:border-[#E8DFC8]/60 lg:last:border-r-0"
              >
                <Icon
                  className="mx-auto mb-2 h-6 w-6 text-[#7A451F]"
                  aria-hidden
                />
                <span className="text-xs font-semibold text-[#2A170D]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
