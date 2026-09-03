"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { navigation } from "@/data/navigation";
import { profile, socials } from "@/data/profile";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation for touch and narrow viewports.
 *
 * Accessibility contract: it is a labelled modal dialog, it traps Tab, Escape
 * closes it, focus returns to the toggle on close, and body scroll is locked
 * while it is open.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useScrollLock(open);
  useFocusTrap(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation principale"
          tabIndex={-1}
          className="fixed inset-0 z-90 flex flex-col bg-sumi/98 backdrop-blur-xl lg:hidden"
          initial={{
            opacity: 0,
            clipPath: prefersReduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          exit={{
            opacity: 0,
            clipPath: prefersReduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          }}
          transition={{ duration: prefersReduced ? 0.15 : 0.7, ease: EASE.veil }}
        >
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <nav className="relative flex flex-1 flex-col justify-center px-gutter">
            <ul className="flex flex-col gap-1">
              {navigation.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: prefersReduced ? "0%" : "110%" }}
                    animate={{ opacity: 1, y: "0%" }}
                    transition={{
                      duration: prefersReduced ? 0.2 : 0.75,
                      ease: EASE.veil,
                      delay: prefersReduced ? 0 : 0.12 + i * 0.06,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-baseline justify-between gap-4 border-b border-line py-4"
                    >
                      <span className="font-display text-4xl leading-none text-ivory transition-colors group-hover:text-gold-soft sm:text-5xl">
                        {item.label}
                      </span>
                      <span className="flex items-baseline gap-3">
                        <span className="label text-steel-dim">{item.labelFr}</span>
                        <span className="font-jp text-sm text-gold/60" aria-hidden="true">
                          {item.kanji}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="relative flex flex-wrap items-end justify-between gap-6 border-t border-line px-gutter py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.5, duration: 0.5 }}
          >
            <div>
              <p className="label mb-2 text-steel-dim">Contact</p>
              <a
                href={`mailto:${profile.email}`}
                className="inline-block py-1 text-sm text-ivory-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-gold-soft"
              >
                {profile.email}
              </a>
            </div>
            <ul className="flex gap-5">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="label inline-block py-1.5 text-steel transition-colors hover:text-gold"
                  >
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
