/** Explicit project-start wording only; ordinary mentions of “project” do not qualify. */
export function shouldShowBuildIdeaReaction(value: string) {
  return /\b(?:start|begin|launch|build)\s+(?:a|my|the)?\s*(?:new\s+)?project\b|\bstart\s+building\b/iu.test(
    value.trim(),
  );
}
