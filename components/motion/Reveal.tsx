"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionSafe, riseIn, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "footer";
}

/**
 * The default section entrance. Everything that enters on scroll goes through
 * here so timing stays consistent and reduced-motion is handled once.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={motionSafe(riseIn, prefersReduced)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: prefersReduced ? 0 : delay }}
    >
      {children}
    </Component>
  );
}
