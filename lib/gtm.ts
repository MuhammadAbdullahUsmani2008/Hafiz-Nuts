/**
 * HAFIZ NUTS - Google Tag Manager config.
 *
 * `NEXT_PUBLIC_GTM_ID` is read once at build time (Next.js inlines
 * `process.env.NEXT_PUBLIC_*` references), so a missing id disables the
 * container instead of breaking the site.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
