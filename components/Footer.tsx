import Image from "next/image";
import Link from "next/link";

/**
 * HAFIZ NUTS | site footer.
 *
 * Brand assets and the copyright sit in the deep chocolate band, with the
 * section anchors between them.
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
 * Both social links point at the brand's live profiles and open in a new tab.
 *
 * A second, quieter row carries the policy routes (`/shipping-returns`,
 * `/privacy`, `/terms`), separated from the section anchors above so reference
 * documents read as reference documents rather than page navigation.
 *
 * ## Anchors are rooted at `/#…`
 *
 * Like the header, this footer is global (`app/layout.tsx`), so its bare
 * `#products` hash resolved against whichever route the visitor was on. On
 * `/terms` that produced `/terms#products`, which has no target and scrolled
 * nowhere. Rooting them at `/` restores the intended jump back to the homepage
 * section from any page.
 */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#bundles", label: "Bundle Offers" },
  { href: "/#benefits", label: "Health Benefits" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#reviews", label: "Testimonials" },
  { href: "/#contact", label: "Contact" },
] as const;

/**
 * Policy documents.
 *
 * Kept out of `LINKS` deliberately: that array is section anchors on the home
 * route (plus `/`), so mixing three full routes into it would put legal pages
 * alongside "Health Benefits" in one long run of separated links. These get
 * their own row, quieter and smaller, below the main one.
 */
const POLICIES = [
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
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

const SOCIAL_LINK =
  "text-gray-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

/* Dimmer than the section anchors - these are reference documents, not nav. */
const POLICY_LINK =
  "text-gray-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]";

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
    <footer className="border-t border-[#3D2314] bg-[#2A170D] px-4 py-6 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs md:flex-row">
        {/* Brand - the gold artwork carries its own contrast on the dark band. */}
        <Link
          href="/"
          aria-label="HAFIZ NUTS - home"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDFBF7]">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </span>
          <Image
            src="/typo.png"
            alt="HAFIZ NUTS"
            width={128}
            height={32}
            className="h-6 w-auto"
          />
        </Link>

        {/* Section anchors. */}
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {LINKS.map((link, index) => (
            <span key={link.href} className="flex items-center gap-x-3">
              {index > 0 ? (
                <span aria-hidden className="text-[#8C5228]/70">
                  |
                </span>
              ) : null}
              <Link
                href={link.href}
                className="text-gray-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C5228]"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Social + copyright. */}
        <div className="flex flex-col items-center gap-1 md:items-end">
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={SOCIAL_LINK}
              >
                <Icon />
              </a>
            ))}
          </div>

          <p className="text-[11px] text-gray-400">
            © 2026 HAFIZ NUTS. All rights reserved.
          </p>
        </div>
      </div>

      {/* Policy documents - their own quieter row, below the section anchors. */}
      <nav
        aria-label="Policies"
        className="mx-auto mt-5 flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-[#3D2314] pt-4 text-[11px] md:justify-end"
      >
        {POLICIES.map((link, index) => (
          <span key={link.href} className="flex items-center gap-x-4">
            {index > 0 ? (
              <span aria-hidden className="text-[#8C5228]/70">
                |
              </span>
            ) : null}
            <Link href={link.href} className={POLICY_LINK}>
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}
