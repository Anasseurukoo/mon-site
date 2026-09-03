"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Direction the mask wipes from. */
  from?: "bottom" | "left";
}

/**
 * Cinematic image reveal: the frame wipes open while the image itself settles
 * back from a slight scale-up. Two layers moving at different rates is what
 * gives the reveal depth rather than reading as a plain fade.
 */
export function RevealImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  from = "bottom",
}: RevealImageProps) {
  const prefersReduced = usePrefersReducedMotion();

  const closed = from === "bottom" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)";

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-sumi-deep", className)}
      // Both branches animate the same properties — only the values differ.
      // See the note on `staticVariants` in lib/motion.ts.
      initial={{ opacity: 0, clipPath: prefersReduced ? "inset(0 0 0% 0)" : closed }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      viewport={viewportOnce}
      transition={{ duration: prefersReduced ? 0.2 : 1.05, ease: EASE.veil }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: prefersReduced ? 1 : 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: prefersReduced ? 0.2 : 1.3, ease: EASE.veil }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          quality={92}
          priority={priority}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </motion.div>
    </motion.div>
  );
}
