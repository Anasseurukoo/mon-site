import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ContactSection } from "@/sections/ContactSection";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Portfolio d’Anasse à Casablanca : Loza Optique, Joury Optic, BBA AI, développement web, IA et automatisation, cybersécurité et fondations systèmes.",
  alternates: { canonical: "/work/" },
};

/**
 * Full project index.
 *
 * Alternating row rhythm rather than a uniform card grid — odd rows lead with
 * the image, even rows lead with the copy.
 */
export default function WorkPage() {
  return (
    <>
      <PageHeader
        headingId="work-heading"
        label="Index — Selected work"
        title="Le travail,"
        accent="en entier."
        image={{
          src: "/assets/backgrounds/custom/work-night.webp",
          alt: "Pont en bois éclairé par des lanternes entre deux rangées de maisons japonaises, sous une pleine lune",
        }}
        intro={
          <p>
            De l’essayage virtuel de Joury Optic et Loza Optique au BBA AI conçu par BuiltByAnas, puis aux fondations systèmes. Chaque
            projet indique ce qui peut être vérifié publiquement — et ce qui ne le peut pas.
          </p>
        }
      />

      <div className="shell pb-section">
        <ul className="border-t border-line">
          {projects.map((project, i) => {
            const number = String(i + 1).padStart(2, "0");
            const reversed = i % 2 === 1;

            return (
              <li key={project.slug}>
                <Reveal
                  as="article"
                  delay={i * 0.04}
                  className="group grid gap-8 border-b border-line py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-16"
                >
                  <div className={reversed ? "lg:order-2" : undefined}>
                    <Link
                      href={`/work/${project.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="block"
                    >
                      <RevealImage
                        src={project.cover.small ?? project.cover.src}
                        alt={project.cover.alt}
                        width={project.cover.width}
                        height={project.cover.height}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="aspect-16/10 w-full"
                        imageClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  <div className={reversed ? "lg:order-1" : undefined}>
                    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-mono text-xs text-steel-dim">{number}</span>
                      <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
                      <span className="label text-gold/80">{project.category}</span>
                      <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
                      <span className="label text-steel-dim">{project.year}</span>
                      <StatusBadge status={project.status} />
                    </div>

                    <h2 className="font-display text-title leading-tight">
                      <Link
                        href={`/work/${project.slug}`}
                        className="text-ivory transition-colors duration-400 hover:text-gold-soft"
                      >
                        {project.name}
                      </Link>
                    </h2>

                    <p className="mt-5 max-w-xl text-[1.02rem] leading-7 text-steel">
                      {project.summary}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-steel-dim"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>


                    <div className="mt-7">
                      <ArrowLink href={`/work/${project.slug}`}>Voir le projet</ArrowLink>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      <ContactSection />
    </>
  );
}
