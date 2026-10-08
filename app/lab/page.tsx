import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LabSection } from "@/sections/LabSection";
import { ContactSection } from "@/sections/ContactSection";

export const metadata: Metadata = {
  title: "Laboratoire IA",
  description:
    "Expérimentations et travaux en cours : agent open-source, concepts et prototypes, clairement étiquetés.",
  alternates: { canonical: "/lab/" },
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
            BBA AI a été conçu et développé par BuiltByAnas et fait partie du portfolio.
            Cette page distingue ce projet des pistes en cours, des recherches et des
            concepts encore à l’état d’affiche.
          </p>
        }
      />
      <LabSection showHeading={false} />
      <ContactSection />
    </>
  );
}
