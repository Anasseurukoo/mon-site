import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DojoSection } from "@/sections/DojoSection";
import { ContactSection } from "@/sections/ContactSection";

export const metadata: Metadata = {
  title: "Digital Dojo",
  description:
    "Compétences et systèmes : IT, web engineering, automatisation, cybersécurité et fondations bas niveau.",
  alternates: { canonical: "/dojo" },
};

export default function DojoPage() {
  return (
    <>
      <PageHeader
        headingId="dojo-heading"
        label="Digital Dojo — 道場"
        title="La pratique"
        accent="avant la théorie."
        image={{
          src: "/assets/backgrounds/custom/dojo-night.webp",
          alt: "Torii rouge dans un lac de nuit, face au mont Fuji sous la voie lactée",
        }}
        intro={
          <p>
            Un dojo n’est pas une vitrine, c’est un lieu de répétition. Chaque technologie
            listée ici est accompagnée de l’endroit où elle a réellement servi — pas d’un
            pourcentage auto-attribué.
          </p>
        }
      />
      <DojoSection label="Index — Capabilities" showHeading={false} />
      <ContactSection />
    </>
  );
}
