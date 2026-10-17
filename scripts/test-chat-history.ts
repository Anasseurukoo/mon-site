import assert from "node:assert/strict";
import { toApiHistory } from "../lib/chat-history.ts";

const history = toApiHistory([
  { from: "ai", kind: "text", text: "hello" },
  { from: "user", kind: "text", text: "blocked", excludedFromAi: true },
  { from: "ai", kind: "image", image: { src: "/x.png", alt: "x", width: 1, height: 1 } },
  ...Array.from({ length: 14 }, (_, index) => ({ from: "user" as const, kind: "text" as const, text: `m${index}` })),
]);
assert.equal(history.length, 12);
assert.equal(history[0]?.content, "m2");
assert.equal(history.at(-1)?.content, "m13");
assert.ok(!history.some((message) => message.content === "blocked"));
console.log("chat history: PASS");
