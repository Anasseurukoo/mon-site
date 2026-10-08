import { tickerSkills } from "@/data/skills";

function SkillRun({ decorative = false }: { decorative?: boolean }) {
  return (
    <ul
      className="tech-ticker__run"
      aria-label={decorative ? undefined : "Technologies et pratiques"}
      aria-hidden={decorative ? true : undefined}
    >
      {tickerSkills.map((skill) => (
        <li key={skill} className="tech-ticker__item">
          <span className="tech-ticker__marker" aria-hidden="true" />
          {skill}
        </li>
      ))}
    </ul>
  );
}

/** Seamless, decorative ticker with one accessible copy for assistive tech. */
export function TechMarquee() {
  return (
    <section
      className="relative border-y border-line bg-charcoal/20 py-8 sm:py-10"
      aria-label="Technologies utilisées par BuiltByAnas"
    >
      <div className="shell mb-5 flex flex-wrap items-baseline justify-between gap-3 sm:mb-6">
        <p className="label text-gold">Digital Dojo · Outils</p>
        <p className="font-display text-lg text-ivory-dim sm:text-xl">
          La bonne technologie, au service du produit.
        </p>
      </div>
      <div className="tech-ticker">
        <div className="tech-ticker__track">
          <SkillRun />
          <SkillRun decorative />
        </div>
      </div>
    </section>
  );
}
