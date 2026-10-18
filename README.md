# BuiltByAnas V2

BuiltByAnas is Anasse’s personal engineering portfolio. It uses a static Next.js export for the website and a Supabase Edge Function for the optional BBA AI assistant.

## Architecture

- **Website:** Next.js App Router, React, TypeScript, Tailwind CSS, and Framer Motion.
- **Rendering:** static export to `out/`; project detail pages are generated from `data/projects.ts`.
- **Content:** profile, projects, capabilities, lab entries, and journey are kept in typed data modules.
- **Portfolio:** Joury Optic now has a featured case study at `/work/joury-optic/`; its live site and try-on routes are linked from that page.
- **Public identity:** the display name is Anasse, the brand is BuiltByAnas, and the public contact email is configured in `data/profile.ts`.
- **Services and pricing:** the owner-approved 2026 brochure is shown on the static `/services/` page and by deterministic local responses inside BBA AI. See `data/pricing.ts` for the shared typed catalogue.
- **Images and fonts:** local assets in `public/assets/` and `public/fonts/`; no remote font request.
- **BBA AI:** browser UI sends a short conversation to a public Supabase Edge Function. The function validates input, applies an HMAC-pseudonymous PostgreSQL rate limit, and calls Gemini. Provider credentials stay in Supabase secrets.
- **Hosting:** GitHub Pages workflow publishes the static `out/` directory. The Edge Function is deployed separately.

The included GitHub Actions workflow is configured to deploy on pushes to `main` (or a manual workflow dispatch). This package has not been pushed or deployed; treat those triggers as production-impacting if this folder is later connected to the repository.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- Deno and the Supabase CLI only when validating or deploying BBA AI

## Install and run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production export, run `npm run build`; Next.js writes the static site to `out/`. Set `NEXT_PUBLIC_SITE_URL` to the preview origin when building a non-production preview. Without it, canonical URLs use `https://builtbyanas.com`.

## Environment configuration

Copy the variable names from `.env.example` into the appropriate environment. `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BBA_AI_ENDPOINT` are public build-time settings. They must never contain credentials.

Set `GEMINI_API_KEY`, `SUPABASE_DB_URL`, and `BBA_AI_RATE_LIMIT_SECRET` as **Supabase Edge Function secrets**, not as frontend variables or GitHub Pages build variables. Apply the local private-schema migration before staging. BBA AI fails closed if provider or rate-limit configuration is missing, and uses both per-client and global database-backed request ceilings.

Cloudflare response-header values and the required report-only rollout are documented in `CLOUDFLARE-SECURITY-HEADERS.md`. They are not applied by the static Next.js build.

Pricing answers and the brochure work without the AI backend. The owner reports production BBA AI is Healthy and responding. See [BBA-AI-RECOVERY.md](./BBA-AI-RECOVERY.md) for the read-only investigation limitation and any future function release considerations.

## Build and checks

```sh
npm run lint
npm run typecheck
npm run test:pricing
npm run test:bba-ai
npm run build
npm run validate:export
npm audit
```

See [SECURITY-AUDIT.md](./SECURITY-AUDIT.md) and [FINAL-VALIDATION-REPORT.md](./FINAL-VALIDATION-REPORT.md) for the corrective release's current dependency and validation findings.

The build is a static export; deploy the contents of `out/` to a static host. GitHub Pages receives the production domain through its workflow build environment.

## Deployment

1. Build the static site with `NEXT_PUBLIC_SITE_URL=https://builtbyanas.com`.
2. Publish the resulting `out/` directory to the configured static host.
3. The static pricing, brochure, Markdown display, and deterministic pricing replies do not require a Supabase deployment. If separately releasing the local Edge Function prompt/security changes, first compare them with the currently working live function and follow the explicit review requirements in [BBA-AI-RECOVERY.md](./BBA-AI-RECOVERY.md).
4. Only for that separately approved function release, configure its documented server-side secrets and verify the intended JWT, origin, and rate-limit settings.

This repository copy is prepared for local review. No deployment or production service changes were made as part of its creation.

## Content and privacy

Project copy is based on the supplied source. Private work remains described at a high level; no private source code or credentials are included. The AI assistant sends the visitor’s submitted conversation to the configured Gemini endpoint. The site advises visitors not to share sensitive information.
