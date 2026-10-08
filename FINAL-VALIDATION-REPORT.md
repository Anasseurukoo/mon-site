# BuiltByAnas V2 â€” Corrective Release Validation

Date: 8 October 2026
Source baseline: supplied `builtbyanas-v2-final-production.zip`
Production changes: none. No commit, push, merge, or deploy was performed.

## Acceptance audits

| Audit | Status | Verification |
|---|---|---|
| 01 â€” Joury Optic | **COMPLETE** | Featured project data, `/work/joury-optic/` static route, project navigation, Try Lens and 3D Try Lunettes ownership statements, live links, canonical/Open Graph metadata, and sitemap entry are present. The official Joury hero image is used as brand artwork. Dedicated Try Lens and 3D Try Lunettes interface screenshots were not present in the public page image markup inspected. |
| 02 â€” Public identity | **COMPLETE** | Profile, hero copy, About, project copy, footer, metadata, and structured data use â€œAnasse.â€ Exact searches for the former full-name forms returned zero source matches. The About route references the original supplied portrait, verified byte-for-byte. |
| 03 â€” BBA AI attribution | **COMPLETE** | The assistant panel, BBA AI project page, and AI Lab identify BBA AI as designed and developed by BuiltByAnas. Pricing logic and the local Supabase function/config are unchanged from the supplied source. |
| 04 â€” Contact email | **COMPLETE** | The shared profile, generated mail links, contact form, mobile menu, and footer use the approved address. The prior address search returned zero source matches. |
| 05 â€” Technology ticker | **PARTIAL** | The homepage renders a duplicated seamless CSS ticker based on the skills data. The compiled export contains the ticker animation, hover pause, accessible hidden duplicate, and reduced-motion rules. Motion and visual quality were not observed in a browser. |
| 06 â€” Private source protection | **COMPLETE** | No project-repository GitHub URLs or misleading source-code CTAs remain in frontend project data or static HTML. The existing GitHub profile link and username remain. Secret-pattern checks found no credential values. |
| 07 â€” Chawkke dedication | **COMPLETE** | All three approved lines, the requested footer credit, and the 2026 Anasse copyright appear in the generated global footer HTML. |
| 08 â€” Dove animation | **PARTIAL** | Two lightweight inline SVG doves and CSS snow drift are present, aria-hidden, and covered by reduced-motion rules that disable motion and simplify the decoration. Animation was not observed in a browser. |
| 09 â€” Services and brochure | **COMPLETE** | `/services/` is in the static export; all six official pricing categories remain in the shared catalogue; the original 2026 brochure hash matches the supplied ZIP; multilingual pricing intent tests pass. |
| 10 â€” BBA AI and static architecture | **PARTIAL** | Pricing tests, source preservation, safe Markdown implementation, brochure link, language handling, and static export checks pass. The browser chat flow and production Supabase behavior were not tested in this pass. |

## Build and source checks

- `npm ci`: passed; 362 packages installed. npm reported that the `unrs-resolver` install script was not approved by the active script policy. No script approval was added; lint, typecheck, and build still passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:pricing`: passed for French, English, Moroccan Darija transliteration, Arabic script, service follow-ups, all six categories, disclaimer, non-pricing intent, and greeting.
- `npm run build`: passed on Next.js 16.4.0; output is a static export and includes `/work/joury-optic/`.
- `npm run validate:export`: passed. It checked **17 exported HTML pages and 785 local `href`/`src`/CSS asset references**, including routes, sitemap, canonical/Open Graph metadata, mail links, page identity, repository links, footer copy, original portrait and brochure hashes, and ticker/memorial markup and CSS.
- `npm audit`: 0 critical, 0 moderate, 0 low, 5 high paths through the development toolchain: `eslint-config-next â†’ @next/eslint-plugin-next â†’ fast-glob â†’ micromatch â†’ braces@3.0.3`. The available automated `eslint-config-next` fix is a major-version downgrade incompatible with the installed Next 16 toolchain. No `npm audit fix` was run.
- Targeted secret scan: no API key, bearer token, Supabase service-role key, or populated Redis credential was found in source text. This does not scan Git history or external account settings.
- SHA-256 comparisons against the supplied source ZIP confirm the About portrait, pricing brochure, pricing catalogue, Supabase Edge Function, and Supabase config are unchanged.

## Required source searches

Searches were run across source and documentation, excluding generated build output and dependencies:

- Previous full-name forms: **0 matches**.
- Previous contact address: **0 matches**.
- Approved contact address: present in the public profile and generated mail links.
- Joury Optic, Try Lens, Try Lunettes, Chawkke, and `TechMarquee`: present in the expected project, footer, route, or homepage files.
- Misleading source-code CTA label: **0 matches**.
- Project-specific GitHub repository URLs: **0 matches**. The profile URL `https://github.com/Anasseurukoo` remains.

## Rendered/runtime limitations

- Browser QA: **UNVERIFIED**. No browser interaction or screenshot inspection was performed for this release.
- Joury imagery: the official brand hero is available and included; standalone screenshots of the Try Lens and 3D Try Lunettes interfaces were not found in the public image markup inspected.
- Live Supabase: **UNVERIFIED** by this pass. The owner reports Healthy status and successful production replies. No Supabase dashboard/API action, setting change, secret change, or function deployment was performed.
- Build and static export checks do not prove that a live camera permission flow, face/iris tracking, or production chat session works on every device.

## Release package

The release ZIP contains one project root and 172 project files. It excludes `node_modules`, `.next`, `out`, temporary files, ZIP backups, Git history, real environment secrets, and cache directories. The ZIP passed its integrity check and required-file manifest check.

A fresh extraction of the packaged source passed `npm ci`, lint, TypeScript, pricing tests, `npm audit` (with the five known high development-toolchain paths above), production build, and static export validation. After the final report-only documentation update, the ZIP was regenerated and re-extracted to verify its final integrity, root structure, required files, exclusions, and preserved asset hashes again.
