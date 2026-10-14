# Local test instructions (Windows 11 / PowerShell)

The project has two deliberately separate modes. Real mode uses the deployed BBA AI Edge Function. Mock mode is optional and uses deterministic local replies. Real mode never falls back to the mock.

## Install once

Open PowerShell in the project folder:

```powershell
npm ci
```

Do not put OpenAI, Supabase service-role, or Upstash secrets in this project. `NEXT_PUBLIC_` values are visible in browser JavaScript.

## A. Real AI test (genuine deployed backend)

The deployed function currently allows exactly `http://localhost:3000` for local browser development. Port 3001 is not accepted by the deployed function.

Make sure no mock override is active, then start Next.js:

```powershell
Remove-Item Env:NEXT_PUBLIC_BBA_AI_ENDPOINT -ErrorAction SilentlyContinue
if (Test-Path .env.local) { Write-Warning "Review .env.local and remove any NEXT_PUBLIC_BBA_AI_ENDPOINT mock override before continuing." }
npm run dev -- --hostname localhost --port 3000
```

Open `http://localhost:3000`. In BBA AI, send a normal project question such as:

```text
Bonjour, quelle est la première étape pour préparer un site vitrine professionnel ?
```

A varied, contextual answer confirms the genuine backend. A canned `Réponse locale de test.` answer means mock mode is active and is not proof of real AI connectivity.

## Respect Mode checks

1. Send `This answer did not help me`; Respect Mode must not trigger.
2. Send `You are an idiot`; the original Respect Mode image must appear.
3. Send `Can we continue with my website?`; normal chat must continue.
4. The follow-up should receive a genuine generated reply. The insult and image-only turn are excluded from AI API history.
