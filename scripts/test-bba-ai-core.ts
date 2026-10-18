import assert from "node:assert/strict";
import { parseGeminiReply, readLimitedJson, resolveClientAddress, retryDelayMs, shouldRetryStatus, validateMessages } from "../supabase/functions/bba-ai/core.ts";

assert.deepEqual(validateMessages({ messages: [{ role: "user", content: " hello " }] }).messages, [{ role: "user", content: "hello" }]);
for (const value of [null, {}, { messages: [] }, { messages: [{ role: "system", content: "x" }] }, { messages: [{ role: "user", content: "" }] }]) {
  assert.ok(validateMessages(value).error);
}
assert.ok(validateMessages({ messages: Array.from({ length: 13 }, () => ({ role: "user", content: "x" })) }).error);
assert.ok(validateMessages({ messages: [{ role: "user", content: "x".repeat(1201) }] }).error);
assert.ok(validateMessages({ messages: [{ role: "user", content: "x".repeat(1000) }, ...Array.from({ length: 6 }, () => ({ role: "assistant", content: "y".repeat(1000) }))] }).error);
assert.ok(validateMessages({ messages: [{ role: "user", content: "one" }, { role: "user", content: "two" }] }).error);
assert.ok(validateMessages({ messages: [{ role: "user", content: "bad\u0000value" }] }).error);
assert.deepEqual(validateMessages({ messages: [{ role: "assistant", content: "hello" }, { role: "user", content: "question" }] }).messages?.length, 2);
assert.equal(resolveClientAddress(new Headers({ "cf-connecting-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.2" })), "203.0.113.7");
assert.equal(resolveClientAddress(new Headers({ "x-real-ip": "[2001:db8::1]" })), "2001:db8::1");
assert.equal(resolveClientAddress(new Headers({ "x-forwarded-for": "198.51.100.9, 10.0.0.1" })), "198.51.100.9");
assert.equal(resolveClientAddress(new Headers({ "cf-connecting-ip": "not-an-ip" })), null);
assert.deepEqual([408, 429, 500, 502, 503, 504].map(shouldRetryStatus), [true, true, true, true, true, true]);
assert.deepEqual([400, 401, 403, 404].map(shouldRetryStatus), [false, false, false, false]);
assert.equal(retryDelayMs(0, "2", 5_000, 0), 2_000);
assert.ok(retryDelayMs(0, null, 5_000, 0) >= 350);
assert.equal(parseGeminiReply({ candidates: [{ content: { parts: [{ text: " ok " }] } }] }), "ok");
assert.equal(parseGeminiReply({ promptFeedback: { blockReason: "SAFETY" } }), null);
assert.equal(parseGeminiReply({ candidates: [{ content: { parts: [] } }] }), null);
assert.equal((await readLimitedJson(new Request("https://test", { method: "POST", body: "{" }))).error, "invalid_json");
assert.equal((await readLimitedJson(new Request("https://test", { method: "POST", headers: { "content-length": "20001" }, body: "{}" }))).error, "too_large");
assert.equal((await readLimitedJson(new Request("https://test", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "ok" }] }) }))).error, undefined);
console.log("backend validation, retry and response parsing: PASS");
