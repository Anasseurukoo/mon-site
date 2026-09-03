"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STACK = [
  "LINUX",
  "PYTHON",
  "DOCKER",
  "GIT & GITHUB",
  "NEXT.JS",
  "TYPESCRIPT",
  "TAILWIND CSS",
  "VIRTUAL TRY-ON",
  "BASH",
  "C",
  "CYBERSECURITY",
];

/**
 * Technology ticker.
 *
 * Under reduced motion it becomes a static, wrapped list rather than a frozen
 * strip with content cut off at the edge — the information stays fully
 * readable, which a paused marquee would not be.
 */
export function TechMarquee() {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <section
        className="border-y border-line bg-charcoal/30 py-6"
        aria-label="Technologies utilisées"
      >
        <ul className="shell flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {STACK.map((item) => (
            <li key={item} className="label text-steel">
              {item}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden border-y border-line bg-charcoal/30 py-6"
      aria-label="Technologies utilisées"
    >
      {/* Edge fades so items enter and leave rather than being clipped. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-sumi to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-sumi to-transparent"
        aria-hidden="true"
      />

      <ul className="flex w-max animate-[marquee_38s_linear_infinite] items-center gap-10 will-change-transform hover:[animation-play-state:paused]">
        {/* Duplicated for a seamless loop; the copy is hidden from a11y. */}
        {[0, 1].map((pass) => (
          <li key={pass} aria-hidden={pass === 1}>
            <ul className="flex items-center gap-10">
              {STACK.map((item) => (
                <li key={item} className="flex items-center gap-10">
                  <span className="label whitespace-nowrap text-steel">{item}</span>
                  <span className="text-gold/40" aria-hidden="true">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
