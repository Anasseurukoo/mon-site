import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const page = await readFile(new URL("../app/ai/page.tsx", import.meta.url), "utf8");
const dojo = await readFile(
  new URL("../components/ai/ApprovedDojoAi.tsx", import.meta.url),
  "utf8",
);
const css = await readFile(new URL("../public/ai/approved-dojo.html", import.meta.url), "utf8");
const navigation = await readFile(new URL("../data/navigation.ts", import.meta.url), "utf8");
const sql = await readFile(
  new URL("../supabase/migrations/202610140001_bba_ai_private_rate_limit.sql", import.meta.url),
  "utf8",
);
await assert.rejects(access(new URL("../public/ai/index.html", import.meta.url)));
assert.ok(page.includes("ApprovedDojoAi"));
for (const required of [
  "shouldTriggerRespectMode",
  "toApiHistory",
  "requestBbaAi",
  "BbaAiError",
  "renderSafeMarkdown",
  "shouldShowBuildIdeaReaction",
  "markEngineAvailable",
  "quotaReaction",
  "text.length > 1200",
])
  assert.ok(dojo.includes(required));
assert.ok(!dojo.includes('const respectReactions = [\n  "/ai/reactions/image(20261016-211052).png"'));
assert.match(dojo, /const quotaReaction = "\/ai\/reactions\/image\(20261016-211052\)\.png"/);
assert.match(dojo, /const buildReaction = "\/ai\/reactions\/image\(20261016-211343\)\.png"/);
assert.match(css, /id="bba-fourier"/);
assert.match(css, /id="magic-wand"/);
assert.match(css, /visualViewport/);
assert.ok(navigation.includes('label: "BBA AI"'));
assert.ok(!navigation.includes('label: "About"'));
assert.ok(sql.includes("create schema if not exists private"));
assert.ok(sql.includes("on conflict (client_hash, window_started_at)"));
assert.ok(sql.includes("revoke all on function"));
console.log("App Router Dojo, mobile safeguards and rate-limit migration: PASS");
