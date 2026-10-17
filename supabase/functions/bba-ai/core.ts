export type ChatMessage = { role: "user" | "assistant"; content: string };
export type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
};

export const MAX_BODY_BYTES = 20_000;
export const MAX_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 1_200;
export const MAX_TOTAL_CHARS = 6_000;

export async function readLimitedJson(req: Request, limit = MAX_BODY_BYTES) {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) return { error: "too_large" as const };
  const reader = req.body?.getReader();
  if (!reader) return { error: "invalid_json" as const };
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        return { error: "too_large" as const };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return { value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { error: "invalid_json" as const };
  }
}

export function validateMessages(value: unknown): { messages?: ChatMessage[]; error?: string } {
  if (!value || typeof value !== "object" || !Array.isArray((value as { messages?: unknown }).messages)) {
    return { error: "A conversation is required." };
  }
  const raw = (value as { messages: unknown[] }).messages;
  if (!raw.length || raw.length > MAX_MESSAGES) return { error: "The conversation is outside the allowed length." };
  let total = 0;
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return { error: "A message is invalid." };
    const message = item as { role?: unknown; content?: unknown };
    if (message.role !== "user" && message.role !== "assistant") return { error: "A message role is invalid." };
    if (typeof message.content !== "string") return { error: "A message is invalid." };
    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) return { error: "Each message must contain between 1 and 1200 characters." };
    total += content.length;
    messages.push({ role: message.role, content });
  }
  if (total > MAX_TOTAL_CHARS) return { error: "The conversation is too long. Start a new chat." };
  if (messages.at(-1)?.role !== "user") return { error: "A user message is required." };
  return { messages };
}

export function shouldRetryStatus(status: number) {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

export function retryDelayMs(attempt: number, retryAfter: string | null, remainingMs: number, random = Math.random()) {
  const numeric = retryAfter ? Number(retryAfter) : Number.NaN;
  const headerMs = Number.isFinite(numeric) ? numeric * 1_000 : 0;
  const dateMs = retryAfter && !Number.isFinite(numeric) ? Math.max(0, Date.parse(retryAfter) - Date.now()) : 0;
  const exponential = 350 * 2 ** attempt + Math.floor(random * 250);
  return Math.max(0, Math.min(Math.max(headerMs, dateMs, exponential), remainingMs - 250));
}

export function parseGeminiReply(data: GeminiResponse | null) {
  if (!data || data.promptFeedback?.blockReason) return null;
  const reply = data.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => typeof part.text === "string" ? part.text : "")
    .filter(Boolean)
    .join("\n")
    .trim();
  return reply || null;
}
