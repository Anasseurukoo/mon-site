/**
 * Deliberately small Markdown renderer for AI replies.  It escapes the input
 * first and then emits only the few presentation elements the chat supports.
 * It is not a general HTML renderer, so provider output cannot execute markup.
 */
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

function inline(value: string) {
  let result = escapeHtml(value);
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, href) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );
  return result;
}

/** Safe HTML for a compact Markdown subset: headings, bullets, bold, code and links. */
export function renderSafeMarkdown(value: string) {
  const output: string[] = [];
  let listOpen = false;
  const closeList = () => {
    if (listOpen) output.push("</ul>");
    listOpen = false;
  };

  for (const line of value.split(/\r?\n/)) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1]!.length;
      output.push(`<h${level}>${inline(heading[2]!)}</h${level}>`);
    } else if (bullet) {
      if (!listOpen) output.push("<ul>");
      listOpen = true;
      output.push(`<li>${inline(bullet[1]!)}</li>`);
    } else {
      closeList();
      output.push(line ? `<p>${inline(line)}</p>` : "<br>");
    }
  }
  closeList();
  return output.join("");
}
