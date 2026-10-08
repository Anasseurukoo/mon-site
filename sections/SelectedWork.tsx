import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFeature } from "@/components/ui/ProjectFeature";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { featuredProjects } from "@/data/projects";

const LAYOUTS = ["wide", "offset", "compact"] as const;

export function SelectedWork() {
  return (
    <section id="work" className="relative py-section" aria-labelledby="work-heading">
      <div className="shell">
        <SectionHeading
          id="work-heading"
          label="01 — Réalisations"
          title="Des projets réels."
          accent="Pas des promesses."
          intro="Chaque projet représente une compétence mise en pratique : comprendre le besoin, choisir les bons outils et livrer une solution utilisable — du développement web à l’IA, l’automatisation, la cybersécurité et aux systèmes."
          className="mb-20 sm:mb-28"
        />

        <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
          {featuredProjects.map((project, i) => (
            <ProjectFeature
              key={project.slug}
              project={project}
              index={i}
              layout={LAYOUTS[i % LAYOUTS.length]}
            />
          ))}
        </div>

        <Reveal className="mt-24 border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-lead text-steel">
                Les fondations comptent autant que la vitrine : systèmes, C, algorithmes,
                administration Linux, IA et automatisation.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel-dim">
                Les projets présentés ici sont conçus ou développés par Anasse dans le cadre de BuiltByAnas, à Casablanca.
              </p>
            </div>
            <ArrowLink href="/work" variant="outline">
              Voir tous les projets
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
