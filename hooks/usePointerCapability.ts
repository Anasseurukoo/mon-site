"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * True only for devices with a real hover-capable pointer.
 *
 * Pointer-driven effects (cursor parallax, hover lift) are mounted behind this
 * so touch devices never pay for listeners they cannot trigger, and so no
 * interaction is available by hover alone.
 *
 * Server snapshot is `false` — assume touch until proven otherwise.
 */
export function usePointerCapability(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
