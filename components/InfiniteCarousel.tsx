"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/**
 * HAFIZ NUTS - endless, swipeable carousel (testimonials, "Why choose us").
 *
 * ## How "endless" works
 *
 * The items are rendered three times in a row - [copy][REAL][copy] - inside one
 * native scroll-snap strip, and the strip rests on the middle set. Swiping or
 * clicking past either end only ever lands on an identical copy; once the
 * scrolling settles, the strip silently jumps by exactly one set-width back to
 * the real set. Nothing visibly changes, so the last item is followed by the
 * first (and the first by the last) forever. No library, no per-frame JS: the
 * browser does all the scrolling, which is also why touch swiping feels native.
 *
 * Copies are `aria-hidden` and `inert`, so screen readers and Tab only ever see
 * each item once.
 *
 * ## Autoplay (optional)
 *
 * Advances one item every `autoplayMs`. It pauses while a mouse hovers, for a
 * few seconds after any touch/scroll/key interaction, while the section is
 * off-screen or the tab is hidden, and never runs for visitors who prefer
 * reduced motion. A visible Pause/Play button covers everyone else.
 *
 * ## Grid mode (optional)
 *
 * With `gridFromMd`, the carousel only exists below `md`; from `md` the same
 * items lay out as that grid and the copies are hidden.
 */

export type CarouselItem = { key: string; node: ReactNode };

type Props = {
  items: readonly CarouselItem[];
  /** Accessible name of the carousel region. */
  label: string;
  /** Card styling + width per breakpoint, applied to every item. */
  itemClassName: string;
  /** Gap etc. for the strip, e.g. `gap-4 md:gap-6`. */
  listClassName?: string;
  /** Previous/next chevrons from `md` up (the strip gets side room for them). */
  arrows?: boolean;
  /** Phone-only "3 / 6 - swipe for more" hint. */
  counter?: boolean;
  /** Auto-advance interval in ms; 0/undefined = off. */
  autoplayMs?: number;
  /** Classes that turn the strip into a plain grid from `md` (hides copies). */
  gridFromMd?: string;
};

const ARROW =
  "absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DFC8] bg-white text-[#7A451F] shadow-sm transition-colors hover:bg-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228] md:flex";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function InfiniteCarousel({
  items,
  label,
  itemClassName,
  listClassName = "gap-4",
  arrows = false,
  counter = false,
  autoplayMs = 0,
  gridFromMd,
}: Props) {
  const n = items.length;
  const endless = n > 1;

  const list = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const hoverRef = useRef(false);
  const lastTouchRef = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  /**
   * Geometry of the strip, or null when it isn't scrolling (single item, or
   * grid mode at `md+` where the strip is a plain grid).
   */
  const measure = useCallback(() => {
    const el = list.current;
    if (!el || !endless || el.scrollWidth <= el.clientWidth + 1) return null;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const nextSet = el.children[n] as HTMLElement | undefined;
    if (!first || !second || !nextSet) return null;
    return {
      el,
      step: second.offsetLeft - first.offsetLeft,
      setWidth: nextSet.offsetLeft - first.offsetLeft,
    };
  }, [endless, n]);

  /** If we've drifted onto a copy, jump (invisibly) to the same spot in the real set. */
  const settle = useCallback(() => {
    const m = measure();
    if (!m) return;
    const { el, step, setWidth } = m;
    const at = el.scrollLeft;

    let target = at;
    if (at < setWidth - 2) target = at + setWidth;
    else if (at >= 2 * setWidth - 2) target = at - setWidth;

    if (target !== at) {
      el.style.scrollSnapType = "none";
      el.scrollLeft = target;
      requestAnimationFrame(() => {
        el.style.scrollSnapType = "";
      });
    }

    const index = Math.round((target - setWidth) / step);
    indexRef.current = ((index % n) + n) % n;
    setActive(indexRef.current);
  }, [measure, n]);

  const onScroll = () => {
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 120);
  };

  /* Rest on the real set at mount, and keep the same item in view on resize. */
  useEffect(() => {
    const place = () => {
      const m = measure();
      if (m) m.el.scrollLeft = m.setWidth + indexRef.current * m.step;
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      clearTimeout(settleTimer.current);
    };
  }, [measure]);

  const move = (direction: 1 | -1) => {
    const m = measure();
    m?.el.scrollBy({
      left: direction * m.step,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const el = list.current;
    if (!autoplayMs || !endless || !el || prefersReducedMotion()) return;

    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    const timer = setInterval(() => {
      if (userPaused || hoverRef.current || !visible || document.hidden) return;
      if (Date.now() - lastTouchRef.current < autoplayMs * 1.5) return;
      const m = measure();
      m?.el.scrollBy({ left: m.step, behavior: "smooth" });
    }, autoplayMs);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [autoplayMs, endless, measure, userPaused]);

  const touched = () => {
    lastTouchRef.current = Date.now();
  };

  const sets = endless ? [0, 1, 2] : [1];

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerDown={touched}
      onWheel={touched}
      onKeyDown={touched}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      {arrows && endless && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous"
            className={`${ARROW} left-0`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next"
            className={`${ARROW} right-0`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      )}

      {/*
        `-my-2 py-2` gives card shadows room (overflow-x also clips vertically).
        `relative` makes the items' offsetLeft measure from this strip.
      */}
      <ul
        ref={list}
        onScroll={onScroll}
        className={`relative -my-2 flex snap-x snap-mandatory overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          arrows ? "md:mx-14" : ""
        } ${listClassName} ${gridFromMd ?? ""}`}
      >
        {sets.map((set) =>
          items.map(({ key, node }) => {
            const real = set === 1;
            return (
              <li
                key={`${set}-${key}`}
                {...(real ? {} : { "aria-hidden": true, inert: true })}
                className={`shrink-0 snap-start ${itemClassName} ${
                  !real && gridFromMd ? "md:hidden" : ""
                }`}
              >
                {node}
              </li>
            );
          }),
        )}
      </ul>

      {(counter || autoplayMs > 0) && endless && (
        <div
          className={`mt-4 flex items-center justify-center gap-3 text-xs ${
            gridFromMd ? "md:hidden" : ""
          } ${counter ? "text-[#8C5228]" : "text-white/90"}`}
        >
          {counter && (
            <p aria-hidden className="md:hidden">
              {active + 1} / {n} &middot; swipe for more
            </p>
          )}
          {autoplayMs > 0 && (
            <button
              type="button"
              onClick={() => setUserPaused((value) => !value)}
              aria-pressed={userPaused}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ring-current/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {userPaused ? (
                <Play className="h-3 w-3" aria-hidden />
              ) : (
                <Pause className="h-3 w-3" aria-hidden />
              )}
              {userPaused ? "Play" : "Pause"} slides
            </button>
          )}
        </div>
      )}
    </div>
  );
}
