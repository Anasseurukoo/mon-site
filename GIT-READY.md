# BuiltByAnas V2.6 — Pre-Git Checklist

This batch contains the requested Hero/intro flow, NOTE-card removal, LinkedIn removal, BBA AI integration, Loza Virtual Try-On ownership messaging, and SEO updates. Run `TEST-BEFORE-GIT.bat` before the first Git push.

# BuiltByAnas V2 — Digital Dojo — Handoff & Audit Notes

Claude audit → repair → local verification pass on `BuiltByAnas-V2-Logo-Petal-Polish-11.zip`.
The existing V2 direction (Next.js Digital Dojo, cinematic gate intro, gold/ivory/charcoal/vermilion
identity, falling petals) is preserved and repaired in place — nothing was rebuilt from zero.

## Base

- Data and wording aligned with the original `builtbyanas.com` identity (verified against the live
  site during this pass — GitHub handle correction and LinkedIn URL both confirmed accurate).
- V2 visual system: near-black/charcoal ground, warm ivory type, restrained metallic gold accent,
  warm red/vermilion petals. No violet/aqua anywhere in the codebase.
- Latest Gemini intro film included and working (see Verified below).
- Digital Dojo interior hero image included.
- Private project data (Airbnb, BBVA) handled with the confidentiality-first wording from the brief.

## What this pass changed

**Build reliability**
- `app/layout.tsx` loaded Geist, Geist Mono and Instrument Serif via `next/font/google`, which
  fetches from `fonts.googleapis.com` at build time. In any network-restricted environment this
  fails the production build outright. Self-hosted all three via `next/font/local`: the actual
  variable-font `.woff2` files now live in `public/fonts/` (sourced from the `@fontsource` packages,
  their license files are alongside them) and load with zero network dependency. `npm run build`
  no longer requires internet access.

**Lint errors (blocking, now fixed)**
- `components/motion/PetalDrift.tsx` used `as any` twice to set CSS custom properties. Replaced with
  a proper `PetalCSSProperties` interface extending `CSSProperties`.
- `components/common/IntroFilm.tsx` called `setState` synchronously inside a `useEffect`, which
  `eslint-config-next`'s `react-hooks/set-state-in-effect` rule flags. Fixing this the naive way
  (moving the sessionStorage/URL read into a `useState` lazy initializer, which runs during the
  client's first render) introduced a **real regression**: the server render and the client's first
  render now produced structurally different HTML — a hydration mismatch — which made the intro
  fail to reliably show at all on a genuinely fresh visit. The correct fix keeps the effect (this is
  a legitimate synchronization with two external systems, sessionStorage and the URL, that plainly
  do not exist during SSR) and carries a narrow, commented `eslint-disable` on the one line that
  needs it. Verified with Playwright across five scenarios: fresh visit, skip, same-session reload,
  `?intro=1` forced replay, and a brand-new browser context — no hydration errors, all five correct.

**Accessibility**
- `components/ai/StudioAssistant.tsx` (the on-site AI assistant) opened as a dialog but had no focus
  trap and no Escape-to-close — keyboard users could Tab straight out of it into the page behind.
  Wired it to the same `useFocusTrap` / `useScrollLock` hooks the mobile menu already uses, so it now
  traps Tab, closes on Escape, restores focus to the launcher, and locks body scroll while open.
- The floating "BBA AI" launcher (`fixed bottom-right`) rendered as a full text pill on all
  viewports. At 360–430px widths it visually overlapped the hero's primary "Démarrer un projet"
  button. It now collapses to an icon-only badge below the `sm` breakpoint, clearing the CTA at every
  tested width, and keeps the full label from tablet width up.
- `components/ui/ArrowLink.tsx`'s solid-variant CTA button pinned its focus ring color explicitly
  (`focus-visible:outline-gold`) rather than relying on inheritance, so the ring can't silently
  resolve to the button's own near-black text color under any future style change.

**Everything audited and found already correct** (no change needed): the confidentiality wording for
Airbnb/BBVA already matches the brief's required phrasing exactly, with no accusatory "cannot verify"
language anywhere; the petal effect is CSS-only, sparse, `pointer-events: none`, and disabled under
`prefers-reduced-motion`; JSON-LD Person structured data is present and sourced from real profile
data; `robots.ts`/`sitemap.ts` correctly disallow indexing only while `NEXT_PUBLIC_SITE_URL` points
at localhost and flip automatically on a real deploy; the contact form has full `aria-describedby`/
`aria-invalid`/live-region wiring; project cover images are already high-resolution
(1400–1600px, `quality={92}`) rather than upscaled crops; no dead `href="#"` links exist anywhere.

## Verification — run yourself with `npm run dev` / `npm run build`

```
npm install         →  0 vulnerabilities, clean
npm run typecheck    →  tsc --noEmit: no errors
npm run lint          →  eslint .: no errors, no warnings
npm run build           →  Turbopack production build: compiles, typechecks, prerenders all
                            15 routes (static + 5 project SSG pages) — no errors, no warnings
```

Additionally verified in this pass with a headless Chromium (Playwright), not just by reading code:
- Full-page renders at 360, 390, 430, 768, 1024, 1440 and 1920px — hero, project cards, Digital
  Dojo grid, journey timeline, about, AI Lab, contact all render correctly after scroll-triggered
  reveals fire; no clipped headings found.
- Keyboard Tab order across the homepage: every stop carries a visible focus ring (confirmed against
  computed `outline-color`, not just visual inspection).
- Mobile menu: opens, traps focus, all six routes reachable, contact/socials present.
- Intro film: fresh visit shows it, skip hides it, same-session reload doesn't replay it, `?intro=1`
  forces replay, zero hydration errors across all of the above.
- Production `next start`: all routes return 200, `robots.txt` correctly disallows in local mode.

## Known remaining items (left for a real decision, not a technical gap)

- `data/lab.ts`'s AI Lab entries are explicitly labeled `concept`/`placeholder` because their poster
  art doesn't correspond to a shipped product. That's intentional per the brief ("AI Lab concepts can
  be marked Concept... but keep the language factual and confident") — flagging here only so it isn't
  mistaken for unfinished work.
- The Open Graph social-card image (`/assets/backgrounds/dojo-1280.webp`) is marked in
  `app/layout.tsx` as a placeholder pending a real 1200×630 export. Cosmetic — the current image is
  real project art, just not cropped to the canonical OG ratio yet.
- `NEXT_PUBLIC_SITE_URL` must be set to the real production domain at deploy time — everything
  (canonical URLs, sitemap, robots indexing, OG URLs) is keyed off it and defaults safely to
  localhost/noindex until it is.

## Local test

```bash
npm install
npm run dev
```
or on Windows: double-click `START-BUILTBYANAS.bat`.

Test at minimum: Home (with and without `?intro=1`), Work index, Airbnb/BBVA/Loza project pages,
About, Digital Dojo, AI Lab, Contact — on both a phone-width viewport and desktop.

## Before Git push

```bash
npm run typecheck
npm run lint
npm run build
git status
```

## Suggested branch

```bash
git checkout -b v2-clean
git add .
git commit -m "fix: self-host fonts, resolve lint/hydration issues, a11y fixes for AI assistant"
git push -u origin v2-clean
```

Do not commit `.next`, `node_modules`, `.env*`, API keys, tokens, or client-private data — all
already covered by `.gitignore`. `AGENTS.md`/`CLAUDE.md` are Next.js 16 dev-server scaffolding that
regenerates on every `next dev` run and is also gitignored; if they reappear locally after running
`npm run dev`, that's expected and safe to leave untracked.
