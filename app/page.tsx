import { Hero } from "@/sections/Hero";
import { IntroFilm } from "@/components/common/IntroFilm";
import { TechMarquee } from "@/sections/TechMarquee";
import { EngineeringPath } from "@/sections/EngineeringPath";
import { SelectedWork } from "@/sections/SelectedWork";
import { DojoSection } from "@/sections/DojoSection";
import { JourneySection } from "@/sections/JourneySection";
import { AboutSection } from "@/sections/AboutSection";
import { LabSection } from "@/sections/LabSection";
import { ContactSection } from "@/sections/ContactSection";
import { profile, socials } from "@/data/profile";
import { serializeJsonLd, siteMeta, siteUrl } from "@/lib/site";

/**
 * Person structured data, mirroring the JSON-LD already on the current site
 * but with the corrected GitHub handle.
 */
const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      jobTitle: "IT Engineer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Casablanca",
        addressCountry: "MA",
      },
      sameAs: socials.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: profile.brand,
      description: siteMeta.description,
      inLanguage: siteMeta.lang,
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(portfolioJsonLd) }}
      />
      <IntroFilm />
      <Hero />
      <TechMarquee />
      <EngineeringPath />
      <SelectedWork />
      <DojoSection limit={4} />
      <JourneySection />
      <AboutSection />
      <LabSection limit={3} />
      <ContactSection />
    </>
  );
}
