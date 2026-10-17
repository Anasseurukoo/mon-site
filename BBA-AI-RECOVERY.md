# BBA AI recovery and drift controls

The supplied repository contained an obsolete OpenAI function while production used recovered Gemini v7 source. This isolated package reconciles the backend from the recovered Gemini baseline and records the immutable source hashes in `RECOVERY-BASELINE-SHA256.txt`.

## Mandatory pre-deployment gate

No deployment was performed. Before any future release:

1. Export the currently deployed `bba-ai` source and configuration again.
2. Hash that export and compare it with the recorded recovery baseline and this package.
3. Stop if production changed after 14 October 2026.
4. Review `supabase/functions/bba-ai/index.ts`, `core.ts`, `supabase/config.toml`, and the private rate-limit migration together.
5. Confirm required staging secrets exist by name only; never print their values.
6. Run the local suite and all staging-only acceptance tests in `BBA-AI-IMPLEMENTATION.md`.

## Rollback assets

- Original archive: `mon-site-main.zip` with SHA-256 recorded in `RECOVERY-BASELINE-SHA256.txt`.
- Recovered production baseline: preserved in the audit workspace under `work/production-recovery/bba-ai-v7/`.
- Repaired implementation: `supabase/functions/bba-ai/`.
- Additive database migration: `supabase/migrations/202610140001_bba_ai_private_rate_limit.sql`.

Rollback must restore the immediately preceding live function bundle, not the obsolete OpenAI file from the archive. The database objects can remain unused until a separately reviewed cleanup is approved.
