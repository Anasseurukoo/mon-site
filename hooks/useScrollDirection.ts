"use client";

import { useEffect, useState } from "react";

interface ScrollState {
  direction: "up" | "down";
  atTop: boolean;
  progress: number;
}

/**
 * Drives the adaptive header. Reads scroll position inside rAF so the listener
 * itself never does layout work on the scroll thread.
 */
export function useScrollDirection(threshold = 12): ScrollState {
  const [state, setState] = useState<ScrollState>({
    direction: "up",
    atTop: true,
    progress: 0,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setState((prev) => {
        const movedEnough = Math.abs(y - lastY) > threshold;
        const direction = movedEnough ? (y > lastY ? "down" : "up") : prev.direction;
        if (movedEnough) lastY = y;

        const atTop = y < 24;
        const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

        if (
          prev.direction === direction &&
          prev.atTop === atTop &&
          Math.abs(prev.progress - progress) < 0.005
        ) {
          return prev;
        }
        return { direction, atTop, progress };
      });

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}
