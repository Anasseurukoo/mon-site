# Ignite the Dojo — local test

Extract the ZIP in PowerShell, then run the checks from its extracted root:

```powershell
Expand-Archive -LiteralPath '.\BuiltByAnas_Ignite_The_Dojo_Final_Local_Test.zip' -DestinationPath '.\BuiltByAnas-Ignite-Test'
Set-Location '.\BuiltByAnas-Ignite-Test'
npm ci
npm run test:bba-ai
npm run test:pricing
npm run typecheck
npm run lint
npm run build
npm run validate:export
npm run dev
```

Open `http://localhost:3000/` and `http://localhost:3000/ai/`. The default BBA AI endpoint is external, so do not submit an AI prompt unless an authorized local or staging endpoint has been configured. The browser QA below intercepts BBA AI requests with a local canned reply.

To repeat the automated browser QA of the static export, use a second PowerShell window after the build:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory out
```

In a third PowerShell window from the extracted root:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless=new --disable-gpu --no-first-run --no-default-browser-check --remote-debugging-port=9229 --user-data-dir="$env:TEMP\bba-ignite-browserqa" about:blank
node scripts/browser-qa.mjs
```

The QA helper writes screenshots into `.browserqa/`. It does not contact Gemini or modify Supabase.
