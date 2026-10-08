import Image from "next/image";
import { pricingServices } from "@/data/pricing";

export function PricingBrochure() {
  return (
    <aside className="mt-4 overflow-hidden border border-line-gold bg-sumi-deep/80 p-3 sm:p-4" aria-label="Brochure officielle des tarifs BuiltByAnas 2026">
      <a
        href="/assets/pricing/builtbyanas-services-tarifs-2026.png"
        target="_blank"
        rel="noreferrer"
        aria-label="Ouvrir la brochure officielle des tarifs 2026 en taille réelle"
      >
        {/* The source brochure is displayed as supplied by the owner. */}
        <Image
          src="/assets/pricing/builtbyanas-services-tarifs-2026.png"
          alt="Brochure BuiltByAnas Digital Dojo — services et tarifs indicatifs 2026 en MAD"
          width={1055}
          height={1491}
          sizes="(max-width: 640px) 92vw, 520px"
          className="h-auto w-full rounded-sm"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ivory-dim">
          {pricingServices.map((service) => (
            <span key={service.id}>{service.name}: {service.displayPrice}</span>
          ))}
        </div>
        <a
          href="/assets/pricing/builtbyanas-services-tarifs-2026.png"
          download="BuiltByAnas-Services-Tarifs-2026.png"
          className="min-h-11 border border-line-strong px-3 py-2 text-xs text-ivory transition hover:border-gold"
        >
          Télécharger la brochure
        </a>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <a href="/services/" className="min-h-11 inline-flex items-center text-xs text-gold-soft underline underline-offset-4">
          Tous les services et tarifs
        </a>
        <a href="/contact/" className="inline-flex min-h-11 items-center border border-gold bg-gold px-4 py-2 text-xs font-medium text-sumi transition hover:bg-gold-soft">
          Demander un devis
        </a>
      </div>
    </aside>
  );
}
