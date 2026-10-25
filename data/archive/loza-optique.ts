import type { Project } from "@/types";

/**
 * Recoverable source record only. This module is intentionally not imported by
 * the public application, so Loza Optique is not included in generated routes,
 * navigation, metadata, structured data, or client bundles.
 */
export const archivedLozaOptique: Project = {
  slug: "loza-optique",
  name: "Loza Optique",
  category: "Virtual Try-On, IA & Web Engineering",
  year: "2026",
  role: "Conception, architecture et développement complet par Anasse",
  summary:
    "Une expérience digitale premium pour un opticien de Casablanca, désormais enrichie d’un Virtual Try-On qui permet de découvrir et d’essayer les montures virtuellement avant la visite en magasin.",
  body: [
    "Loza Optique est un opticien indépendant de Casablanca. Le projet a évolué d’un site vitrine premium vers une expérience produit plus complète : identité visuelle, collections, services, prise de rendez-vous et essayage virtuel de montures. La conception et le développement de cette évolution ont été réalisés par Anasse.",
    "Le Virtual Try-On est aujourd’hui la fonctionnalité la plus différenciante du projet. L’objectif est simple : réduire la distance entre la découverte en ligne et l’essayage en magasin, sans imposer au commerçant un modèle d’abonnement mensuel pour cette brique technologique.",
    "Le même socle reste pensé comme un système cohérent : interface publique, composants réutilisables et évolutions produit partagent une direction visuelle et technique commune.",
  ],
  challenge:
    "Donner à un commerce indépendant une présence digitale capable de convertir avant même la visite en magasin, tout en gardant une expérience simple, premium et maîtrisable par le commerçant.",
  approach:
    "Construire le parcours autour des usages réels de l’opticien : découverte des collections, confiance, prise de contact et Virtual Try-On intégré comme fonctionnalité produit, avec une base Next.js et TypeScript maintenable.",
  result:
    "Le site est en ligne et le Virtual Try-On est devenu le point fort du projet. Le produit continue d’évoluer autour de l’essayage virtuel, du mobile et des outils de gestion.",
  technologies: ["Virtual Try-On", "Essayage virtuel", "Next.js", "TypeScript", "Tailwind CSS", "Responsive UI", "Mobile App"],
  status: "in-development",
  verification: "live",
  featured: true,
  cover: {
    src: "/assets/projects/v3/loza-cover.webp",
    small: "/assets/projects/v3/loza-cover.webp",
    alt: "Boutique Loza Optique présentée dans une ambiance premium sombre et chaleureuse",
    width: 1400,
    height: 875,
  },
  links: [
    { label: "Voir le site", href: "https://lozaoptique.com/", external: true },
    { label: "Parler du projet", href: "/contact" },
  ],
};
