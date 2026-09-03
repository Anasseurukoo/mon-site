import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every project route at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projet introuvable" };

  const projectKeywords = project.slug === "loza-optique"
    ? ["Loza Optique", "Virtual Try-On", "essayage virtuel lunettes", "opticien Casablanca", "développement web Maroc"]
    : project.slug === "bba-ai-studio-assistant"
      ? ["BBA AI", "assistant IA", "Gemini API", "IA et automatisation", "BuiltByAnas"]
      : [project.name, project.category, "Anasse Anida", "BuiltByAnas"];

  return {
    title: project.name,
    description: project.summary,
    keywords: projectKeywords,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — BuiltByAnas`,
      description: project.summary,
      images: [{ url: project.cover.src }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(slug);

  const facts = [
    { label: "Rôle", value: project.role },
    { label: "Catégorie", value: project.category },
    { label: "Année", value: project.year },
  ];

  return (
    <>
      <PageHeader
        label={`${project.category} — ${project.year}`}
        title={project.name}
        image={{ src: project.cover.src, alt: "" }}
        intro={<p>{project.summary}</p>}
      >
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <StatusBadge status={project.status} />
            {project.links.map((link) => (
              <ArrowLink
                key={link.href}
                href={link.href}
                external={link.external}
                variant="outline"
                className="!px-5 !py-2.5 !text-xs bg-black/30 backdrop-blur-sm"
              >
                {link.label}
              </ArrowLink>
            ))}
          </div>
        </Reveal>
      </PageHeader>

      <div className="shell pb-section">
        {/* ------------------------------------------------------ fact strip */}
        <Reveal>
          <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-sumi p-6">
                <dt className="label text-steel-dim">{fact.label}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-ivory-dim">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ----------------------------------------------------------- body */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            {project.body.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p
                  className={
                    i === 0
                      ? "text-[1.15rem] leading-8 text-ivory-dim"
                      : "mt-6 text-[1.02rem] leading-7 text-steel"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <div className="mt-14 flex flex-col gap-10">
              {project.challenge && (
                <Reveal>
                  <div className="rounded-sm bg-charcoal/35 p-6 sm:p-7">
                    <h2 className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-gold-soft">Le problème</h2>
                    <p className="text-[1.02rem] leading-7 text-ivory-dim">{project.challenge}</p>
                  </div>
                </Reveal>
              )}
              {project.approach && (
                <Reveal>
                  <div className="rounded-sm bg-charcoal/35 p-6 sm:p-7">
                    <h2 className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-gold-soft">L’approche</h2>
                    <p className="text-[1.02rem] leading-7 text-ivory-dim">{project.approach}</p>
                  </div>
                </Reveal>
              )}
              {project.result && (
                <Reveal>
                  <div className="rounded-sm bg-charcoal/35 p-6 sm:p-7">
                    <h2 className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-gold-soft">Le résultat</h2>
                    <p className="text-[1.02rem] leading-7 text-ivory-dim">{project.result}</p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          {/* -------------------------------------------------------- aside */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="label mb-5 text-steel-dim">Technologies</h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-steel"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.links.length > 0 && (
              <Reveal delay={0.1}>
                <h2 className="label mb-4 mt-10 text-steel-dim">Liens</h2>
                <ul className="flex flex-col gap-3 border-t border-line pt-4">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <ArrowLink href={link.href} external={link.external}>
                        {link.label}
                      </ArrowLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>

        {/* -------------------------------------------------------- gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mt-24" aria-labelledby="gallery-heading">
            <Reveal>
              <div className="rule mb-6" />
              <h2 id="gallery-heading" className="label mb-10">
                Aperçus
              </h2>
            </Reveal>
            <Lightbox images={project.gallery} />
          </section>
        )}

        {!project.gallery && (
          <Reveal className="mt-24">
            <RevealImage
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="100vw"
              className="aspect-21/9 w-full"
            />
          </Reveal>
        )}

        {/* ----------------------------------------------------- pagination */}
        <nav
          className="mt-24 grid gap-px border border-line bg-line sm:grid-cols-2"
          aria-label="Autres projets"
        >
          {previous && (
            <Link
              href={`/work/${previous.slug}`}
              className="group bg-sumi p-7 transition-colors hover:bg-charcoal/40"
            >
              <span className="label text-steel-dim">← Précédent</span>
              <span className="mt-3 block font-display text-xl text-ivory transition-colors group-hover:text-gold-soft">
                {previous.name}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group bg-sumi p-7 text-right transition-colors hover:bg-charcoal/40"
            >
              <span className="label text-steel-dim">Suivant →</span>
              <span className="mt-3 block font-display text-xl text-ivory transition-colors group-hover:text-gold-soft">
                {next.name}
              </span>
            </Link>
          )}
        </nav>

        <Reveal className="mt-12">
          <ArrowLink href="/work" variant="outline">
            Retour à l’index
          </ArrowLink>
        </Reveal>
      </div>
    </>
  );
}
