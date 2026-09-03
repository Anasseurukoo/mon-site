import Image from "next/image";
import type { ReactNode } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { PetalDrift } from "@/components/motion/PetalDrift";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  label: string;
  title: string;
  accent?: string;
  intro?: ReactNode;
  /** Optional atmospheric backdrop, sunk into the page ground. */
  image?: { src: string; alt: string };
  children?: ReactNode;
  className?: string;
  /**
   * Id placed on the h1's accessible (sr-only) text node. Lets a section
   * further down the page — one that intentionally has no visible heading of
   * its own because this h1 already introduced it — point its
   * aria-labelledby back at this h1 instead of at nothing.
   */
  headingId?: string;
}

/**
 * The opening block for inner routes. Shorter than the home hero — these pages
 * should get to their content quickly rather than repeating the full cinematic
 * treatment on every route.
 *
 * The label and heading animate via CSS (`immediate` / `anim-fade-up`) because
 * they are always in the first viewport; making them wait for hydration would
 * make them the Largest Contentful Paint and push it past two seconds.
 */
export function PageHeader({
  label,
  title,
  accent,
  intro,
  image,
  children,
  className,
  headingId,
}: PageHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24", className)}>
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={92}
            className="object-cover opacity-90"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(7,8,10,0.4) 0%, rgba(7,8,10,0.5) 65%, #07080a 100%)",
            }}
          />
        </div>
      )}
      <PetalDrift />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="shell">
        <div className="anim-fade">
          <div className="rule mb-6" />
          <p className="label text-ivory-dim [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">{label}</p>
        </div>

        <h1 className="mt-7">
          <span id={headingId} className="sr-only">
            {title} {accent}
          </span>
          <span aria-hidden="true">
            <MaskText
              as="span"
              text={title}
              className="title block pb-[0.12em] font-display text-ivory"
              stagger={0.04}
              immediate
            />
            {accent && (
              <MaskText
                as="span"
                text={accent}
                className="title block pb-[0.16em] font-display italic text-gold-soft"
                delay={0.1}
                stagger={0.04}
                immediate
              />
            )}
          </span>
        </h1>

        {intro && (
          <div
            className="anim-fade-up mt-9 max-w-2xl text-lead leading-relaxed text-steel"
            style={{ animationDelay: "0.35s" }}
          >
            {intro}
          </div>
        )}

        {children && <Reveal delay={0.1}>{children}</Reveal>}
      </div>
    </header>
  );
}
