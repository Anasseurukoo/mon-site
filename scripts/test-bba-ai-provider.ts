import assert from "node:assert/strict";
import {
  resetModelDiscoveryCacheForTests,
  routeGemini,
} from "../supabase/functions/bba-ai/provider.ts";

const modelList = (models = ["gemini-3.5-flash-lite", "gemini-3.8-flash"]) =>
  new Response(
    JSON.stringify({
      models: models.map((name) => ({
        name: `models/${name}`,
        supportedGenerationMethods: ["generateContent"],
      })),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

const ok = (text = "ok") =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const fail = (status: number, retryAfter?: string) =>
  new Response(JSON.stringify({ error: { code: status } }), {
    status,
    headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
  });

const base = {
  apiKey: "test-key-not-a-secret",
  messages: [{ role: "user" as const, content: "hello" }],
  systemPrompt: "test",
  deadlineAt: 20_000,
  now: () => 0,
  random: () => 0,
};

resetModelDiscoveryCacheForTests();
{
  const calls: string[] = [];
  const result = await routeGemini({
    ...base,
    fetchImpl: async (input) => {
      const url = String(input);
      calls.push(url);
      return url.includes("?pageSize") ? modelList() : ok("success");
    },
  });
  assert.deepEqual(result, {
    ok: true,
    reply: "success",
    model: "gemini-3.5-flash-lite",
  });
  assert.equal(calls.length, 2);
}

resetModelDiscoveryCacheForTests();
{
  let generationCalls = 0;
  const delays: number[] = [];
  const result = await routeGemini({
    ...base,
    sleep: async (delay) => {
      delays.push(delay);
    },
    fetchImpl: async (input) => {
      if (String(input).includes("?pageSize")) return modelList();
      generationCalls += 1;
      return generationCalls === 1 ? fail(503) : ok("recovered");
    },
  });
  assert.equal(result.ok && result.reply, "recovered");
  assert.deepEqual(delays, [350]);
  assert.equal(generationCalls, 2);
}

resetModelDiscoveryCacheForTests();
{
  const calledModels: string[] = [];
  const result = await routeGemini({
    ...base,
    fetchImpl: async (input) => {
      const url = String(input);
      if (url.includes("?pageSize")) return modelList();
      calledModels.push(url);
      return url.includes("gemini-3.5-flash-lite") ? fail(404) : ok("fallback");
    },
  });
  assert.equal(result.ok && result.reply, "fallback");
  assert.equal(calledModels.length, 2, "404 must not retry the same model");
}

resetModelDiscoveryCacheForTests();
{
  let calls = 0;
  const result = await routeGemini({
    ...base,
    maxAttemptsPerModel: 1,
    fetchImpl: async (input) => {
      if (String(input).includes("?pageSize")) {
        return modelList(["gemini-3.5-flash-lite"]);
      }
      calls += 1;
      throw new DOMException("timed out", "AbortError");
    },
  });
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.category, "timeout");
  assert.equal(calls, 1);
}

resetModelDiscoveryCacheForTests();
{
  const result = await routeGemini({
    ...base,
    maxAttemptsPerModel: 1,
    fetchImpl: async (input) => (String(input).includes("?pageSize") ? modelList() : fail(503)),
  });
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.category, "provider_503");
}

resetModelDiscoveryCacheForTests();
{
  const result = await routeGemini({
    ...base,
    fetchImpl: async () => modelList(["unapproved-model"]),
  });
  assert.deepEqual(result, { ok: false, category: "no_supported_model" });
}

console.log("provider discovery, recovery, failover, timeout and total failure: PASS");
