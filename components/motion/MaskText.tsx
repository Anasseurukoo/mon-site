"use client";

import { motion } from "framer-motion";
import { createElement, Fragment } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, viewportOnce } from "@/lib/motion";
import { toWords } from "@/lib/utils";

interface MaskTextProps {
  text: string;
  className?: string;
  /** Rendered element. Headings must still be semantically correct. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
  /** Per-word stagger. Lower for long strings so the reveal stays brisk. */
  stagger?: number;
  /**
   * Reveal on first paint using CSS instead of waiting for a viewport trigger.
   * Use for anything guaranteed to be above the fold — it keeps the text out of
   * the hydration critical path, which is what LCP actually measures.
   */
  immediate?: boolean;
  /** Forwarded to the root element — lets a section's aria-labelledby resolve. */
  id?: string;
}

/**
 * Word-by-word mask reveal: each word rides up from behind a clipped line box.
 *
 * The animation wrappers contain the only copy of the text. Keeping the words
 * as ordinary inline text avoids a hidden duplicate sentence in the DOM while
 * preserving one readable phrase for assistive technology and crawlers.
 *
 * The inter-word space is a text node *between* the clipping spans, not inside
 * them. Inside, it is trailing whitespace in an inline-block and CSS strips it,
 * which runs every word together. Outside, it renders normally and still lets
 * the heading wrap between words.
 *
 * The same element tree is rendered whether or not motion is reduced; only the
 * animation values change. Swapping the tree instead would remount the node
 * when the reduced-motion value resolves after hydration.
 */
export function MaskText({
  text,
  className,
  as = "span",
  delay = 0,
  stagger = 0.055,
  immediate = false,
  id,
}: MaskTextProps) {
  const prefersReduced = usePrefersReducedMotion();
  const words = toWords(text);

  return createElement(
    as,
    { className, id },
    words.map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span
          className="inline-block overflow-hidden align-bottom"
          style={{
            paddingBottom: "0.12em",
            marginBottom: "-0.12em",
            paddingRight: "0.08em",
            marginRight: "-0.08em",
          }}
        >
          {immediate ? (
            <span
              className="anim-rise inline-block"
              style={{ animationDelay: `${delay + i * stagger}s` }}
            >
              {word}
            </span>
          ) : (
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: prefersReduced ? "0%" : "110%" }}
              whileInView={{ opacity: 1, y: "0%" }}
              viewport={viewportOnce}
              transition={{
                duration: prefersReduced ? 0.2 : 0.85,
                ease: EASE.veil,
                delay: prefersReduced ? 0 : delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
          )}
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
