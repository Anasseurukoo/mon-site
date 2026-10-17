import type { Project } from "@/types";

/**
 * Single source of truth for project content.
 *
 * Provenance rules applied here:
 *  - Prose is based on builtbyanas.com, the supplied owner brief, and linked live sites.
 *  - `links` only point at URLs that were confirmed to resolve.
 *  - Anything the current site asserts but that has no public artefact is
 *    marked `verification: "site-only"` and carries a `verificationNote`.
 *  - No metrics, clients, revenue figures or outcomes have been invented.
 */
export const projects: Project[] = [
  {
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
  },

  {
    slug: "joury-optic",
    name: "Joury Optic — Try Lens & 3D Try Lunettes",
    category: "Virtual Try-On & Product Engineering",
    year: "2026",
    role: "Conception et ingénierie des expériences Try Lens et 3D Try Lunettes par BuiltByAnas",
    summary:
      "Deux expériences d’essayage virtuel conçues et développées sur mesure pour Joury Optic : lentilles de couleur en caméra temps réel et essayage interactif de lunettes en 3D.",
    body: [
      "Joury Optic réunit deux expériences produit complémentaires. Try Lens permet d’explorer des lentilles colorées en temps réel avec la caméra, tandis que 3D Try Lunettes met les montures en situation grâce au suivi du visage. Chaque parcours relie le choix d’un produit à une expérience d’essayage pensée pour le Web.",
      "Try Lens — Designed and engineered by BuiltByAnas.",
      "L’intégration Try Lens associe le suivi des yeux et de l’iris au rendu numérique des lentilles. Le travail porte sur le placement et le réglage visuel de la couleur, avec une attention portée aux détails naturels de la pupille et de l’iris, à la lisibilité des teintes Bella Color et à l’adaptation aux écrans mobiles. L’accès à la caméra commence par l’action de la personne et l’autorisation du navigateur; aucun détail d’architecture interne n’est publié ici.",
      "3D Try Lunettes — Designed and engineered by BuiltByAnas.",
      "L’expérience lunettes combine suivi du visage, interaction avec les produits et visualisation de modèles 3D existants. Le parcours a été conçu autour de la découverte et de l’essayage, avec capture souvenir et filigrane lorsque ces options sont proposées par le produit.",
      "Ces réalisations sont des implémentations produit sur mesure, et non des solutions d’essayage commerciales prêtes à l’emploi achetées puis simplement intégrées. Les bibliothèques génériques de caméra, de suivi et de rendu restent des briques distinctes du travail d’ingénierie produit.",
    ],
    challenge:
      "Faire passer une découverte optique en ligne vers un essayage compréhensible, interactif et utilisable sur mobile, sans perdre le lien entre les teintes ou les montures et le catalogue Joury Optic.",
    approach:
      "Concevoir séparément les parcours Try Lens et 3D Try Lunettes, puis intégrer leurs interactions caméra, le suivi adapté à chaque usage, le rendu visuel et les points de contact avec les collections. Les détails propriétaires d’implémentation ne sont pas publiés.",
    result:
      "Deux expériences d’essayage virtuel sont accessibles depuis le site Joury Optic : Try Lens pour les lentilles de couleur et 3D Try Lunettes pour les montures.",
    technologies: [
      "Camera-based interaction",
      "Eye & iris tracking",
      "Face tracking",
      "3D product experience",
      "Virtual Try-On",
      "Bella Color catalogue",
      "Responsive UX",
    ],
    status: "live",
    verification: "live",
    verificationNote:
      "Le site public permet de vérifier les parcours et l’accès aux expériences. Les captures autonomes des interfaces Try Lens et 3D Try Lunettes ne sont pas publiées dans les pages consultées; le visuel ci-dessous est une image de marque officielle, pas une capture de l’interface.",
    featured: true,
    cover: {
      src: "/assets/projects/joury-optic/joury-hero.webp",
      small: "/assets/projects/joury-optic/joury-hero.webp",
      alt: "Image de marque officielle Joury Optic, montrant une monture et le regard d’une cliente",
      width: 1664,
      height: 692,
    },
    links: [
      { label: "Site Joury Optic", href: "https://jouryoptic.com/", external: true },
      { label: "Try Lens", href: "https://jouryoptic.com/try-lens/", external: true },
      { label: "3D Try Lunettes", href: "https://jouryoptic.com/essayage/", external: true },
    ],
  },

  {
    slug: "bba-ai-studio-assistant",
    name: "BBA AI — Studio Assistant",
    category: "AI & Automation",
    year: "2026",
    role: "Conception, prompt design et développement par BuiltByAnas",
    summary:
      "Assistant IA intégré à BuiltByAnas pour transformer une idée en brief, répondre aux questions sur les projets et guider un visiteur vers la prochaine étape.",
    body: [
      "BBA AI est l’assistant conversationnel de BuiltByAnas. Il utilise un modèle génératif via un backend serverless afin de garder la clé du fournisseur hors du navigateur.",
      "Le comportement est cadré par un contexte dédié au studio : développement web, IA et automatisation, cybersécurité, DevOps et le projet Loza Optique avec Virtual Try-On.",
      "L’objectif n’est pas de simuler un chatbot générique, mais de proposer une première interface de qualification capable de comprendre le besoin d’un prospect et de l’orienter vers un projet concret.",
    ],
    challenge:
      "Donner au portfolio un assistant réellement conversationnel sans exposer la clé API au frontend ni transformer l’interface en simple démonstration technique.",
    approach:
      "Interface Next.js, historique de conversation court, fonction Supabase Edge côté serveur et API Gemini avec contexte cadré et gestion des erreurs.",
    result:
      "BBA AI est conçu et développé par BuiltByAnas. L’interface de chat, la reconnaissance des demandes de prix, la brochure jointe et l’intégration à la fonction Supabase Edge forment un assistant sur mesure, et non un chatbot commercial acheté.",
    technologies: ["Gemini API", "Supabase Edge Functions", "Next.js", "TypeScript", "AI", "Prompt Engineering"],
    status: "live",
    verification: "site-only",
    verificationNote:
      "L’assistant est intégré au site. Les détails de l’implémentation serveur et les clés fournisseur restent privés.",
    featured: true,
    cover: {
      src: "/assets/projects/v3/ai-assistant-cover.webp",
      small: "/assets/projects/v3/ai-assistant-cover.webp",
      alt: "Assistant IA intégré à un studio de développement numérique",
      width: 1400,
      height: 875,
    },
    links: [{ label: "Parler du projet", href: "/contact" }],
  },

  {
    slug: "airbnb-product-engineering",
    name: "Airbnb — Product Engineering",
    category: "Product Engineering",
    year: "V2–V3",
    role: "Product Engineer (freelance)",
    summary:
      "Mission freelance menée avec une équipe d’ingénieurs autour de l’expérience utilisateur, des parcours de réservation et d’évolutions produit sur les phases V2 et V3.",
    body: [
      "Intervention en tant qu’ingénieur freelance sur différentes évolutions de la plateforme, avec une contribution aux phases V2 et V3 du projet.",
      "Travail en collaboration avec une équipe d’ingénieurs sur l’amélioration de l’expérience utilisateur, l’optimisation des parcours de réservation et l’intégration de fonctionnalités.",
    ],
    challenge:
      "Rendre lisible une offre très dense et réduire la friction dans un parcours de réservation à plusieurs étapes.",
    approach:
      "Travail sur la découverte produit, la continuité desktop/mobile et la clarté des informations de confiance dans le parcours.",
    result:
      "Contribution à l’expérience produit et aux parcours de réservation sur les phases V2 et V3.",
    technologies: ["Product UX", "Parcours utilisateur", "Responsive", "Collaboration"],
    status: "case-study",
    verification: "site-only",
    verificationNote:
      "CONFIDENTIALITÉ — Cette mission a été réalisée comme membre d’une équipe d’ingénieurs. Ma contribution s’inscrivait dans un travail collectif et ne constitue pas un accomplissement individuel. Par principe professionnel, les données, dépôts, documents et éléments internes des projets auxquels je contribue restent confidentiels.",
    featured: true,
    cover: {
      src: "/assets/projects/v3/airbnb-cover.webp",
      small: "/assets/projects/v3/airbnb-cover.webp",
      alt: "Interface Airbnb présentée dans un intérieur contemporain premium",
      width: 1400,
      height: 875,
    },
    gallery: [
      {
        src: "/assets/projects/airbnb/desktop-mobile.webp",
        alt: "Interface affichée sur ordinateur portable et smartphone",
        width: 1200,
        height: 800,
      },
      {
        src: "/assets/projects/airbnb/categories.webp",
        alt: "Trois écrans mobiles présentant la navigation par catégories",
        width: 1200,
        height: 800,
      },
      {
        src: "/assets/projects/airbnb/split-destination.webp",
        alt: "Écran mobile — un voyage réparti sur deux séjours",
        width: 800,
        height: 1000,
      },
      {
        src: "/assets/projects/airbnb/map.webp",
        alt: "Carte interactive avec deux étapes de séjour",
        width: 800,
        height: 1000,
      },
      {
        src: "/assets/projects/airbnb/aircover.webp",
        alt: "Écran de présentation des garanties voyageur",
        width: 1200,
        height: 800,
      },
    ],
    links: [{ label: "Parler du projet", href: "/contact" }],
  },

  {
    slug: "bbva-cybersecurity",
    name: "BBVA Cybersecurity",
    category: "Automation & Security",
    year: "Case study",
    role: "Automatisation & fiabilité",
    summary:
      "Automatisation de traitements techniques avec gestion de fichiers, logs, contrôles et reporting dans un environnement Linux.",
    body: [
      "Automatisation de traitements techniques récurrents : gestion de fichiers, collecte de logs, contrôles de cohérence et reporting.",
      "L’enjeu principal est la traçabilité : un traitement automatisé n’a de valeur que si l’on peut prouver ce qu’il a fait, quand, et sur quelles données.",
    ],
    challenge:
      "Remplacer des manipulations manuelles répétitives par des traitements reproductibles, sans perdre la trace de ce qui s’exécute.",
    approach:
      "Scripts Python et Bash sur Linux, journalisation systématique et contrôles explicites à chaque étape.",
    result: "Fiabilité, traçabilité et sécurité des traitements.",
    technologies: ["Python", "Bash", "Linux", "Logs"],
    status: "case-study",
    verification: "site-only",
    verificationNote:
      "CONFIDENTIALITÉ — Les détails internes, données, dépôts et documents de cette expérience ne sont pas publiés. Je présente uniquement le périmètre général, les outils et les compétences mobilisées, sans exposer les données du projet.",
    featured: true,
    cover: {
      src: "/assets/projects/v3/bbva-cover.webp",
      small: "/assets/projects/v3/bbva-cover.webp",
      alt: "Siège BBVA avec représentation visuelle de la cybersécurité",
      width: 1400,
      height: 875,
    },
    links: [
      { label: "Voir le profil GitHub", href: "https://github.com/Anasseurukoo", external: true },
    ],
  },

  {
    slug: "digital-dojo-portfolio",
    name: "Digital Dojo — Portfolio",
    category: "Web Engineering",
    year: "2026",
    role: "Design et développement",
    summary:
      "BuiltByAnas — Digital Dojo : le portfolio et laboratoire créatif du studio, aujourd’hui reconstruit en Next.js tout en conservant l’identité et les données du site original.",
    body: [
      "Le site original BuiltByAnas a servi de base éditoriale et identitaire. Cette V2 conserve ses données essentielles et fait évoluer l’interface vers une architecture Next.js plus structurée et maintenable.",
      "C’est le projet le plus simple techniquement du lot, et c’est volontaire : il sert de terrain d’essai pour la typographie, le rythme et le motion design avant de les appliquer ailleurs.",
    ],
    challenge: "Tenir un niveau de finition élevé sans dépendances ni outillage.",
    approach:
      "Next.js, TypeScript, composants structurés, intro cinématique, motion respectueux de prefers-reduced-motion et design system centralisé.",
    result: "Une base V2 prête pour le test local, le versioning Git et le déploiement progressif sur builtbyanas.com.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Git"],
    status: "live",
    verification: "live",
    featured: false,
    cover: {
      src: "/assets/projects/v3/ui-kit-cover.webp",
      small: "/assets/projects/v3/ui-kit-cover.webp",
      alt: "Interface UI sombre et premium représentant le travail de design du Digital Dojo",
      width: 1400,
      height: 875,
    },
    links: [
      { label: "Voir le site", href: "https://builtbyanas.com", external: true },
    ],
  },

  {
    slug: "systems-foundations",
    name: "Systems Foundations",
    category: "Low-level & Systems",
    year: "2023 — 2024",
    role: "Software engineering — cursus ALX",
    summary:
      "Une série de projets bas niveau en C, Python et Shell : allocation mémoire, shell Unix, structures de données, algorithmes de tri et administration système.",
    body: [
      "Avant les interfaces, les fondations. Cette série de travaux de formation couvre le C, les structures de données, les algorithmes et l’administration système Linux.",
      "Réimplémenter des fonctions de bibliothèque, écrire un shell Unix, manipuler des arbres binaires ou une machine à pile force à comprendre ce qui se passe réellement sous les abstractions — la mémoire, les pointeurs, les processus, les descripteurs de fichiers.",
      "C’est cette base qui rend le débogage d’un système en production possible : quand une abstraction fuit, il faut savoir lire ce qu’il y a en dessous.",
    ],
    challenge:
      "Construire une compréhension réelle du fonctionnement des systèmes plutôt qu’une familiarité de surface avec des frameworks.",
    approach:
      "Implémentation à partir de zéro, en C et en Shell, avec des contraintes strictes : pas de bibliothèque, gestion manuelle de la mémoire, respect des spécifications.",
    result: "Une base de travail en C, Python, Shell et Linux, centrée sur les concepts fondamentaux des systèmes.",
    technologies: ["C", "Python", "Shell", "Linux", "Git", "Data structures", "Algorithms"],
    status: "archived",
    verification: "site-only",
    featured: false,
    cover: {
      src: "/assets/projects/v3/devops-cover.webp",
      small: "/assets/projects/v3/devops-cover.webp",
      alt: "Visuel d’ambiance représentant les fondations systèmes",
      width: 1400,
      height: 875,
    },
    links: [{ label: "Parler de ce parcours", href: "/contact/" }],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
}
