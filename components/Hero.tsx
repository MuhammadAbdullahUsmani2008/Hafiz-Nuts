import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Package } from "lucide-react";

/**
 * HAFIZ NUTS - hero.
 *
 * The photograph runs edge to edge behind everything, so this section is the
 * document's first element and the `fixed` header floats over its top edge.
 *
 * ## Two photographs, one per orientation
 *
 * The landscape `hero-bg.jpg` (1586x672) is cropped to a sliver on a phone,
 * so below `md` the portrait `mobile-hero.jpg` (768x1376) is shown instead.
 * Both go through `getImageProps` into a single `<picture>` - the art
 * direction pattern from the Next docs - so each device downloads only the
 * image it displays. Two `<Image>` components toggled with `hidden` would
 * fetch both everywhere.
 *
 * The `<img>` is eager with `fetchPriority="high"`: it is the LCP element.
 * `preload` is not used because it would insert one `<link>` for one
 * source, preloading the wrong photo on half the devices.
 *
 * ## Legibility drives the overlay
 *
 * Desktop: the left of the landscape shot is blurred orchard bokeh over a warm
 * wooden table - mid-tone where the copy sits - so a left-weighted cream
 * gradient sits over it and clears to nothing by the right edge, leaving the
 * product photography untouched.
 *
 * Mobile: the portrait photo covers the whole hero, edge to edge, with no wash
 * over it - the copy sits directly on the bright orchard in its upper part.
 * The one element that needs help is the trust row, which lands on the dark
 * wooden table at the bottom of the shot; it gets its own frosted cream card
 * rather than shading the photograph.
 *
 * ## Exactly one screen on phones
 *
 * The hero is the landing screen, so on a phone it must end at the bottom of
 * the first viewport. Below `md` the section is a fixed `h-svh` flex column -
 * copy at the top, trust card pushed to the bottom with `mt-auto` - and the
 * photo fills it with `object-cover`. `svh` (small viewport height) is the
 * height with the browser's toolbars showing, i.e. what is visible on load.
 * The heading is a size smaller below `md` (two lines instead of three) and
 * the trust descriptions only appear from `md`, so the copy stays within the
 * orchard band above the jars.
 *
 * ## One `<picture>`, both layouts
 *
 * The `<img>` is `absolute inset-0 -z-10` against the section at every size;
 * `isolate` on the section keeps the negative z-index inside the hero, so the
 * photo sits above the section's own background but beneath the desktop wash
 * and the copy.
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

/*
 * Cream halo around the label, heading, and paragraph on phones, where they
 * sit straight on the photo with no wash - it lifts the letters off busy bokeh
 * and leaves without shading the photograph. Not applied to the buttons, whose
 * own fills already give them contrast (and white text with a cream halo just
 * looks blurred). Two stacked shadows: a tight one for crisp edges, a wide one to
 * soften what is behind each line. Removed from `md` up.
 */
const GLOW =
  "[text-shadow:0_0_2px_rgba(250,246,240,0.95),0_0_14px_rgba(250,246,240,0.9)] md:[text-shadow:none]";

/* Breakpoint where the landscape photo takes over - Tailwind's `md`. */
const DESKTOP_MEDIA = "(min-width: 768px)";

export default function Hero() {
  /* Decorative photographs, so no alt text. */
  const common = { alt: "", sizes: "100vw" };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: "/hero-bg.jpg", width: 1586, height: 672 });

  const { props: mobileImage } = getImageProps({
    ...common,
    src: "/mobile-hero.jpg",
    width: 768,
    height: 1376,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section className="relative isolate flex h-svh w-full flex-col overflow-hidden bg-[#FAF6F0] md:h-auto md:min-h-svh md:flex-row md:items-center">
      {/*
        Desktop wash. Stops are tuned so the copy sits on >=75% cream while
        the right third stays fully transparent.
      */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-gradient-to-r from-[#FAF6F0]/95 from-0% via-[#FAF6F0]/75 via-40% to-[#FAF6F0]/0 to-90% md:block"
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
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-24 md:block md:flex-none md:px-12 md:pb-20 md:pt-32">
        <div className="relative z-10 max-w-xl lg:max-w-2xl">
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
            <span className={`text-xs font-bold uppercase tracking-[0.2em] text-[#5C2E12] md:font-semibold md:text-[#8C5228] ${GLOW}`}>
              Natural goodness in every bite
            </span>
            <span
              aria-hidden
              className="hidden h-px w-8 bg-[#8C5228]/40 sm:block"
            />
          </div>

          <h1 className={`mt-4 text-[2rem] font-bold leading-tight text-[#2A170D] md:mt-5 md:text-5xl lg:text-6xl ${GLOW}`}>
            Naturally Delicious,
            <span className="block">Sweetened by Nature.</span>
          </h1>

          <p className={`mt-3 max-w-lg text-sm font-medium text-[#3D2518] md:mt-4 md:text-base md:font-normal md:text-[#5C4333] ${GLOW}`}>
            Discover our Premium Honey &amp; Nut Mix, a delightful blend crafted
            for those who appreciate natural taste and quality.
          </p>

          {/*
            `inline-grid` sizes to the wider button and its `1fr` tracks split
            that width evenly, so both buttons always match. Stacked on phones -
            at 390px the column is ~342px and "Explore Our Products ->" alone
            needs ~205px, so two cannot share a row - and side by side from `sm`.
            The filled button carries a same-colour 2px border so its height
            matches the outlined one exactly.
          */}
          <div className="mt-5 inline-grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-8">
            <Link
              href="#products"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[#7A451F] bg-[#7A451F] px-6 py-3 font-medium text-white shadow-md transition-all hover:border-[#603516] hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#why-us"
              className="flex items-center justify-center rounded-full border-2 border-[#7A451F] bg-[#FAF6F0]/90 px-6 py-3 font-medium text-[#7A451F] backdrop-blur-sm transition-all hover:bg-[#F1E6D6] md:bg-transparent md:backdrop-blur-none md:hover:bg-[#7A451F]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
            >
              Discover Our Mix
            </Link>
          </div>
        </div>

        {/* The photograph - full-cover background at every size. */}
        <picture>
          <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} sizes="100vw" />
          <img
            {...mobileImage}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
        </picture>

        {/*
          Trust highlights. Phones: a frosted cream card pinned to the bottom
          (`mt-auto`), three compact centred columns of icon over title - the
          card is what keeps them legible over the dark wooden table. From
          `md`: no card; icon beside title and description, with hairline
          dividers between the columns.
        */}
        <ul className="relative z-10 mt-auto grid max-w-xl grid-cols-3 divide-x divide-[#8C5228]/20 rounded-2xl bg-[#FAF6F0]/85 py-3 shadow-sm backdrop-blur-sm md:mt-10 md:rounded-none md:bg-transparent md:py-0 md:shadow-none md:backdrop-blur-none lg:max-w-2xl">
          {TRUST_HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-1 px-1 text-center md:flex-row md:items-start md:gap-3 md:px-4 md:text-left md:first:pl-0 md:last:pr-0"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-[#8C5228] md:mt-0.5"
                aria-hidden
              />
              <div>
                <p className="text-xs leading-tight font-semibold text-[#2A170D] md:text-sm">
                  {title}
                </p>
                <p className="mt-0.5 hidden text-xs leading-snug text-[#5C4333] md:block">
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
