import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Headphones,
  HeartHandshake,
  Leaf,
  MessageCircle,
  PackageCheck,
  Wallet,
} from "lucide-react";

/**
 * HAFIZ NUTS - "Why Choose HAFIZ NUTS?".
 *
 * Server component: the backdrop is a fixed asset in `public/`, so it is simply
 * referenced here. Headings pick up Playfair Display from the `h2`/`h3` rules in
 * `globals.css`; the handwritten note uses the `font-script` (Caveat) family.
 *
 * The backdrop photograph is a wide golden-hour panorama. `object-cover` on a
 * tall section blows it up and crops it to a centre slice, which reads as a warm
 * atmospheric wash rather than a focal image - that is why the overlay can be
 * this strong and still leave the scene recognisable at the edges.
 */

type Feature = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

const FEATURES: readonly Feature[] = [
  {
    icon: Leaf,
    title: "Natural Goodness",
    copy: "Enjoy the delicious combination of honey and nuts in every bite, bringing rich taste and a satisfying snack experience to your day.",
  },
  {
    icon: HeartHandshake,
    title: "Made with Care",
    copy: "We believe good food starts with care. HAFIZ NUTS is dedicated to offering a delightful honey and nut mix that you can enjoy and share.",
  },
  {
    icon: PackageCheck,
    title: "Sizes for Every Need",
    copy: "From a handy 30g tub to a generous 500g pack, choose the size that suits your cravings, routine, or sharing occasions.",
  },
  {
    icon: Wallet,
    title: "Options for Every Budget",
    copy: "Choose from individual packs or value bundles designed to give you more flexibility when ordering your favourite mix.",
  },
  {
    icon: MessageCircle,
    title: "Convenient Ordering",
    copy: "Place your order through our website or WhatsApp, with Cash on Delivery available for a straightforward ordering experience.",
  },
  {
    icon: Headphones,
    title: "Here to Help",
    copy: "Have a question about your order or our products? Contact us and we\u2019ll help you with the information you need.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section
      id="why-us"
      className="relative scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      {/*
       * Backdrop. Two stacked overlays instead of one flat wash: the base keeps
       * the whole photo legible behind the cards, and the gradient darkens the
       * top band (where the white heading sits) and the bottom edge without
       * flattening the middle.
       */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/why-us-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2A170D]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A170D]/35 via-[#2A170D]/10 to-[#2A170D]/45" />
      </div>

      {/*
       * Handwritten flourish, right edge. Narrower at `lg` and wider from `xl`:
       * at exactly 1024px the 14rem version runs into the centred heading, so it
       * tightens to 9.5rem there and only opens back up once there is room.
       */}
      <p className="pointer-events-none absolute top-12 right-4 z-10 hidden w-38 -rotate-6 font-script text-2xl leading-tight text-white/90 md:text-3xl lg:block xl:right-8 xl:w-56">
        Good Food, Brighter Days ♡
      </p>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
            Why Choose HAFIZ NUTS?
          </h2>

          <p className="mt-2 text-base font-medium text-[#F3E5AB] italic md:text-lg">
            Natural Goodness in Every Bite.
          </p>

          <p className="mx-auto mt-3 mb-12 max-w-3xl text-sm leading-relaxed text-gray-100 drop-shadow-sm md:text-base">
            Discover a delicious honey and nut mix, thoughtfully presented in
            convenient sizes with flexible bundle offers and easy ordering.
            Whether you&rsquo;re choosing a small tub for yourself or a larger
            pack to share, HAFIZ NUTS makes it simple to find your favourite
            size.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-[#E8DFC8] bg-[#FAF6F0] p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <Icon
                className="mt-1 h-8 w-8 shrink-0 text-[#7A451F]"
                aria-hidden
              />
              <div>
                <h3 className="text-base font-bold text-[#2A170D] md:text-lg">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-snug text-[#5C4333] md:text-sm">
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
