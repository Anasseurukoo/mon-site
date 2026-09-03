"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";

type Message = { from: "ai" | "user"; text: string };

type ApiMessage = { role: "assistant" | "user"; content: string };

const QUICK = [
  "Je veux un site premium",
  "Je veux une application mobile",
  "Je veux ajouter de l’AI",
  "Je veux un essayage AR",
];

const AI_ENDPOINT =
  process.env.NEXT_PUBLIC_BBA_AI_ENDPOINT?.trim() ||
  "https://ydsnzlhcdirhtmmcucbb.supabase.co/functions/v1/bba-ai";

export function StudioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "Salut. Je suis BBA AI. Dis-moi ce que tu veux construire — je t’aide à transformer l’idée en brief clair.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(
    () => (messages.length < 3 && !loading ? QUICK : []),
    [messages.length, loading],
  );

  const close = () => setOpen(false);

  useScrollLock(open);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      120,
    );
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const requestAi = async (conversation: Message[]) => {
    if (!AI_ENDPOINT) {
      throw new Error("BBA AI endpoint is not configured.");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25000);

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
        | { reply?: string; error?: string }
        | null;

      if (!response.ok || !payload?.reply) {
        throw new Error(payload?.error || "BBA AI is temporarily unavailable.");
      }

      return payload.reply;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const send = async (value: string) => {
    const text = value.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { from: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await requestAi(nextMessages);
      setMessages((current) => [...current, { from: "ai", text: reply }]);
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      setMessages((current) => [
        ...current,
        {
          from: "ai",
          text: timedOut
            ? "La réponse prend trop de temps. Réessaie dans un instant."
            : error instanceof Error && error.message
            ? error.message
            : "Je n’arrive pas à joindre mon moteur AI pour le moment. Réessaie dans un instant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-90 flex items-center gap-3 border border-line-gold bg-sumi/92 p-2.5 shadow-2xl backdrop-blur-xl transition hover:border-gold sm:bottom-7 sm:right-7 sm:px-4 sm:py-3"
        aria-label="Ouvrir BBA AI — parle-moi de ton projet"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-gold/40 font-display text-lg text-gold">
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
            className="fixed inset-0 z-110 flex items-end justify-end bg-sumi/55 p-0 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Fermer"
              className="absolute inset-0 cursor-default"
              onClick={close}
            />
            <motion.section
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="bba-ai-title"
              tabIndex={-1}
              className="relative z-10 flex h-[82svh] w-full max-w-xl flex-col border border-line-strong bg-charcoal shadow-2xl sm:h-[720px]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE.dojo }}
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="label text-gold">BuiltByAnas / AI Assistant</p>
                  <h2 id="bba-ai-title" className="mt-1 font-display text-2xl text-ivory">
                    Qu’est-ce qu’on construit ?
                  </h2>
                </div>
                <button
                  onClick={close}
                  className="flex h-10 w-10 items-center justify-center border border-line-strong text-xl text-steel transition hover:border-gold hover:text-ivory"
                  aria-label="Fermer l’assistant"
                >
                  ×
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    key={`${message.from}-${index}`}
                    className={
                      message.from === "user"
                        ? "ml-auto max-w-[85%] border border-line-gold bg-gold/8 px-4 py-3 text-sm leading-relaxed text-ivory"
                        : "max-w-[90%] border border-line bg-sumi-deep/65 px-4 py-3 text-sm leading-relaxed text-ivory-dim"
                    }
                  >
                    {message.text}
                  </div>
                ))}

                {loading && (
                  <div className="max-w-[90%] border border-line bg-sumi-deep/65 px-4 py-3 text-sm text-ivory-dim">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                      BBA AI réfléchit…
                    </span>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {suggestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => void send(question)}
                        className="border border-line-strong px-3 py-2 text-left text-xs text-steel transition hover:border-gold hover:text-ivory"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <form onSubmit={onSubmit} className="border-t border-line p-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ex: J’ai un magasin d’optique..."
                    maxLength={1200}
                    disabled={loading}
                    className="min-w-0 flex-1 border border-line-strong bg-sumi-deep px-4 py-3 text-sm outline-none placeholder:text-steel-dim focus:border-gold disabled:opacity-60"
                  />
                  <button
                    className="border border-gold bg-gold px-4 py-3 font-mono text-xs uppercase tracking-widest text-sumi transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={loading || !input.trim()}
                  >
                    {loading ? "..." : "Envoyer"}
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
