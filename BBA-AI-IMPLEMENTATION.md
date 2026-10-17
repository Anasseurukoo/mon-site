# BBA AI repair package

## Reliability

- Primary model: `gemini-3.1-flash-lite`.
- Removed production-broken Gemini 2.5 fallbacks.
- One retry only for network errors, 408, 429, 500, 502, 503, and 504.
- Exponential-style backoff with jitter and bounded `Retry-After` support.
- Total provider deadline: 20 seconds.
- Maximum attempts: two primary attempts; one additional fallback attempt only when the fallback has been explicitly enabled after staging verification.
- Permanent 400, 401, 403, and 404 responses are never retried.
- Browser responses contain stable error categories only; provider messages and secrets stay server-side.

## Validation and privacy

- Request body: 20 KB maximum.
- Conversation: 12 messages, 1,200 characters per message, 6,000 total characters.
- Invalid roles, blank messages, malformed JSON, unsupported content types, and oversize requests are rejected before provider use.
- Responses use `Cache-Control: no-store, private`.
- Safe logs contain category, model, attempt, status, and retryability only.

## Browser cache

- Per-page-memory only; no storage APIs or cookies.
- Two-minute TTL, 20-entry LRU, versioned keys, and per-tab random namespace.
- Identical simultaneous requests share one promise.
- Only short single-turn, non-sensitive successful requests are eligible.
- Respect Mode, images, personal or sensitive text, multi-turn chats, errors, timeouts, invalid replies, and rate limits are never cached.

## Server Error Meme Mode

Both interfaces include a reserved `data-server-error-meme-slot`/`server-error-meme-slot`. It appears only for network, timeout, or temporary service failures. No image has been fabricated. When an approved asset is supplied, add it to this slot without reusing the Respect Mode guardian.

## Staging acceptance

- Apply the migration and validate 12 allowed requests, the 13th 429 response, `Retry-After`, window expiry, and concurrent atomic increments.
- Mock 200, 400, 401, 403, 404, 408, 429, 500, 502, 503, 504, malformed JSON, empty, blocked, network, and timeout provider responses.
- Confirm the exact staging credential can call `gemini-3.1-flash-lite`.
- Leave the 3.5 fallback disabled unless the exact credential passes a controlled call and current free-tier terms are confirmed.
- Verify allowed origins, preflight, the `{ reply: string }` success contract, and absence of raw provider diagnostics.
- Verify no secrets appear in the static export, browser source, function responses, or logs.

## Rollback

1. Preserve hashes of the currently deployed function immediately before any future release.
2. Deploy to staging and retain the previous function bundle and migration state.
3. If acceptance fails, restore the previous function bundle; do not enable the 3.5 fallback.
4. The private rate-limit table is additive and can remain dormant. A separately reviewed rollback may revoke access, drop `private.consume_bba_ai_rate_limit`, then drop the table; never do this while the repaired function is active.
5. Rebuild the prior static source to restore the previous frontend. Browser caches are memory-only and disappear on reload.

## Known blockers

- Real Supabase migration execution, database concurrency behavior, Edge Function deployment, and credential-specific Gemini calls require an authorized staging environment.
- Deno and Supabase CLI are not installed in the audit environment, so hosted-runtime type checking is staging-required.
- `npm audit` reports five high advisories in the existing ESLint/Next lint toolchain. Its offered remediation is a breaking downgrade to `eslint-config-next` 14 and was not applied.
