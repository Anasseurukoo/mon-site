import type { LabEntry } from "@/types";

/**
 * AI Lab — work in progress, held to a strict rule.
 *
 * Nothing in this section is presented as shipped. Four of these entries exist
 * only as design posters that were found in the current site's image folder;
 * the interfaces shown in those posters are mockups, and the feature lists and
 * metrics printed on them are not backed by any repository. They are labelled
 * `concept` and the UI states this explicitly rather than hiding it.
 */
export const labEntries: LabEntry[] = [
  {
    id: "open-source-agent",
    title: "Open-source AI Agent",
    status: "research",
    summary:
      "Concevoir un agent utile, documenté et publiquement vérifiable — l’objectif « NEXT » déclaré sur builtbyanas.com.",
    note: "Objectif déclaré. Aucun produit public associé à ce projet à ce jour.",
    technologies: ["Python", "LLM tooling", "Open source"],
    verification: "site-only",
  },
  {
    id: "ai-assistant",
    title: "Conversational UI — concept",
    status: "concept",
    summary:
      "Une étude visuelle de parcours conversationnels : contexte, historique, rendu Markdown et code.",
    note: "Affiche de concept sans produit associé. BBA AI est un assistant distinct, conçu et développé par BuiltByAnas, et intégré au portfolio.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    verification: "placeholder",
    image: {
      src: "/assets/projects/ai-assistant.webp",
      small: "/assets/projects/ai-assistant-800.webp",
      alt: "Affiche de concept pour une application d’assistant conversationnel",
      width: 1200,
      height: 1200,
    },
  },
  {
    id: "devops-pipeline",
    title: "DevOps Pipeline",
    status: "concept",
    summary:
      "Une chaîne build → test → conteneurisation → déploiement → supervision, pensée comme un seul flux.",
    note: "Affiche de concept. Les outils et étapes affichés illustrent une piste de travail, pas un dépôt ou un produit livré.",
    technologies: ["Docker", "GitHub Actions", "Linux"],
    verification: "placeholder",
    image: {
      src: "/assets/projects/devops.webp",
      small: "/assets/projects/devops-900.webp",
      alt: "Affiche de concept pour un pipeline DevOps",
      width: 1400,
      height: 933,
    },
  },
  {
    id: "binary-tool",
    title: "Binary — Converter & Calculator",
    status: "concept",
    summary:
      "Un outil web de conversion entre systèmes de numération, avec opérations bit à bit et historique.",
    note: "Affiche de concept. Elle ne représente pas un outil livré ni un dépôt de code.",
    technologies: ["HTML", "CSS", "JavaScript"],
    verification: "placeholder",
    image: {
      src: "/assets/projects/binary.webp",
      small: "/assets/projects/binary-800.webp",
      alt: "Affiche de concept pour un convertisseur binaire",
      width: 1200,
      height: 1200,
    },
  },
  {
    id: "ui-kit",
    title: "UI Kit — Design System",
    status: "concept",
    summary:
      "Un système de composants cohérent : typographie, couleurs, états, grille et thèmes clair/sombre.",
    note: "Affiche de concept. Aucun paquet ni dépôt public ne correspond à ce système à ce jour.",
    technologies: ["Design system", "Components", "Tokens"],
    verification: "placeholder",
    image: {
      src: "/assets/projects/ui-kit.webp",
      small: "/assets/projects/ui-kit-800.webp",
      alt: "Affiche de concept pour un système de design",
      width: 1200,
      height: 1200,
    },
  },
];

export const labStatusLabels: Record<LabEntry["status"], string> = {
  concept: "Concept",
  prototype: "Prototype",
  "in-progress": "En cours",
  research: "Recherche",
};
