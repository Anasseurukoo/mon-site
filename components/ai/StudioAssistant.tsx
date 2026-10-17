"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { EASE } from "@/lib/motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AssistantMessage } from "@/components/ai/AssistantMessage";
import { PricingBrochure } from "@/components/ai/PricingBrochure";
import { formatPricingReply, matchPricingRequest } from "@/data/pricing";
import type { ChatMessage, UserMessage } from "@/components/ai/message-types";
import { toApiHistory } from "@/lib/chat-history";
import { nextRespectModeImage, shouldTriggerRespectMode } from "@/lib/respect-mode";
import { BbaAiError, requestBbaAi } from "../../public/ai/bba-ai-client.js";

const QUICK = [
  "Je veux un site premium",
  "Je veux une application mobile",
  "Je veux ajouter de l’IA",
  "Je veux un essayage virtuel",
];

const AI_ENDPOINT =
  process.env.NEXT_PUBLIC_BBA_AI_ENDPOINT?.trim() ||
  "https://ydsnzlhcdirhtmmcucbb.supabase.co/functions/v1/bba-ai";

function messageForError(error: unknown): string {
  if (!(error instanceof BbaAiError)) {
    return "La connexion à BBA AI a échoué. Réessaie ou écris-moi par e-mail.";
  }
  if (error.code === "RATE_LIMITED") {
    return "Tu as atteint la limite temporaire de demandes. Réessaie dans quelques minutes.";
  }
  if (error.code === "NETWORK_ERROR") {
    return "Connexion impossible pour le moment. Vérifie ton réseau puis réessaie.";
  }
  if (error.code === "TIMEOUT") return "La réponse prend trop de temps. Tu peux réessayer dans un instant.";
  return "BBA AI ne peut pas répondre pour le moment. Réessaie ou écris-moi par e-mail.";
}

export function StudioAssistant() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedConversation, setFailedConversation] = useState<ChatMessage[] | null>(null);
  const [retryBlocked, setRetryBlocked] = useState(false);
  const [serverFailure, setServerFailure] = useState(false);
  const [pricingContext, setPricingContext] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "ai",
      kind: "text",
      text: "Salut. Je suis BBA AI. Dis-moi ce que tu veux construire — je t’aide à transformer l’idée en brief clair.",
    },
  ]);
  const lastRespectImageRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const suggestions = useMemo(
    () => (messages.length < 3 && !loading ? QUICK : []),
    [messages.length, loading],
  );

  const close = () => {
    requestControllerRef.current?.abort();
    setOpen(false);
  };
  useScrollLock(open);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "end" });
  }, [messages, loading, error, open, prefersReduced]);

  useEffect(() => () => {
    requestControllerRef.current?.abort();
    if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
  }, []);

  const completeRequest = async (conversation: ChatMessage[]) => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setLoading(true);
    setError(null);
    setServerFailure(false);
    try {
      const { reply } = await requestBbaAi(AI_ENDPOINT, toApiHistory(conversation), {
        signal: controller.signal,
        hasImages: conversation.some((message) => message.kind === "image"),
      });
      setMessages((current) => [...current, { from: "ai", kind: "text", text: reply }]);
      setFailedConversation(null);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setFailedConversation(conversation);
      setError(messageForError(requestError));
      const retryAfter = requestError instanceof BbaAiError ? requestError.retryAfter : 0;
      setRetryBlocked(true);
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = window.setTimeout(() => setRetryBlocked(false), Math.max(3, retryAfter) * 1_000);
      setServerFailure(requestError instanceof BbaAiError && ["SERVICE_UNAVAILABLE", "TIMEOUT", "NETWORK_ERROR"].includes(requestError.code));
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const send = async (value: string) => {
    const text = value.trim();
    if (!text || text.length > 1200 || loading) return;

    const respectMode = shouldTriggerRespectMode(text);
    const userMessage: UserMessage = respectMode
      ? { from: "user", kind: "text", text, excludedFromAi: true }
      : { from: "user", kind: "text", text };
    const nextMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    if (respectMode) {
      const selection = nextRespectModeImage(lastRespectImageRef.current);
      lastRespectImageRef.current = selection.index;
      setError(null);
      setFailedConversation(null);
      setMessages([...nextMessages, { from: "ai", kind: "image", image: selection.image }]);
      return;
    }

    const pricing = matchPricingRequest(text, pricingContext);
    if (pricing) {
      setPricingContext(true);
      setError(null);
      setFailedConversation(null);
      setMessages([...nextMessages, {
        from: "ai",
        kind: "text",
        text: formatPricingReply(pricing),
        showPricingBrochure: true,
      }]);
      return;
    }

    await completeRequest(nextMessages);
  };

  const retry = async () => {
    if (!failedConversation || loading || retryBlocked) return;
    await completeRequest(failedConversation);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-90 flex min-h-12 items-center gap-3 border border-line-gold bg-sumi/95 p-2.5 shadow-2xl backdrop-blur-xl transition hover:border-gold sm:bottom-7 sm:right-7 sm:px-4 sm:py-3"
        aria-label="Ouvrir BBA AI — parle-moi de ton projet"
        aria-haspopup="dialog"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-gold/40 font-display text-lg text-gold" aria-hidden="true">
          道
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="label block text-gold">BBA AI</span>
          <span className="block text-xs text-ivory-dim">Parle-moi de ton projet</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-110 flex items-end justify-end bg-sumi/70 p-0 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0.12 : 0.3 }}
          >
            <button
              type="button"
              aria-label="Fermer l’assistant"
              className="absolute inset-0 cursor-default"
              onClick={close}
            />
            <motion.section
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              tabIndex={-1}
              className="relative z-10 flex h-[min(88svh,48rem)] w-full max-w-xl flex-col border border-line-strong bg-charcoal shadow-2xl sm:h-[min(82svh,48rem)]"
              initial={{ y: prefersReduced ? 0 : 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: prefersReduced ? 0 : 30, opacity: 0 }}
              transition={{ duration: prefersReduced ? 0.15 : 0.45, ease: EASE.dojo }}
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="label text-gold">BBA AI · Digital Dojo</p>
                  <p className="mt-1 text-xs text-steel">Conçu et développé par BuiltByAnas</p>
                  <h2 id={`${uid}-title`} className="mt-1 font-display text-2xl text-ivory">
                    Qu’est-ce qu’on construit ?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-11 w-11 items-center justify-center border border-line-strong text-xl text-steel transition hover:border-gold hover:text-ivory"
                  aria-label="Fermer l’assistant"
                >
                  ×
                </button>
              </header>

              <div
                className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
                role="log"
                aria-label="Conversation avec BBA AI"
                aria-relevant="additions"
                aria-busy={loading}
              >
                {messages.map((message, index) => (
                  <div
                    key={`${message.from}-${index}`}
                    className={
                      message.from === "user"
                        ? "ml-auto max-w-[85%] border border-line-gold bg-gold/8 px-4 py-3 text-sm leading-relaxed text-ivory"
                        : "max-w-[90%] border border-line bg-sumi-deep/65 px-4 py-3 text-sm leading-relaxed text-ivory-dim"
                    }
                  >
                    {message.from === "ai" ? <AssistantMessage message={message} /> : message.text}
                    {message.from === "ai" && message.kind === "text" && message.showPricingBrochure && <PricingBrochure />}
                  </div>
                ))}

                {loading && (
                  <div className="max-w-[90%] border border-line bg-sumi-deep/65 px-4 py-3 text-sm text-ivory-dim" role="status">
                    BBA AI réfléchit…
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2" aria-label="Suggestions">
                    {suggestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void send(question)}
                        className="min-h-11 border border-line-strong px-3 py-2 text-left text-xs text-steel transition hover:border-gold hover:text-ivory"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="border border-vermilion/50 bg-sumi-deep/75 p-4" role="alert">
                    {serverFailure && (
                      <div data-server-error-meme-slot className="mb-3 flex min-h-24 items-center justify-center border border-dashed border-line-strong px-4 text-center text-xs text-steel">
                        Illustration d’indisponibilité temporaire — emplacement réservé
                      </div>
                    )}
                    <p className="text-sm leading-relaxed text-ivory-dim">{error}</p>
                    {failedConversation && (
                      <button
                        type="button"
                        onClick={() => void retry()}
                        className="mt-3 min-h-11 border border-line-strong px-3 py-2 text-xs text-ivory transition hover:border-gold"
                        disabled={loading || retryBlocked}
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <form onSubmit={onSubmit} className="sticky bottom-0 border-t border-line bg-charcoal p-4">
                <label htmlFor={`${uid}-input`} className="sr-only">Ton message</label>
                <div className="flex gap-2">
                  <input
                    id={`${uid}-input`}
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ex. : J’ai un magasin d’optique…"
                    maxLength={1200}
                    disabled={loading}
                    autoComplete="off"
                    className="min-h-12 min-w-0 flex-1 border border-line-strong bg-sumi-deep px-4 py-3 text-sm outline-none placeholder:text-steel-dim focus:border-gold disabled:opacity-60"
                  />
                  <button
                    className="min-h-12 border border-gold bg-gold px-4 py-3 font-mono text-xs uppercase tracking-widest text-sumi transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={loading || !input.trim()}
                  >
                    {loading ? "…" : "Envoyer"}
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-steel-dim">
                  BBA AI peut se tromper. Ne partage pas d’informations sensibles.
                </p>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
