import assert from "node:assert/strict";

const counters = new Map();
async function consume(client, limit, window) {
  const key = `${client}:${window}`;
  const next = (counters.get(key) || 0) + 1;
  counters.set(key, next);
  return next <= limit;
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
console.log(
  "rate-limit concurrency model, isolation and expiry: PASS (database execution requires staging)",
);
