"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether the page has scrolled past `threshold` pixels.
 *
 * The scroll handler is passive and coalesced into a requestAnimationFrame, so a
 * fast scroll triggers at most one state write per frame instead of one per
 * event. It also reads the position once on mount: after a reload part-way down
 * a page the browser has already restored the scroll offset, so without that
 * initial read the header would render transparent over scrolled content.
 */
export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
