import { Hero } from "@/sections/Hero";
import { IntroFilm } from "@/components/common/IntroFilm";
import { TechMarquee } from "@/sections/TechMarquee";
import { SelectedWork } from "@/sections/SelectedWork";
import { DojoSection } from "@/sections/DojoSection";
import { JourneySection } from "@/sections/JourneySection";
import { AboutSection } from "@/sections/AboutSection";
import { LabSection } from "@/sections/LabSection";
import { ContactSection } from "@/sections/ContactSection";
import { profile, socials } from "@/data/profile";

/**
 * Person structured data, mirroring the JSON-LD already on the current site
 * but with the corrected GitHub handle.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "IT Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
  sameAs: socials.map((s) => s.href),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <IntroFilm />
      <Hero />
      <TechMarquee />
      <SelectedWork />
      <DojoSection limit={4} />
      <JourneySection />
      <AboutSection />
      <LabSection limit={3} />
      <ContactSection />
    </>
  );
}
