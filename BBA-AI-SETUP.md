# BBA AI local and staging setup

No production action is included or authorized by this package.

## Local website

```powershell
npm ci
npm run test:bba-ai
npm run typecheck
npm run lint
npm run build
npm run validate:export
npm run dev
```

Open `http://localhost:3000/` and `http://localhost:3000/ai/`. Set `NEXT_PUBLIC_BBA_AI_ENDPOINT` only when pointing the browser at an authorized local or staging function.

## Supabase staging prerequisites

1. Create or select a non-production Supabase project.
2. Review and apply `supabase/migrations/202610140001_bba_ai_private_rate_limit.sql` to staging only.
3. Configure `GEMINI_API_KEY`, `SUPABASE_DB_URL`, and a high-entropy `BBA_AI_RATE_LIMIT_SECRET` as Edge Function secrets. Never put them in `NEXT_PUBLIC_*` variables or GitHub Pages build variables.
4. Keep `BBA_AI_ALLOW_LOCALHOST=false` in production. Enable it only for an authorized local Edge Function test.
5. Keep the per-client default at 10 requests per 600 seconds and the global backstop at 120 requests per 600 seconds unless a staging load test supports a deliberate adjustment.
6. Keep `BBA_AI_ENABLE_GEMINI_35_FALLBACK=false` until one controlled call using the exact staging project and credential confirms `gemini-3.5-flash-lite` access and free-tier eligibility.
7. Optionally tune the three rate-limit values after staging tests; the defaults are 10 requests per client and 120 requests globally per 600 seconds.
8. Serve or deploy the function to staging only, then run the acceptance checks in `BBA-AI-IMPLEMENTATION.md`.

The rate limiter stores only an HMAC digest of the network address and fixed-window counters. It does not store plaintext IP addresses, prompts, user agents, conversations, or credentials. Anonymous identification is approximate: shared NATs may share a limit, addresses can change, and determined attackers can distribute requests.
