import type { SkillGroup } from "@/types";

/**
 * The Digital Dojo.
 *
 * Deliberately no percentage bars. Each entry carries a short factual note
 * about where the skill was actually applied, which is verifiable, rather
 * than a self-assigned score, which is not.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "systems",
    index: "01",
    title: "IT & Systems",
    kanji: "基",
    kanjiRomaji: "KI — la base",
    description:
      "Diagnostic, résolution d’incidents, environnements Windows/Linux et approche structurée des problèmes complexes.",
    items: [
      { name: "Linux", note: "Administration système, scripts shell, cursus DevOps" },
      { name: "Windows", note: "Support et résolution d’incidents en environnement mixte" },
      { name: "Networking", note: "Diagnostic réseau et analyse de connectivité" },
      { name: "Troubleshooting", note: "Méthode d’isolation : reproduire, isoler, corriger" },
    ],
  },
  {
    id: "web",
    index: "02",
    title: "Web Engineering",
    kanji: "構",
    kanjiRomaji: "KŌ — construire",
    description:
      "Interfaces modernes, responsive design, architecture front-end et intégration de fonctionnalités utiles.",
    items: [
      { name: "Next.js", note: "Joury Optic — Try Lens, 3D Try Lunettes et surfaces produit" },
      { name: "Virtual Try-On", note: "Joury Optic — essayage virtuel intégré au parcours web" },
      { name: "TypeScript", note: "Langage principal des projets web BuiltByAnas" },
      { name: "React", note: "Interfaces du portfolio et des projets Next.js" },
      { name: "Tailwind CSS", note: "Système de design partagé entre les surfaces du projet" },
      { name: "HTML / CSS / JS", note: "builtbyanas.com, écrit sans framework" },
    ],
  },
  {
    id: "automation",
    index: "03",
    title: "Automation & DevOps",
    kanji: "流",
    kanjiRomaji: "RYŪ — le flux",
    description:
      "Scripts, conteneurs et workflows reproductibles pour réduire les tâches manuelles et fiabiliser la livraison.",
    items: [
      { name: "Python", note: "Traitements de fichiers, contrôles et reporting" },
      { name: "Bash", note: "Automatisation de tâches système récurrentes" },
      { name: "Docker", note: "Environnements reproductibles" },
      { name: "Git & GitHub", note: "Versionnement et collaboration sur des projets techniques" },
    ],
  },
  {
    id: "security",
    index: "04",
    title: "Cybersecurity",
    kanji: "盾",
    kanjiRomaji: "TATE — le bouclier",
    description:
      "Pratiques de sécurité, contrôle, logs et traçabilité intégrés dès la conception des systèmes.",
    items: [
      { name: "Hardening", note: "Réduction de surface d’exposition sur systèmes Linux" },
      { name: "Logs & traçabilité", note: "Journalisation systématique des traitements" },
      { name: "Monitoring", note: "Contrôles de cohérence et alertes" },
      { name: "Cryptographie appliquée", note: "RSA Factoring Challenge — dépôt public" },
    ],
  },
  {
    id: "foundations",
    index: "05",
    title: "Low-level Foundations",
    kanji: "根",
    kanjiRomaji: "NE — les racines",
    description:
      "Le socle : mémoire, pointeurs, processus et structures de données, écrits à la main en C.",
    items: [
      { name: "C", note: "Fonctions standard et outils Unix réimplémentés depuis zéro" },
      { name: "Structures de données", note: "Arbres binaires, piles, files" },
      { name: "Algorithmes", note: "Algorithmes de tri et analyse de complexité" },
      { name: "Systèmes Unix", note: "Processus, descripteurs de fichiers, signaux" },
    ],
  },
  {
    id: "ai",
    index: "06",
    title: "AI & Product",
    kanji: "知",
    kanjiRomaji: "CHI — la connaissance",
    description:
      "Un axe en construction : outils assistés par IA dans le workflow, et un agent open-source comme objectif déclaré.",
    items: [
      { name: "AI-assisted workflow", note: "Outils IA intégrés au développement quotidien" },
      { name: "Agent open-source", note: "Objectif annoncé — documenté et vérifiable" },
      { name: "Product awareness", note: "Parcours utilisateur et lisibilité de l’offre" },
      { name: "UI systems", note: "Composants partagés entre plusieurs surfaces" },
      { name: "Supabase", note: "BBA AI — intégration Edge Function" },
    ],
  },
];

/** Curated, verified skills for the homepage's visual technology ticker. */
export const tickerSkills = [
  "Docker",
  "Git & GitHub",
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Virtual Try-On",
  "Cybersecurity",
  "Linux",
  "Python",
  "Bash",
  "Automation",
  "Supabase",
] as const;
