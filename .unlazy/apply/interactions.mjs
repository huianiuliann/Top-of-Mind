// Browser probe for the behaviours the markup oracle cannot see (effects, hover, timers, WebGL), with motion NOT reduced.
// Drives headless Chrome over the DevTools protocol (no dependency). Needs a fresh build; serves dist/ itself
// unless a base URL is given:  node .unlazy/apply/interactions.mjs [baseUrl]
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
let BASE = process.argv[2];
if (!BASE) {
  const server = http.createServer((req, res) => {
    const file = path.join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  server.unref();
  BASE = `http://127.0.0.1:${server.address().port}`;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => p && fs.existsSync(p));
const fail = (m) => {
  console.error("FAIL: " + m);
  process.exit(1);
};
if (!CHROME) fail("no Chrome");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "tom-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "--force-device-scale-factor=1", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "about:blank"], { stdio: "ignore" });
process.on("exit", () => {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(chrome.pid), "/T", "/F"], { stdio: "ignore" });
  else chrome.kill();
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
  } catch {}
});
const portFile = path.join(profile, "DevToolsActivePort");
for (let i = 0; i < 150 && !fs.existsSync(portFile); i++) await sleep(100);
const port = fs.readFileSync(portFile, "utf8").split("\n")[0];
const ws = new WebSocket((await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const pending = new Map();
const listeners = new Set();
let nextId = 1;
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  } else for (const l of listeners) l(m);
});
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
async function open(url, width = 1280, height = 900) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);
  const errors = [];
  listeners.add((m) => {
    if (m.sessionId !== sessionId) return;
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
  });
  await S("Page.enable");
  await S("Runtime.enable");
  await S("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  await S("Page.addScriptToEvaluateOnNewDocument", { source: "window.__TOM_DEBUG__ = true;" });
  const loaded = new Promise((r) => listeners.add((m) => m.sessionId === sessionId && m.method === "Page.loadEventFired" && r()));
  await S("Page.navigate", { url: BASE + url });
  await loaded;
  await sleep(800);
  const js = async (expression) => {
    const r = await S("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const mouse = (x, y) => S("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  return { js, mouse, errors, close: () => send("Target.closeTarget", { targetId }) };
}

const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);

// ---------- home, desktop ----------
{
  const p = await open("/index.html");
  // nav shrinks on scroll, grows back at the top
  const bar = `document.querySelector("div.fixed > div")`;
  const top = await p.js(`${bar}.className.includes("backdrop-blur-md")`);
  await p.js("scrollTo(0, 700)");
  await sleep(1200);
  const scrolled = await p.js(`${bar}.className.includes("backdrop-blur-md")`);
  await p.js("scrollTo(0, 0)");
  await sleep(1200);
  const back = await p.js(`${bar}.className.includes("backdrop-blur-md")`);
  check("nav shrinks on scroll", !top && scrolled && !back, `top=${top} scrolled=${scrolled} back=${back}`);

  // typewriter: types while the panel is on screen, stands still while it is off screen
  const panels = `[...document.querySelectorAll("span.font-mono.text-\\\\[13px\\\\].text-neutral-200")].filter((s) => s.parentElement.querySelector("svg"))`;
  const sample = async (ms) => {
    const seen = new Set();
    for (let t = 0; t < ms; t += 150) {
      seen.add(await p.js(`${panels}.map((s) => s.firstChild?.textContent ?? "").join("|")`));
      await sleep(150);
    }
    return seen.size;
  };
  const offScreen = await sample(2500);
  await p.js(`(() => { const s = ${panels}; const el = s.find((x) => x.getBoundingClientRect().width > 0) || s[0]; el.scrollIntoView({ block: "center" }); })()`);
  await sleep(600);
  const onScreen = await sample(4500);
  check("typewriter types only while visible", offScreen === 1 && onScreen > 3, `distinct texts off-screen=${offScreen} on-screen=${onScreen}`);

  // lead-flow beams get a computed path once on screen
  await p.js(`document.querySelector("h3")?.scrollIntoView(); [...document.querySelectorAll("h3")].find((h) => /Lead generation/.test(h.textContent)).scrollIntoView({ block: "center" })`);
  await sleep(1200);
  const beams = await p.js(`[...document.querySelectorAll("svg.transform-gpu path")].map((x) => x.getAttribute("d")).filter(Boolean).length`);
  check("animated beams draw", beams >= 6, `${beams} beam paths with a d attribute`);

  // funnel drops appear once the funnel is on screen
  await p.js(`[...document.querySelectorAll("svg")].find((s) => s.getAttribute("viewBox") === "0 0 360 214").scrollIntoView({ block: "center" })`);
  await sleep(1500);
  const drops = await p.js(`[...document.querySelectorAll("svg")].find((s) => s.getAttribute("viewBox") === "0 0 360 214").querySelectorAll("circle").length`);
  check("funnel drops animate", drops === 14, `${drops} drops`);

  // compare slider: autoplay moves the handle; the mouse moves it too
  const handle = `[...document.querySelectorAll("div.will-change-transform")].find((d) => d.className.includes("z-40"))`;
  await p.js(`${handle}.scrollIntoView({ block: "center" })`);
  await sleep(500);
  const t1 = await p.js(`${handle}.style.transform`);
  await sleep(900);
  const t2 = await p.js(`${handle}.style.transform`);
  const box = await p.js(`(() => { const r = ${handle}.parentElement.getBoundingClientRect(); return { x: r.left + r.width * 0.2, y: r.top + r.height / 2 }; })()`);
  await p.mouse(box.x, box.y);
  await sleep(200);
  const t3 = await p.js(`${handle}.style.transform`);
  check("compare slider autoplays and follows the mouse", t1 !== t2 && /translate3d\(-30/.test(t3), `${t1} -> ${t2}, mouse -> ${t3}`);

  // rotating fee text changes every 2.4 s
  const rot = `[...document.querySelectorAll("span.whitespace-nowrap.text-neutral-200")].find((s) => s.closest("li"))`;
  await p.js(`${rot}.scrollIntoView({ block: "center" })`);
  const r1 = await p.js(`${rot}.textContent`);
  await sleep(3000);
  const r2 = await p.js(`${rot}.textContent`);
  check("rotating fee text rotates", r1 !== r2, `"${r1}" -> "${r2}"`);

  // founder tilt card: hover lifts the items (CSS translateZ) and the card turns toward the cursor
  const item = `[...document.querySelectorAll("h3")].find((h) => h.textContent === "Iulian Huian")`;
  await p.js(`${item}.scrollIntoView({ block: "center" })`);
  await sleep(400);
  const before = await p.js(`getComputedStyle(${item}).transform`);
  const c = await p.js(`(() => { const r = ${item}.getBoundingClientRect(); return { x: r.left + 20, y: r.top + 10 }; })()`);
  await p.mouse(c.x, c.y);
  await p.mouse(c.x + 5, c.y + 5);
  await sleep(500);
  const after = await p.js(`getComputedStyle(${item}).transform`);
  const card = await p.js(`${item}.closest(".group\\\\/card").parentElement.style.transform`);
  check("tilt card lifts and turns on hover", before === "none" && /matrix3d/.test(after) && /rotateY/.test(card), `before=${before} after=${after.slice(0, 40)} card=${card}`);
  check("home: no runtime errors", p.errors.length === 0, p.errors.join(" | ").slice(0, 300));
  await p.close();
}

// ---------- team carousel ----------
{
  const p = await open("/team.html");
  const name = `[...document.querySelectorAll("h3")].find((h) => /Iulian|Sebastian/.test(h.textContent))?.textContent`;
  const n1 = await p.js(name);
  await p.js(`document.querySelector("button[aria-label='Next']").click()`);
  await sleep(700);
  const n2 = await p.js(name);
  await p.js(`document.querySelector("button[aria-label='Previous']").click()`);
  await sleep(700);
  const n3 = await p.js(name);
  check("founder carousel next/prev", n1 !== n2 && n3 === n1, `${n1} -> ${n2} -> ${n3}`);
  check("team: no runtime errors", p.errors.length === 0, p.errors.join(" | ").slice(0, 300));
  await p.close();
}

// ---------- contact globe ----------
{
  const p = await open("/contact.html");
  await p.js(`document.querySelector("canvas").scrollIntoView({ block: "center" })`);
  await sleep(2000);
  const g = await p.js(`(() => { const c = document.querySelector("canvas"); const box = c.parentElement; return { w: c.width, ready: box.dataset.ready || "", fallback: box.dataset.fallback || "", label: box.querySelector("span").style.transform }; })()`);
  check("globe renders (WebGL) and places the Cluj label", g.w > 0 && g.ready === "1" && !g.fallback && /translate3d/.test(g.label), JSON.stringify(g));
  check("contact: no runtime errors", p.errors.length === 0, p.errors.join(" | ").slice(0, 300));
  await p.close();
}

// ---------- mobile menu on a Romanian page ----------
{
  const p = await open("/ro/services.html", 375, 812);
  const btn = `document.querySelector("button[aria-expanded]")`;
  await p.js(`${btn}.click()`);
  await sleep(500);
  const open1 = await p.js(`${btn}.getAttribute("aria-expanded")`);
  const links = await p.js(`[...document.querySelectorAll("div.fixed a")].filter((a) => a.getBoundingClientRect().height > 0).length`);
  await p.js(`${btn}.click()`);
  await sleep(500);
  const open2 = await p.js(`${btn}.getAttribute("aria-expanded")`);
  check("mobile menu opens and closes", open1 === "true" && open2 === "false" && links >= 6, `open=${open1} links=${links} closed=${open2}`);
  await p.close();
}

console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) fail(`${results.filter((r) => r.startsWith("FAIL")).length} interaction checks failed`);
console.log(`apply interactions verification passed (${results.length} checks)`);
process.exit(0);
