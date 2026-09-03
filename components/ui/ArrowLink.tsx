import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: "text" | "solid" | "outline";
  className?: string;
}

/**
 * The site's only link affordance. The arrow slides on hover *and* on focus,
 * so keyboard users get the same feedback pointer users do.
 */
export function ArrowLink({
  href,
  children,
  external = false,
  variant = "text",
  className,
}: ArrowLinkProps) {
  const base =
    "group inline-flex items-center gap-2.5 transition-colors duration-300 focus-visible:outline-2";

  const styles = {
    // `py-1.5` takes the hit area to 32px tall. These are standalone calls to
    // action, not links inside a sentence, so WCAG 2.2 SC 2.5.8's inline
    // exception does not apply and they need to clear 24×24.
    text: "py-1.5 text-sm text-ivory-dim hover:text-gold-soft",
    // `focus-visible:outline-[color]` pins the ring to gold explicitly: the
    // global `:focus-visible` rule sets outline-color too, but this element's
    // own `text-sumi` was winning the cascade on outline-color (which
    // defaults to currentColor), making the ring nearly invisible against the
    // gold fill it was meant to outline.
    solid:
      "border border-gold bg-gold px-6 py-3.5 text-sm font-medium text-sumi hover:bg-gold-soft hover:border-gold-soft focus-visible:outline-gold",
    outline:
      "border border-line-strong px-6 py-3.5 text-sm text-ivory-dim hover:border-gold hover:text-ivory",
  }[variant];

  const arrow = (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
        external
          ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5"
          : "group-hover:translate-x-1 group-focus-visible:translate-x-1",
        variant === "solid" ? "text-sumi" : "text-gold",
      )}
    >
      {external ? "↗" : "→"}
    </span>
  );

  const content = (
    <>
      <span>{children}</span>
      {arrow}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(base, styles, className)}
      >
        {content}
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, styles, className)}>
      {content}
    </Link>
  );
}
