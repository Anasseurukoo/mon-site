import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LabSection } from "@/sections/LabSection";
import { ContactSection } from "@/sections/ContactSection";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Expérimentations et travaux en cours : agent open-source, concepts et prototypes, clairement étiquetés.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        headingId="lab-heading"
        label="AI Lab — 研究"
        title="Le laboratoire,"
        accent="portes ouvertes."
        image={{
          src: "/assets/backgrounds/custom/lab-night.webp",
          alt: "Bonsaï éclairé sur une terrasse en bois face à un lac de nuit et au mont Fuji",
        }}
        intro={
          <p>
            Building in public suppose d’assumer l’état réel des choses. Ce qui est ici est
            en cours, en recherche, ou encore à l’état d’affiche — et c’est écrit sur chaque
            entrée.
          </p>
        }
      />
      <LabSection showHeading={false} />
      <ContactSection />
    </>
  );
}
