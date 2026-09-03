import type { Transition, Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole site.
 *
 * Three eases, three durations. Every component composes these rather than
 * inventing its own timing, which is what keeps a site with this much movement
 * from feeling like a pile of unrelated effects.
 */
export const EASE = {
  /** Primary decelerate — entrances, most things. */
  dojo: [0.22, 1, 0.36, 1],
  /** Symmetrical — page and state transitions that go both ways. */
  blade: [0.65, 0, 0.35, 1],
  /** Long tail — cinematic reveals, masks, the intro. */
  veil: [0.16, 1, 0.3, 1],
} as const;

export const DURATION = {
  quick: 0.28,
  base: 0.62,
  slow: 1.1,
} as const;

export const transition = {
  quick: { duration: DURATION.quick, ease: EASE.dojo },
  base: { duration: DURATION.base, ease: EASE.dojo },
  slow: { duration: DURATION.slow, ease: EASE.veil },
} satisfies Record<string, Transition>;

/** Section entrance: rise into place with a soft fade. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

/** Container that staggers its children. */
export const stagger = (delayChildren = 0, staggerChildren = 0.075): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

/**
 * Typography mask reveal. The child slides up from behind a clipped parent —
 * the parent must carry `overflow: hidden`.
 */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE.veil } },
};

/** Image reveal: the frame wipes open while the image settles from a scale-up. */
export const imageClip: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 1.05, ease: EASE.veil } },
};

export const imageSettle: Variants = {
  hidden: { scale: 1.12 },
  visible: { scale: 1, transition: { duration: 1.3, ease: EASE.veil } },
};

/**
 * Applied when prefers-reduced-motion is set: state change without travel.
 *
 * `y` is declared here even though it never moves. The reduced-motion value is
 * resolved after hydration, so a component can switch between these variants
 * and `riseIn` mid-life — and any property present in one set but absent from
 * the other would be left stranded at its old value. Keeping the property sets
 * identical is what stops that.
 */
export const staticVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

/**
 * Picks the real variant or the still one. Callers pass the hook result so the
 * decision lives in a single place.
 */
export function motionSafe(variants: Variants, prefersReduced: boolean): Variants {
  return prefersReduced ? staticVariants : variants;
}

/** Standard viewport trigger — fires once, slightly before the element lands. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
