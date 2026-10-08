# BuiltByAnas V2 change log

## Architecture

- Kept the Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, static GitHub Pages export, and the existing Supabase Edge Function boundary.
- Added generated `robots.txt` and `sitemap.xml` routes from the actual App Router paths and project data; removed stale static sitemap entries.
- Added project-level CreativeWork structured data and per-project Open Graph/Twitter metadata.
- Made the production domain the canonical default while retaining environment overrides for previews.

## Design and content

- Reinterpreted the visual system as an engineering folio: blue-black and petrol surfaces, mineral text, and a restrained ember accent. Original photography, Japanese details, typography direction, and cinematic hero assets remain.
- Replaced the previous continuously moving tech ticker with a static product lifecycle sequence, reducing motion and improving the explanation of the engineering approach.
- Expanded the role focus to match the source’s web engineering, cybersecurity, automation, and AI work.
- Replaced the conflicting GitHub repository counts with timeless copy and corrected the AI provider description to match the OpenAI API called by the function.
- Changed the BBVA GitHub link label to accurately identify the destination as a profile.

## SEO, accessibility, and performance

- Removed duplicate hidden phrase copies from animated heading markup while preserving the visible word reveal and semantic h1/h2 elements.
- Added keyboard-focus persistence for the adaptive header and dialog semantics/focus trapping for the cinematic intro.
- Improved BBA AI input labeling, loading/error announcements, retry behavior, reduced-motion transitions, and touch target sizes.
- Kept hero imagery local and compressed, self-hosted fonts, static pages, lazy/reveal image patterns, and reduced-motion support. No new frontend dependency was introduced for the design or AI work.

## BBA AI and security

- Added an explicit public-function JWT policy for the anonymous portfolio flow, strict input/body limits, provider timeout, safe errors, and a fail-closed Upstash Redis per-IP rate limit.
- Added `.env.example`, `BBA-AI-RECOVERY.md`, and `SECURITY-AUDIT.md`. The OpenAI and Upstash values are documented as Supabase secrets; no credential values are included.
- The owner now reports the live Supabase project is Healthy and BBA AI responds on production; the earlier pause remains a historical cause of an earlier outage. No live project settings or function versions were changed.
- The existing GitHub Actions workflow deploys on `main` pushes or manual dispatch; the V2 package was not pushed or deployed.

## Pricing, conversation, and supplied artwork follow-up

- Added the owner-approved 2026 price list as a single typed catalogue shared by the Services page and the assistant’s deterministic local pricing flow.
- Added French, English, Moroccan Darija Latin transliteration, and Arabic-script intent/service matching; pricing follow-ups work in an active pricing context without making project-interest statements trigger unsolicited quotes.
- Added the supplied original Services & Tarifs brochure unchanged to the conversation, with full-size view, download, Services page, and quote CTA. Pricing answers remain available if the AI endpoint fails.
- Added a Services & Tarifs page and included it in site navigation and the generated sitemap.
- Added safe rendering for paragraphs, bold/italic text, lists, and validated links without rendering model output as HTML.
- Kept the supplied Digital Dojo portrait illustration in local assets for the About section.
- Updated local Edge Function instructions for consistent reply language and approved price information. Production function changes are not required for the deterministic UI pricing path and remain separately pending approval.

## Dependencies and validation

- Patched the critical Next.js advisory and vulnerable `sharp`, `source-map-js`, and `brace-expansion` transitive packages with compatible updates. The final package pins Next.js and its ESLint config at 16.4.0 after an updated audit revealed additional advisories affecting 16.3.6.
- Kept the Next 16 ESLint toolchain instead of applying npm’s incompatible major-version downgrade. One unpatched high advisory remains in the development-only `braces` glob dependency chain.
- Validation results and environment limitations are reported separately at delivery time.

## Corrective release

- Added Joury Optic as a featured case study with a static `/work/joury-optic/` route, brand artwork sourced from its official public website, and direct links to the live Try Lens and 3D Try Lunettes experiences. The image is brand artwork; dedicated product screenshots were not present in the public pages checked.
- Corrected the public display name to Anasse and the public contact email to the owner-approved address across profile-driven copy and metadata.
- Clarified that BBA AI was designed and developed by BuiltByAnas, including the assistant panel, portfolio entry, and AI Lab introduction.
- Removed project-specific GitHub repository links from frontend project data and replaced misleading source links with case-study, website, or contact actions. The public GitHub profile remains linked.
- Restored a genuine seamless technology ticker on the homepage, with accessible duplicated track handling, hover pause, mobile layout, and a reduced-motion static presentation. Kept the existing five engineering phases in their own section.
- Added the approved Chawkke dedication to the global footer with two lightweight SVG doves and subtle snow-like CSS motion; reduced-motion mode removes the animation and simplifies the decoration.
- Kept the static export, services/pricing catalogue, original brochure, deterministic pricing path, safe Markdown rendering, and live Supabase integration boundary intact. No production Supabase or website settings were changed.
