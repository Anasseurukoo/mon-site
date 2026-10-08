import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../data/pricing.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const pricing = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const cases = [
  ["French premium site", "Quels sont vos tarifs pour un site vitrine premium ?", false, "15 000 MAD"],
  ["French e-commerce", "Combien coûte un site e-commerce ?", false, "25 000 MAD"],
  ["English mobile app", "What does a mobile app cost?", false, "45 000 MAD"],
  ["Darija transliteration", "Chhal taman dyal site vitrine?", false, "15 000 MAD"],
  ["Arabic script", "شحال ثمن تطبيق الهاتف؟", false, "45 000 MAD"],
  ["Contextual follow-up", "Et pour un e-commerce ?", true, "25 000 MAD"],
];

for (const [label, prompt, priorContext, expectedPrice] of cases) {
  const match = pricing.matchPricingRequest(prompt, priorContext);
  assert.ok(match, `${label}: expected pricing intent`);
  assert.match(pricing.formatPricingReply(match), new RegExp(expectedPrice.replaceAll(" ", "\\s*")), label);
  assert.ok(match.service, `${label}: expected a specific service match`);
}

const allPrices = pricing.matchPricingRequest("Quels sont tous vos tarifs ?", false);
assert.ok(allPrices);
assert.equal(allPrices.service, undefined);
const allReply = pricing.formatPricingReply(allPrices);
for (const price of ["15 000", "20 000", "25 000", "35 000", "45 000", "sur devis"]) {
  assert.ok(allReply.includes(price), `general overview includes ${price}`);
}
assert.match(pricing.formatPricingReply(pricing.matchPricingRequest(cases[0][1], false)), /indicatifs/i);
assert.equal(pricing.matchPricingRequest("Je veux un site premium.", false), null);
assert.equal(pricing.matchPricingRequest("Bonjour", false), null);

console.log("Pricing intent checks passed across French, English, Moroccan Darija, Arabic script, contextual follow-up, full overview, disclaimer, non-pricing statement, and greeting.");
