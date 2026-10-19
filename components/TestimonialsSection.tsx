import { ChevronLeft, ChevronRight, Leaf, Star } from "lucide-react";

/**
 * HAFIZ NUTS - "What Our Customers Say".
 *
 * ## The arrows are decoration, not controls
 *
 * The three reviews are static and the grid shows all of them at once from
 * `md`, so there is no second page for the reference layout's chevrons to
 * move between. They used to be `<button>`s with accessible names and no
 * behaviour, which promised "Previous reviews" to a screen-reader or keyboard
 * user and then did nothing when activated. They are now decorative spans
 * carrying the exact same chrome - size, ring, shadow, hover tint - so the
 * layout is unchanged while the false affordance is gone. If a second page of
 * reviews ever lands, turn them back into buttons and wire real paging.
 * They only show from `lg`, where the grid reserves side padding for them.
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
};

const REVIEWS: readonly Review[] = [
  {
    quote:
      "Amazing quality and taste! The honey & nut mix is so fresh and delicious. Truly premium and worth it.",
    name: "Priya Sharma",
    city: "Lahore",
    initials: "PS",
  },
  {
    quote:
      "HAFIZ NUTS has become our family's favorite snack. The quality is consistent and simply the best.",
    name: "Rahul Mehta",
    city: "Karachi",
    initials: "RM",
  },
  {
    quote:
      "Fresh, natural, and delicious! Highly recommended to everyone looking for authentic quality.",
    name: "Sneha Kapoor",
    city: "Islamabad",
    initials: "SK",
  },
];

const ARROW =
  "absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-[#7A451F] shadow-sm transition-colors hover:bg-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228] lg:flex";

export default function TestimonialsSection() {
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

        <div className="relative">
          <span aria-hidden className={`${ARROW} left-0`}>
            <ChevronLeft className="h-5 w-5" />
          </span>

          <span aria-hidden className={`${ARROW} right-0`}>
            <ChevronRight className="h-5 w-5" />
          </span>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:px-16">
            {REVIEWS.map(({ quote, name, city, initials }) => (
              <li
                key={name}
                className="flex items-start gap-4 rounded-2xl border border-[#E8DFC8]/70 bg-white p-6 shadow-sm"
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

                  <blockquote className="text-xs leading-relaxed text-[#3D2518] md:text-sm">
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
      </div>
    </section>
  );
}
