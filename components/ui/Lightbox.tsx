"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";
import type { ProjectImage } from "@/types";

/**
 * Gallery with an accessible lightbox.
 *
 * Thumbnails are real buttons, not clickable divs. The dialog traps focus,
 * closes on Escape and on backdrop click, restores focus to the thumbnail that
 * opened it, and supports arrow-key paging between images.
 */
export function Lightbox({ images }: { images: ProjectImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const isOpen = openIndex !== null;
  useScrollLock(isOpen);

  const close = useCallback(() => setOpenIndex(null), []);
  useFocusTrap(dialogRef, isOpen, close);

  // Return focus to the thumbnail that opened the dialog. The trap restores
  // whatever had focus beforehand, which is not the same thing — a dialog
  // opened by keyboard "Enter" on a thumbnail leaves activeElement elsewhere
  // in some browsers, and focus would land back at the top of the document.
  useEffect(() => {
    if (isOpen) return;
    const trigger = triggerRef.current;
    if (!trigger) return;
    trigger.focus({ preventScroll: true });
    triggerRef.current = null;
  }, [isOpen]);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, step]);

  const active = openIndex !== null ? images[openIndex] : undefined;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        {images.map((image, i) => (
          <li
            key={image.src}
            className={image.height > image.width ? "sm:col-span-1" : "sm:col-span-2"}
          >
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenIndex(i);
              }}
              className="group relative block w-full overflow-hidden border border-line bg-charcoal transition-colors hover:border-line-strong"
              aria-label={`Agrandir : ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={92}
                className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <span
                className="absolute bottom-3 right-3 border border-line-strong bg-sumi/80 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-widest text-ivory-dim opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden="true"
              >
                Agrandir
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {isOpen && active && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            tabIndex={-1}
            className="fixed inset-0 z-100 flex items-center justify-center bg-sumi/95 p-4 backdrop-blur-md sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0.12 : 0.3, ease: EASE.dojo }}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <motion.figure
              className="relative max-h-full w-full max-w-5xl"
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReduced ? 0.15 : 0.45, ease: EASE.veil }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="100vw"
                className="max-h-[78vh] w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-steel">{active.alt}</span>
                <span className="label text-steel-dim">
                  {(openIndex ?? 0) + 1} / {images.length}
                </span>
              </figcaption>
            </motion.figure>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Image précédente"
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-ivory sm:left-6"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Image suivante"
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-ivory sm:right-6"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Fermer l’aperçu"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-ivory sm:right-8 sm:top-8"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
