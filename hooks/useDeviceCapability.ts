"use client";

import { useSyncExternalStore } from "react";

/** These signals do not change during a page's life, so there is nothing to subscribe to. */
const noopSubscribe = () => () => {};

function readCapability(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;

  // Respect an explicit data-saving request.
  if (connection?.saveData) return false;

  // Very low core counts are a reasonable proxy for devices that will struggle
  // with a continuously animating full-screen shader.
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2) {
    return false;
  }

  return true;
}

/**
 * Whether this device should run the optional heavy visual layer.
 *
 * Modelled as an external-store read rather than state assigned inside an
 * effect: the value is available on the first client render, so the shader
 * either mounts immediately or never mounts at all — no flash of it starting
 * and then being torn down.
 */
export function useHeavyEffectsAllowed(): boolean {
  return useSyncExternalStore(noopSubscribe, readCapability, () => false);
}
