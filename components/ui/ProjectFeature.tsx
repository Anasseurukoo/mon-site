"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealImage } from "@/components/motion/RevealImage";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { usePointerCapability } from "@/hooks/usePointerCapability";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectFeatureProps {
  project: Project;
  index: number;
  /** Alternating layouts — the brief explicitly rules out identical cards. */
  layout?: "wide" | "offset" | "compact";
}

export function ProjectFeature({ project, index, layout = "wide" }: ProjectFeatureProps) {
  const hasPointer = usePointerCapability();
  const prefersReduced = usePrefersReducedMotion();
  const lift = hasPointer && !prefersReduced;

  const number = String(index + 1).padStart(2, "0");
  const reversed = layout === "offset";

  return (
    <article
      className={cn(
        "group relative grid items-center gap-8 lg:gap-14",
        layout === "compact"
          ? "lg:grid-cols-[0.9fr_1.1fr]"
          : "lg:grid-cols-2",
      )}
    >
      {/* ------------------------------------------------------------ media */}
      <motion.div
        className={cn("relative", reversed && "lg:order-2")}
        whileHover={lift ? { y: -6 } : undefined}
        transition={{ duration: 0.6, ease: EASE.dojo }}
      >
        <Link
          href={`/work/${project.slug}`}
          className="block"
          aria-label={`Voir le projet ${project.name}`}
          tabIndex={-1}
        >
          <RevealImage
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              layout === "compact" ? "aspect-4/3" : "aspect-16/11",
              "w-full",
            )}
            imageClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        </Link>

        {/* Editorial index numeral. Decorative, but kept at a contrast that
            passes AA for large text rather than relying on aria-hidden to
            excuse an unreadable value. */}
        <span
          className="pointer-events-none absolute -top-6 -left-2 font-display text-[clamp(3.5rem,7vw,6rem)] leading-none text-ivory/45 lg:-left-8"
          aria-hidden="true"
        >
          {number}
        </span>

        <div className="absolute bottom-4 left-4">
          <StatusBadge status={project.status} className="bg-sumi/80 backdrop-blur-sm" />
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- copy */}
      <div className={cn(reversed && "lg:order-1")}>
        <Reveal>
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label text-gold/80">{project.category}</span>
            <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
            <span className="label text-steel-dim">{project.year}</span>
          </div>
        </Reveal>

        <h3>
          <Link
            href={`/work/${project.slug}`}
            className="inline-block transition-colors duration-400 hover:text-gold-soft focus-visible:text-gold-soft"
          >
            <MaskText
              as="span"
              text={project.name}
              className="title block font-display text-ivory"
              stagger={0.04}
            />
          </Link>
        </h3>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl leading-relaxed text-steel">{project.summary}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-7 border-t border-line pt-5">
            <p className="label mb-2 text-steel-dim">Rôle</p>
            <p className="text-sm text-ivory-dim">{project.role}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-6 flex flex-wrap gap-2">
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

        <Reveal delay={0.28}>
          <div className="mt-8">
            <ArrowLink href={`/work/${project.slug}`}>Voir le projet</ArrowLink>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
