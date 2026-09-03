import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StudioAssistant } from "@/components/ai/StudioAssistant";
import { siteMeta, siteUrl, isLocalPrototype } from "@/lib/site";
import { profile } from "@/data/profile";

// Self-hosted (no Google Fonts network fetch at build time — the previous
// next/font/google setup broke production builds in restricted-network
// environments). Variable font files are bundled locally under public/fonts.
const geist = localFont({
  src: "../public/fonts/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin-wght-normal.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const instrument = localFont({
  src: "../public/fonts/instrument-serif-latin-400-normal.woff2",
  variable: "--font-instrument",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMeta.title,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  applicationName: profile.brand,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteMeta.locale,
    url: "/",
    siteName: profile.brand,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [
      {
        url: "/assets/brand/og-builtbyanas.webp",
        width: 1200,
        height: 630,
        alt: `${profile.brand} — ${profile.concept}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  // The local prototype must never be indexed. Flip via NEXT_PUBLIC_SITE_URL.
  robots: isLocalPrototype
    ? { index: false, follow: false }
    : { index: true, follow: true },
  icons: {
    icon: [{ url: "/assets/brand/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMeta.lang}
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:bg-gold focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-sumi"
        >
          Aller au contenu
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StudioAssistant />
      </body>
    </html>
  );
}
