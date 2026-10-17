import type { AssistantImageMessage } from "@/components/ai/message-types";

export const RESPECT_MODE_IMAGES: AssistantImageMessage["image"][] = [
  {
    src: "/images/bba-respect-mode-guardian.png",
    alt: "BuiltByAnas Respect Mode guardian",
    width: 1496,
    height: 1051,
  },
  {
    src: "/ai/reactions/image(20261016-211222).png",
    alt: "BuiltByAnas Respect Mode workplace guide",
    width: 836,
    height: 745,
  },
];

const META_LANGUAGE =
  /\b(?:translate|translation|quote|quoted|quotation|means?|definition|example|say|saying|word|traduire|traduction|citation|cite|signifie|dire|mot|exemple)\b|(?:ترجم|ترجمة|اقتباس|ماذا يعني|شنو كتعني|كيف نقول)/iu;

const DIRECT_ABUSE_PATTERNS = [
  // English: direct second-person attacks, never criticism of an answer or feature.
  /\b(?:you(?:'re|\s+are)|u\s+r)\s+(?:a\s+|an\s+)?(?:fucking\s+)?(?:idiot|moron|stupid|dumb(?:ass)?|asshole|bastard|piece\s+of\s+shit)\b/iu,
  /\b(?:fuck\s+you|go\s+fuck\s+yourself)\b/iu,

  // French: direct address only.
  /\btu\s+(?:es|restes)\s+(?:un\s+|une\s+)?(?:putain\s+de\s+)?(?:con(?:ne)?|connard|connasse|idiot(?:e)?|imbecile|abruti(?:e)?)\b/iu,
  /\b(?:va\s+te\s+faire\s+foutre|nique\s+ta\s+mere)\b/iu,

  // Moroccan Darija in Latin transliteration.
  /\b(?:nta|nti|ntaia|ntiya)\s+(?:wahed\s+)?(?:hmar|hmara|kelb|kelba|mklkh|mekellekh|9lil\s+terbiya)\b/iu,
  /\b(?:sir|siri)\s+t(?:9|q|g)awed\b/iu,
  /\b(?:t(?:9|q|g)awed|layn3el\s+tabon\s+mok)\b/iu,

  // Arabic and Darija in Arabic script.
  /(?:انت|انتي|أنت|أنتي)\s+(?:واحد\s+)?(?:غبي|غبية|احمق|حمقاء|حمار|حمارة|كلب|كلبة|مكلخ|مكلخة)/iu,
  /(?:سير|سيري|روح)\s+(?:تقود|تقاد|انقلع)/iu,
  /(?:تفو\s+عليك|اللعنة\s+عليك)/iu,
];

const NEGATED_ATTACK =
  /\b(?:you(?:'re|\s+are)|u\s+r|tu\s+es|nta|nti|ntaia|ntiya)\s+(?:not|pas|machi|mashi)\b|(?:انت|انتي|أنت|أنتي)\s+(?:لست|مش|ماشي)/iu;

function normalizeForDetection(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function isFullyQuoted(value: string): boolean {
  return /^(?:["“«].*["”»]|'.*')$/su.test(value.trim());
}

/** High-precision client-side gate for direct, clearly abusive messages. */
export function shouldTriggerRespectMode(value: string): boolean {
  const normalized = normalizeForDetection(value);
  if (!normalized || isFullyQuoted(normalized) || META_LANGUAGE.test(normalized)) return false;
  if (NEGATED_ATTACK.test(normalized)) return false;
  return DIRECT_ABUSE_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** Picks the next asset without immediately repeating when more than one exists. */
export function nextRespectModeImage(previousIndex: number): {
  image: AssistantImageMessage["image"];
  index: number;
} {
  const count = RESPECT_MODE_IMAGES.length;
  const index = count === 1 ? 0 : (previousIndex + 1) % count;
  return { image: RESPECT_MODE_IMAGES[index]!, index };
}
