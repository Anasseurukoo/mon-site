import type { ReactNode } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** e.g. "01 — SELECTED WORK" */
  label: string;
  title: string;
  accent?: string;
  intro?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  align?: "split" | "stacked";
  /** Matches the section's aria-labelledby target (e.g. "about-heading"). */
  id?: string;
}

/**
 * The section opener used across the site: index label over a hairline, a
 * display-type title that masks up, and an optional intro column beside it.
 */
export function SectionHeading({
  label,
  title,
  accent,
  intro,
  className,
  as = "h2",
  align = "split",
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("w-full", className)}>
      <Reveal>
        <div className="rule mb-6 opacity-95" />
        <p className="label">{label}</p>
      </Reveal>

      <div
        className={cn(
          "mt-7 gap-x-16 gap-y-8",
          align === "split" ? "grid lg:grid-cols-[1.25fr_1fr] lg:items-end" : "block",
        )}
      >
        {/* MaskText already exposes the full string to assistive tech, so the
            accent line must not be duplicated with a second sr-only copy. */}
        <MaskText
          id={id}
          as={as}
          text={title}
          className="title block pb-[0.10em] font-display text-ivory"
          stagger={0.045}
        />

        {accent && (
          <MaskText
            as="span"
            text={accent}
            className="title mt-1 block pb-[0.16em] font-display italic text-gold-soft lg:col-start-1"
            delay={0.1}
            stagger={0.045}
          />
        )}

        {intro && (
          <Reveal
            delay={0.15}
            className={cn(
              "max-w-md text-lead leading-relaxed text-steel",
              align === "split" && "lg:col-start-2 lg:row-start-1 lg:row-span-2",
            )}
          >
            {intro}
          </Reveal>
        )}
      </div>
    </div>
  );
}
