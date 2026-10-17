"use client";

import { useEffect, useRef } from "react";
import { formatPricingReply, matchPricingRequest } from "@/data/pricing";
import type { ChatMessage, UserMessage } from "@/components/ai/message-types";
import { toApiHistory } from "@/lib/chat-history";
import { shouldTriggerRespectMode, RESPECT_MODE_IMAGES } from "@/lib/respect-mode";
import { shouldShowBuildIdeaReaction } from "@/lib/build-intent";
import { renderSafeMarkdown } from "@/lib/safe-markdown";
import { BbaAiError, requestBbaAi } from "../../public/ai/bba-ai-client.js";

const endpoint =
  process.env.NEXT_PUBLIC_BBA_AI_ENDPOINT?.trim() ||
  "https://ydsnzlhcdirhtmmcucbb.supabase.co/functions/v1/bba-ai";
const initial: ChatMessage[] = [
  {
    from: "ai",
    kind: "text",
    text: "Welcome to your creative space. What would you like to build today?",
  },
];
const respectReactions = RESPECT_MODE_IMAGES.map((image) => image.src);
const buildReaction = "/ai/reactions/image(20261016-211343).png";
const quotaReaction = "/ai/reactions/image(20261016-211052).png";
const outageVideo =
  "/ai/reactions/burned%20out%20%F0%9F%A5%B1%20made%20with%20%40higgsfield.ai.mp4";
function errorText(error: unknown) {
  if (!(error instanceof BbaAiError))
    return "BBA AI cannot respond right now. Please try again shortly.";
  if (error.code === "RATE_LIMITED")
    return "The temporary request limit has been reached. Please try again in a few minutes.";
  if (error.code === "TIMEOUT")
    return "The response is taking too long. Please try again shortly.";
  return "BBA AI is temporarily unavailable. Please try again shortly.";
}

export function ApprovedDojoAi() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    // A full document navigation keeps this static-export iframe boundary stable.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    const navigateHome = () => window.location.assign("/");
    let controller: AbortController | null = null;
    let conversation = [...initial];
    let pricingContext = false;
    let previousRespect = -1;
    let busy = false;
    let attachedDoc: Document | null = null;
    let eventController: AbortController | null = null;
    let injectedStyle: HTMLStyleElement | null = null;
    const attach = () => {
      const doc = frame.contentDocument;
      if (!doc || attachedDoc === doc) return;
      const form = doc.querySelector<HTMLFormElement>("#composer");
      const input = doc.querySelector<HTMLTextAreaElement | HTMLInputElement>("#prompt");
      const messages = doc.querySelector<HTMLElement>("#messages");
      const send = form?.querySelector<HTMLButtonElement>(".send");
      if (!form || !input || !messages || !send) return;
      eventController?.abort();
      injectedStyle?.remove();
      attachedDoc = doc;
      eventController = new AbortController();
      const signal = eventController.signal;
       let engineVerified = false;
       const markEngineAvailable = () => {
         if (engineVerified) return;
         engineVerified = true;
         doc.querySelector(".badge")?.remove();
         doc.querySelector(".note")?.remove();
       };
      let stickToBottom = true;
      const scrollToLatest = (force = false) => {
        if (!force && !stickToBottom) return;
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
      };
      const updateScrollIntent = () => {
        stickToBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight < 32;
      };
      messages.addEventListener("scroll", updateScrollIntent, { passive: true, signal });
      const style = doc.createElement("style");
      style.textContent =
        ".messages .bubble img{display:block;max-width:min(240px,100%);max-height:180px;width:auto;height:auto;object-fit:contain;cursor:zoom-in}.messages .bubble img.bba-expanded{max-width:100%;max-height:none;cursor:zoom-out}#wand-veil{z-index:2147483644!important;pointer-events:none!important}#mouse-aura,#mouse-sparks{z-index:2147483645!important;pointer-events:none!important}#magic-wand{z-index:2147483646!important;pointer-events:none!important}";
      doc.head.append(style);
      injectedStyle = style;
      messages.addEventListener("click", (event) => {
        const image = (event.target as Element).closest(".bubble img");
        if (image) image.classList.toggle("bba-expanded");
      }, { signal });
      const logo = doc.querySelector<HTMLElement>("header strong");
      if (logo) {
        logo.tabIndex = 0;
        logo.setAttribute("role", "link");
        logo.setAttribute("aria-label", "BuiltByAnas — accueil");
        logo.style.cursor = "pointer";
        logo.addEventListener("click", navigateHome, { signal });
        logo.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigateHome();
          }
        }, { signal });
      }
      const hero = doc.querySelector<HTMLElement>("header");
      if (hero) {
        const back = hero.querySelector<HTMLButtonElement>("[data-bba-back]") ?? doc.createElement("button");
        back.type = "button";
        back.dataset.bbaBack = "true";
        back.textContent = "← Back";
        back.setAttribute("aria-label", "Back to BuiltByAnas homepage");
        back.style.cssText =
          "background:none;border:0;color:inherit;font:inherit;cursor:pointer";
        back.addEventListener("click", navigateHome, { signal });
        back.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigateHome();
          }
        }, { signal });
        if (!back.isConnected) hero.append(back);
      }
       const add = (text: string, role: "user" | "assistant" | "error") => {
        const node = doc.createElement("div");
        node.className = `bubble ${role}`;
         if (role === "assistant") node.innerHTML = renderSafeMarkdown(text);
         else node.textContent = text;
        messages.append(node);
        scrollToLatest();
        return node;
      };
      const write = async (text: string) => {
        const node = doc.createElement("div");
        node.className = "bubble assistant writing";
        const avatar = doc.createElement("span");
        avatar.className = "avatar";
        avatar.textContent = "BBA AI / DIGITAL DOJO";
        const copy = doc.createElement("span");
        copy.className = "written-copy";
        node.append(avatar, copy);
        messages.append(node);
        const reduced = frame.contentWindow?.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
         if (reduced) copy.innerHTML = renderSafeMarkdown(text);
        else
          for (let index = 0; index < text.length; index += 3) {
             copy.innerHTML = renderSafeMarkdown(text.slice(0, index + 3));
            scrollToLatest();
            await new Promise((resolve) => window.setTimeout(resolve, 18));
          }
        node.classList.remove("writing");
        scrollToLatest();
      };
      const addReaction = (src: string, alt: string) => {
        const bubble = doc.createElement("div");
        bubble.className = "bubble assistant";
        const image = doc.createElement("img");
        image.src = src;
        image.alt = alt;
        bubble.append(image);
        messages.append(bubble);
        scrollToLatest();
      };
      const request = async (value: string, isBuildIdea = false) => {
        const text = value.trim();
        if (!text || text.length > 1200 || busy) return;
        const respect = shouldTriggerRespectMode(text);
        const user: UserMessage = respect
          ? { from: "user", kind: "text", text, excludedFromAi: true }
          : { from: "user", kind: "text", text };
        conversation = [...conversation, user];
        stickToBottom = true;
        add(text, "user");
        scrollToLatest(true);
        input.value = "";
        if (respect) {
          previousRespect = (previousRespect + 1) % respectReactions.length;
          addReaction(respectReactions[previousRespect]!, "BuiltByAnas Respect Mode");
          return;
        }
         if (isBuildIdea || shouldShowBuildIdeaReaction(text))
           addReaction(buildReaction, "BBA AI is ready to start your project");
        const pricing = matchPricingRequest(text, pricingContext);
        if (pricing) {
          pricingContext = true;
          const reply = formatPricingReply(pricing);
          conversation = [...conversation, { from: "ai", kind: "text", text: reply }];
          await write(reply);
          return;
        }
        busy = true;
        send.disabled = true;
        controller?.abort();
        controller = new AbortController();
        try {
          const result = await requestBbaAi(endpoint, toApiHistory(conversation), {
            signal: controller.signal,
            hasImages: false,
          });
           markEngineAvailable();
          conversation = [...conversation, { from: "ai", kind: "text", text: result.reply }];
          await write(result.reply);
        } catch (error) {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            const outage =
              error instanceof BbaAiError &&
              ["SERVICE_UNAVAILABLE", "TIMEOUT", "NETWORK_ERROR"].includes(error.code);
            if (error instanceof BbaAiError && error.code === "QUOTA_EXHAUSTED") {
              addReaction(
                 quotaReaction,
                "BBA AI request quota reached",
              );
              add(
                "You've used your 10 attempts. Come back when your allowance resets.",
                "error",
              );
            } else if (outage) {
              const bubble = doc.createElement("div");
              bubble.className = "bubble assistant error";
              const video = doc.createElement("video");
              video.src = outageVideo;
              video.controls = true;
              video.preload = "metadata";
              video.setAttribute("aria-label", "BBA AI temporary service outage");
              bubble.append(
                video,
                doc.createTextNode(
                  "Our AI needs a little break 🥱\nWe're experiencing a technical issue. Please try again later.",
                ),
              );
              messages.append(bubble);
              scrollToLatest();
            } else add(errorText(error), "error");
          }
        } finally {
          busy = false;
          send.disabled = false;
          input.focus({ preventScroll: true });
        }
      };
      const submit = (event: Event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        void request(input.value);
      };
      const keydown = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (
          keyboardEvent.key === "Enter" &&
          !keyboardEvent.shiftKey &&
          !keyboardEvent.isComposing
        ) {
          keyboardEvent.preventDefault();
          keyboardEvent.stopImmediatePropagation();
          void request(input.value);
        }
      };
      form.addEventListener("submit", submit, { capture: true, signal });
      input.addEventListener("keydown", keydown, { capture: true, signal });
      doc.querySelectorAll<HTMLButtonElement>(".suggestions button").forEach((button) =>
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            void request(
              button.textContent ?? "",
              /build an idea/i.test(button.textContent ?? ""),
            );
          },
          { capture: true, signal },
        ),
      );
    };
    frame.addEventListener("load", attach);
    attach();
    return () => {
      controller?.abort();
      eventController?.abort();
      injectedStyle?.remove();
      frame.removeEventListener("load", attach);
    };
  }, []);
  return (
    <iframe
      ref={frameRef}
      src="/ai/approved-dojo.html"
      title="BBA AI Digital Dojo"
      className="block h-[100svh] w-full border-0"
    />
  );
}
