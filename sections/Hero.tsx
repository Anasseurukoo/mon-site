"use client";

import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PetalDrift } from "@/components/motion/PetalDrift";

/**
 * Homepage hero using the exact Japanese-identity video provided by the user
 * as the full-bleed hero background.
 */
export function Hero() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      className="relative flex min-h-[100svh] overflow-hidden border-b border-line bg-sumi pt-[5.25rem] sm:pt-[5.5rem]"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/assets/backgrounds/custom/hero-final-japanese-dojo.webp"
          alt=""
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,6,0.95)_0%,rgba(7,5,6,0.83)_23%,rgba(7,5,6,0.46)_47%,rgba(7,5,6,0.12)_74%,rgba(7,5,6,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,6,0.17)_0%,rgba(7,5,6,0.03)_35%,rgba(7,5,6,0.14)_68%,rgba(7,5,6,0.74)_100%)]" />
        <div className="absolute inset-y-0 right-[8%] hidden w-px bg-gradient-to-b from-transparent via-white/16 to-transparent lg:block" />
        <div className="grain absolute inset-0 opacity-[0.11]" />
      </div>

      <PetalDrift />

      <div className="shell relative z-10 flex min-h-[calc(100svh-5.25rem)] w-full items-center py-10 sm:min-h-[calc(100svh-5.5rem)] sm:py-12 lg:py-14">
        <div className="flex w-full flex-col gap-10">
          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="flex w-full max-w-[40rem] flex-col gap-8 lg:max-w-[43rem]">
              <div>
                <div
                  className="anim-fade-up mb-5 flex flex-wrap items-center gap-3"
                  style={{ animationDelay: "0.03s" }}
                >
                  <span className="inline-flex items-center gap-2.5 border border-gold/40 bg-black/35 px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.22)] backdrop-blur-md">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                    </span>
                    <span className="label text-ivory-dim">{profile.availability}</span>
                  </span>

                  <span className="inline-flex items-center gap-2 border border-white/12 bg-black/20 px-3 py-2 backdrop-blur-md">
                    <span className="font-display text-base leading-none text-gold-soft">道</span>
                    <span className="label text-ivory-dim">Japanese identity / cinematic hero</span>
                  </span>
                </div>

                <h1
                  id="hero-heading"
                  className="text-ivory drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.7rem, 5vw + .3rem, 5.6rem)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.025em",
                  }}
                >
                  <span className="block overflow-hidden pb-[0.1em] pr-[0.08em] -mr-[0.08em]">
                    <span className="anim-rise block" style={{ animationDelay: "0.04s" }}>
                      {profile.headline.lead}
                    </span>
                  </span>
                  <span className="block overflow-hidden pb-[0.13em] pr-[0.08em] -mr-[0.08em]">
                    <span
                      className="anim-rise block italic text-gold-soft"
                      style={{ animationDelay: "0.14s" }}
                    >
                      {profile.headline.accent}
                    </span>
                  </span>
                </h1>

                <p
                  className="anim-fade-up mt-6 max-w-[35rem] text-lead leading-relaxed text-ivory-dim drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
                  style={{ animationDelay: "0.3s" }}
                >
                  {profile.intro}
                </p>

                <div
                  className="anim-fade-up mt-8 flex flex-wrap items-center gap-3"
                  style={{ animationDelay: "0.39s" }}
                >
                  <ArrowLink href="/contact" variant="solid">
                    Parlons de votre projet
                  </ArrowLink>
                  <ArrowLink href="/work" variant="outline">
                    Voir mes réalisations
                  </ArrowLink>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-5 border-t border-white/14 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
                <Image
                  src="/assets/brand/builtbyanas-dojo-emblem.png"
                  alt=""
                  fill
                  quality={94}
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-lg leading-none text-ivory sm:text-xl">
                  BuiltByAnas
                </p>
                <p className="label mt-1 text-ivory-dim/70">Digital Dojo / Enter. Build. Evolve.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className="label text-ivory-dim/70">Focus</span>
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="border border-white/10 bg-black/15 px-3 py-2 text-xs uppercase tracking-[0.22em] text-ivory-dim/80"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
