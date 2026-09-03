import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AboutSection } from "@/sections/AboutSection";
import { JourneySection } from "@/sections/JourneySection";
import { ContactSection } from "@/sections/ContactSection";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anasse Anida, ingénieur IT à Casablanca : parcours, développement web, IA et automatisation, cybersécurité et philosophie du Digital Dojo.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        headingId="about-heading"
        label="À propos — Digital Dojo"
        title={profile.aboutTitle.lead}
        accent={profile.aboutTitle.accent}
        image={{
          src: "/assets/backgrounds/custom/about-night.webp",
          alt: "Pavillon japonais illuminé au bord d'un lac, avec le mont Fuji au loin sous un ciel étoilé",
        }}
        intro={<p>{profile.intro}</p>}
      />
      <AboutSection full showHeading={false} />
      <JourneySection />
      <ContactSection />
    </>
  );
}
