"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const RING_TEXT = "BUILTBYANAS · DIGITAL DOJO · CASABLANCA · ";

/**
 * Slowly rotating seal, adapted from the circular badge in the reference film.
 * The rotation stops entirely under reduced motion — the seal still reads as a
 * mark, it just holds still.
 */
export function RotatingSeal({ className }: { className?: string }) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        animate={prefersReduced ? undefined : { rotate: 360 }}
        transition={{ duration: 44, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id="seal-ring"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <text className="fill-steel font-mono" style={{ fontSize: 13, letterSpacing: "0.34em" }}>
          <textPath href="#seal-ring" startOffset="0%">
            {RING_TEXT.repeat(2)}
          </textPath>
        </text>
      </motion.svg>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="font-jp text-2xl text-gold/70">{profile.kanji}</span>
      </span>

      <span className="pointer-events-none absolute inset-[18%] rounded-full border border-line" />
    </div>
  );
}
