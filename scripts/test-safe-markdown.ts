import assert from "node:assert/strict";
import { renderSafeMarkdown } from "../lib/safe-markdown.ts";

const rendered = renderSafeMarkdown("# Heading\n- **bold** and `code`\n<script>alert(1)</script>");
assert.match(rendered, /<h1>Heading<\/h1>/);
assert.match(rendered, /<ul><li><strong>bold<\/strong> and <code>code<\/code><\/li><\/ul>/);
assert.match(rendered, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.doesNotMatch(rendered, /<script>/);
console.log("safe markdown headings, lists, bold, code and HTML escaping: PASS");
