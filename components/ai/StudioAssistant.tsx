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

type Message = { from: "ai" | "user"; text: string; showPricingBrochure?: boolean };
type ApiMessage = { role: "assistant" | "user"; content: string };

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
  if (error instanceof DOMException && error.name === "AbortError") {
    return "La réponse prend trop de temps. Tu peux réessayer dans un instant.";
  }
  if (!(error instanceof Error)) {
    return "La connexion à BBA AI a échoué. Réessaie ou écris-moi par e-mail.";
  }
  if (error.message === "RATE_LIMITED") {
    return "Tu as atteint la limite temporaire de demandes. Réessaie dans quelques minutes.";
  }
  if (error.message === "NOT_CONFIGURED") {
    return "BBA AI est en cours de configuration. Tu peux me contacter directement par e-mail.";
  }
  if (error instanceof TypeError) {
    return "Connexion impossible pour le moment. Vérifie ton réseau puis réessaie.";
  }
  return "BBA AI ne peut pas répondre pour le moment. Réessaie ou écris-moi par e-mail.";
}

async function requestAi(conversation: Message[]): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 25_000);

  try {
    const history: ApiMessage[] = conversation.slice(-12).map((message) => ({
      role: message.from === "user" ? "user" : "assistant",
      content: message.text,
    }));

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | { reply?: string }
      | null;

    if (response.status === 429) throw new Error("RATE_LIMITED");
    if (response.status === 503) throw new Error("NOT_CONFIGURED");
    if (!response.ok || typeof payload?.reply !== "string" || !payload.reply.trim()) {
      throw new Error("REQUEST_FAILED");
    }

    return payload.reply.trim();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function StudioAssistant() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedConversation, setFailedConversation] = useState<Message[] | null>(null);
  const [pricingContext, setPricingContext] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "Salut. Je suis BBA AI. Dis-moi ce que tu veux construire — je t’aide à transformer l’idée en brief clair.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const suggestions = useMemo(
    () => (messages.length < 3 && !loading ? QUICK : []),
    [messages.length, loading],
  );

  const close = () => setOpen(false);
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

  const completeRequest = async (conversation: Message[]) => {
    setLoading(true);
    setError(null);
    try {
      const reply = await requestAi(conversation);
      setMessages((current) => [...current, { from: "ai", text: reply }]);
      setFailedConversation(null);
    } catch (requestError) {
      setFailedConversation(conversation);
      setError(messageForError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const send = async (value: string) => {
    const text = value.trim();
    if (!text || text.length > 1200 || loading) return;

    const nextMessages = [...messages, { from: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");

    const pricing = matchPricingRequest(text, pricingContext);
    if (pricing) {
      setPricingContext(true);
      setError(null);
      setFailedConversation(null);
      setMessages([...nextMessages, {
        from: "ai",
        text: formatPricingReply(pricing),
        showPricingBrochure: true,
      }]);
      return;
    }

    await completeRequest(nextMessages);
  };

  const retry = async () => {
    if (!failedConversation || loading) return;
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
                    {message.from === "ai" ? <AssistantMessage text={message.text} /> : message.text}
                    {message.showPricingBrochure && <PricingBrochure />}
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
                    <p className="text-sm leading-relaxed text-ivory-dim">{error}</p>
                    {failedConversation && (
                      <button
                        type="button"
                        onClick={() => void retry()}
                        className="mt-3 min-h-11 border border-line-strong px-3 py-2 text-xs text-ivory transition hover:border-gold"
                        disabled={loading}
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <form onSubmit={onSubmit} className="border-t border-line p-4">
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
