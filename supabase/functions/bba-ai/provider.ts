import {
  parseGeminiReply,
  retryDelayMs,
  shouldRetryStatus,
  type ChatMessage,
  type GeminiResponse,
} from "./core.ts";

export const DEFAULT_MODEL_CANDIDATES = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
] as const;

type FetchLike = typeof fetch;
type Sleep = (milliseconds: number) => Promise<void>;

export type ProviderFailure = {
  ok: false;
  category: string;
  retryAfter?: string | null;
};

export type ProviderResult = { ok: true; reply: string; model: string } | ProviderFailure;

export type ProviderOptions = {
  apiKey: string;
  messages: ChatMessage[];
  systemPrompt: string;
  deadlineAt: number;
  candidates?: readonly string[];
  fetchImpl?: FetchLike;
  sleep?: Sleep;
  now?: () => number;
  random?: () => number;
  maxAttemptsPerModel?: number;
};

type ModelListResponse = {
  models?: Array<{
    name?: unknown;
    supportedGenerationMethods?: unknown;
  }>;
};

const MODEL_CACHE_TTL_MS = 10 * 60 * 1_000;
let modelCache: { models: Set<string>; expiresAt: number } | null = null;

export function resetModelDiscoveryCacheForTests() {
  modelCache = null;
}

export async function discoverGenerateContentModels(
  apiKey: string,
  fetchImpl: FetchLike = fetch,
  signal?: AbortSignal,
) {
  const response = await fetchImpl(
    "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",
    {
      headers: { "x-goog-api-key": apiKey },
      signal,
    },
  );
  if (!response.ok) throw new Error(`model_discovery_${response.status}`);
  const data = (await response.json()) as ModelListResponse;
  return new Set(
    (data.models ?? [])
      .filter(
        (model) =>
          Array.isArray(model.supportedGenerationMethods) &&
          model.supportedGenerationMethods.includes("generateContent"),
      )
      .map((model) =>
        typeof model.name === "string" ? model.name.replace(/^models\//, "") : "",
      )
      .filter(Boolean),
  );
}

function contents(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

async function attemptModel(model: string, options: ProviderOptions): Promise<ProviderResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep =
    options.sleep ??
    ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
  const now = options.now ?? Date.now;
  const random = options.random ?? Math.random;
  const maxAttempts = options.maxAttemptsPerModel ?? 2;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const remaining = options.deadlineAt - now();
    if (remaining <= 250) return { ok: false, category: "deadline" };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remaining);
    try {
      const response = await fetchImpl(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "x-goog-api-key": options.apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: options.systemPrompt }] },
            contents: contents(options.messages),
            generationConfig: { maxOutputTokens: 450 },
          }),
          signal: controller.signal,
        },
      );
      const data = (await response.json().catch(() => null)) as GeminiResponse | null;
      if (response.ok) {
        const reply = parseGeminiReply(data);
        return reply ? { ok: true, reply, model } : { ok: false, category: "empty_or_blocked" };
      }
      const retryAfter = response.headers.get("retry-after");
      if (!shouldRetryStatus(response.status) || attempt === maxAttempts - 1) {
        return { ok: false, category: `provider_${response.status}`, retryAfter };
      }
      const delay = retryDelayMs(attempt, retryAfter, options.deadlineAt - now(), random());
      if (delay <= 0) return { ok: false, category: "deadline", retryAfter };
      await sleep(delay);
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      if (attempt === maxAttempts - 1 || options.deadlineAt - now() <= 250) {
        return { ok: false, category: timedOut ? "timeout" : "network" };
      }
      const delay = retryDelayMs(attempt, null, options.deadlineAt - now(), random());
      if (delay <= 0) return { ok: false, category: "deadline" };
      await sleep(delay);
    } finally {
      clearTimeout(timeout);
    }
  }
  return { ok: false, category: "unknown" };
}

export async function routeGemini(options: ProviderOptions): Promise<ProviderResult> {
  let discovered: Set<string>;
  const now = options.now ?? Date.now;
  if (modelCache && modelCache.expiresAt > now()) {
    discovered = modelCache.models;
  } else {
    const remaining = options.deadlineAt - now();
    if (remaining <= 250) return { ok: false, category: "deadline" };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remaining);
    try {
      discovered = await discoverGenerateContentModels(
        options.apiKey,
        options.fetchImpl,
        controller.signal,
      );
      modelCache = { models: discovered, expiresAt: now() + MODEL_CACHE_TTL_MS };
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      return { ok: false, category: timedOut ? "timeout" : "model_discovery_failed" };
    } finally {
      clearTimeout(timeout);
    }
  }
  const models = (options.candidates ?? DEFAULT_MODEL_CANDIDATES).filter((model) =>
    discovered.has(model),
  );
  if (!models.length) return { ok: false, category: "no_supported_model" };

  let lastFailure: ProviderFailure = { ok: false, category: "no_supported_model" };
  for (const model of models) {
    if (options.deadlineAt - (options.now ?? Date.now)() <= 250) {
      return { ok: false, category: "deadline", retryAfter: lastFailure.retryAfter };
    }
    const result = await attemptModel(model, options);
    if (result.ok) return result;
    lastFailure = result;
    if (result.category === "deadline" || result.category === "timeout") break;
  }
  return lastFailure;
}
