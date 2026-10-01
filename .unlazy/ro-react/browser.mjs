// Real-browser oracle for .unlazy/ro-react/GATES.md. No dependency: serves dist/ locally and drives headless Chrome
// over the DevTools protocol (Node's built-in WebSocket).  Usage:
//   node .unlazy/ro-react/browser.mjs                 run every check on the 12 pages (EN + RO) at 1280 and 375 px
//   node .unlazy/ro-react/browser.mjs --only team     one page
//   node .unlazy/ro-react/browser.mjs --shots <dir>   save full-page screenshot slices instead of checking
// Needs a fresh build (node .unlazy/ro-react/verify.mjs build) and Chrome (CHROME_PATH or a standard install).
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { foreignWords, englishLeft, CEDILLA, ASCII_RO } from "./rules.mjs";

const ROOT =path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIST = path.join(ROOT, "dist");
const PAGES = ["index", "services", "process", "team", "contact", "how-you-sell"];
const fileOf = (p) => (p === "index" ? "index.html" : p + ".html");
const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const only = opt("--only");
const shotsDir = opt("--shots");
const dumpDir = opt("--dump"); // also save every text line seen after interaction, per page and language (review aid)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (m) => {
  console.error("FAIL: " + m);
  process.exit(1);
};
const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => p && fs.existsSync(p));
if (!CHROME) fail("no Chrome/Edge found; set CHROME_PATH");
if (!fs.existsSync(path.join(DIST, "ro/index.html"))) fail('dist/ro/index.html missing: run "node .unlazy/ro-react/verify.mjs build"');

/* ---------- static server: Vercel-like (/ro -> ro/index.html) ---------- */
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
let controlHtml = "";
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/__control") {
    res.writeHead(200, { "content-type": MIME[".html"] });
    res.end(controlHtml);
    return;
  }
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  let file = p === "/" ? "index.html" : p.slice(1);
  if (!path.extname(file)) file = path.join(file, "index.html");
  const full = path.join(DIST, file);
  if (!full.startsWith(DIST) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(full)] || "application/octet-stream" });
  fs.createReadStream(full).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

/* ---------- minimal DevTools client ---------- */
// profiles of earlier runs that Chrome's helper processes kept alive (older than 10 minutes, so never a run in progress)
for (const e of fs.readdirSync(os.tmpdir())) {
  const old = path.join(os.tmpdir(), e);
  try {
    if (e.startsWith("tom-chrome-") && Date.now() - fs.statSync(old).mtimeMs > 600000) fs.rmSync(old, { recursive: true, force: true });
  } catch {}
}
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "tom-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "about:blank"], { stdio: "ignore" });
const cleanup = () => {
  try {
    // Chrome starts helper processes that keep the profile open: kill the whole tree on Windows
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(chrome.pid), "/T", "/F"], { stdio: "ignore" });
    else chrome.kill();
  } catch {}
  server.close();
  // the process is exiting, so a timer would never fire: remove the profile now, retrying while Chrome lets go of its files
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
  } catch {}
};
process.on("exit", cleanup);
const portFile = path.join(profile, "DevToolsActivePort");
for (let i = 0; i < 150 && !fs.existsSync(portFile); i++) await sleep(100);
if (!fs.existsSync(portFile)) fail("Chrome did not start");
const port = fs.readFileSync(portFile, "utf8").split("\n")[0];
const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
const ws = new WebSocket(version.webSocketDebuggerUrl);
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

async function openTab(width, height) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const S = (method, params) => send(method, params, sessionId);
  const logs = [];
  const onMsg = (m) => {
    if (m.sessionId !== sessionId) return;
    const p = m.params;
    if (m.method === "Runtime.consoleAPICalled" && ["error", "warning", "assert"].includes(p.type)) logs.push(`console.${p.type}: ` + p.args.map((a) => a.value ?? a.description ?? "").join(" "));
    if (m.method === "Runtime.exceptionThrown") logs.push("exception: " + (p.exceptionDetails.exception?.description || p.exceptionDetails.text));
    if (m.method === "Log.entryAdded" && ["error", "warning"].includes(p.entry.level)) logs.push(`log.${p.entry.level}: ${p.entry.text} ${p.entry.url || ""}`);
  };
  listeners.add(onMsg);
  await S("Page.enable");
  await S("Runtime.enable");
  await S("Log.enable");
  await S("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  await S("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await S("Page.addScriptToEvaluateOnNewDocument", { source: "window.__TOM_DEBUG__ = true;" });
  const loaded = () =>
    new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error("page load timeout")), 20000);
      const l = (m) => {
        if (m.sessionId === sessionId && m.method === "Page.loadEventFired") {
          clearTimeout(t);
          listeners.delete(l);
          res();
        }
      };
      listeners.add(l);
    });
  const evaluate = async (expression) => {
    const r = await S("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  return {
    logs,
    S,
    evaluate,
    loaded,
    async go(url, settle = 1000) {
      const l = loaded();
      await S("Page.navigate", { url });
      await l;
      await sleep(settle);
    },
    close: async () => {
      listeners.delete(onMsg);
      await send("Target.closeTarget", { targetId });
    },
  };
}

/* ---------- in-page probes ---------- */
const VIS = `const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };`;
const COLLECT = `(() => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    // word-by-word reveal spans (one per word) differ in number between EN and RO by design
    if (el.tagName === "SPAN" && el.parentElement && el.parentElement.tagName === "P" && /\\binline-block\\b/.test(el.className)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") { out.push(null); continue; }
    const r = el.getBoundingClientRect();
    out.push([Math.round(r.left), Math.round(r.right), Math.round(r.width), el.clientWidth, el.scrollWidth, cs.overflowX]);
  }
  return { vw: innerWidth, n: out.length, rects: out, lang: document.documentElement.lang };
})()`;
const DESCRIBE = (idx) => `(() => { const all = [...document.querySelectorAll("body *")].filter((el) => !(el.tagName === "SPAN" && el.parentElement && el.parentElement.tagName === "P" && /\\binline-block\\b/.test(el.className))); return ${JSON.stringify(idx)}.map((i) => { const el = all[i]; return el.tagName.toLowerCase() + "." + String(el.className?.baseVal ?? el.className).split(" ").slice(0, 4).join(".") + " \\"" + (el.textContent || "").trim().slice(0, 50) + "\\""; }); })()`;
// header boxes that must not touch each other
const HEADER = `(() => { ${VIS}
  const bar = document.querySelector("div.fixed");
  const shell = [...bar.children].find(vis);
  const q = (sel) => [...shell.querySelectorAll(sel)].filter(vis).map((el) => { const r = el.getBoundingClientRect(); return { name: sel + " " + (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24), l: r.left, r: r.right, t: r.top, b: r.bottom }; });
  const s = shell.getBoundingClientRect();
  const parts = [...q("a[aria-label*='Top of Mind']"), ...q("nav a"), ...q("[data-lang-switch]"), ...q("a[target='_blank']"), ...q("button[aria-expanded]")];
  return { vw: innerWidth, shell: { l: s.left, r: s.right }, parts };
})()`;
// Everything a visitor can see after poking the page: scroll through, press every button in <main> (accordions, quiz, carousel),
// then sample the text for a few seconds so timed visuals show their other states. Returns the set of visible text lines.
const SWEEP = `(async () => {
  const seen = new Set();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const grab = () => { for (const line of document.body.innerText.split("\\n")) { const s = line.trim(); if (s) seen.add(s); } };
  for (let y = 0; y < document.documentElement.scrollHeight; y += 450) { scrollTo(0, y); await wait(60); grab(); }
  scrollTo(0, 0);
  for (const b of document.querySelectorAll("main button")) { b.click(); await wait(180); grab(); }
  for (let i = 0; i < 8; i++) { await wait(600); grab(); }
  return [...seen];
})()`;
const TAP = `(() => { ${VIS} const a = [...document.querySelectorAll("[data-lang-switch] a")].find(vis); if (!a) return null; const r = a.getBoundingClientRect(); return { w: r.width, h: r.height, href: a.getAttribute("href") }; })()`;
const CLICK_SWITCH = `(() => { ${VIS} const a = [...document.querySelectorAll("[data-lang-switch] a")].find(vis); a.click(); return true; })()`;

function headerProblems(h, label) {
  const bad = [];
  const eps = 1;
  for (const p of h.parts) if (p.l < -eps || p.r > h.vw + eps) bad.push(`${label}: "${p.name}" leaves the viewport`);
  for (const p of h.parts) if (p.l < h.shell.l - eps || p.r > h.shell.r + eps) bad.push(`${label}: "${p.name}" sticks out of the header (${Math.round(p.l)}..${Math.round(p.r)} vs ${Math.round(h.shell.l)}..${Math.round(h.shell.r)})`);
  for (let i = 0; i < h.parts.length; i++)
    for (let j = i + 1; j < h.parts.length; j++) {
      const a = h.parts[i];
      const b = h.parts[j];
      if (a.l < b.r - eps && b.l < a.r - eps && a.t < b.b - eps && b.t < a.b - eps) bad.push(`${label}: "${a.name}" overlaps "${b.name}"`);
    }
  return bad;
}
function layoutRegressions(en, ro) {
  if (en.n !== ro.n) return { text: [`DOM size differs after hydration (EN ${en.n} elements, RO ${ro.n})`], idx: [] };
  const idx = [];
  const text = [];
  const clipped = (r) => /hidden|clip|auto|scroll/.test(r[5]) && r[4] > r[3] + 1;
  for (let i = 0; i < en.n; i++) {
    const a = en.rects[i];
    const b = ro.rects[i];
    if (!a || !b) continue;
    if (b[1] > ro.vw + 1 && a[1] <= en.vw + 1) (idx.push(i), text.push("sticks out on the right in RO only"));
    else if (b[0] < -1 && a[0] >= -1) (idx.push(i), text.push("sticks out on the left in RO only"));
    else if (clipped(b) && !clipped(a)) (idx.push(i), text.push("text clipped in RO only"));
  }
  return { text, idx };
}

/* ---------- screenshots (QA aid, not a gate) ---------- */
async function shoot(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [vw, vh, sliceH] of [[1280, 900, 1000], [375, 812, 1500]]) {
    for (const lang of ["en", "ro"]) {
      for (const p of only ? [only] : PAGES) {
        const tab = await openTab(vw, vh);
        await tab.go(`${BASE}/${lang === "ro" ? "ro/" : ""}${fileOf(p)}`, 600);
        const total = await tab.evaluate(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400)); return document.documentElement.scrollHeight; })()`);
        for (let y = 0, n = 0; y < total; y += sliceH, n++) {
          const { data } = await tab.S("Page.captureScreenshot", { format: "jpeg", quality: 72, captureBeyondViewport: true, clip: { x: 0, y, width: vw, height: Math.min(sliceH, total - y), scale: 1 } });
          fs.writeFileSync(path.join(dir, `${lang}-${p}-${vw}-${String(n).padStart(2, "0")}.jpg`), Buffer.from(data, "base64"));
        }
        await tab.close();
      }
    }
  }
  console.log("screenshots saved to " + dir);
}
if (shotsDir) {
  await shoot(path.resolve(shotsDir));
  process.exit(0);
}
// debugging aid: --probe ro/team.html [--width 1024] [--scroll] --eval "<js>" (or --eval @HEADER)
if (opt("--probe")) {
  const tab = await openTab(Number(opt("--width") || 1280), 800);
  await tab.go(`${BASE}/${opt("--probe")}`);
  if (args.includes("--scroll")) {
    await tab.evaluate("scrollTo(0, 700)");
    await sleep(1100);
  }
  const code = opt("--eval") === "@HEADER" ? HEADER : opt("--eval");
  console.log(JSON.stringify(await tab.evaluate(code), (k, v) => (typeof v === "number" ? Math.round(v) : v)));
  process.exit(0);
}

/* ---------- the gate ---------- */
const bad = [];
const KNOWN_404 = /favicon\.svg|apple-touch-icon\.png/;
const noise = (l) => KNOWN_404.test(l) || /Failed to load resource: the server responded with a status of 404/.test(l) && KNOWN_404.test(l);
let checked = 0;
let sampled = 0;

// control 1: the layout comparator must see a widened element
if (!layoutRegressions({ vw: 100, n: 1, rects: [[0, 50, 50, 50, 50, "visible"]] }, { vw: 100, n: 1, rects: [[0, 150, 150, 50, 50, "visible"]] }).idx.length) fail("control failed: layout comparator is blind");
// control 2: hydration errors must be visible. A prerendered RO page whose first heading text is altered must log a React error.
{
  const html = fs.readFileSync(path.join(DIST, "ro/index.html"), "utf8");
  controlHtml = html.replace(/(<h1\b[^>]*>)([^<])/, "$1Z$2");
  if (controlHtml === html) fail("control setup failed: no <h1> text in dist/ro/index.html");
  const tab = await openTab(1280, 800);
  await tab.go(`${BASE}/__control`, 1500);
  const seen = tab.logs.some((l) => /hydrat|#418|#423|#425|did not match|mismatch/i.test(l));
  await tab.close();
  if (!seen) fail("control failed: an altered prerendered page did not log a hydration error");
}

for (const [vw, vh] of [[1280, 800], [375, 812]]) {
  for (const p of only ? [only] : PAGES) {
    const metrics = {};
    const sweeps = {};
    for (const lang of ["en", "ro"]) {
      const tab = await openTab(vw, vh);
      const url = `${BASE}/${lang === "ro" ? "ro/" : ""}${fileOf(p)}`;
      await tab.go(url);
      checked++;
      const real = tab.logs.filter((l) => !noise(l));
      for (const l of real) bad.push(`${lang}/${p} @${vw}: ${l.slice(0, 220)}`);
      const m = await tab.evaluate(COLLECT);
      if (m.lang !== lang) bad.push(`${lang}/${p} @${vw}: <html lang> is "${m.lang}"`);
      metrics[lang] = m;
      // header: nothing overlaps or leaves the viewport (top of page, then scrolled, which narrows the desktop bar)
      for (const state of vw >= 1024 ? ["top", "scrolled"] : ["top", "menu"]) {
        if (state === "scrolled") {
          await tab.evaluate("scrollTo(0, 700)");
          await sleep(1100);
        }
        if (state === "menu") {
          await tab.evaluate(`document.querySelector("button[aria-expanded]").click()`);
          await sleep(500);
          const menu = await tab.evaluate(`(() => { ${VIS} return [...document.querySelectorAll("div.fixed a")].filter(vis).map((a) => { const r = a.getBoundingClientRect(); return { name: "menu " + a.textContent.trim().slice(0, 30), l: r.left, r: r.right, t: r.top, b: r.bottom }; }); })()`);
          for (const q of menu) if (q.l < -1 || q.r > vw + 1) bad.push(`${lang}/${p} @${vw}: ${q.name} leaves the viewport`);
          if (!menu.length) bad.push(`${lang}/${p} @${vw}: mobile menu did not open`);
          continue;
        }
        const h = await tab.evaluate(HEADER);
        for (const b of headerProblems(h, `${lang}/${p} @${vw} header ${state}`)) bad.push(b);
      }
      // hidden states (closed accordions, quiz answers, carousel, timed visuals): text seen while interacting
      if (vw >= 1024) sweeps[lang] = new Set(await tab.evaluate(SWEEP));
      // the switch is tappable and takes the visitor to the same page in the other language
      const tap = await tab.evaluate(TAP);
      if (!tap) bad.push(`${lang}/${p} @${vw}: no visible language switch`);
      else {
        if (tap.w < 24 || tap.h < 24) bad.push(`${lang}/${p} @${vw}: switch link is ${Math.round(tap.w)}x${Math.round(tap.h)}px, below the 24px target size`);
        await tab.evaluate("scrollTo(0, 0)");
        const next = tab.loaded();
        await tab.evaluate(CLICK_SWITCH);
        await next;
        await sleep(300);
        const where = await tab.evaluate("({ path: location.pathname, lang: document.documentElement.lang })");
        const want = lang === "en" ? `/ro/${fileOf(p)}` : `/${fileOf(p)}`;
        if (where.path !== want || where.lang !== (lang === "en" ? "ro" : "en")) bad.push(`${lang}/${p} @${vw}: switch landed on ${where.path} (${where.lang}), want ${want}`);
      }
      await tab.close();
    }
    // text a visitor can reach in Romanian must be Romanian: identical-to-English lines, English words, wrong diacritics
    if (sweeps.en && sweeps.ro) {
      sampled += sweeps.ro.size;
      if (dumpDir) {
        fs.mkdirSync(dumpDir, { recursive: true });
        for (const l of ["en", "ro"]) fs.writeFileSync(path.join(dumpDir, `${l}-${p}.txt`), [...sweeps[l]].join("\n"));
      }
      for (const line of sweeps.ro) {
        const same = sweeps.en.has(line) && foreignWords(line).length;
        const left = englishLeft(line);
        if (same) bad.push(`ro/${p}: still English after interaction: ${JSON.stringify(line.slice(0, 110))}`);
        else if (left.length) bad.push(`ro/${p}: English words (${[...new Set(left)].join(", ")}) after interaction: ${JSON.stringify(line.slice(0, 110))}`);
        if (CEDILLA.test(line) || ASCII_RO.test(line)) bad.push(`ro/${p}: wrong diacritics after interaction: ${JSON.stringify(line.slice(0, 110))}`);
      }
    }
    // Romanian text is longer: nothing may stick out of the viewport or be clipped that was fine in English
    const reg = layoutRegressions(metrics.en, metrics.ro);
    if (reg.idx.length) {
      const tab = await openTab(vw, vh);
      await tab.go(`${BASE}/ro/${fileOf(p)}`);
      const names = await tab.evaluate(DESCRIBE(reg.idx.slice(0, 6)));
      await tab.close();
      reg.idx.slice(0, 6).forEach((_, k) => bad.push(`ro/${p} @${vw}: ${names[k]} ${reg.text[k]}`));
      if (reg.idx.length > 6) bad.push(`ro/${p} @${vw}: ... ${reg.idx.length - 6} more layout regressions`);
    } else if (reg.text.length) bad.push(`ro/${p} @${vw}: ${reg.text[0]}`);
  }
}
if (bad.length) fail("\n" + bad.join("\n"));
console.log(`ro browser verification passed (${checked} page loads, ${sampled} Romanian text lines sampled after interaction, hydration clean, switch works, header and layout hold at 1280 and 375)`);
process.exit(0);
