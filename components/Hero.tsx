import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Package } from "lucide-react";

/**
 * HAFIZ NUTS - hero.
 *
 * The photograph runs edge to edge behind everything, so this section is the
 * document's first element and the `fixed` header floats over its top edge.
 *
 * Legibility drives the overlay. The left of this particular shot is blurred
 * orchard bokeh over a warm wooden table - mid-tone where the copy sits - so a
 * left-weighted cream gradient sits over it and clears to nothing by the right
 * edge, leaving the product photography untouched.
 *
 * Both floating elements are decorative and only appear from `lg` up. Below that
 * the copy column is wide enough to reach them: at `md` the trust row and badge
 * overlap horizontally by 25px and are separated by only 6px vertically, so the
 * badge starts where there is a clear 128px gap.
 */

const TRUST_HIGHLIGHTS = [
  {
    icon: Leaf,
    title: "Premium Ingredients",
    copy: "Carefully selected nuts and honey",
  },
  {
    icon: Heart,
    title: "Naturally Delicious",
    copy: "A satisfying blend of rich flavors",
  },
  {
    icon: Package,
    title: "Packed with Care",
    copy: "Quality presentation in every pack",
  },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full items-center overflow-hidden">
      {/* Photograph - decorative, so it carries no alt text. */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/*
        Warm cream wash. Stops are tuned so the copy sits on >=75% cream while
        the right third stays fully transparent.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/95 from-0% via-[#FAF6F0]/75 via-40% to-[#FAF6F0]/0 to-90%"
      />

      {/* Floating handwritten note, top right. */}
      <p className="absolute right-12 top-32 hidden w-64 text-right font-script text-3xl leading-tight text-[#2A170D] lg:block xl:w-72 xl:text-4xl">
        Goodness today, a little joy in every bite ♡
      </p>

      {/* Floating circular badge, bottom right. */}
      <div className="absolute bottom-12 right-12 hidden h-32 w-32 items-center justify-center rounded-full border-2 border-[#C59B27] bg-[#2A170D] shadow-lg lg:flex">
        {/* Inset ring makes the badge double-bordered. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1.5 rounded-full border border-[#C59B27]/40"
        />
        <div className="flex flex-col items-center px-3 text-center">
          <Leaf className="h-4 w-4 text-[#C59B27]" aria-hidden />
          <span className="mt-1 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
            Nature&rsquo;s Finest
          </span>
          <span className="text-[0.6rem] uppercase leading-tight tracking-[0.12em] text-[#C59B27]">
            In Every Bite
          </span>
        </div>
      </div>

      {/* Copy. Top padding clears the fixed header at every size. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 md:px-12 md:pb-20 md:pt-32">
        <div className="max-w-xl lg:max-w-2xl">
          {/*
            The rules only appear from `sm` up. At 12px with 0.2em tracking the
            label alone needs 287px, so on a phone the two rules overflow the row
            and force an unbalanced wrap.
          */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="hidden h-px w-8 bg-[#8C5228]/40 sm:block"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C5228]">
              Natural goodness in every bite
            </span>
            <span
              aria-hidden
              className="hidden h-px w-8 bg-[#8C5228]/40 sm:block"
            />
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-[#2A170D] md:text-5xl lg:text-6xl">
            Naturally Delicious,
            <span className="block">Sweetened by Nature.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm text-[#5C4333] md:text-base">
            Discover our Premium Honey &amp; Nut Mix, a delightful blend crafted
            for those who appreciate natural taste and quality.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Link
              href="#products"
              className="flex items-center gap-2 rounded-full bg-[#7A451F] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#why-us"
              className="rounded-full border-2 border-[#7A451F] px-6 py-3 font-medium text-[#7A451F] transition-all hover:bg-[#7A451F]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
            >
              Discover Our Mix
            </Link>
          </div>
        </div>

        {/* Trust highlights - horizontal with hairline dividers, stacked on phones. */}
        <ul className="mt-10 grid max-w-xl gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#8C5228]/20 lg:max-w-2xl">
          {TRUST_HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="flex items-start gap-3 sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-[#8C5228]"
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-[#2A170D]">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-[#5C4333]">
                  {copy}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
