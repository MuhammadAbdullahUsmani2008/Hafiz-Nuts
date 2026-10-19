import Link from "next/link";

/**
 * HAFIZ NUTS - not-found boundary.
 *
 * Serves two cases: any unmatched URL (`/foo`), and - via the rewrite in
 * `proxy.ts` - an unknown `/products/<slug>`, which reaches here with the 404
 * status and `x-robots-tag: noindex` already set on the response. Before this
 * page existed, both showed Next's default unbranded 404, which broke the
 * earthy theme on a route the brief asks to audit like any other.
 *
 * Server component, static: nothing here needs the client. The header and
 * footer come from `app/layout.tsx`, so this only supplies the body.
 */
export default function NotFound() {
  return (
    <main
      id="home"
      className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF6F0] px-4 pt-28 pb-16 text-center"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-[#8C5228] uppercase">
        Error 404
      </p>

      <h1 className="mt-3 font-display text-3xl font-bold text-[#2A170D] md:text-4xl">
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-sm text-[#5C4333] md:text-base">
        The page you are looking for does not exist or may have been moved.
        Every pack size and bundle is still just a click away.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[#7A451F] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#603516] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
        >
          Back to Home
        </Link>

        <Link
          href="/#products"
          className="rounded-full border-2 border-[#7A451F] px-6 py-3 text-sm font-medium text-[#7A451F] transition-colors hover:bg-[#7A451F]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}
