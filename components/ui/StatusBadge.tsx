import type { LabStatus, ProjectStatus, Verification } from "@/types";
import { cn } from "@/lib/utils";

const PROJECT_LABELS: Record<ProjectStatus, string> = {
  live: "En ligne",
  "in-development": "En développement",
  "case-study": "Étude de cas",
  archived: "Archivé",
};

const LAB_LABELS: Record<LabStatus, string> = {
  concept: "Concept",
  prototype: "Prototype",
  "in-progress": "En cours",
  research: "Recherche",
};

/**
 * Status pill. Colour carries meaning here and is always paired with a word,
 * so it never becomes the only channel of information.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus | LabStatus;
  className?: string;
}) {
  const label =
    status in PROJECT_LABELS
      ? PROJECT_LABELS[status as ProjectStatus]
      : LAB_LABELS[status as LabStatus];

  const tone =
    status === "live"
      ? "border-gold/45 text-gold-soft"
      : status === "in-development" || status === "in-progress"
        ? "border-gold/35 text-gold-soft"
        : "border-line-strong text-steel";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border bg-black/30 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] backdrop-blur-sm",
        tone,
        className,
      )}
    >
      {(status === "live" || status === "in-development") && (
        <span
          className={cn(
            "block h-1.5 w-1.5 rounded-full",
            "bg-gold",
          )}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

/**
 * Shown wherever a claim cannot be checked against a public artefact. This is
 * a deliberate design element, not an apology: it is what makes the verifiable
 * projects on this site actually mean something.
 */
export function VerificationNote({
  verification,
  note,
  className,
}: {
  verification: Verification;
  note?: string;
  className?: string;
}) {
  if (verification === "repo" || verification === "live" || !note) return null;

  return (
    <p
      className={cn(
        "rounded-sm bg-charcoal/45 px-4 py-3 text-[0.8125rem] leading-6 text-steel",
        className,
      )}
    >
      <span className="mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold-soft">
        Note
      </span>
      <span>
        <span className="sr-only">Note de vérification : </span>
        {note}
      </span>
    </p>
  );
}
