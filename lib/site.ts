/**
 * Deployment-facing configuration, kept in one place so the production domain
 * can be set later without touching page code.
 *
 * Production is the default so direct local builds still produce the correct
 * canonical URLs. Previews can set NEXT_PUBLIC_SITE_URL to their own origin.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtbyanas.com").replace(/\/+$/, "");

/** True when the site is still running as the local prototype. */
export const isLocalPrototype = siteUrl.includes("localhost");

export const siteMeta = {
  title: "Anasse — IT Engineer | BuiltByAnas",
  titleTemplate: "%s | BuiltByAnas",
  description:
    "Anasse, ingénieur IT à Casablanca. Web engineering, cybersécurité, automatisation et IA appliquées à des produits numériques concrets.",
  locale: "fr_MA",
  lang: "fr",
  keywords: [
    "Anasse",
    "BuiltByAnas",
    "ingénieur IT Casablanca",
    "développeur web Casablanca",
    "développement web Maroc",
    "web engineering",
    "intelligence artificielle",
    "automatisation",
    "cybersécurité",
    "Virtual Try-On",
    "Joury Optic",
    "portfolio ingénieur informatique Casablanca",
  ],
};

/** Escape script-breaking characters in JSON-LD serialized into an HTML script. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
