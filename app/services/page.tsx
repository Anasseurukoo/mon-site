import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { pricingDisclaimer, pricingServices } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Services & tarifs 2026",
  description: "Services BuiltByAnas et tarifs indicatifs 2026 en MAD : sites web, e-commerce, applications et expériences interactives.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services — Digital Dojo"
        title="Des solutions digitales"
        accent="conçues pour vos usages."
        image={{ src: "/assets/backgrounds/custom/about-night.webp", alt: "Un pavillon japonais illuminé au bord d’un lac" }}
        intro={<p>Sites web, applications et expériences interactives sur mesure. Les tarifs ci-dessous sont indicatifs et servent de point de départ à la discussion.</p>}
      />
      <section className="shell pb-section" aria-labelledby="pricing-heading">
        <div className="mb-10 border border-line-gold bg-charcoal/45 p-6 sm:p-8">
          <p className="label text-gold">Tarifs indicatifs 2026</p>
          <h2 id="pricing-heading" className="mt-3 font-display text-3xl text-ivory sm:text-4xl">À partir de 15 000 MAD</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ivory-dim">{pricingDisclaimer.fr}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {pricingServices.map((service, index) => (
            <li key={service.id} className="flex min-h-48 gap-5 border border-line bg-sumi/70 p-6 sm:p-7">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center border border-line-gold bg-petrol font-display text-xl text-gold">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl text-ivory">{service.name}</h3>
                <p className="mt-2 font-mono text-xl text-gold-soft">{service.price === null ? service.displayPrice : `À partir de ${service.displayPrice}`}</p>
                <p className="mt-3 text-sm leading-relaxed text-steel">{service.description}</p>
                <Link href="/contact/" className="mt-4 inline-flex min-h-11 items-center text-sm text-ivory underline decoration-gold underline-offset-4 hover:text-gold-soft">Demander un devis</Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid items-center gap-8 border-t border-line pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)]">
          <div>
            <h2 className="font-display text-3xl text-ivory">Le bon périmètre, avant le bon prix.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ivory-dim">Chaque projet commence par une compréhension du besoin, des utilisateurs et des contraintes. Le devis final précise le périmètre, les étapes et les intégrations prévues.</p>
            <Link href="/contact/" className="mt-6 inline-flex min-h-12 items-center border border-gold bg-gold px-5 py-3 text-sm font-medium text-sumi transition hover:bg-gold-soft">Demander un devis</Link>
          </div>
          <a href="/assets/pricing/builtbyanas-services-tarifs-2026.png" target="_blank" rel="noreferrer" aria-label="Ouvrir la brochure originale BuiltByAnas Services et Tarifs 2026 en taille réelle">
            <Image src="/assets/pricing/builtbyanas-services-tarifs-2026.png" width={1055} height={1491} sizes="(max-width: 1024px) 80vw, 24rem" alt="Brochure BuiltByAnas Digital Dojo — Services & Tarifs 2026, prix indicatifs en MAD" className="h-auto w-full border border-line-gold shadow-xl" />
          </a>
        </div>
      </section>
    </>
  );
}
