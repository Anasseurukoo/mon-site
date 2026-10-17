"use client";

import { usePathname } from "next/navigation";
import { StudioAssistant } from "@/components/ai/StudioAssistant";

/** Keeps the site-wide launcher out of the dedicated BBA AI workspace. */
export function GlobalStudioAssistant() {
  const pathname = usePathname();
  if (pathname === "/ai" || pathname.startsWith("/ai/")) return null;
  return <StudioAssistant />;
}
