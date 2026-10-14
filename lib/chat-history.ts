import type { ChatMessage } from "@/components/ai/message-types";

export type ApiMessage = { role: "assistant" | "user"; content: string };

/** Image-only UI messages never become blank assistant turns in the AI request. */
export function toApiHistory(conversation: ChatMessage[]): ApiMessage[] {
  return conversation
    .filter(
      (message): message is Extract<ChatMessage, { kind: "text" }> =>
        message.kind === "text" && !(message.from === "user" && message.excludedFromAi),
    )
    .slice(-12)
    .map((message) => ({
      role: message.from === "user" ? "user" : "assistant",
      content: message.text,
    }));
}
