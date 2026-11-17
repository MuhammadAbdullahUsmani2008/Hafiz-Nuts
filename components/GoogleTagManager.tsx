import Script from "next/script";

import { GTM_ID } from "@/lib/gtm";

/**
 * HAFIZ NUTS - Google Tag Manager.
 *
 * Mounted once in the root layout: the script tag as early as possible in
 * `<head>`, and `<GoogleTagManagerNoscript />` right after the opening
 * `<body>` tag, per Google's own placement guidance.
 *
 * Renders nothing when `NEXT_PUBLIC_GTM_ID` is unset - tracking is simply
 * disabled, and the rest of the site is unaffected.
 */
export default function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`
        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          var f = d.getElementsByTagName(s)[0];
          var j = d.createElement(s);
          var dl = l !== "dataLayer" ? "&l=" + l : "";
          j.async = true;
          j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", "${GTM_ID}");
      `}
    </Script>
  );
}

/** Noscript fallback iframe - must be the first element inside `<body>`. */
export function GoogleTagManagerNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
