"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { timeline } from "@/data/timeline";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * The path.
 *
 * A vertical spine draws itself as the section scrolls — scroll-*linked*, not
 * scroll-*jacking*: the page scrolls normally and the line simply reads the
 * position. Under reduced motion the spine is drawn at full height immediately.
 */
export function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 55%"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" className="relative py-section" aria-labelledby="journey-heading">
      <div className="shell">
        <SectionHeading
          id="journey-heading"
          label="04 — Parcours"
          title="Revenir plus fort,"
          accent="construire plus juste."
          intro={
            <>
              <p>
                Quatre étapes, du support IT aux systèmes que je construis aujourd’hui.
                Chacune a laissé une trace concrète — un dépôt, un incident résolu, une
                leçon retenue.
              </p>
              <blockquote className="mt-6 border-l border-gold/50 pl-5 font-display text-lg italic leading-snug text-ivory-dim">
                «&nbsp;{profile.quote}&nbsp;»
              </blockquote>
            </>
          }
          className="mb-16 sm:mb-24"
        />

        <div ref={ref} className="relative">
          {/* spine */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-line sm:left-[11px]"
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-linear-to-b from-gold via-gold/60 to-gold/25 sm:left-[11px]"
            style={{ scaleY: prefersReduced ? 1 : spineScale }}
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-14 sm:gap-20">
            {timeline.map((entry, i) => (
              <li key={entry.id} className="relative pl-10 sm:pl-16">
                <Reveal delay={i * 0.05}>
                  {/* node */}
                  <span
                    className={cn(
                      "absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border sm:h-6 sm:w-6",
                      entry.status === "current"
                        ? "border-gold bg-sumi"
                        : entry.status === "next"
                          ? "border-gold/45 bg-sumi"
                          : "border-line-strong bg-sumi",
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block h-1.5 w-1.5 rounded-full",
                        entry.status === "current"
                          ? "bg-gold"
                          : entry.status === "next"
                            ? "bg-gold"
                            : "bg-steel-dim",
                      )}
                    />
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span
                      className={cn(
                        "label",
                        entry.status === "current" ? "text-gold" : "text-steel-dim",
                      )}
                    >
                      {entry.phase}
                    </span>
                    {entry.status === "current" && (
                      <span className="label text-steel-dim">— en cours</span>
                    )}
                    {entry.status === "next" && (
                      <span className="label text-gold-soft">— objectif</span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-12">
                    <div className="max-w-xl">
                      <h3 className="font-display text-heading leading-tight text-ivory">
                        {entry.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-steel">{entry.description}</p>
                      {entry.detail && (
                        <p className="mt-3 text-sm leading-relaxed text-steel-dim">
                          {entry.detail}
                        </p>
                      )}
                    </div>
                    <span
                      className="font-jp text-4xl leading-none text-gold/20 lg:text-6xl"
                      aria-hidden="true"
                    >
                      {entry.kanji}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
