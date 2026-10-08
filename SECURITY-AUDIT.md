# Security audit — BuiltByAnas V2

Scope: the supplied ZIP and this corrected V2 working copy. The ZIP contains no Git history, so this review does not cover secrets in previous commits, GitHub repository settings, live Supabase dashboard configuration, or provider account settings. Dependency data was checked with `npm audit` on 8 October 2026.

Validation: clean dependency installation, lint, TypeScript, pricing intent checks, static production export, and static HTML/link/asset checks passed on 8 October 2026; see `VALIDATION-REPORT.json` and `FINAL-VALIDATION-REPORT.md`. Browser QA was not performed for this release. The owner reports that production Supabase is Healthy and the assistant responds live. The Supabase inspection connector returned “Unknown tool” in the earlier read-only investigation, so deployed function source/configuration/logs could not be checked; no live changes were made.

## Critical

- **No confirmed current critical finding.** The supplied lockfile installed Next.js 16.3.3, which fell within a critical `next/og` ImageResponse remote-code-execution advisory. The application does not import `next/og` or generate dynamic images, and it is statically exported, reducing exposure. V2 now pins Next.js and its matching ESLint config to 16.4.0, beyond the patched 16.3.6 line for that advisory and beyond additional Next 16.3.8 fixes found by the latest audit. `npm audit` reports no critical or Next.js runtime advisories on the final lockfile. Re-run the audit before release. [Next.js advisory GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j), [Next.js 16.3.8 release](https://github.com/vercel/next.js/releases/tag/v16.3.8)

## High

- **Unpatched development-only glob dependency.** `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces@3.0.3` remains reported by npm as high severity. The current `braces` advisory has no patched release. This chain is used by lint/build tooling, not by the static site at runtime, and the portfolio does not pass visitor-controlled patterns into it. Do not force-downgrade the Next ESLint configuration to clear the report; re-evaluate when the maintainer publishes a patch. [braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

## Medium

- **BBA AI production state is owner-confirmed, not independently inspected here.** The owner reports the project is Healthy and production chat replies are working. A previous pause caused an earlier outage, but that is not the reported current state. The Supabase read-only connector failed, so deployed source, logs, secrets presence, and function settings remain unverified by this review. No live project action was taken.
- **Public AI endpoint and cost exposure.** The Edge Function is deliberately public because visitors do not have user JWTs. A public `verify_jwt = false` endpoint is not authenticated. The local V2 function requires an Upstash rate limiter and fails closed if it is missing or unavailable. Configure and monitor that service before releasing this local function change. The owner reports that the existing production assistant is currently responding. CORS by itself does not stop scripted clients.
- **Trusted client IP requirement.** The rate limiter keys requests using the gateway-provided forwarded IP and stores only its SHA-256 hash. Confirm the deployed Supabase gateway supplies a trusted `x-forwarded-for` value. If that cannot be established, put an authenticated/rate-limited proxy in front of the function.
- **JWT configuration is unverified.** The browser request contains no user JWT and the source snapshot had no function-level `verify_jwt` configuration. The owner reports that production requests currently work, so do not change the live JWT setting based on this source review. Confirm the deployed configuration only through an available read-only dashboard/API path before any future function release.
- **Static hosting response headers.** The GitHub Pages static export cannot configure response headers from Next.js. A Content Security Policy, HSTS, `X-Frame-Options`/`frame-ancestors`, and Permissions Policy must be configured at a hosting/CDN layer if the hosting setup supports it. No untested CSP meta policy was added because Next’s static runtime uses inline bootstrap code.
- **Visitor prompt privacy.** BBA AI forwards visitor messages to OpenAI. The browser warns users not to submit sensitive information; retention and processing terms depend on the owner’s provider configuration.

## Low

- **Public contact address and profile links.** The email and public GitHub profile are rendered as contact details by design. Expect automated scraping; no new contact backend was introduced.
- **Public function URL.** The Supabase project URL/function route is visible in the client build. It is an endpoint identifier, not a credential. The OpenAI and Upstash secrets remain server-side.

## Informational

- No OpenAI key, Supabase service-role key, Redis token, `.env` file, or other credential value was found in the source snapshot by a targeted text scan. This is not a full historical or binary secret scan.
- The client uses React text rendering for AI replies; it does not render model output as HTML.
- The JSON-LD serializer escapes script-breaking characters. The JSON-LD uses only profile/project fields from the local source.
- The contact form validates locally and opens the visitor’s email application. It does not claim the message was delivered.
- External links opened in a new tab use `rel="noreferrer"`.
- No iframe or third-party browser script was found in the reviewed application source.

## Dependency changes

- Updated Next.js and its ESLint config to the matching pinned 16.4.0 release after `npm audit` identified additional Next advisories affecting 16.3.6.
- `npm audit fix` updated patched transitive releases, including `sharp`, `source-map-js`, and `brace-expansion`.
- No `--force` audit fix was used. The remaining `braces` advisory has no patch at the time of this audit. The `npm audit` report shows five affected package paths through the same development-only chain.

## Before production

1. Re-run `npm ci`, `npm audit`, lint, typecheck, and the static build from the final ZIP.
2. Confirm the patched dependency versions in the lockfile and revisit the `braces` advisory.
3. Set OpenAI and Upstash values only as Supabase function secrets.
4. Compare the deployed `verify_jwt` setting, allowed origins, trusted client-IP forwarding, rate-limit behavior, and OpenAI usage limits with the local proposal before an explicitly approved function release.
5. Configure response security headers at the chosen static hosting/CDN layer where available.
6. Review OpenAI data handling and visitor privacy copy before enabling real visitor traffic.
