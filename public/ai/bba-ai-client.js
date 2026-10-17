const CACHE_VERSION = "bba-ai-v2";
const CACHE_TTL_MS = 120_000;
const CACHE_MAX = 20;
const REQUEST_TIMEOUT_MS = 24_000;
const cache = new Map();
const inFlight = new Map();
const sessionNonce = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
const sensitivePattern = /\b(?:password|mot de passe|api[_ -]?key|secret|token|iban|carte bancaire|credit card|adresse|address|phone|telephone|email|e-mail|cin|passport)\b|@/iu;

export class BbaAiError extends Error {
  constructor(code, retryAfter = 0) {
    super(code);
    this.name = "BbaAiError";
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function normalizeHistory(messages) {
  return messages.slice(-12).map(({ role, content }) => ({ role, content: content.trim().replace(/\s+/g, " ") }));
}

export function isCacheEligible(messages, options = {}) {
  if (options.respectMode || options.hasImages || messages.length !== 1) return false;
  const message = messages[0];
  return message?.role === "user" && message.content.length <= 240 && !sensitivePattern.test(message.content);
}

async function digest(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) { cache.delete(key); return null; }
  cache.delete(key);
  cache.set(key, entry);
  return entry.reply;
}

function writeCache(key, reply) {
  cache.set(key, { reply, expiresAt: Date.now() + CACHE_TTL_MS });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
}

function withCallerCancellation(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
  return Promise.race([
    promise,
    new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true })),
  ]);
}

export async function requestBbaAi(endpoint, messages, options = {}) {
  const normalized = normalizeHistory(messages);
  const eligible = isCacheEligible(normalized, options);
  const key = await digest(`${CACHE_VERSION}:${sessionNonce}:${JSON.stringify(normalized)}`);
  if (eligible) {
    const cached = readCache(key);
    if (cached) return { reply: cached, source: "cache" };
  }
  const existing = inFlight.get(key);
  if (existing) return withCallerCancellation(existing, options.signal);

  const promise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: normalized }), signal: controller.signal });
      const payload = await response.json().catch(() => null);
      const retryAfter = Math.max(0, Number(response.headers.get("retry-after")) || 0);
      if (response.status === 429) throw new BbaAiError(payload?.code === "QUOTA_EXHAUSTED" ? "QUOTA_EXHAUSTED" : "RATE_LIMITED", retryAfter);
      if (response.status === 502 || response.status === 503 || response.status === 504) throw new BbaAiError("SERVICE_UNAVAILABLE", retryAfter);
      if (!response.ok || typeof payload?.reply !== "string" || !payload.reply.trim()) throw new BbaAiError("REQUEST_FAILED");
      const reply = payload.reply.trim();
      if (eligible) writeCache(key, reply);
      return { reply, source: "network" };
    } catch (error) {
      if (error instanceof BbaAiError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") throw new BbaAiError("TIMEOUT");
      throw new BbaAiError("NETWORK_ERROR");
    } finally {
      clearTimeout(timeout);
    }
  })();
  inFlight.set(key, promise);
  promise.finally(() => inFlight.delete(key)).catch(() => undefined);
  return withCallerCancellation(promise, options.signal);
}

export function resetBbaAiClientForTests() { cache.clear(); inFlight.clear(); }
