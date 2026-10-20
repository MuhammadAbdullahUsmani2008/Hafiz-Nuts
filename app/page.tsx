import type { Metadata } from "next";

import BundleOffersSection from "@/components/BundleOffersSection";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/ContactSection";
import HealthBenefitsSection from "@/components/HealthBenefitsSection";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { SITE_URL } from "@/lib/catalog";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/*
 * `id="home"` gives the header's "Home" link a real scroll target - without it
 * the link changed the hash and scrolled nowhere. It sits on `<main>` rather
 * than the hero so the anchor is stable if the hero is ever reordered.
 *
 * The footer is no longer rendered here: it moved into `app/layout.tsx` so it
 * appears on every route.
 */
/*
 * Only the canonical is set here: the title, description, and share card are
 * the root layout's defaults, which are written for this page.
 */
export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return (
    <main id="home" className="flex-1">
      {/* Business identity for search engines - name, logo, contact, socials. */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <Hero />

      <ProductsSection />

      <BundleOffersSection />

      <HealthBenefitsSection />

      <WhyChooseUsSection />

      <TestimonialsSection />

      <ContactSection />
    </main>
  );
}
