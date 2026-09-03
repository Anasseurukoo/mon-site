"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/common/BrandMark";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { navigation } from "@/data/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Adaptive header.
 *
 * At the top it is transparent and open. Once scrolled it condenses, gains a
 * hairline and a blur, and retreats out of the way when the reader is moving
 * down the page — returning immediately on any upward scroll. It never hides
 * while the mobile menu is open, and never hides on keyboard focus within.
 */
export function SiteHeader() {
  const { direction, atTop, progress } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Route change closes the menu — otherwise it stays open over the new page.
  // Adjusting during render (rather than in an effect) means the new page never
  // paints once with the old menu still over it.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const hidden = direction === "down" && !atTop && !menuOpen;

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-95 transition-[background-color,border-color,backdrop-filter] duration-500",
          atTop
            ? "border-b border-white/10 bg-black/32 backdrop-blur-md"
            : "border-b border-line bg-sumi/92 shadow-[0_12px_34px_rgba(0,0,0,0.2)] backdrop-blur-xl",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE.blade }}
      >
        <div
          className={cn(
            "shell flex h-[5.25rem] items-center justify-between gap-5 transition-[height] duration-500 sm:h-[5.5rem]",
          )}
        >
          <BrandMark compact />

          <nav aria-label="Navigation principale" className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-center gap-0.5 xl:gap-1">
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.split("#")[0] ?? item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative block px-3 py-2 text-[0.82rem] tracking-[0.01em] transition-colors xl:px-3.5 xl:text-sm",
                        active ? "text-ivory" : "text-steel hover:text-ivory-dim",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-3 bottom-1 h-px origin-left bg-gold transition-transform duration-500 xl:inset-x-3.5",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-2 border border-gold/35 bg-black/20 px-4 py-2.5 text-sm text-ivory-dim backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold/10 hover:text-ivory xl:inline-flex"
            >
              Parlons projet
              <span aria-hidden="true" className="text-gold">
                ↗
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-11 w-11 items-center justify-center border border-line-strong transition-colors hover:border-gold lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ivory transition-all duration-400",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ivory transition-all duration-400",
                    menuOpen ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Reading progress — a single hairline, no numbers, no chrome. */}
        <div
          className="h-px origin-left bg-gold/45"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
