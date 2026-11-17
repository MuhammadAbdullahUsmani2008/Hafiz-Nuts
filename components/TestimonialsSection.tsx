"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, Star } from "lucide-react";

/**
 * HAFIZ NUTS - "What Our Customers Say".
 *
 * ## A real carousel
 *
 * The reviews sit in one horizontally scrolling, scroll-snapping strip:
 *
 * - phones show ONE review at a time and the visitor swipes to the next
 *   (native touch scrolling + `snap-mandatory`, so it always settles on a card);
 * - `md` shows two and `lg` three at a time;
 * - from `md`, the chevrons are real buttons that move the strip by one card,
 *   and disable themselves at either end.
 *
 * Adding a review is just appending to `REVIEWS` - the strip, the arrows and
 * the phone counter all adapt to however many there are.
 *
 * Avatars: no customer photography exists in `public/`, so each card falls back
 * to the customer's initials on the neutral disc the layout calls for. Drop
 * `avatar-<name>.jpg` files in later and swap the initials for `<Image>` there.
 */

type Review = {
  quote: string;
  name: string;
  city: string;
  /** Initials shown on the avatar disc until real photography lands. */
  initials: string;
  /** Urdu (right-to-left) text: sets `dir`/`lang` on the quote. */
  rtl?: boolean;
};

/*
 * Real customer reviews, quoted exactly as sent - wording, spelling, and
 * emoji untouched. Keep it that way: only add reviews customers actually gave.
 */
const REVIEWS: readonly Review[] = [
  {
    quote:
      "Bhai…mashallah bhot hi zbardast or Allla-Quality ha…jazakAllah hiil khair🙂",
    name: "Wajahat",
    city: "Rahim Yar Khan",
    initials: "W",
  },
  {
    quote:
      "Aoa\ndry fruits box bht hi yummy and healthy thy.. or honey ki quantity b kafi achi thi.. Allah pak ap k kam mn barkat dalen",
    name: "Ayesha",
    city: "Rahim Yar Khan",
    initials: "A",
  },
  {
    quote:
      "Dry fruits with honey ka combo lajawab hai, freshness aur quality 10/10 hai. Healthy, tasty aur energy se bharpoor - highly recommended!",
    name: "Zainab",
    city: "Rahim Yar Khan",
    initials: "Z",
  },
  {
    quote:
      "I ordered six boxes of mixed nuts - one without honey and one with honey, and I absolutely loved both! They are super crunchy, crispy, fresh, and delicious. The honey-coated nuts have such a lovely taste, while the plain ones are equally enjoyable. I really had a great time eating them! Everything was neatly packed, clean, and hygienic, which I really appreciate. Overall, I’m very happy with my order and would definitely recommend them. ❤️",
    name: "Umme Mustafa",
    city: "Rahim Yar Khan",
    initials: "U",
  },
  {
    quote:
      "ڈرائی فروٹ کا معیار واقعی بہترین ہے۔ تمام آئٹمز تازہ، صاف ستھرے اور اچھی کوالٹی کے تھے۔ پیکنگ بھی بہت مناسب اور محفوظ تھی، جس کی وجہ سے پروڈکٹ بہترین حالت میں موصول ہوا۔ مجموعی طور پر معیار، ذائقہ اور سروس سے مکمل اطمینان ہوا۔ ⭐⭐⭐⭐⭐",
    name: "Anam",
    city: "Rahim Yar Khan",
    initials: "A",
    rtl: true,
  },
  {
    quote:
      "ماشاءاللہ، ڈرائی فروٹ واقعی بہت اچھے اور تازہ تھے۔ ذائقہ اتنا اچھا تھا کہ کھا کر دل خوش ہوگیا۔ ❤️ پیکنگ بھی بہت پیاری اور صاف تھی۔ اچھی کوالٹی کی چیز مناسب انداز میں ملے تو دوبارہ آرڈر کرنے کو دل کرتا ہے۔ ان شاء اللہ دوبارہ بھی ضرور آرڈر کروں گی۔ بہت شکریہ! 🌸",
    name: "Anam",
    city: "Rahim Yar Khan",
    initials: "A",
    rtl: true,
  },
];

const ARROW =
  "absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-[#7A451F] shadow-sm transition-colors hover:bg-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white md:flex";

export default function TestimonialsSection() {
  const scroller = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(REVIEWS.length > 1);
  const [active, setActive] = useState(0);

  /** Distance between one card's left edge and the next (card width + gap). */
  const step = useCallback(() => {
    const first = scroller.current?.children[0] as HTMLElement | undefined;
    const second = scroller.current?.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    return second
      ? second.offsetLeft - first.offsetLeft
      : first.getBoundingClientRect().width;
  }, []);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const size = step();
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setActive(size ? Math.round(el.scrollLeft / size) : 0);
  }, [step]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const move = (direction: 1 | -1) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.current?.scrollBy({
      left: direction * step(),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden bg-[#FAF6F0] px-4 py-12 md:px-8 md:py-16"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <Leaf className="mx-auto h-5 w-5 text-[#8C5228]" aria-hidden />

          <h2 className="mt-2 text-2xl font-bold text-[#2A170D] md:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-1 mb-8 text-xs text-[#5C4333] md:text-sm">
            Trusted by families who choose health and quality.
          </p>
        </div>

        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
        >
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label="Previous reviews"
            className={`${ARROW} left-0`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label="Next reviews"
            className={`${ARROW} right-0`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          {/*
            `-my-2 py-2` gives the cards' shadows room, since an overflow-x
            container also clips vertically. The side margin on `md+` keeps the
            cards clear of the arrows.
          */}
          <ul
            ref={scroller}
            onScroll={sync}
            className="-my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 [scrollbar-width:none] md:mx-14 md:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map(({ quote, name, city, initials, rtl }, index) => (
              <li
                key={`${name}-${index}`}
                className="flex w-full shrink-0 snap-start items-start gap-4 rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-bold text-[#5C4333]"
                >
                  {initials}
                </span>

                <div>
                  <div
                    className="mb-2 flex gap-1"
                    role="img"
                    aria-label="Rated 5 out of 5"
                  >
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-amber-500 text-amber-500"
                        aria-hidden
                      />
                    ))}
                  </div>

                  {/* `pre-line` keeps a customer's own line breaks, e.g. after a greeting. */}
                  <blockquote
                    dir={rtl ? "rtl" : undefined}
                    lang={rtl ? "ur" : undefined}
                    className="text-xs leading-relaxed whitespace-pre-line text-[#3D2518] md:text-sm"
                  >
                    &ldquo;{quote}&rdquo;
                  </blockquote>

                  <p className="mt-2 text-xs font-bold text-[#2A170D] md:text-sm">
                    {name}
                  </p>
                  <p className="text-[11px] text-[#8C5228]">{city}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Phone-only position hint, so it's clear there's more to swipe to. */}
        <p
          className="mt-4 text-center text-xs text-[#8C5228] md:hidden"
          aria-hidden
        >
          {Math.min(active + 1, REVIEWS.length)} / {REVIEWS.length} &middot;
          swipe for more
        </p>
      </div>
    </section>
  );
}
