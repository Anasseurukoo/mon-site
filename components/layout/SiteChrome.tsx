"use client";

import { usePathname } from "next/navigation";
import { GlobalStudioAssistant } from "@/components/ai/GlobalStudioAssistant";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAi = pathname === "/ai" || pathname.startsWith("/ai/");
  return (
    <>
      {!isAi && <SiteHeader />}
      <main id="main">{children}</main>
      {!isAi && <SiteFooter />}
      <GlobalStudioAssistant />
    </>
  );
}
