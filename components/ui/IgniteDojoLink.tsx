"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";
import styles from "./IgniteDojoLink.module.css";

type FireState = "idle" | "proximity" | "hover" | "activating" | "navigating";

export function IgniteDojoLink() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const stateRef = useRef<FireState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    let frame = 0;
    let point = { x: 0, y: 0 };
    const setState = (next: FireState) => {
      if (stateRef.current === next) return;
      stateRef.current = next;
      link.dataset.fireState = next;
    };
    const update = () => {
      frame = 0;
      if (stateRef.current === "activating" || stateRef.current === "navigating") return;
      const rect = link.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(point.x, rect.right));
      const y = Math.max(rect.top, Math.min(point.y, rect.bottom));
      const distance = Math.hypot(point.x - x, point.y - y);
      link.style.setProperty("--fire-x", `${point.x - rect.left}px`);
      link.style.setProperty("--fire-y", `${point.y - rect.top}px`);
      link.style.setProperty("--fire-near", String(Math.max(0, 1 - distance / 170)));
      if (link.matches(":hover, :focus-visible")) setState("hover");
      else setState(distance < 170 ? "proximity" : "idle");
    };
    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      if (stateRef.current !== "activating" && stateRef.current !== "navigating") {
        link.style.setProperty("--fire-near", "0");
        setState(link.matches(":focus-visible") ? "hover" : "idle");
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (stateRef.current === "activating" || stateRef.current === "navigating") {
      event.preventDefault();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    stateRef.current = "activating";
    const link = linkRef.current;
    if (link) link.dataset.fireState = "activating";
    timerRef.current = setTimeout(() => {
      stateRef.current = "navigating";
      if (link) link.dataset.fireState = "navigating";
      // Keep the static-export route as a full page transition after ignition.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/ai/");
    }, 410);
  };

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch" || stateRef.current === "activating") return;
    stateRef.current = "hover";
    event.currentTarget.dataset.fireState = "hover";
  };

  return (
    <Link
      ref={linkRef}
      href="/ai/"
      data-fire-state="idle"
      className={`group inline-flex items-center gap-2.5 border border-line-strong px-6 py-3.5 text-sm text-ivory-dim transition-colors duration-300 focus-visible:outline-2 ${styles.link}`}
      onClick={activate}
      onPointerEnter={onPointerEnter}
      onPointerLeave={(event) => {
        if (stateRef.current !== "activating" && stateRef.current !== "navigating") {
          stateRef.current = "idle";
          event.currentTarget.dataset.fireState = "idle";
        }
      }}
      onFocus={(event) => {
        if (stateRef.current !== "activating") {
          stateRef.current = "hover";
          event.currentTarget.dataset.fireState = "hover";
        }
      }}
      onBlur={(event) => {
        if (stateRef.current !== "activating") {
          stateRef.current = "idle";
          event.currentTarget.dataset.fireState = "idle";
        }
      }}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      <span className={styles.embers} aria-hidden="true" />
      <span className={styles.label}>BBA AI — Digital Dojo</span>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  );
}
