"use client";

import { useEffect } from "react";

/**
 * Locks body scroll for overlays (intro, mobile menu) without the layout shift
 * that `overflow:hidden` alone causes on desktop, by compensating for the
 * scrollbar width that disappears.
 *
 * Reference-counted: two overlays open at once cannot unlock each other.
 */
let lockCount = 0;

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const body = document.body;
    lockCount += 1;

    if (lockCount === 1) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.dataset.scrollLocked = "true";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        delete body.dataset.scrollLocked;
        body.style.removeProperty("padding-right");
      }
    };
  }, [active]);
}
