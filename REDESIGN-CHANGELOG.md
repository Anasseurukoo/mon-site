# BuiltByAnas V2.6 — Final Polish Batch

- Replaced the homepage Hero artwork with the new luxury Japanese Digital Dojo image supplied by the user.
- Moved the exact Japanese identity video previously used in the Hero into the cinematic ENTER intro, with SKIP support preserved.
- Removed all rendered verification/concept NOTE cards from project and Lab surfaces.
- Removed LinkedIn from the site's social/contact surfaces; direct contact is email-first.
- Preserved BBA AI, Loza Virtual Try-On ownership messaging, Gemini/Supabase backend integration, and the SEO work from V2.5.

---

# BuiltByAnas V2.5 — Authorship + Search SEO

- Made Anasse Anida's authorship explicit for the Loza Optique Virtual Try-On project.
- Added a public-facing BBA AI — Studio Assistant portfolio entry describing the real AI integration.
- Expanded natural search language around web engineering, AI/automation, cybersecurity, DevOps, Virtual Try-On and Casablanca/Morocco.
- Added page metadata keywords as supporting metadata while keeping the primary SEO work in visible, useful page content.

---

# BuiltByAnas V2.3 — BBA AI Local Endpoint Fix

- Fixed local development configuration so BBA AI no longer depends on `.env.production`.
- Added a safe public endpoint fallback for localhost; no API secret is exposed.
- Added `.env.local` containing only the non-secret Supabase function URL for local testing.

---

# BuiltByAnas V2.2 — Japanese Hero Video

- Removed the previously proposed slideshow hero.
- Integrated the exact user-provided Japanese identity video as the homepage hero background.
- Added a poster fallback image extracted from the same video.
- Preserved the existing BuiltByAnas overlay copy and CTA structure on top of the video hero.

---

# BuiltByAnas V2.1 — Hero Slideshow Test

- Replaced the static homepage hero with a cinematic slideshow inspired by the shared reference video.
- Added four rotating highlight slides: Studio, Loza Virtual Try-On, AI / Automation, and Systems / Reliability.
- Added manual previous/next controls and direct slide selection inside the hero.
- Preserved the existing BuiltByAnas identity, CTAs, navbar overlay feel, and lower signature band.

---

# BuiltByAnas V2 — Digital Dojo redesign pass

Full UI/UX, typography and responsive redesign, built on top of the Task 1
audit/repair pass (see `GIT-READY.md` for that history). Identity, content,
Japanese cinematic direction and all existing functionality preserved — this
was a redesign pass, not a rebuild.

## Hero

- Replaced the interior-shot background with the supplied illustrated
  portrait (`hero-anasse.webp`) — the person, handwritten scrapbook notes,
  the pagoda, Fuji and the sunset are shown intact, not cropped or covered.
- Rebuilt the layout as a two-zone split instead of text-over-image: a text
  column with its own dark ground, and the artwork shown at full visibility
  beside it (desktop) or above it (mobile/tablet, stacked). This was a
  deliberate change from a first attempt at overlaying the headline directly
  on the artwork, which either buried the subject's face under type at wide
  viewports or hid most of the illustration under `object-contain` cropping
  on mobile — neither held up under actual screenshot review.
- Headline uses a dedicated fluid clamp sized for the narrower column so it
  wraps to two balanced lines at every width instead of four to six.
- Capability badges and the role list were dropped from the hero in favour
  of the brief's "minimal text, 1–2 CTAs" direction; roles/capabilities
  remain discoverable on About and Digital Dojo.
- Added a top scrim over the artwork on desktop so the fixed, mostly
  transparent nav keeps legible contrast against bright sky.

## Typography system

- Extended `app/globals.css`'s existing fluid clamp scale (which already
  covered display/title/heading/lead/label) with the roles the brief called
  for: `--text-subheading`, `--text-eyebrow`, `--text-metadata`,
  `--text-button`, `--text-body`, each with matching Tailwind utility
  classes (`text-subheading`, `.eyebrow`, `.metadata`, …) generated
  automatically via Tailwind v4's `@theme` block.
- Tightened mobile minimums across `--text-display` and `--text-title` so no
  heading dominates a 375px viewport; desktop maxes are unchanged.
- Fixed a real clipping bug in `MaskText.tsx`: each word's reveal mask only
  compensated for descender clipping vertically, not horizontally — italic
  serif characters (the trailing "r" in "Builder", the question mark in
  "à résoudre ensemble ?") were being cut off by the mask's `overflow:
  hidden`. Added matching horizontal padding/margin compensation.
- `PageHeader`'s h1 now uses the `.title` role instead of `.display`, since
  `.display` is reserved for the homepage Hero headline per the new role
  split — inner-page titles are already less dominant as a result.

## Backgrounds — per-page identity

- About, Digital Dojo, AI Lab, Contact and Work index each now show their
  own supplied night-scene image (lakeside pavilion, torii gate, bonsai
  terrace, sakura petals, moonlit bridge) instead of one background reused
  everywhere.
- Found and fixed a real bug while verifying this: the images were wired
  correctly in code but rendered as solid black on every page. Root cause
  was a stray `-z-10` on the image wrapper inside `PageHeader.tsx`, which
  in this stacking context put the artwork below paint level. Removed the
  negative z-index (matching the already-working Hero pattern) and
  rebalanced the gradient scrim (was crushing the image to near-black by
  48% of the header's height; now holds legibility without hiding the art).
- Confirmed by screenshot, not just DOM inspection — the initial "fix"
  looked correct in computed styles while still rendering solid black,
  which is what surfaced the actual cause.

## Duplicate content fixes

- About, Digital Dojo, AI Lab and Contact routes were rendering their title
  and intro twice — once from `PageHeader`, once from the page's own
  section component reusing the same `SectionHeading`. Added a
  `showHeading` prop (default `true`, preserving homepage behaviour) to
  `AboutSection`, `DojoSection`, `LabSection` and `ContactSection`, and
  wired `PageHeader`'s new `headingId` prop so each section's
  `aria-labelledby` still resolves to a real element when its own visible
  heading is suppressed.
- `ContactSection`'s supporting line ("Disponible pour opportunités IT...")
  was duplicated with `PageHeader`'s intro on the dedicated `/contact`
  route specifically; now only renders when the section carries its own
  heading (i.e. everywhere except `/contact`).
- The Journey section's intro paragraph on the About page restated the
  About section's own closing paragraph almost verbatim. Rewritten to
  introduce the timeline instead of repeating the preceding paragraph.
- Along the way, found and fixed the same missing-`aria-labelledby`-target
  bug (an `id` never actually rendered anywhere) on the homepage's Work and
  Journey sections, which predates this pass.

## Contrast and legibility

- `PageHeader`'s label ("CONTACT — 縁", "AI LAB — 研究", …) now carries a
  text-shadow and a slightly dimmer but higher-contrast color so it stays
  readable against bright sky regions in the new artwork.
- `StatusBadge` and the project detail page's outline links previously had
  no background fill, so they could land on a bright part of a project
  photo with poor contrast. Added a translucent backdrop-blur scrim.

## Verification

```
npm install         →  0 vulnerabilities, clean (fresh install re-tested)
npm run typecheck    →  tsc --noEmit: no errors
npm run lint          →  eslint .: no errors, no warnings
npm run build           →  Turbopack production build: compiles, typechecks,
                            prerenders all 15 routes — no errors, no warnings
npm run start            →  all routes return 200, zero browser console errors
```

Additionally verified with headless Chromium screenshots, not just by
reading code:
- Every route at 375, 390, 430, 768, 1280, 1440 and 1920px — no horizontal
  overflow detected at any width, on any page.
- Hero, About, Digital Dojo, AI Lab, Contact and Work headers re-screenshot
  after each fix to confirm backgrounds render, duplication is gone, and
  text doesn't clip or overlap the artwork.
- Full-page scroll-through captures of the homepage and every inner route
  to check section-to-section consistency, not just the first viewport.
- Mobile menu opens, focus-traps, and lists all six routes correctly.

## Not changed

- Existing good animations (word-mask reveals, scroll-linked Journey spine,
  petal drift, `prefers-reduced-motion` gating) were left as-is — nothing
  here needed removing or simplifying.
- No new dependencies were added; the typography extension and Hero rework
  use the existing Tailwind v4 `@theme` token system and Framer Motion
  setup already in place.
- Project data, confidentiality wording and verification labelling
  (untouched from the Task 1 pass) — no metrics, clients or claims were
  invented.


## 1.9 — Full-bleed Hero + Navbar polish
- Hero artwork now fills the complete first viewport as a background.
- Added layered contrast gradients so the full image stays visible behind readable copy.
- Removed the split framed-image composition.
- Navbar reduced to a cleaner fixed height with compact brand mark and centered navigation.
- Refined top-state transparency, blur, CTA treatment, spacing and desktop navigation density.
