import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

interface DojoSectionProps {
  /** The home page shows a condensed set; /dojo shows everything. */
  limit?: number;
  label?: string;
  /**
   * False on the /dojo route, where PageHeader already rendered this exact
   * title and intro — showing SectionHeading again duplicates the opener.
   * True (default) on the homepage, where this is the section's only heading.
   */
  showHeading?: boolean;
}

/**
 * The Digital Dojo.
 *
 * Deliberately an editorial index rather than a grid of cards: rows separated
 * by hairlines, each opening with its index and kanji. Every technology is
 * paired with where it was actually used — no proficiency bars, because a
 * self-assigned percentage is not evidence of anything.
 */
export function DojoSection({
  limit,
  label = "03 — Digital Dojo",
  showHeading = true,
}: DojoSectionProps) {
  const groups = limit ? skillGroups.slice(0, limit) : skillGroups;

  return (
    <section
      id="dojo"
      className={cn("relative", showHeading ? "py-section" : "pb-section pt-8 sm:pt-10")}
      aria-labelledby="dojo-heading"
    >
      <div className="shell">
        {showHeading && (
          <SectionHeading
            id="dojo-heading"
            label={label}
            title="Une vision système."
            accent="Des outils concrets."
            intro="Mon avantage n’est pas une liste de technologies. C’est la capacité à relier infrastructure, code, sécurité et expérience utilisateur."
            className="mb-16 sm:mb-24"
          />
        )}

        <ul className="border-t border-line">
          {groups.map((group, i) => (
            <li key={group.id}>
              <Reveal
                delay={i * 0.04}
                className={cn(
                  "group grid gap-6 border-b border-line py-10 transition-colors duration-500",
                  "lg:grid-cols-[auto_1fr_1.15fr] lg:items-start lg:gap-12 lg:py-12",
                  "hover:bg-charcoal/25",
                )}
              >
                {/* index + kanji */}
                <div className="flex items-center gap-5 lg:w-28 lg:flex-col lg:items-start lg:gap-3">
                  <span className="label text-steel-dim">{group.index}</span>
                  <span
                    className="font-jp text-4xl leading-none text-gold/30 transition-colors duration-500 group-hover:text-gold/70 lg:text-5xl"
                    aria-hidden="true"
                  >
                    {group.kanji}
                  </span>
                  <span className="label hidden text-steel-dim lg:block">
                    {group.kanjiRomaji}
                  </span>
                </div>

                {/* title + description */}
                <div>
                  <h3 className="font-display text-heading leading-tight text-ivory">
                    {group.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">
                    {group.description}
                  </p>
                </div>

                {/* evidence */}
                <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <div key={item.name} className="border-l border-line pl-4">
                      <dt className="font-mono text-xs uppercase tracking-wider text-ivory-dim">
                        {item.name}
                      </dt>
                      <dd className="mt-1.5 text-xs leading-relaxed text-steel-dim">
                        {item.note}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
