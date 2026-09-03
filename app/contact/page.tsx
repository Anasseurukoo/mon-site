import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter Anasse Anida — opportunités IT, collaborations web et projets techniques. Casablanca / Remote.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        headingId="contact-heading"
        label="Contact — 縁"
        title="Un problème intéressant"
        accent="à résoudre ensemble ?"
        image={{
          src: "/assets/backgrounds/custom/contact-night.webp",
          alt: "Pétales de sakura flottant sur l'eau devant une maison japonaise illuminée, mont Fuji au loin",
        }}
        intro={
          <p>
            Disponible pour opportunités IT, collaborations web et projets techniques. Le
            plus direct reste l’e-mail.
          </p>
        }
      />
      <ContactSection showHeading={false} />
    </>
  );
}
