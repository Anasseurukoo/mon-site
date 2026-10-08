# BBA AI setup

The function source and explicit public-invocation configuration are in `supabase/functions/bba-ai/` and `supabase/config.toml`.

BBA AI requires these **Supabase Edge Function secrets** before it will call OpenAI:

- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The Upstash rate limiter is required and fails closed when its configuration is missing. Keep all three values out of frontend variables and GitHub Pages build settings. For diagnosis, deployment, and request validation, see [BBA-AI-RECOVERY.md](./BBA-AI-RECOVERY.md).
