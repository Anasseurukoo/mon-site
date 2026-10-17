import assert from "node:assert/strict";
import { shouldShowBuildIdeaReaction } from "../lib/build-intent.ts";

for (const value of ["Start a project", "I want to launch my new project", "Let us build a project"]) {
  assert.equal(shouldShowBuildIdeaReaction(value), true, value);
}
for (const value of ["Show me your projects", "My project is broken", "What projects have you done?"]) {
  assert.equal(shouldShowBuildIdeaReaction(value), false, value);
}
console.log("explicit build intent positive and negative cases: PASS");
