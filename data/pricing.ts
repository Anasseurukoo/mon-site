export type PricingService = {
  id: string;
  name: string;
  nameEn: string;
  nameDarija: string;
  price: number | null;
  displayPrice: string;
  description: string;
  aliases: string[];
};

/** Owner-approved indicative prices from the Services & Tarifs 2026 brochure. */
export const pricingServices: PricingService[] = [
  { id: "showcase", name: "Site vitrine premium", nameEn: "Premium showcase website", nameDarija: "موقع تعريفي فاخر", price: 15000, displayPrice: "15 000 MAD", description: "Design sur mesure, responsive, SEO technique et mise en ligne.", aliases: ["site vitrine", "site premium", "premium website", "showcase website", "vitrine"] },
  { id: "business", name: "Site business / catalogue", nameEn: "Business / catalogue website", nameDarija: "موقع للأعمال / كتالوج", price: 20000, displayPrice: "20 000 MAD", description: "Catalogue, collections, formulaires et parcours client avancé.", aliases: ["site business", "site catalogue", "catalogue", "business website", "catalog website", "موقع تجاري", "موقع كتالوج"] },
  { id: "ecommerce", name: "E-commerce", nameEn: "E-commerce store", nameDarija: "متجر إلكتروني", price: 25000, displayPrice: "25 000 MAD", description: "Boutique en ligne, catalogue, commandes, paiement et configuration.", aliases: ["e-commerce", "ecommerce", "boutique en ligne", "online store", "online shop", "متجر إلكتروني", "متجر الكتروني"] },
  { id: "web-app", name: "Application web sur mesure", nameEn: "Custom web application", nameDarija: "تطبيق ويب حسب الطلب", price: 35000, displayPrice: "35 000 MAD", description: "Dashboard, espace client, workflows et logique métier.", aliases: ["application web", "web app", "web application", "dashboard", "application sur mesure", "تطبيق ويب"] },
  { id: "mobile-app", name: "Application mobile", nameEn: "Mobile application", nameDarija: "تطبيق الهاتف", price: 45000, displayPrice: "45 000 MAD", description: "Application iOS / Android selon fonctionnalités et architecture.", aliases: ["application mobile", "app mobile", "mobile app", "ios app", "android app", "تطبيق الهاتف", "تطبيق موبايل"] },
  { id: "interactive", name: "3D / AR / IA / expériences interactives", nameEn: "3D / AR / AI / interactive experiences", nameDarija: "تجارب تفاعلية بالـ 3D و AR و AI", price: null, displayPrice: "Sur devis", description: "Try-on, visualisation 3D, automatisation et expériences interactives.", aliases: ["3d", "ar", "ia", "ai", "intelligence artificielle", "try-on", "try on", "essayage virtuel", "interactive experience"] },
];

export const pricingDisclaimer = {
  fr: "Tarifs indicatifs, sous réserve d’un devis final selon le périmètre, la complexité et les intégrations du projet.",
  en: "Indicative starting prices. A final quote depends on project scope, complexity, and integrations.",
  darija: "هاد الأثمنة غير استرشادية. الثمن النهائي كيتحدد على حساب نطاق المشروع، درجة التعقيد والخدمات اللي خاصها تندمج.",
} as const;

export type PricingLanguage = keyof typeof pricingDisclaimer;

export function detectPricingLanguage(text: string): PricingLanguage {
  if (/[\u0600-\u06FF]/.test(text) || /\b(chhal|bchhal|taman|taman dyal)\b/i.test(text)) return "darija";
  if (/\b(what|how much|price|pricing|cost|quote|estimate|e-?commerce|mobile app|website)\b/i.test(text)) return "en";
  return "fr";
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const PRICING_INTENT = /\b(tarifs?|prix|combien|cout|coute|devis|budget|price|pricing|cost|how much|quote|estimate|chhal|bchhal|taman)\b|شحال|الثمن|السعر/i;

export type PricingMatch = { requested: true; language: PricingLanguage; service?: PricingService };

/** Match explicit pricing questions and service-specific follow-ups in context. */
export function matchPricingRequest(text: string, priorPricingContext: boolean): PricingMatch | null {
  const hasPricingIntent = PRICING_INTENT.test(text);
  const normalized = normalize(text);
  const service = pricingServices.find((candidate) =>
    candidate.aliases.some((alias) => {
      const needle = normalize(alias);
      return needle === "ia" || needle === "ai" || needle === "3d" || needle === "ar"
        ? new RegExp(`(?:^|[^\\p{L}])${needle}(?:$|[^\\p{L}])`, "iu").test(normalized)
        : normalized.includes(needle);
    }),
  );

  const contextualQuestion = priorPricingContext && Boolean(service) &&
    (/^\s*(et\s+pour|et\s+le|et\s+la|et\s+l['’]|and\s+(for|what\s+about)|what\s+about|o\s+chno\s+3la|w\s+)?[^.!]{1,70}\?\s*$/i.test(text));
  if (!hasPricingIntent && !contextualQuestion) return null;

  return { requested: true, language: detectPricingLanguage(text), ...(service ? { service } : {}) };
}

export function formatPriceForSpeech(service: PricingService, language: PricingLanguage): string {
  if (service.price === null) return language === "en" ? "custom quote" : language === "darija" ? "devis على حساب الطلب" : "sur devis";
  return service.displayPrice;
}

export function formatPricingReply(match: PricingMatch): string {
  const { language, service } = match;
  if (service) {
    const price = formatPriceForSpeech(service, language);
    const disclaimer = pricingDisclaimer[language];
    if (language === "en") return `${service.nameEn}: **from ${price}**. ${disclaimer}`;
    if (language === "darija") return `الثمن ديال **${service.nameDarija}** كيبدا من **${price}**. ${disclaimer}`;
    return `${service.name} : **à partir de ${price}**. ${disclaimer}`;
  }

  const rows = pricingServices.map((item) => {
    const price = formatPriceForSpeech(item, language);
    if (language === "en") return `- **${item.nameEn}:** from ${price}`;
    if (language === "darija") return `- **${item.nameDarija}:** ${item.price === null ? price : `ابتداءً من ${price}`}`;
    return `- **${item.name} :** à partir de ${price}`;
  });
  const list = rows.join("\n");
  return language === "en"
    ? `Here are the indicative starting prices:\n\n${list}\n\n${pricingDisclaimer.en}`
    : language === "darija"
      ? `Hado tamanat l-ibtida2iya:\n\n${list}\n\n${pricingDisclaimer.darija}`
      : `Voici les tarifs indicatifs de départ :\n\n${list}\n\n${pricingDisclaimer.fr}`;
}
