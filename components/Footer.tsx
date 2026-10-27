import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";

import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  DELIVERY_FEE_PKR,
  formatPkr,
  WHATSAPP_NUMBER,
} from "@/lib/catalog";

/**
 * HAFIZ NUTS | site footer.
 *
 * Same deep chocolate band, bronze accents, and gold artwork as before, laid
 * out as a full multi-column footer: brand and socials, an "Explore" column of
 * page links, the policy documents, and direct contact details - then a slim
 * bottom bar with the copyright and the delivery / payment promise.
 *
 * Server component with no client code: every value is static, and phone,
 * email, and the delivery fee come from `lib/catalog.ts`, the same constants
 * the checkout and policy pages read.
 *
 * The mark keeps a cream disc behind it rather than being inverted: roughly a
 * quarter of its pixels are near-black (the script lettering inside the badge),
 * which would drop to about 1.5:1 on this background. The disc preserves the
 * artwork exactly as the header shows it and clears contrast comfortably. The
 * wordmark is fine as-is - only 0.2% of its pixels fall that dark.
 *
 * The two social marks are inline SVG rather than `lucide-react` icons: brand
 * glyphs were dropped from the icon set (this build exports no `Facebook` or
 * `Instagram`), so the paths below reproduce the shapes those icons used, at the
 * same 2px stroke weight, so they still match the icons used elsewhere.
 *
 * ## Anchors are rooted at `/#…`
 *
 * The footer is global (`app/layout.tsx`), so a bare `#bundles` would resolve
 * against whichever route the visitor was on - `/terms#bundles`, which has no
 * target. Rooting them at `/` jumps back to the homepage section from any page.
 *
 * ## Column headings are `<h2>` with explicit styling
 *
 * The base layer in `globals.css` gives every `h2` the display serif and the
 * walnut colour, which would vanish on this background. The utility classes
 * below override both, so the headings keep their semantics for screen-reader
 * navigation while reading as small gold labels.
 */

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/products#honey", label: "Pure Sidr Honey" },
  { href: "/#bundles", label: "Bundle Offers" },
  { href: "/#benefits", label: "Health Benefits" },
  { href: "/#why-us", label: "Why Choose Us" },
  { href: "/#reviews", label: "Testimonials" },
  { href: "/#contact", label: "Contact" },
] as const;

const POLICIES = [
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/product-info", label: "Product Info & Allergens" },
  { href: "/cookies", label: "Cookie Notice" },
] as const;

const SOCIAL = [
  {
    href: "https://www.facebook.com/people/Hafiz-Nuts/61595136471681/",
    label: "HAFIZ NUTS on Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://www.instagram.com/hafiznuts/",
    label: "HAFIZ NUTS on Instagram",
    icon: InstagramIcon,
  },
] as const;

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B27]";

const HEADING =
  "font-sans text-xs font-semibold tracking-[0.2em] text-[#C59B27] uppercase";

const LINK = `text-sm text-gray-300 transition-colors hover:text-white ${FOCUS_RING}`;

/* Round bronze-ringed chip, shared by the social links and contact icons. */
const ICON_CHIP =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#C59B27] ring-1 ring-[#8C5228]/60";

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#2A170D] text-white">
      {/* Gold hairline - echoes the hero badge's bronze ring along the top edge. */}
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-transparent via-[#C59B27]/60 to-transparent"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 pt-14 pb-10 md:px-12 lg:grid-cols-12 lg:gap-8">
        {/*
          Brand. Full width below `lg`; Explore and Policies then pair up side
          by side, so a phone shows two short columns instead of one long one.
        */}
        <div className="col-span-2 lg:col-span-4">
          <Link
            href="/"
            aria-label="HAFIZ NUTS - home"
            className={`inline-flex items-center gap-3 rounded-sm ${FOCUS_RING}`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] ring-2 ring-[#C59B27]/50">
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-auto"
              />
            </span>
            <Image
              src="/typo.png"
              alt="HAFIZ NUTS"
              width={160}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-300">
            Premium dry fruits blended with pure honey - 100% natural, packed
            with care in Rahim Yar Khan and delivered all over Pakistan.
          </p>

          <p className="mt-4 font-script text-2xl text-[#C59B27]">
            Nature&rsquo;s finest, in every bite ♡
          </p>

          <div className="mt-5 flex items-center gap-3">
            {SOCIAL.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${ICON_CHIP} transition-colors hover:bg-[#C59B27] hover:text-[#2A170D] ${FOCUS_RING}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Explore. */}
        <nav aria-labelledby="footer-explore" className="lg:col-span-2">
          <h2 id="footer-explore" className={HEADING}>
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policies. */}
        <nav aria-labelledby="footer-policies" className="lg:col-span-3">
          <h2 id="footer-policies" className={HEADING}>
            Policies
          </h2>
          <ul className="mt-4 space-y-2.5">
            {POLICIES.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact. */}
        <div className="col-span-2 lg:col-span-3">
          <h2 className={HEADING}>Get in Touch</h2>

          <ul className="mt-4 space-y-3.5">
            <li className="flex items-center gap-3">
              <span className={ICON_CHIP}>
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className={LINK}>
                {CONTACT_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className={ICON_CHIP}>
                <MessageCircle className="h-4 w-4" aria-hidden />
              </span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Order on WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className={ICON_CHIP}>
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${LINK} break-all`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className={ICON_CHIP}>
                <MapPin className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm text-gray-300">
                Muslim Bazar, Rahim Yar Khan
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar - copyright, plus the delivery and payment promise. */}
      <div className="border-t border-[#3D2314]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center md:flex-row md:px-12 md:text-left">
          <p className="text-xs text-gray-400">
            © 2026 HAFIZ NUTS. All rights reserved.
          </p>

          {/*
            `w-full` below `md`: in the centred column a flex row sizes to its
            content, so without it the badges never wrap and push the page
            sideways on a phone.
          */}
          <ul className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400 md:w-auto md:justify-end">
            <li className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#C59B27]" aria-hidden />
              Delivery all over Pakistan · {formatPkr(DELIVERY_FEE_PKR)}
            </li>
            <li className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-[#C59B27]" aria-hidden />
              Cash on Delivery
            </li>
            <li className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-[#C59B27]" aria-hidden />
              EasyPaisa
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
