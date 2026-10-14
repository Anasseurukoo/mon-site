import assert from "node:assert/strict";
import test from "node:test";

const { nextRespectModeImage, shouldTriggerRespectMode } = (await import(
  new URL("../lib/respect-mode.ts", import.meta.url).href
)) as typeof import("../lib/respect-mode");
const { toApiHistory } = (await import(
  new URL("../lib/chat-history.ts", import.meta.url).href
)) as typeof import("../lib/chat-history");

test("detects direct abuse in every supported language", () => {
  const abusive = [
    "You are an idiot",
    "Fuck you",
    "Tu es un connard",
    "Va te faire foutre",
    "nta hmar",
    "sir t9awed",
    "أنت غبي",
    "سير تقود",
  ];
  for (const message of abusive) assert.equal(shouldTriggerRespectMode(message), true, message);
});
test("does not flag criticism, frustration, jokes, quotes, or innocent text", () => {
  const allowed = [
    "This answer is stupid and did not help me",
    "I am frustrated because the form is broken",
    "You're not an idiot",
    "nta machi hmar",
    "Mon ami est un idiot parfois",
    'Translate "you are an idiot" into French',
    '"Tu es un connard"',
    "What does fuck you mean?",
    "BBA AI, your price is too high",
    "هاد الجواب ما عجبنيش",
    "كتقدر تصلح هاد المشكل؟",
  ];
  for (const message of allowed) assert.equal(shouldTriggerRespectMode(message), false, message);
});

test("image selection is valid and avoids immediate repetition when possible", () => {
  const first = nextRespectModeImage(-1);
  const second = nextRespectModeImage(first.index);
  assert.ok(first.image.src.startsWith("/images/"));
  if (first.image.src !== second.image.src) assert.notEqual(first.index, second.index);
});

test("image-only turns stay out of API history and normal chat can continue", () => {
  const history = toApiHistory([
    { from: "user", kind: "text", text: "You are an idiot", excludedFromAi: true },
    {
      from: "ai",
      kind: "image",
      image: { src: "/images/respect.jpg", alt: "Respect mode", width: 1200, height: 850 },
    },
    { from: "user", kind: "text", text: "Can we continue with my website?" },
  ]);

  assert.deepEqual(history, [
    { role: "user", content: "Can we continue with my website?" },
  ]);
  assert.ok(history.every((message) => message.content.length > 0));
});
