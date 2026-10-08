import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  /** The home page teases; /about shows the full text and the console. */
  full?: boolean;
  /**
   * False when a PageHeader directly above this section already rendered the
   * same title/intro (the /about route) — otherwise the page opens with the
   * exact same heading twice. True (default) on the homepage, where this
   * section is the only place that title appears.
   */
  showHeading?: boolean;
}

export function AboutSection({ full = false, showHeading = true }: AboutSectionProps) {
  const paragraphs = full ? profile.about : profile.about.slice(0, 2);

  return (
    <section
      id="about"
      className={cn("relative", showHeading ? "py-section" : "pb-section pt-8 sm:pt-10")}
      aria-labelledby="about-heading"
    >
      <div className="shell">
        {showHeading && (
          <SectionHeading
            id="about-heading"
            label="05 — About"
            title={profile.aboutTitle.lead}
            accent={profile.aboutTitle.accent}
            align="stacked"
            className="mb-16 sm:mb-20"
          />
        )}

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* ------------------------------------------------------ portrait */}
          <div className="relative">
            <RevealImage
              src="/assets/profile/anasse-digital-dojo-notes.png"
              alt={`Illustration éditoriale de ${profile.name} dans l’univers japonais du Digital Dojo`}
              width={1189}
              height={1323}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-4/3 w-full"
              imageClassName="object-cover object-[center_30%]"
            />

            <Reveal delay={0.2}>
              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                <span className="font-display text-xl text-ivory">{profile.name}</span>
                <span className="label text-steel-dim">{profile.location}</span>
              </div>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------- copy */}
          <div>
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? "text-lead leading-relaxed text-ivory-dim"
                      : "mt-6 leading-relaxed text-steel"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
                {profile.principles.map((principle) => (
                  <li key={principle.index} className="bg-sumi p-6">
                    <span className="label text-gold/70">{principle.index}</span>
                    <p className="mt-3 font-display text-lg leading-snug text-ivory">
                      {principle.label}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {full && (
              <Reveal delay={0.3}>
                {/* The self-describing console from the current site, rebuilt. */}
                <figure className="mt-12 border border-line bg-charcoal/40">
                  <figcaption className="flex items-center gap-3 border-b border-line px-4 py-3">
                    <span className="flex gap-1.5" aria-hidden="true">
                      <span className="block h-2 w-2 rounded-full bg-gold/60" />
                      <span className="block h-2 w-2 rounded-full bg-gold/60" />
                      <span className="block h-2 w-2 rounded-full bg-steel-dim/60" />
                    </span>
                    <span className="font-mono text-xs text-steel-dim">
                      anasse@digital-dojo
                    </span>
                  </figcaption>
                  <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-ivory-dim sm:text-sm">
                    <code>
                      {profile.snippet.map((line) => (
                        <span key={line.n} className="block">
                          <span className="mr-4 select-none text-steel-dim">{line.n}</span>
                          {line.code}
                        </span>
                      ))}
                      <span className="mt-3 block text-gold-soft">
                        <span className="mr-4 select-none text-steel-dim">›</span>
                        system.status(&quot;ready&quot;);
                      </span>
                    </code>
                  </pre>
                </figure>
              </Reveal>
            )}

            {!full && (
              <Reveal delay={0.32}>
                <div className="mt-10">
                  <ArrowLink href="/about">Lire le parcours complet</ArrowLink>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
