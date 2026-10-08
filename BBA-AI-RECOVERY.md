# BBA AI — status, pricing flow, and deployment notes

## Live status reported by the owner

The owner reports that the Supabase project is **Healthy** and has successfully tested BBA AI on `https://builtbyanas.com/`; production messages and generated replies are working. This is owner-confirmed production behavior. It does not confirm that the V2 code in this local package is deployed.

The prior project pause was a confirmed earlier cause of backend unavailability. That diagnosis is historical; the live project has since been resumed. During this update, the Supabase read-only connector returned “Unknown tool” for project inspection, so current function source, configuration, and logs could not be independently inspected here. No Supabase changes were made.

## V2 pricing behavior

The official 2026 brochure supplied by the owner is included unchanged at `public/assets/pricing/builtbyanas-services-tarifs-2026.png`. The typed catalogue in `data/pricing.ts` is the canonical source for the static Services page and deterministic in-chat pricing replies. Pricing questions are answered locally in the browser, so the overview, individual prices, original brochure, Services link, download, and quote CTA continue to work during an AI backend outage.

Recognized explicit pricing questions include French, English, Darija transliteration, and Arabic-script terms. A short, explicit service question can follow a previous pricing request, for example “Et pour un e-commerce ?”. A project-interest statement such as “Je veux un site premium.” does not itself trigger a price or brochure.

The current local Edge Function prompt was also aligned with the approved prices and single-language replies for future non-browser clients. The price experience does not require an Edge Function change because the website responds deterministically.

## Production deployment impact

- Publishing the V2 static site updates the new `/services/` page, brochure asset, pricing UI, message formatting, and local deterministic responses. It does not call or change Supabase.
- The local Edge Function source includes prompt language/pricing instructions and the previously documented request validation, timeout, and Upstash-based rate limiting. These local changes are **not deployed**.
- Before any function deployment, compare its source and configuration with the currently working live function. The local version requires `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` as function secrets. Do not deploy it unless the rate-limit service is configured and validated, allowed origins are confirmed, and the intended JWT policy is verified against the current live setup.
- The local `supabase/config.toml` sets `verify_jwt = false` for the anonymous portfolio flow. This is a proposed V2 function setting, not a verified statement about the current production function. Do not apply it to production without reviewing the working deployment and approving that change.
- Changing the local Edge Function or `supabase/config.toml` is unnecessary for the deterministic price replies and Markdown display fixes. A function update is only needed if you choose to release the prompt alignment or other Edge Function hardening separately.

No live project settings, secrets, function versions, or deployments were modified during this work.

## Validation checklist for a later approved function deployment

After reviewing the current live function and explicitly approving any required production changes:

1. Verify deployed function source, JWT verification setting, allowed origins, and existing rate controls.
2. Confirm all required server-only secrets are present without exposing their values.
3. Deploy to a staging project or otherwise test with non-production credentials first.
4. Check OPTIONS/CORS, a valid chat request, invalid JSON/input, request limits, timeout behavior, rate limiting, and provider errors.
5. Confirm responses remain in the visitor’s language and no raw provider details or visitor prompts are logged.
6. Run the live chat smoke test only after the owner approves the specific deployment.

## Source references

- Function handler: `supabase/functions/bba-ai/index.ts`
- Function configuration: `supabase/config.toml`
- Frontend assistant: `components/ai/StudioAssistant.tsx`
- Canonical prices and matching rules: `data/pricing.ts`
