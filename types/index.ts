/**
 * Shared content types.
 *
 * `verification` is deliberately part of the data model: this portfolio mixes
 * content that can be checked against a public repository with content that
 * only exists as prose on the current site. Keeping that distinction in the
 * type system stops unverified claims from quietly becoming "facts" in the UI.
 */
export type Verification =
  | "repo" // backed by a public GitHub repository
  | "live" // backed by a publicly reachable site
  | "site-only" // taken from builtbyanas.com prose, no public artefact
  | "placeholder"; // editable stand-in, clearly marked in the UI

export type ProjectStatus = "live" | "in-development" | "case-study" | "archived";

export type LabStatus = "concept" | "prototype" | "in-progress" | "research";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ProjectImage {
  src: string;
  /** Same image at a smaller width, used as the `sizes` fallback. */
  small?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  year: string;
  role: string;
  /** One-line summary used in indexes and cards. */
  summary: string;
  /** Long-form paragraphs used on the detail page. */
  body: string[];
  challenge?: string;
  approach?: string;
  result?: string;
  technologies: string[];
  status: ProjectStatus;
  verification: Verification;
  /** Shown in the UI when the claim cannot be checked against a public artefact. */
  verificationNote?: string;
  featured: boolean;
  cover: ProjectImage;
  gallery?: ProjectImage[];
  links: ProjectLink[];
}

export interface SkillGroup {
  id: string;
  index: string;
  title: string;
  kanji: string;
  kanjiRomaji: string;
  description: string;
  /** No proficiency percentages — evidence, not self-scored bars. */
  items: { name: string; note: string }[];
}

export interface TimelineEntry {
  id: string;
  phase: string;
  kanji: string;
  title: string;
  description: string;
  detail?: string;
  status: "past" | "current" | "next";
}

export interface LabEntry {
  id: string;
  title: string;
  status: LabStatus;
  summary: string;
  note: string;
  technologies: string[];
  verification: Verification;
  image?: ProjectImage;
  href?: string;
}

export interface NavItem {
  label: string;
  labelFr?: string;
  href: string;
  kanji?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}
