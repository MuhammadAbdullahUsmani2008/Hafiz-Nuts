/**
 * HAFIZ NUTS - TikTok Pixel client helpers.
 *
 * The pixel is entirely optional: `NEXT_PUBLIC_TIKTOK_PIXEL_ID` is read once
 * at build time (Next.js inlines `process.env.NEXT_PUBLIC_*` references), and
 * every helper below is a no-op when it is unset - so a missing pixel ID
 * disables tracking instead of breaking the site.
 *
 * Every call is wrapped in try/catch: a blocked script, an ad blocker, or a
 * malformed payload must never throw into the component that triggered it
 * (an add-to-cart click, a checkout submit, …).
 */

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

type Ttq = {
  track: (event: string, data?: Record<string, unknown>) => void;
  page: () => void;
};

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

/** A single line item in a TikTok `contents` array. */
export type TikTokContent = {
  content_id: string;
  content_name?: string;
  quantity?: number;
  price?: number;
};

function withTtq(run: (ttq: Ttq) => void): void {
  if (!TIKTOK_PIXEL_ID || typeof window === "undefined") return;

  try {
    const ttq = window.ttq;
    if (!ttq) return;
    run(ttq);
  } catch {
    /* Tracking must never break the site. */
  }
}

/** Fires a TikTok page-view event. The base snippet fires the first one itself. */
export function trackTikTokPageView(): void {
  withTtq((ttq) => ttq.page());
}

/** Fires a named TikTok pixel event with an optional data payload. */
export function trackTikTokEvent(
  event: string,
  data?: Record<string, unknown>,
): void {
  withTtq((ttq) => ttq.track(event, data));
}
