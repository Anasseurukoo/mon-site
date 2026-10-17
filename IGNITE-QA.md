# Ignite the Dojo — QA record

## PASS

- Exact lockfile install: `npm ci`.
- Existing BBA AI and pricing tests: `npm run test:bba-ai`, `npm run test:pricing`.
- TypeScript, ESLint, production static build, and export: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run validate:export`.
- Browser at 1440, 1280, 390, and 320 pixels: Hero CTA present, idle amber border, no horizontal overflow, and mobile CTA visible after scrolling.
- Browser interaction: proximity, hover, pointer-leave reset, mouse click ignition and `/ai/` entry, Space activation, touch entry, and reduced-motion entry.
- Browser navigation: approved Dojo logo click and Enter go to top-level `/`; Hero Back click and Enter go to top-level `/`.
- Browser Dojo: iframe fills the viewport on desktop and mobile; existing design and chat remain visible. A mocked AI reply renders Markdown and removes the preview labels only after success.
- Browser JavaScript exceptions: none during the automated sequence.
- Approved Dojo HTML: byte-identical SHA-256 to the supplied source.

## BLOCKED by local-only release scope

- Live Gemini model and credential response.
- Production Supabase Edge Function, database migration, and concurrent quota behavior. The existing 10-request / 600-second implementation and model tests were preserved.

No production endpoint was called during browser QA. The browser helper intercepts BBA AI requests with a canned local response.
