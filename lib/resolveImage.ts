import { PUBLIC_IMAGES } from "@/lib/publicImages.generated";

/**
 * HAFIZ NUTS - image resolution.
 *
 * Checks `lib/publicImages.generated.ts` (a list of public/ built by
 * `scripts/generate-public-images.mjs`) rather than the disk. On Cloudflare
 * Workers there is no `public/` at render time, so a filesystem probe found
 * nothing and every product card fell back to the placeholder.
 *
 * Extracted from the product and bundle sections, which each carried their own
 * copy of this helper. Dropping real photography into `public/` is all that
 * is required - the list is regenerated on build, preview and deploy. Without
 * this a card would render a broken image until its asset lands.
 *
 * Server sections resolve the URL and pass it to the client cards as a prop.
 */

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

/** Returns the public URL of the first candidate that exists, or `null`. */
export function resolvePublicImage(candidates: readonly string[]): string | null {
  for (const base of candidates) {
    for (const extension of IMAGE_EXTENSIONS) {
      const candidate = `${base}.${extension}`;
      if (PUBLIC_IMAGES.has(candidate)) {
        return `/${candidate}`;
      }
    }
  }

  return null;
}
