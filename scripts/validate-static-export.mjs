import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "out");
const baseUrl = new URL("https://builtbyanas.com/");
const failures = [];
let checkedLocalReferences = 0;

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

async function fileExists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

async function resolveExportPath(rawValue, fromFile) {
  if (!rawValue || rawValue.startsWith("#") || /^(?:data:|mailto:|tel:|javascript:)/i.test(rawValue)) return;
  let url;
  try {
    const sourcePath = `/${path.relative(outputRoot, fromFile).replaceAll("\\", "/")}`;
    url = new URL(rawValue.replaceAll("&amp;", "&"), new URL(sourcePath, baseUrl));
  } catch {
    failures.push(`Invalid URL reference: ${rawValue} in ${path.relative(outputRoot, fromFile)}`);
    return;
  }
  if (url.origin !== baseUrl.origin) return;

  checkedLocalReferences += 1;
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    failures.push(`Invalid encoded path: ${rawValue}`);
    return;
  }
  const candidate = path.resolve(outputRoot, `.${pathname}`);
  if (candidate !== outputRoot && !candidate.startsWith(`${outputRoot}${path.sep}`)) {
    failures.push(`Path escapes export root: ${rawValue}`);
    return;
  }

  const candidates = pathname.endsWith("/")
    ? [path.join(candidate, "index.html")]
    : path.extname(pathname)
      ? [candidate]
      : [path.join(candidate, "index.html"), `${candidate}.html`];
  const candidateResults = await Promise.all(candidates.map(fileExists));
  if (!candidateResults.some(Boolean)) {
    failures.push(`Missing local target: ${rawValue} in ${path.relative(outputRoot, fromFile)}`);
  }
}

const requiredFiles = [
  "index.html",
  "about/index.html",
  "work/index.html",
  "work/joury-optic/index.html",
  "contact/index.html",
  "services/index.html",
  "lab/index.html",
  "sitemap.xml",
  "robots.txt",
  "CNAME",
  "assets/profile/anasse-digital-dojo-notes.png",
  "assets/pricing/builtbyanas-services-tarifs-2026.png",
];
for (const relativePath of requiredFiles) {
  if (!(await fileExists(path.join(outputRoot, relativePath)))) failures.push(`Missing required export file: ${relativePath}`);
}

const requiredSourceFiles = [
  "README.md",
  "SECURITY-AUDIT.md",
  "BBA-AI-RECOVERY.md",
  "V2-CHANGELOG.md",
  "VALIDATION-REPORT.json",
  "FINAL-VALIDATION-REPORT.md",
  ".env.example",
  "package.json",
  "package-lock.json",
  ".github/workflows/deploy.yml",
  "CNAME",
];
for (const relativePath of requiredSourceFiles) {
  if (!(await fileExists(path.join(projectRoot, relativePath)))) failures.push(`Missing required source file: ${relativePath}`);
}

const htmlFiles = (await walk(outputRoot)).filter((file) => file.endsWith(".html"));
assert.ok(htmlFiles.length > 0, "No exported HTML pages were found");
const pages = new Map();
const visibleText = (html) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:amp|lt|gt|quot|apos|copy);/gi, (entity) => ({
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&copy;": "©",
  })[entity.toLowerCase()] ?? entity)
  .replace(/\s+/g, " ")
  .trim();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  pages.set(path.relative(outputRoot, file).replaceAll("\\", "/"), html);

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"'<>]+)["']/gi)) {
    await resolveExportPath(match[1], file);
  }
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(",")) {
      const source = candidate.trim().split(/\s+/)[0];
      await resolveExportPath(source, file);
    }
  }

  const lowerHtml = html.toLowerCase();
  const previousPublicName = ["Anasse", ["Ani", "da"].join("")].join(" ").toLowerCase();
  const previousPublicEmail = ["Ouzoumarta", "icloud.com"].join("@").toLowerCase();
  const previousTerminalIdentity = ["ani", "da@"].join("");
  const codeCtaLabel = ["Voir", "le", "code"].join(" ");
  assert.ok(!lowerHtml.includes(previousPublicName), `Obsolete full name in ${path.relative(outputRoot, file)}`);
  assert.ok(!lowerHtml.includes(previousTerminalIdentity), `Obsolete public surname variation in ${path.relative(outputRoot, file)}`);
  assert.ok(!lowerHtml.includes(previousPublicEmail), `Obsolete email in ${path.relative(outputRoot, file)}`);
  assert.ok(!html.includes(codeCtaLabel), `Misleading source-code CTA in ${path.relative(outputRoot, file)}`);
  assert.ok(!/github\.com\/anasseurukoo\/[a-z0-9_.-]+/i.test(html), `Repository URL in ${path.relative(outputRoot, file)}`);
}

for (const cssFile of (await walk(outputRoot)).filter((file) => file.endsWith(".css"))) {
  const cssText = await readFile(cssFile, "utf8");
  for (const match of cssText.matchAll(/url\(([^)]+)\)/gi)) {
    const asset = match[1].trim().replace(/^['"]|['"]$/g, "");
    await resolveExportPath(asset, cssFile);
  }
}

const home = pages.get("index.html") ?? "";
const homeText = visibleText(home);
const about = pages.get("about/index.html") ?? "";
const work = pages.get("work/index.html") ?? "";
const joury = pages.get("work/joury-optic/index.html") ?? "";
const bba = pages.get("work/bba-ai-studio-assistant/index.html") ?? "";
const services = pages.get("services/index.html") ?? "";
const servicesText = visibleText(services);
const lab = pages.get("lab/index.html") ?? "";
const footerCopy = [
  "À la douce mémoire de Chawkke · 2021",
  "Une petite étoile partie trop tôt, dont la lumière restera à jamais dans nos cœurs.",
  "Avec tout mon amour. ♡",
  "Site conçu par BuiltByAnas.com",
  "© 2026 Anasse",
];

for (const [relativePath, html] of pages) {
  const text = visibleText(html);
  for (const expected of footerCopy) assert.ok(text.includes(expected), `Footer copy missing from ${relativePath}: ${expected}`);
}
assert.ok(homeText.includes("Je suis Anasse"), "Homepage introduction does not use the approved display name");
assert.ok(work.includes("Joury Optic"), "Joury Optic is missing from the projects index");
assert.ok(joury.includes("Try Lens — Designed and engineered by BuiltByAnas."), "Try Lens attribution is missing");
assert.ok(joury.includes("3D Try Lunettes — Designed and engineered by BuiltByAnas."), "3D Try Lunettes attribution is missing");
assert.ok(joury.includes("https://jouryoptic.com/"), "Joury production website link is missing");
assert.ok(joury.includes("og:title") && joury.includes("Joury Optic"), "Joury Open Graph metadata is missing");
assert.ok(joury.includes("canonical") && joury.includes("/work/joury-optic/"), "Joury canonical URL is missing");
assert.ok(bba.includes("BBA AI est conçu et développé par BuiltByAnas"), "BBA AI project attribution is missing");
assert.ok(about.includes("anasse-digital-dojo-notes.png"), "Original About portrait is missing from exported page");
assert.ok(services.includes("builtbyanas-services-tarifs-2026.png"), "Original pricing brochure is missing from Services page");
for (const category of [
  "Site vitrine premium", "15 000 MAD",
  "Site business / catalogue", "20 000 MAD",
  "E-commerce", "25 000 MAD",
  "Application web sur mesure", "35 000 MAD",
  "Application mobile", "45 000 MAD",
  "3D / AR / IA / expériences interactives", "Sur devis",
]) assert.ok(servicesText.includes(category), `Official price catalogue item missing: ${category}`);
assert.ok(lab.includes("BBA AI") && lab.includes("conçu et développé par BuiltByAnas"), "AI Lab attribution is missing");

const hashes = {
  "assets/profile/anasse-digital-dojo-notes.png": "ceac45a26aa4e28fc20570b0974601d99486d4e11968dbec18cc83a4ea66c89d",
  "assets/pricing/builtbyanas-services-tarifs-2026.png": "5da4fd6b29b9b135cf76a76d1c6d2a2a70c5461fb846b7829537e20a1ffd5cf8",
};
for (const [relativePath, expectedHash] of Object.entries(hashes)) {
  const bytes = await readFile(path.join(outputRoot, relativePath));
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  assert.equal(actualHash, expectedHash, `Preserved asset changed: ${relativePath}`);
}

const staticFiles = await walk(outputRoot);
for (const forbidden of ["node_modules", ".next", "tsconfig.tsbuildinfo", ".env"]) {
  assert.ok(!staticFiles.some((file) => path.relative(outputRoot, file).split(path.sep).includes(forbidden)), `Build output unexpectedly includes ${forbidden}`);
}

const profileSource = await readFile(path.join(projectRoot, "data", "profile.ts"), "utf8");
const approvedEmail = profileSource.match(/email:\s*"([^"]+)"/)?.[1];
assert.equal(approvedEmail, ["Builtbyanass", "gmail.com"].join("@"), "Approved contact email is missing from public profile data");
const mailtoTargets = [...new Set([...pages.values()].flatMap((html) => [...html.matchAll(/href=["']mailto:([^"'?&<>]+)/gi)].map((match) => match[1])))];
assert.ok(mailtoTargets.length > 0, "No public mailto contact action was found");
assert.ok(approvedEmail && mailtoTargets.every((target) => target.toLowerCase() === approvedEmail.toLowerCase()), `Unexpected public mailto target(s): ${mailtoTargets.join(", ")}`);

const tickerLabels = ["Docker", "Git &amp; GitHub", "Next.js", "TypeScript", "React", "Tailwind CSS", "Virtual Try-On", "Cybersecurity", "Linux", "Python", "Bash", "Automation", "Supabase"];
for (const label of tickerLabels) assert.ok(home.includes(label), `Technology ticker label missing: ${label}`);
assert.ok(home.includes("tech-ticker__track"), "Technology ticker is not rendered on the homepage");
assert.ok(home.includes('aria-hidden="true"'), "Decorative duplicate ticker copy is missing aria-hidden");

const sitemap = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
assert.ok(sitemap.includes("https://builtbyanas.com/work/joury-optic/"), "Joury route is missing from sitemap.xml");

const cssFiles = (await walk(path.join(outputRoot, "_next", "static", "chunks"))).filter((file) => file.endsWith(".css"));
const css = (await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert.ok(css.includes("tech-ticker-scroll"), "Compiled ticker animation is missing");
assert.ok(css.includes("prefers-reduced-motion:reduce"), "Compiled reduced-motion rules are missing");
assert.ok(css.includes("memorial-dove") && css.includes("memorial-snow"), "Compiled memorial animation rules are missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static export validation passed: ${htmlFiles.length} HTML pages, ${checkedLocalReferences} local href/src targets, route/sitemap/metadata/contact/privacy/footer/portrait/brochure/ticker/memorial checks.`);
}
