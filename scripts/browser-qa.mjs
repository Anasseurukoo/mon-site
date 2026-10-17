import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = "http://127.0.0.1:4173";
const targets = await (await fetch("http://127.0.0.1:9229/json/list")).json();
const target = targets.find((item) => item.type === "page");
assert.ok(target, "No browser page target");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.text);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});
function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function until(expression, timeout = 8000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const value = await evaluate(expression);
      if (value) return value;
    } catch { /* A new document may be navigating. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}`);
}
async function navigate(path) {
  await send("Page.navigate", { url: base + path });
  await until(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete'`);
  await new Promise((resolve) => setTimeout(resolve, 250));
}
async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 600,
  });
}
async function screenshot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await mkdir(".browserqa", { recursive: true });
  await writeFile(`.browserqa/${name}.png`, Buffer.from(data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => { if (location.hostname === '127.0.0.1') sessionStorage.setItem('bba:intro:v07','seen'); const original = window.fetch.bind(window); window.fetch = (input, init) => String(input).includes('/functions/v1/bba-ai') ? Promise.resolve(new Response(JSON.stringify({reply:'# Mock reply\\n- **Ready**'}), {status:200,headers:{'Content-Type':'application/json'}})) : original(input, init); })();`,
});

const results = [];
for (const width of [1440, 1280, 390, 320]) {
  await viewport(width);
  await navigate("/");
  const cta = await until(`(() => { const a = document.querySelector('a[href="/ai/"][data-fire-state]'); if (!a) return null; const r=a.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,state:a.dataset.fireState,border:getComputedStyle(a).borderColor,overflow:document.documentElement.scrollWidth > innerWidth}; })()`);
  assert.equal(cta.state, "idle");
  assert.equal(cta.overflow, false, `Horizontal overflow on home at ${width}px`);
  if (width < 600) {
    await evaluate(`document.querySelector('a[href="/ai/"][data-fire-state]').scrollIntoView({block:'center',behavior:'instant'})`);
    await until(`(() => {const r=document.querySelector('a[href="/ai/"][data-fire-state]').getBoundingClientRect();return r.top>=0 && r.bottom<=innerHeight})()`);
  }
  await until(`getComputedStyle(document.querySelector('a[href="/ai/"][data-fire-state]').closest('.anim-fade-up')).opacity === '1'`);
  await screenshot(`home-${width}`);
  results.push({ width, cta });
}

await viewport(1440);
await navigate("/");
const rect = await evaluate(`(() => {const r=document.querySelector('a[href="/ai/"][data-fire-state]').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x - 35, y: rect.y + rect.h / 2 });
await until(`document.querySelector('a[href="/ai/"][data-fire-state]').dataset.fireState === 'proximity'`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 });
await until(`document.querySelector('a[href="/ai/"][data-fire-state]').dataset.fireState === 'hover'`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 10, y: 100 });
await until(`document.querySelector('a[href="/ai/"][data-fire-state]').dataset.fireState === 'idle'`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 });
await until(`document.querySelector('a[href="/ai/"][data-fire-state]').dataset.fireState === 'hover'`);
await send("Input.dispatchMouseEvent", { type: "mousePressed", x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, button: "left", clickCount: 1 });
await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, button: "left", clickCount: 1 });
await until(`location.pathname === '/ai/'`);
await until(`document.querySelector('iframe')?.contentDocument?.querySelector('header strong[role="link"]')`);
const dojo = await evaluate(`(() => {const f=document.querySelector('iframe'),d=f.contentDocument;return {height:f.getBoundingClientRect().height,viewport:innerHeight,logo:!!d.querySelector('header strong[role="link"]'),back:!!d.querySelector('[data-bba-back]'),overflow:document.documentElement.scrollWidth>innerWidth}})()`);
assert.ok(dojo.logo && dojo.back);
assert.equal(dojo.height, dojo.viewport);
assert.equal(dojo.overflow, false);
await screenshot("dojo-1440");
assert.equal(await evaluate(`!!document.querySelector('iframe').contentDocument.querySelector('.badge')`), true);
await evaluate(`(() => {const d=document.querySelector('iframe').contentDocument;d.querySelector('#prompt').value='Test the assistant';d.querySelector('#composer').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));})()`);
await until(`document.querySelector('iframe')?.contentDocument?.querySelector('.written-copy h1')?.textContent === 'Mock reply'`);
assert.equal(await evaluate(`!!document.querySelector('iframe').contentDocument.querySelector('.badge')`), false);
await evaluate(`document.querySelector('iframe').contentDocument.querySelector('header strong').click()`);
await until(`location.pathname === '/'`);
await navigate("/ai/");
await until(`document.querySelector('iframe')?.contentDocument?.querySelector('[data-bba-back]')`);
await evaluate(`document.querySelector('iframe').contentDocument.querySelector('[data-bba-back]').click()`);
await until(`location.pathname === '/'`);

await navigate("/ai/");
await until(`document.querySelector('iframe')?.contentDocument?.querySelector('[data-bba-back]')`);
await evaluate(`(() => {const f=document.querySelector('iframe');f.contentWindow.focus();f.contentDocument.querySelector('[data-bba-back]').focus();})()`);
assert.equal(await evaluate(`document.querySelector('iframe').contentDocument.activeElement?.hasAttribute('data-bba-back')`), true);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
await until(`location.pathname === '/'`);

await navigate("/ai/");
await until(`document.querySelector('iframe')?.contentDocument?.querySelector('header strong[role="link"]')`);
await evaluate(`(() => {const logo=document.querySelector('iframe').contentDocument.querySelector('header strong');logo.focus();logo.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));})()`);
await until(`location.pathname === '/'`);

await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await navigate("/");
await evaluate(`document.querySelector('a[href="/ai/"][data-fire-state]').click()`);
await until(`location.pathname === '/ai/'`);
await send("Emulation.setEmulatedMedia", { features: [] });

await navigate("/");
await evaluate(`document.querySelector('a[href="/ai/"][data-fire-state]').focus()`);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
await until(`location.pathname === '/ai/'`);

await viewport(390, 780);
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
await navigate("/");
await evaluate(`document.querySelector('a[href="/ai/"][data-fire-state]').scrollIntoView({block:'center',behavior:'instant'})`);
const touchRect = await until(`(() => {const r=document.querySelector('a[href="/ai/"][data-fire-state]').getBoundingClientRect();return r.top>=0 && r.bottom<=innerHeight ? {x:r.x+r.width/2,y:r.y+r.height/2} : null})()`);
await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: touchRect.x, y: touchRect.y, id: 1 }] });
await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
await until(`location.pathname === '/ai/'`);
await send("Emulation.setTouchEmulationEnabled", { enabled: false });

for (const width of [390, 320]) {
  await viewport(width, 780);
  await navigate("/ai/");
  await until(`document.querySelector('iframe')?.contentDocument?.querySelector('[data-bba-back]')`);
  const measure = await evaluate(`(() => {const f=document.querySelector('iframe');return {height:f.getBoundingClientRect().height,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
  assert.equal(measure.height, measure.viewport);
  assert.equal(measure.overflow, false);
  await screenshot(`dojo-${width}`);
  results.push({ width, dojo: measure });
}

assert.deepEqual(exceptions, [], "Browser JavaScript exceptions");
console.log(JSON.stringify({ status: "PASS", results, dojo, exceptions }, null, 2));
socket.close();
