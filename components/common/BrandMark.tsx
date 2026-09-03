import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
  href?: string;
}

/**
 * Permanent BuiltByAnas identity.
 * Uses the supplied Digital Dojo artwork with its dark background removed so
 * the mark belongs to the interface instead of looking like a pasted banner.
 */
export function BrandMark({ className, compact = false, href = "/" }: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center", className)}
      aria-label={`${profile.brand} — accueil`}
    >
      <span
        className={cn(
          "relative block shrink-0 transition-transform duration-500 group-hover:scale-[1.015]",
          compact
            ? "h-[3.65rem] w-[12.25rem]"
            : "h-[4.1rem] w-[14rem] sm:h-[4.65rem] sm:w-[15.8rem] xl:h-[4.9rem] xl:w-[16.7rem]",
        )}
      >
        <Image
          src="/assets/brand/builtbyanas-dojo-logo-transparent.png"
          alt="BuiltByAnas — Digital Dojo"
          fill
          priority
          sizes={compact ? "196px" : "268px"}
          quality={92}
          className="object-contain object-left drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
        />
      </span>
    </Link>
  );
}
