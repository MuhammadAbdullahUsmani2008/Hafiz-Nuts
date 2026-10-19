import { existsSync } from "node:fs";
import path from "node:path";

/**
 * HAFIZ NUTS - build-time image resolution (server only).
 *
 * Extracted from the product and bundle sections, which each carried their own
 * copy of this helper. It reads `public/` from disk while the page is
 * prerendered, so dropping real photography in is all that is required - no
 * code change, and no runtime cost. Without it a card would render a broken
 * image until its asset lands.
 *
 * Never import this from a `"use client"` module: `node:fs` has no browser
 * equivalent. Server sections resolve the URL and pass it to the client cards
 * as a prop.
 */

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

/** Returns the public URL of the first candidate that exists, or `null`. */
export function resolvePublicImage(candidates: readonly string[]): string | null {
  for (const base of candidates) {
    for (const extension of IMAGE_EXTENSIONS) {
      const candidate = `${base}.${extension}`;
      if (existsSync(path.join(process.cwd(), "public", candidate))) {
        return `/${candidate}`;
      }
    }
  }

  return null;
}
