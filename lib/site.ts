/**
 * Deployment-facing configuration, kept in one place so the production domain
 * can be set later without touching page code.
 *
 * `siteUrl` deliberately points at localhost: this is a local prototype and
 * must not emit canonical URLs for a domain it is not deployed to. Set
 * NEXT_PUBLIC_SITE_URL at build time when the site is genuinely deployed.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** True when the site is still running as the local prototype. */
export const isLocalPrototype = siteUrl.includes("localhost");

export const siteMeta = {
  title: "Anasse Anida — BuiltByAnas · Digital Dojo",
  titleTemplate: "%s — BuiltByAnas",
  description:
    "Anasse Anida — ingénieur IT à Casablanca, spécialisé en développement web, IA et automatisation, cybersécurité et systèmes. Découvrez BuiltByAnas, son portfolio et ses projets comme Loza Optique et Virtual Try-On.",
  locale: "fr_MA",
  lang: "fr",
  keywords: [
    "Anasse Anida",
    "BuiltByAnas",
    "ingénieur IT Casablanca",
    "développeur web Casablanca",
    "développement web Maroc",
    "Next.js TypeScript Maroc",
    "intelligence artificielle Maroc",
    "IA et automatisation",
    "cybersécurité Casablanca",
    "DevOps Maroc",
    "Virtual Try-On Maroc",
    "essayage virtuel lunettes",
    "Loza Optique",
    "portfolio ingénieur informatique Casablanca",
  ],
};
