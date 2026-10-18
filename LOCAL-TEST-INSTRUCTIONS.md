# Local test instructions (Windows 11 / PowerShell)

The project has two deliberately separate modes. Real mode uses the deployed BBA AI Edge Function. Mock mode is optional and uses deterministic local replies. Real mode never falls back to the mock.

## Install once

Open PowerShell in the project folder:

```powershell
npm ci
```

Do not put Gemini, Supabase database/service-role, or rate-limit secrets in the Next.js project. `NEXT_PUBLIC_` values are visible in browser JavaScript and must contain public configuration only.

## A. Safe local mock test (recommended)

Production should not allow localhost origins. Use the deterministic local mock for routine UI testing.

In PowerShell terminal 1:

```powershell
npm run dev:mock
```

In PowerShell terminal 2:

```powershell
$env:NEXT_PUBLIC_BBA_AI_ENDPOINT="http://127.0.0.1:3101"
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`. The canned local reply confirms that no production AI call was made.

## B. Authorized staging AI test

Use a non-production Supabase function configured with `BBA_AI_ALLOW_LOCALHOST=true`, and set `NEXT_PUBLIC_BBA_AI_ENDPOINT` to that staging URL before starting Next.js. Never place provider, database, service-role, or rate-limit secrets in the Next.js environment.

Send a normal project question such as:

```text
Bonjour, quelle est la première étape pour préparer un site vitrine professionnel ?
```

A varied, contextual answer confirms the staging backend. A canned local reply means mock mode is active and is not proof of real AI connectivity.

## Respect Mode checks

1. Send `This answer did not help me`; Respect Mode must not trigger.
2. Send `You are an idiot`; the original Respect Mode image must appear.
3. Send `Can we continue with my website?`; normal chat must continue.
4. The follow-up should receive a genuine generated reply. The insult and image-only turn are excluded from AI API history.
