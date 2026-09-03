"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Single source of truth for motion gating.
 *
 * This is a subscription to an external store (the media query list), so it is
 * modelled as one rather than as state synchronised inside an effect — that
 * avoids the extra render pass and reads the true value on the very first
 * client render instead of one frame later.
 *
 * The server snapshot is `true`: the still version is what gets rendered
 * before the client knows the preference, so users who asked for reduced
 * motion never see a frame of movement.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
