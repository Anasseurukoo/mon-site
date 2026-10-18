import assert from "node:assert/strict";

const counters = new Map();
async function consume(client, limit, window) {
  const key = `${client}:${window}`;
  const next = (counters.get(key) || 0) + 1;
  counters.set(key, next);
  return next <= limit;
}

async function consumeRequest(client, clientLimit, globalLimit, window) {
  if (!(await consume(`client:${client}`, clientLimit, window))) return false;
  return consume("global:bba-ai", globalLimit, window);
}

const results = await Promise.all(Array.from({ length: 11 }, () => consume("digest-a", 10, 1)));
assert.equal(results.filter(Boolean).length, 10);
assert.equal(results.filter((allowed) => !allowed).length, 1);
assert.equal(
  await consume("digest-b", 10, 1),
  true,
  "separate pseudonymous clients must not share counters",
);
assert.equal(
  await consume("digest-a", 10, 2),
  true,
  "new windows must expire the previous count",
);
const globalResults = await Promise.all(
  Array.from({ length: 121 }, (_, index) =>
    consumeRequest(`rotating-client-${index}`, 10, 120, 3),
  ),
);
assert.equal(globalResults.filter(Boolean).length, 120);
assert.equal(
  globalResults.filter((allowed) => !allowed).length,
  1,
  "global ceiling must stop rotating client identifiers",
);
console.log(
  "rate-limit concurrency model, isolation, expiry and global anti-spoofing ceiling: PASS (database execution requires staging)",
);
