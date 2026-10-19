import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
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

export const metadata: Metadata = {
  title: "HAFIZ NUTS | Premium Dry Fruits",
  description:
    "Hand-picked almonds, pistachios, cashews and dates, sourced from single-origin growers and delivered fresh.",
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
