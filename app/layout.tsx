import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL } from "@/lib/catalog";
import "./globals.css";

/**
 * Google Fonts are self-hosted by `next/font`, so there is no render-blocking
 * request to fonts.googleapis.com. The `variable` names are consumed by
 * `fontFamily` in `tailwind.config.ts`.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/*
 * Handwritten accent, used once in the hero. Caveat is a variable font (400-700).
 *
 * `preload: false` because the only element using it is hidden below `lg`, so a
 * preload would be fetched and discarded on every phone. It still loads on
 * demand, via `display: "swap"`, wherever the note is actually shown.
 */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

/*
 * `metadataBase` lets any route's metadata use relative URLs; the OG and
 * Twitter images below are absolute already, so they ignore it.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hafiz Nuts | Premium Dry Fruits Mixed with Honey",
  description:
    "Discover the finest quality dry fruits blended with pure honey from Hafiz Nuts. 100% natural, healthy, and premium packaging delivered all over Pakistan.",
  keywords: [
    "dry fruits",
    "honey",
    "healthy snacks",
    "Hafiz Nuts",
    "natural nuts",
    "cash on delivery Pakistan",
  ],
  openGraph: {
    title: "Hafiz Nuts | Premium Dry Fruits & Honey",
    description:
      "Shop 100% natural dry fruits mixed with honey. Premium quality delivered across Pakistan.",
    url: SITE_URL,
    siteName: "Hafiz Nuts",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Hafiz Nuts Products",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafiz Nuts | Premium Dry Fruits & Honey",
    description: "Shop 100% natural dry fruits mixed with honey.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${caveat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/*
          The cart context wraps the whole app so the header badge, the
          product/bundle buttons, and the drawer all share one source of
          truth. The footer lives here rather than in the page so it renders
          on every route, current and future.
        */}
        <CartProvider>
          {/* Site-wide header, rendered once here so every route gets it. */}
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
