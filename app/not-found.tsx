import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { navigation } from "@/data/navigation";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center py-section">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="shell relative">
        <div className="rule mb-6 max-w-md" />
        <p className="label">Erreur 404</p>

        <h1 className="display mt-7 font-display text-ivory">
          Cette page
          <span className="block italic text-gold-soft">n’existe pas.</span>
        </h1>

        <p className="mt-8 max-w-md text-lead leading-relaxed text-steel">
          Le lien est peut-être ancien, ou l’adresse comporte une erreur. Voici les
          sections qui existent réellement.
        </p>

        <nav className="mt-12" aria-label="Sections du site">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-4 bg-sumi p-6 transition-colors hover:bg-charcoal/40"
                >
                  <span className="font-display text-xl text-ivory transition-colors group-hover:text-gold-soft">
                    {item.label}
                  </span>
                  <span className="font-jp text-sm text-gold/40" aria-hidden="true">
                    {item.kanji}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12">
          <ArrowLink href="/" variant="solid">
            Retour à l’accueil
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
