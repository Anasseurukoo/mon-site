import Image from "next/image";
import type { ReactNode } from "react";
import type { AssistantImageMessage, AssistantTextMessage } from "@/components/ai/message-types";

function safeHref(value: string): string | null {
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function inlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<>]+)/g;
  const output: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) output.push(text.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      output.push(<strong key={`${keyPrefix}-${index++}`} className="font-semibold text-ivory">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      output.push(<em key={`${keyPrefix}-${index++}`}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = link ? safeHref(link[2]!) : null;
      output.push(href && link
        ? <a key={`${keyPrefix}-${index++}`} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-gold-soft underline underline-offset-4">{link[1]}</a>
        : token);
    } else {
      const href = safeHref(token);
      output.push(href
        ? <a key={`${keyPrefix}-${index++}`} href={href} target="_blank" rel="noreferrer" className="break-all text-gold-soft underline underline-offset-4">{token}</a>
        : token);
    }
    cursor = match.index + token.length;
  }
  if (cursor < text.length) output.push(text.slice(cursor));
  return output;
}

/** Small safe Markdown subset: paragraphs, emphasis, links and ordered/unordered lists. */
function AssistantText({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: { text: string; ordered: boolean }[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`p-${key++}`} className="whitespace-pre-wrap">{inlineMarkdown(paragraph.join(" "), `p${key}`)}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    const ordered = listItems[0]!.ordered;
    const Tag = ordered ? "ol" : "ul";
    blocks.push(<Tag key={`l-${key++}`} className={ordered ? "list-decimal space-y-1 pl-5" : "list-disc space-y-1 pl-5"}>
      {listItems.map((item, index) => <li key={index}>{inlineMarkdown(item.text, `l${key}-${index}`)}</li>)}
    </Tag>);
    listItems = [];
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (listItems.length && listItems[0]!.ordered !== ordered) flushList();
      listItems.push({ text: (bullet ?? numbered)![1]!, ordered });
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();

  return <div className="space-y-3 break-words">{blocks}</div>;
}

export function AssistantMessage({ message }: { message: AssistantTextMessage | AssistantImageMessage }) {
  if (message.kind === "image") {
    return (
      <figure className="overflow-hidden border border-line-gold/60 bg-charcoal">
        <Image
          src={message.image.src}
          alt={message.image.alt}
          width={message.image.width}
          height={message.image.height}
          sizes="(max-width: 640px) 82vw, 470px"
          className="h-auto w-full object-contain"
          priority={false}
        />
      </figure>
    );
  }

  return <AssistantText text={message.text} />;
}
