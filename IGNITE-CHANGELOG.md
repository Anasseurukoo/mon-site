# Ignite the Dojo — focused changes

- `sections/Hero.tsx`: replaces only the existing BBA AI Hero CTA with an isolated fire-enhanced link.
- `components/ui/IgniteDojoLink.tsx` and `.module.css`: adds the amber border, proximity glow, animated edge embers, brief portal ignition, keyboard and touch activation, reduced-motion behavior, and cleanup. The anchor still points to `/ai/` if animation JavaScript fails.
- `components/ai/ApprovedDojoAi.tsx`: shares one top-level Home navigation handler between the approved Dojo logo and Hero Back button. It attaches the iframe bridge even when the cached document loaded before React's effect, and aborts its listeners on unmount.
- `scripts/browser-qa.mjs`: local headless Edge QA at 1440, 1280, 390, and 320 pixels with a mocked BBA AI response.
- `scripts/validate-static-export.mjs`: scopes the shared-footer assertion to pages that use the site chrome, preserving the standalone `/ai/` design.
- `.env.example`: documents the optional public endpoint without credentials.

The approved `public/ai/approved-dojo.html` remains unchanged. Its SHA-256 is `4EA5E37BA4B9D2B8CD94E617F9BA04FE9265C83DB7093EE245471A15C3CCA5D8`, identical to the supplied source.
