import { NextResponse, type NextRequest } from "next/server";

import { PRODUCTS } from "@/lib/catalog";

/**
 * HAFIZ NUTS - request-time guard for product slugs.
 *
 * ## Why this file is `proxy.ts` and not `middleware.ts`
 *
 * The brief asked for `middleware.ts`. In Next 16 that convention is
 * deprecated and renamed to `proxy` - same capability, same position in the
 * request lifecycle, only the filename and export name changed. Writing
 * `middleware.ts` here would produce a deprecation warning and is scheduled
 * for removal, so this is the file Next 16 actually honours.
 *
 * ## What it fixes
 *
 * Unknown product slugs were a **soft 404**: because `cacheComponents`
 * (Partial Prerendering) is on, the static shell went out with a 200 and
 * `notFound()` only reached the visitor inside the streamed payload. Search
 * engines would index `/products/typo` as a real page. `dynamicParams = false`
 * is the usual cure, but Next 16 rejects it outright alongside
 * `cacheComponents`, so the check has to happen before rendering instead.
 *
 * That is what a proxy is for: it runs ahead of the router and can end a
 * request with a genuine 404 status.
 *
 * ## What is *not* handled here
 *
 * `/products` and `/products/premium-honey-nut-mix` are deliberate redirects
 * owned by their own page files (307s). This guard deliberately passes them
 * through untouched so the redirect logic lives in exactly one place.
 *
 * `lib/catalog.ts` is safe to import: it holds no `node:fs` or `window`
 * access, so it evaluates cleanly in the proxy's runtime.
 */

/** Slugs the router serves, plus the ones that must fall through to redirects. */
const VALID_SLUGS = new Set(PRODUCTS.map((product) => product.slug));

/** Kept out of the 404 check so their page-level `redirect()` still runs. */
const RESERVED_SEGMENTS = new Set(["premium-honey-nut-mix"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* `/products` - no slug to validate, let the index page redirect it. */
  const slug = pathname.replace(/^\/products\/?/, "").replace(/\/+$/, "");
  if (!slug) return NextResponse.next();

  /* Nested paths under /products are not product pages. */
  if (slug.includes("/")) return NextResponse.next();

  if (RESERVED_SEGMENTS.has(slug)) return NextResponse.next();

  /*
   * An unknown slug ends here with a real 404, before any prerendered shell
   * can be committed. The rewrite lands on the not-found boundary, so the body
   * is the branded `app/not-found.tsx` rather than Next's stock page, and
   * `x-robots-tag` keeps the miss out of search results even for clients that
   * ignore response bodies.
   */
  if (!VALID_SLUGS.has(slug)) {
    const response = NextResponse.rewrite(new URL("/404", request.url), {
      status: 404,
    });
    response.headers.set("x-robots-tag", "noindex");
    return response;
  }

  return NextResponse.next();
}

/*
 * Scoped to product pages only. Everything else - home, checkout, and the
 * `_next`/`public` assets - skips this entirely, so there is no per-request
 * cost elsewhere and no risk of blocking CSS, JS, or images.
 */
export const config = {
  matcher: "/products/:path*",
};
