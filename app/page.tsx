import BundleOffersSection from "@/components/BundleOffersSection";
import ContactSection from "@/components/ContactSection";
import HealthBenefitsSection from "@/components/HealthBenefitsSection";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

/*
 * `id="home"` gives the header's "Home" link a real scroll target - without it
 * the link changed the hash and scrolled nowhere. It sits on `<main>` rather
 * than the hero so the anchor is stable if the hero is ever reordered.
 *
 * The footer is no longer rendered here: it moved into `app/layout.tsx` so it
 * appears on every route.
 */
export default function Home() {
  return (
    <main id="home" className="flex-1">
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
