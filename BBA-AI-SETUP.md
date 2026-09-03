# BBA AI — real AI setup

The frontend is already wired to:

`https://ydsnzlhcdirhtmmcucbb.supabase.co/functions/v1/bba-ai`

The Edge Function source is included in `supabase/functions/bba-ai/`.

## Required secret before BBA AI can answer

Add an Edge Function secret named:

`OPENAI_API_KEY`

with your OpenAI API key in the Supabase project settings / Edge Functions secrets.

Never put the OpenAI key in `.env.production`, any `NEXT_PUBLIC_*` variable, GitHub Pages, or frontend code.

## Test

1. Start the site with `START-BUILTBYANAS.bat`.
2. Open BBA AI.
3. Ask: `J’ai un magasin d’optique, qu’est-ce que tu me proposes ?`
4. Confirm the answer is generated and contextual rather than one of the old canned responses.
