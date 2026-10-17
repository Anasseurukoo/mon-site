export type ApiMessage = { role: "user" | "assistant"; content: string };
export class BbaAiError extends Error { code: string; retryAfter: number; }
export function normalizeHistory(messages: ApiMessage[]): ApiMessage[];
export function isCacheEligible(messages: ApiMessage[], options?: { respectMode?: boolean; hasImages?: boolean }): boolean;
export function requestBbaAi(endpoint: string, messages: ApiMessage[], options?: { signal?: AbortSignal; respectMode?: boolean; hasImages?: boolean }): Promise<{ reply: string; source: "cache" | "network" }>;
export function resetBbaAiClientForTests(): void;
