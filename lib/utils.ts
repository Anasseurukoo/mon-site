/** Joins class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Splits a string into words for staggered per-word reveals. */
export function toWords(text: string): string[] {
  return text.split(" ").filter(Boolean);
}

/** Clamps a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
