"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { PricingBrochure } from "@/components/ai/PricingBrochure";
import type { ChatMessage, UserMessage } from "@/components/ai/message-types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { toApiHistory } from "@/lib/chat-history";
import { nextRespectModeImage, shouldTriggerRespectMode } from "@/lib/respect-mode";
import { formatPricingReply, matchPricingRequest } from "@/data/pricing";
import { BbaAiError, requestBbaAi } from "../../public/ai/bba-ai-client.js";
import styles from "./DigitalDojoAssistant.module.css";

const AI_ENDPOINT =
  process.env.NEXT_PUBLIC_BBA_AI_ENDPOINT?.trim() ||
  "https://ydsnzlhcdirhtmmcucbb.supabase.co/functions/v1/bba-ai";
const QUICK = [
  "Je veux un site premium",
  "Je veux une application mobile",
  "Je veux ajouter de l’IA",
];

function messageForError(error: unknown): string {
  if (!(error instanceof BbaAiError))
    return "La connexion à BBA AI a échoué. Réessaie ou écris-moi par e-mail.";
  if (error.code === "RATE_LIMITED")
    return "Tu as atteint la limite temporaire de demandes. Réessaie dans quelques minutes.";
  if (error.code === "NETWORK_ERROR")
    return "Connexion impossible pour le moment. Vérifie ton réseau puis réessaie.";
  if (error.code === "TIMEOUT")
    return "La réponse prend trop de temps. Tu peux réessayer dans un instant.";
  return "BBA AI ne peut pas répondre pour le moment. Réessaie ou écris-moi par e-mail.";
}

function InkText({ text, reduced }: { text: string; reduced: boolean }) {
  return <span className={reduced ? styles.inkTextReduced : styles.inkText}>{text}</span>;
}

function FourierA({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const media = window.matchMedia("(min-width: 901px)");
    let frame = 0;
    const draw = (time: number) => {
      if (!media.matches) return;
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      if (
        canvas.width !== Math.round(bounds.width * scale) ||
        canvas.height !== Math.round(bounds.height * scale)
      ) {
        canvas.width = Math.round(bounds.width * scale);
        canvas.height = Math.round(bounds.height * scale);
      }
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.strokeStyle = "rgba(213, 174, 99, .42)";
      context.lineWidth = 1;
      context.beginPath();
      const pulse = time / 950;
      for (let index = 0; index <= 160; index += 1) {
        const progress = index / 160;
        const x = bounds.width * (0.16 + progress * 0.68) + Math.sin(progress * 18 + pulse) * 3;
        const y =
          bounds.height * (0.76 - Math.sin(progress * Math.PI) * 0.55) +
          Math.cos(progress * 14 - pulse) * 4;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.beginPath();
      context.moveTo(bounds.width * 0.29, bounds.height * 0.7);
      context.lineTo(bounds.width * 0.5, bounds.height * 0.18);
      context.lineTo(bounds.width * 0.7, bounds.height * 0.7);
      context.moveTo(bounds.width * 0.38, bounds.height * 0.49);
      context.lineTo(bounds.width * 0.62, bounds.height * 0.49);
      context.stroke();
      frame = window.requestAnimationFrame(draw);
    };
    const refresh = () => {
      window.cancelAnimationFrame(frame);
      if (media.matches) frame = window.requestAnimationFrame(draw);
    };
    media.addEventListener("change", refresh);
    const observer = new ResizeObserver(refresh);
    observer.observe(canvas);
    refresh();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", refresh);
    };
  }, [reduced]);
  return (
    <aside className={styles.fourier} aria-hidden="true">
      <canvas ref={canvasRef} />
      <p>F(ω) = ∫ f(t)e⁻ⁱωᵗ dt</p>
      <p>∑ aₙ sin(nωt)</p>
    </aside>
  );
}

export function DigitalDojoAssistant() {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const lastRespectImageRef = useRef(-1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverFailure, setServerFailure] = useState(false);
  const [retryBlocked, setRetryBlocked] = useState(false);
  const [failedConversation, setFailedConversation] = useState<ChatMessage[] | null>(null);
  const [pricingContext, setPricingContext] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "ai",
      kind: "text",
      text: "Bienvenue dans le Digital Dojo. Dis-moi ce que tu veux construire — je t’aide à transformer l’idée en brief clair.",
    },
  ]);
  const suggestions = useMemo(
    () => (messages.length < 3 && !loading ? QUICK : []),
    [loading, messages.length],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "end" });
  }, [error, loading, messages, reduced]);
  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
    },
    [],
  );

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
      retryTimerRef.current = window.setTimeout(
        () => setRetryBlocked(false),
        Math.max(3, retryAfter) * 1000,
      );
      setServerFailure(
        requestError instanceof BbaAiError &&
          ["SERVICE_UNAVAILABLE", "TIMEOUT", "NETWORK_ERROR"].includes(requestError.code),
      );
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
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setInput("");
    if (respectMode) {
      const selection = nextRespectModeImage(lastRespectImageRef.current);
      lastRespectImageRef.current = selection.index;
      setError(null);
      setFailedConversation(null);
      setMessages([...conversation, { from: "ai", kind: "image", image: selection.image }]);
      return;
    }
    const pricing = matchPricingRequest(text, pricingContext);
    if (pricing) {
      setPricingContext(true);
      setError(null);
      setFailedConversation(null);
      setMessages([
        ...conversation,
        {
          from: "ai",
          kind: "text",
          text: formatPricingReply(pricing),
          showPricingBrochure: true,
        },
      ]);
      return;
    }
    await completeRequest(conversation);
  };

  const retry = () => {
    if (failedConversation && !loading && !retryBlocked)
      void completeRequest(failedConversation);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const rect = event.currentTarget.getBoundingClientRect();
      rootRef.current?.style.setProperty("--dojo-x", `${event.clientX - rect.left}px`);
      rootRef.current?.style.setProperty("--dojo-y", `${event.clientY - rect.top}px`);
    }
  };

  return (
    <section
      ref={rootRef}
      className={styles.dojo}
      onPointerMove={onPointerMove}
      aria-labelledby={`${uid}-title`}
    >
      <FourierA reduced={reduced} />
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.wand} aria-hidden="true">
        ✦
      </div>
      <div className={styles.workspace}>
        <header className={styles.intro}>
          <Image
            src="/assets/brand/builtbyanas-dojo-logo-transparent.png"
            width={176}
            height={56}
            alt="BuiltByAnas"
            priority
          />
          <p>TRADITION MEETS TECHNOLOGY</p>
          <h1 id={`${uid}-title`}>
            Enter the <em>Dojo.</em>
          </h1>
          <span>Une conversation utile, pensée avec calme et précision.</span>
        </header>
        <article className={styles.paper}>
          <div className={styles.lamps} aria-hidden="true">
            <span>灯</span>
            <span>灯</span>
          </div>
          <div className={styles.paperLight} aria-hidden="true" />
          <header className={styles.chatbar}>
            <div>
              <strong>BBA AI</strong>
              <span>Digital Dojo</span>
            </div>
            <b>RESPECT MODE</b>
          </header>
          <div
            className={styles.messages}
            role="log"
            aria-label="Conversation avec BBA AI"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={loading}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={message.from === "user" ? styles.userBubble : styles.aiBubble}
              >
                {message.kind === "image" ? (
                  <Image
                    src={message.image.src}
                    alt={message.image.alt}
                    width={message.image.width}
                    height={message.image.height}
                  />
                ) : message.from === "ai" ? (
                  <InkText text={message.text} reduced={reduced} />
                ) : (
                  message.text
                )}
                {message.from === "ai" &&
                  message.kind === "text" &&
                  message.showPricingBrochure && <PricingBrochure />}
              </div>
            ))}
            {loading && (
              <div className={styles.thinking} role="status">
                BBA AI prépare l’encre…
              </div>
            )}
            {suggestions.length > 0 && (
              <div className={styles.suggestions} aria-label="Suggestions">
                {suggestions.map((question) => (
                  <button key={question} type="button" onClick={() => void send(question)}>
                    {question}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div className={styles.error} role="alert">
                {serverFailure && (
                  <div data-server-error-meme-slot className={styles.errorIllustration}>
                    Indisponibilité temporaire
                  </div>
                )}
                <p>{error}</p>
                {failedConversation && (
                  <button type="button" onClick={retry} disabled={loading || retryBlocked}>
                    Réessayer
                  </button>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form className={styles.composer} onSubmit={submit}>
            <label htmlFor={`${uid}-input`}>Écris ton intention</label>
            <textarea
              id={`${uid}-input`}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setWriting(true);
              }}
              onBlur={() => setWriting(false)}
              onKeyDown={onKeyDown}
              maxLength={1200}
              disabled={loading}
              placeholder="Ex. : J’ai un magasin d’optique…"
              autoComplete="off"
            />
            <button
              className={`${styles.quill} ${writing ? styles.writing : ""} ${loading ? styles.thinkingQuill : ""}`}
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Envoyer le message à BBA AI"
            >
              <span aria-hidden="true">✒</span>
            </button>
            <p>Ne partage pas d’informations sensibles. BBA AI peut se tromper.</p>
          </form>
        </article>
      </div>
    </section>
  );
}
