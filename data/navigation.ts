import type { NavItem } from "@/types";

/**
 * The current site mixes English editorial labels with French prose. That
 * bilingual convention is kept: English section names, French descriptions.
 * There is no language selector because no translated copy exists to switch to.
 */
export const navigation: NavItem[] = [
  { label: "Work", labelFr: "Projets", href: "/work", kanji: "業" },
  { label: "About", labelFr: "À propos", href: "/about", kanji: "我" },
  { label: "Journey", labelFr: "Parcours", href: "/about#journey", kanji: "道" },
  { label: "Digital Dojo", labelFr: "Expertise", href: "/dojo", kanji: "場" },
  { label: "AI Lab", labelFr: "Laboratoire", href: "/lab", kanji: "研" },
  { label: "Services", labelFr: "Services & tarifs", href: "/services", kanji: "価" },
  { label: "Contact", labelFr: "Parlons-nous", href: "/contact", kanji: "縁" },
];

/**
 * Intentionally empty. The current site publishes no legal or privacy page,
 * so linking to one here would create a dead route. Add entries once the real
 * pages exist — the footer renders this list automatically.
 */
export const footerLegal: NavItem[] = [];
