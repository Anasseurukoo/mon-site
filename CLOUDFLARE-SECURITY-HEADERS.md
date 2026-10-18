# Cloudflare security headers for BuiltByAnas

The site is a Next.js static export hosted by GitHub Pages and proxied by Cloudflare. Next.js `headers()` is not supported for static exports, so apply these values at Cloudflare only after testing them on a preview hostname. No Cloudflare change is made by this repository.

## Phase 1 - report-only CSP

Create a Cloudflare Response Header Transform Rule for HTML responses. Set:

```text
Content-Security-Policy-Report-Only: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' mailto:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; frame-src 'self'; connect-src 'self' https://ydsnzlhcdirhtmmcucbb.supabase.co; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
X-Frame-Options: DENY
```

`'unsafe-inline'` is currently required by the exported Next.js bootstrap/JSON-LD and the approved standalone Dojo document. This policy still restricts scripts to same-origin content and blocks plugins, framing, unexpected connections, and cross-origin assets. Do not remove `'unsafe-inline'` until inline script/style hashes have been generated from the final export and verified after every build.

Keep the existing HSTS value. Do not add `includeSubDomains` or `preload` until every required subdomain is confirmed HTTPS-only.

## Phase 2 - enforcement

1. Run the local production build and static export validation.
2. Deploy to a preview hostname with the report-only policy.
3. Exercise the Hero, Ignite interaction, BBA AI, Respect Mode, fallback media, navigation, contact flow, and every route on mobile and desktop.
4. Review CSP reports. Add only the minimum source required for a verified feature; never add `*`, `data:` to `script-src`, or `unsafe-eval`.
5. Replace `Content-Security-Policy-Report-Only` with `Content-Security-Policy` only after the preview has no unexplained violations.
6. Recheck response headers on `/`, `/ai/`, project routes, JavaScript, CSS, images, fonts, and video.

## BBA AI edge controls

Create a separate Cloudflare rate-limit rule for requests to the public Supabase BBA AI endpoint only if that endpoint is proxied through a controlled custom hostname. The rule is defense in depth; the Supabase function's database-backed per-client and global limits remain authoritative. Do not cache AI responses or log request bodies.
