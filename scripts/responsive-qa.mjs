import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const base = process.env.BBA_QA_BASE ?? "http://localhost:4173";
const port = Number(process.env.BBA_QA_DEBUG_PORT ?? "9229");
const browserPath = process.env.BBA_QA_BROWSER ??
  (process.platform === "win32"
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : "google-chrome");
const outputDir = path.resolve("..", "..", "responsive-qa");
const profileDir = path.join(os.tmpdir(), `builtbyanas-responsive-qa-${process.pid}`);

await mkdir(outputDir, { recursive: true });
const browser = spawn(browserPath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--disable-default-apps",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

async function pollJson(url, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch { /* Browser is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let socket;
try {
  const targets = await pollJson(`http://127.0.0.1:${port}/json/list`);
  const target = targets.find((item) => item.type === "page");
  assert.ok(target, "No browser page target");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") {
      exceptions.push(message.params.exceptionDetails.text);
    }
    if (message.id && pending.has(message.id)) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
    }
  });

  const send = (method, params = {}) => {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  };
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const until = async (expression, timeout = 10_000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      try {
        const result = await evaluate(expression);
        if (result) return result;
      } catch { /* Navigation can briefly replace the execution context. */ }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out: ${expression}`);
  };
  const viewport = (width, height) => send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  const navigate = async (pathname) => {
    await send("Page.navigate", { url: `${base}${pathname}` });
    await until(`location.pathname === ${JSON.stringify(pathname)} && document.readyState === "complete"`);
    try {
      await until(`Boolean(document.querySelector('main') && document.querySelector('h1'))`);
    } catch (error) {
      const state = await evaluate(`({ url: location.href, title: document.title, body: document.body?.innerText.slice(0, 500) })`);
      throw new Error(`${error.message}; state=${JSON.stringify(state)}`);
    }
    await until(`document.fonts?.status === "loaded"`);
  };
  const screenshot = async (name) => {
    const result = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(path.join(outputDir, `${name}.png`), Buffer.from(result.data, "base64"));
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `sessionStorage.setItem('bba:intro:v07','seen');`,
  });

  const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440];
  const routes = ["/", "/work/", "/work/joury-optic/", "/ai/"];
  const results = [];
  for (const width of widths) {
    const height = width < 768 ? 844 : 1000;
    await viewport(width, height);
    for (const pathname of routes) {
      await navigate(pathname);
      if (pathname === "/ai/") {
        await until(`document.querySelector('iframe')?.contentDocument?.readyState === 'complete'`);
      }
      const measure = await evaluate(`(() => {
        const root = document.documentElement;
        const offenders = [...document.querySelectorAll('body *')]
          .filter((element) => {
            const style = getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
          })
          .slice(0, 8)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { tag: element.tagName, className: String(element.className).slice(0, 100), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
          });
        const iframe = document.querySelector('iframe');
        const iframeOverflow = iframe?.contentDocument
          ? iframe.contentDocument.documentElement.scrollWidth > iframe.contentWindow.innerWidth + 1
          : false;
        return {
          viewport: innerWidth,
          scrollWidth: root.scrollWidth,
          overflow: root.scrollWidth > innerWidth + 1,
          iframeOverflow,
          offenders,
          h1: document.querySelectorAll('h1').length,
          failedImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
          hasFooter: Boolean(document.querySelector('footer')),
        };
      })()`);
      assert.equal(measure.viewport, width, `Unexpected viewport width on ${pathname}`);
      assert.equal(measure.overflow, false, `Horizontal overflow on ${pathname} at ${width}px: ${JSON.stringify(measure.offenders)}`);
      assert.equal(measure.iframeOverflow, false, `Iframe overflow on ${pathname} at ${width}px`);
      assert.equal(measure.failedImages, 0, `Failed image on ${pathname} at ${width}px`);
      assert.ok(measure.h1 >= 1, `Missing outer h1 on ${pathname}`);
      if (pathname !== "/ai/") assert.equal(measure.hasFooter, true, `Missing footer on ${pathname}`);
      if (pathname === "/work/") {
        const portfolio = await evaluate(`(() => {
          const text = document.querySelector('main')?.innerText ?? '';
          const firstHeading = document.querySelector('main article h2')?.textContent ?? '';
          return { firstHeading, hasLoza: /loza/i.test(text), hasJouryLink: Boolean(document.querySelector('a[href="/work/joury-optic/"]')) };
        })()`);
        assert.match(portfolio.firstHeading, /Joury Optic/);
        assert.equal(portfolio.hasLoza, false);
        assert.equal(portfolio.hasJouryLink, true);
      }
      results.push({ width, pathname, ...measure });
      await screenshot(`${pathname === "/" ? "home" : pathname.split("/").filter(Boolean).join("-")}-${width}`);
    }

    if (width < 1024) {
      await navigate("/work/");
      await evaluate(`document.querySelector('button[aria-label="Ouvrir le menu"]')?.click()`);
      await until(`Boolean(document.querySelector('[role="dialog"][aria-label="Navigation principale"]'))`);
      const menu = await evaluate(`({ overflow: document.documentElement.scrollWidth > innerWidth + 1, dialog: Boolean(document.querySelector('[role="dialog"][aria-label="Navigation principale"]')) })`);
      assert.equal(menu.dialog, true);
      assert.equal(menu.overflow, false, `Mobile menu overflow at ${width}px`);
      await evaluate(`document.querySelector('button[aria-label="Fermer le menu"]')?.click()`);
      await until(`!document.querySelector('[role="dialog"][aria-label="Navigation principale"]')`);
    }
  }

  await viewport(390, 844);
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await navigate("/work/");
  const reducedMotion = await evaluate(`(() => {
    const petals = document.querySelector('.petal-rain');
    return matchMedia('(prefers-reduced-motion: reduce)').matches &&
      (!petals || getComputedStyle(petals).display === 'none');
  })()`);
  assert.equal(reducedMotion, true, "Reduced-motion override is not active");
  await send("Emulation.setEmulatedMedia", { features: [] });

  assert.deepEqual(exceptions, [], "Browser JavaScript exceptions");
  console.log(JSON.stringify({ status: "PASS", cases: results.length, widths, routes, results }, null, 2));
  await send("Browser.close");
} finally {
  socket?.close();
  if (!browser.killed) browser.kill();
}
