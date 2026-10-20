import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/seo";

/**
 * HAFIZ NUTS - `/manifest.webmanifest`.
 *
 * Lets "Add to Home Screen" use the brand name, icon, and colours instead of
 * the page title and a screenshot. The icons are the `app/icon.png` (512px)
 * and `app/apple-icon.png` (180px) file conventions, served at these paths.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hafiz Nuts | Premium Dry Fruits Mixed with Honey",
    short_name: SITE_NAME,
    description:
      "100% natural dry fruits mixed with pure honey, delivered all over Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6F0",
    theme_color: "#7A451F",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
