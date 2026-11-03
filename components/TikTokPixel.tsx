"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { TIKTOK_PIXEL_ID, trackTikTokPageView } from "@/lib/tiktokPixel";

/**
 * HAFIZ NUTS - TikTok Pixel.
 *
 * Mounted once in the root layout, inside the body, so it loads on every
 * route without ever being re-inserted by a client-side navigation (the root
 * layout does not remount between routes).
 *
 * Renders nothing when `NEXT_PUBLIC_TIKTOK_PIXEL_ID` is unset - tracking is
 * simply disabled, and the rest of the site is unaffected.
 *
 * The base snippet below calls `ttq.page()` itself once it loads, which is
 * the initial PageView. `hasMounted` skips that same event firing a second
 * time from this component's own effect, so only *subsequent* client-side
 * navigations call `trackTikTokPageView()` here.
 */
export default function TikTokPixel() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!TIKTOK_PIXEL_ID) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    trackTikTokPageView();
  }, [pathname]);

  if (!TIKTOK_PIXEL_ID) return null;

  return (
    <Script id="tiktok-pixel-base" strategy="afterInteractive">
      {`
        (function (w, d, t) {
          w.TiktokAnalyticsObject = t;
          var ttq = w[t] = w[t] || [];
          ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
          ttq.setAndDefer = function (t, e) {
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          };
          for (var i = 0; i < ttq.methods.length; i++) {
            ttq.setAndDefer(ttq, ttq.methods[i]);
          }
          ttq.instance = function (t) {
            var e = ttq._i[t] || [];
            for (var n = 0; n < ttq.methods.length; n++) {
              ttq.setAndDefer(e, ttq.methods[n]);
            }
            return e;
          };
          ttq.load = function (e, n) {
            var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
            var o = n && n.partner;
            ttq._i = ttq._i || {};
            ttq._i[e] = [];
            ttq._i[e]._u = r;
            ttq._t = ttq._t || {};
            ttq._t[e] = +new Date();
            ttq._o = ttq._o || {};
            ttq._o[e] = n || {};
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = r + "?sdkid=" + e + "&lib=" + t;
            var f = document.getElementsByTagName("script")[0];
            f.parentNode.insertBefore(s, f);
          };

          try {
            ttq.load("${TIKTOK_PIXEL_ID}");
            ttq.page();
          } catch (err) {
            /* Tracking must never break the site. */
          }
        })(window, document, "ttq");
      `}
    </Script>
  );
}
