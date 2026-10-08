import type { SocialLink } from "@/types";

/**
 * Every field here is taken from builtbyanas.com or from a verified public
 * source. Nothing is invented. See FINAL-VALIDATION-REPORT.md for provenance.
 */
export const profile = {
  name: "Anasse",
  brand: "BuiltByAnas",
  concept: "Digital Dojo",
  kanji: "道", // "the way" — used as the brand mark on the current site
  /** Roles as stated on the current site's hero eyebrow. */
  roles: ["IT Engineer", "Web Engineering", "Cybersecurity", "Automation & AI"],
  /** Broader framing used across the brief and the site's own AI ambitions. */
  disciplines: ["IT Engineer", "Creative Developer", "AI Builder"],
  location: "Casablanca, Maroc",
  locationShort: "Casablanca",
  availability: "Disponible pour de nouveaux projets",
  website: "builtbyanas.com",

  headline: {
    lead: "Je transforme les problèmes",
    accent: "en systèmes qui fonctionnent.",
  },

  intro:
    "Je suis Anasse, ingénieur IT basé à Casablanca. Je construis des expériences web solides, j’automatise les tâches répétitives et j’aborde chaque incident comme un système à comprendre.",

  aboutTitle: {
    lead: "Ingénieur par métier.",
    accent: "Builder par nature.",
  },

  about: [
    "J’aime les systèmes qui ont du sens : une interface claire, un déploiement reproductible, une erreur qu’on peut tracer et une solution que quelqu’un peut réellement utiliser.",
    "Ma méthode est simple : comprendre avant de construire, tester avant d’affirmer, documenter avant de livrer. Le Digital Dojo représente cette discipline d’apprentissage continu.",
    "Mon parcours n’est pas une ligne droite. J’ai travaillé au cœur des opérations IT, géré des incidents et appris à rester lucide quand les systèmes ne répondent plus. Depuis 2017, je reconstruis mon parcours autour de la pratique et de projets visibles.",
  ],

  principles: [
    { index: "01", label: "Clarté avant complexité" },
    { index: "02", label: "Preuve avant promesse" },
    { index: "03", label: "Progrès avant perfection" },
  ],

  quote: "Chaque ligne de commande est un pas vers la liberté.",

  /** The self-describing snippet from the current site's hero console. */
  snippet: [
    { n: "01", code: "const engineer = {" },
    { n: "02", code: "  name: \"Anasse\"," },
    { n: "03", code: "  focus: [\"Web\", \"Cyber\"]," },
    { n: "04", code: "  mindset: \"rebuild\"," },
    { n: "05", code: "  shipping: true" },
    { n: "06", code: "};" },
  ],

  email: "Builtbyanass@gmail.com",
} as const;

/**
 * NOTE — the live site links to github.com/anasseurkoo, which returns 404.
 * The account that actually holds the portfolio and project repositories is
 * github.com/Anasseurukoo. The corrected handle is used here; the discrepancy
 * is documented in docs/CONTENT_INVENTORY.md.
 */
export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Anasseurukoo",
    handle: "@Anasseurukoo",
  },
];

export const githubUser = "Anasseurukoo";
