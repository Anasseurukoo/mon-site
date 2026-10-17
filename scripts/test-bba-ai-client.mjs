import assert from "node:assert/strict";
import { isCacheEligible, requestBbaAi, resetBbaAiClientForTests } from "../public/ai/bba-ai-client.js";

let calls = 0;
globalThis.fetch = async () => {
  calls += 1;
  await new Promise((resolve) => setTimeout(resolve, 10));
  return new Response(JSON.stringify({ reply: "BBA AI OK" }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const safe = [{ role: "user", content: "What services do you offer?" }];
assert.equal(isCacheEligible(safe), true);
assert.equal(isCacheEligible([{ role: "user", content: "email me at a@b.com" }]), false);
const [first, duplicate] = await Promise.all([requestBbaAi("https://example.test", safe), requestBbaAi("https://example.test", safe)]);
assert.equal(first.reply, "BBA AI OK");
assert.equal(duplicate.reply, "BBA AI OK");
assert.equal(calls, 1, "concurrent identical requests must deduplicate");
const cached = await requestBbaAi("https://example.test", safe);
assert.equal(cached.source, "cache");
assert.equal(calls, 1);
await requestBbaAi("https://example.test", [{ role: "user", content: "my password is secret" }]);
await requestBbaAi("https://example.test", [{ role: "user", content: "my password is secret" }]);
assert.equal(calls, 3, "sensitive requests must not cache");
resetBbaAiClientForTests();
console.log("cache hit/miss, in-flight dedupe and privacy: PASS");
