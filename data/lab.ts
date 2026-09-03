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
    note: "Objectif déclaré. Aucun code public à ce jour ; l’avancement sera visible dans les dépôts.",
    technologies: ["Python", "LLM tooling", "Open source"],
    verification: "site-only",
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    status: "concept",
    summary:
      "Une interface de chat assistée : conversations contextuelles, historique, rendu Markdown et code.",
    note: "Affiche de concept. L’interface visible est une maquette — aucun produit correspondant n’est déployé et aucun dépôt public ne lui est associé.",
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
    note: "Affiche de concept. Le travail système réel se trouve dans le dépôt alx-system_engineering-devops (Shell) ; les outils affichés sur l’affiche ne sont pas ceux du dépôt.",
    technologies: ["Docker", "GitHub Actions", "Linux"],
    verification: "placeholder",
    image: {
      src: "/assets/projects/devops.webp",
      small: "/assets/projects/devops-900.webp",
      alt: "Affiche de concept pour un pipeline DevOps",
      width: 1400,
      height: 933,
    },
    href: "https://github.com/Anasseurukoo/alx-system_engineering-devops",
  },
  {
    id: "binary-tool",
    title: "Binary — Converter & Calculator",
    status: "concept",
    summary:
      "Un outil web de conversion entre systèmes de numération, avec opérations bit à bit et historique.",
    note: "Affiche de concept. À ne pas confondre avec le dépôt binary_trees, qui porte sur les arbres binaires en C.",
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
