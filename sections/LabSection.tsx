import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { labEntries } from "@/data/lab";
import { cn } from "@/lib/utils";

interface LabSectionProps {
  limit?: number;
  /**
   * False on the /lab route, where PageHeader already rendered this exact
   * title and intro. True (default) on the homepage.
   */
  showHeading?: boolean;
}

/**
 * AI Lab.
 *
 * The rule this section enforces: nothing here is presented as shipped. Every
 * card carries its status and an explicit note about what does and does not
 * exist. The concept posters are shown as posters — reduced in contrast and
 * captioned as design work — rather than dressed up as product screenshots.
 */
export function LabSection({ limit, showHeading = true }: LabSectionProps) {
  const entries = limit ? labEntries.slice(0, limit) : labEntries;

  return (
    <section
      id="lab"
      className={cn("relative", showHeading ? "py-section" : "pb-section pt-8 sm:pt-10")}
      aria-labelledby="lab-heading"
    >
      <div className="shell">
        {showHeading && (
          <SectionHeading
            id="lab-heading"
            label="06 — AI Lab"
            title="Le laboratoire,"
            accent="portes ouvertes."
            intro="Un espace pour le travail non terminé. Rien ici n’est présenté comme livré : chaque entrée indique son état réel et ce qui existe — ou pas — publiquement."
            className="mb-16 sm:mb-20"
          />
        )}

        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className={cn(
                "bg-sumi",
                // First entry spans the full width — it is the real objective,
                // the rest are concepts.
                i === 0 && "md:col-span-2",
              )}
            >
              <Reveal
                delay={i * 0.05}
                className={cn(
                  "group flex h-full flex-col gap-6 p-7 transition-colors duration-500 hover:bg-charcoal/30 sm:p-9",
                  i === 0 && "md:flex-row md:items-center md:gap-12",
                )}
              >
                {entry.image && (
                  <div
                    className={cn(
                      "relative w-full shrink-0 overflow-hidden border border-line",
                      i === 0 ? "md:w-2/5" : "",
                    )}
                  >
                    <Image
                      src={entry.image.small ?? entry.image.src}
                      alt={entry.image.alt}
                      width={entry.image.width}
                      height={entry.image.height}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      quality={92}
                      className="h-full w-full object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-95"
                    />
                    <span className="absolute bottom-2 left-2 bg-sumi/85 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-widest text-steel backdrop-blur-sm">
                      Affiche de concept
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <StatusBadge status={entry.status} />
                    {entry.verification === "placeholder" && (
                      <span className="label text-steel-dim">Non publié</span>
                    )}
                  </div>

                  <h3 className="font-display text-heading leading-tight text-ivory">
                    {entry.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-steel">{entry.summary}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {entry.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-steel-dim"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {entry.href && (
                    <div className="mt-6">
                      <ArrowLink href={entry.href} external>
                        En savoir plus
                      </ArrowLink>
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {limit && limit < labEntries.length && (
          <Reveal className="mt-10">
            <ArrowLink href="/lab" variant="outline">
              Voir le laboratoire
            </ArrowLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
