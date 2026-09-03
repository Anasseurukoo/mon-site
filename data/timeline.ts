import type { TimelineEntry } from "@/types";

/**
 * The four phases named on builtbyanas.com, with the kanji the current site
 * already pairs with each one. No dates have been added beyond the one the
 * site states itself (2017, the point of return described in the About text).
 */
export const timeline: TimelineEntry[] = [
  {
    id: "foundation",
    phase: "FOUNDATION",
    kanji: "経験",
    title: "IT Operations",
    description:
      "Support, incidents, résolution de problèmes et responsabilité opérationnelle.",
    detail:
      "Le terrain : rester lucide quand les systèmes ne répondent plus, et comprendre qu’un incident est un système à lire, pas une fatalité.",
    status: "past",
  },
  {
    id: "rebuild",
    phase: "REBUILD",
    kanji: "再建",
    title: "Retour structuré vers l’IT",
    description: "Linux, Git, Docker, Python, web development et pratique quotidienne.",
    detail:
      "Depuis 2017, une reconstruction méthodique autour de la pratique : le C et les systèmes d’abord, puis le web. Dix dépôts publics documentent cette période.",
    status: "past",
  },
  {
    id: "ship",
    phase: "SHIP",
    kanji: "実行",
    title: "Projets réels",
    description:
      "Airbnb, BBVA Cybersecurity et Loza Optique — jusqu’au Virtual Try-On livré sur un projet réel.",
    detail:
      "Le passage de l’exercice au livrable : un client réel, des contraintes réelles, puis une fonctionnalité produit différenciante avec le Virtual Try-On de Loza Optique.",
    status: "current",
  },
  {
    id: "next",
    phase: "NEXT",
    kanji: "未来",
    title: "Open-source AI Agent",
    description: "Objectif : concevoir un agent utile, documenté et publiquement vérifiable.",
    detail:
      "Objectif déclaré, pas encore commencé publiquement. Il sera construit en public, avec le même critère que le reste : vérifiable ou non revendiqué.",
    status: "next",
  },
];
