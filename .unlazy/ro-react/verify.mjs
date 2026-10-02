// Oracles for .unlazy/ro-react/GATES.md (bilingual site: English at /, Romanian at /ro/).
// Usage: node .unlazy/ro-react/verify.mjs <build|en|ro|head|links|switch|geo|fonts|deps>
//        node .unlazy/ro-react/verify.mjs page <index|services|process|team|contact|how-you-sell>   (fast loop, no dist needed)
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { foreignWords, englishLeft, CEDILLA, ASCII_RO, MOJIBAKE } from "./rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REF = path.join(ROOT, ".unlazy/ro-react/ref");
const DIST = path.join(ROOT, "dist");
const PAGES = ["index", "services", "process", "team", "contact", "how-you-sell"];
const SITE = "https://topofmind.me";
const cmd = process.argv[2];

const fail = (m) => {
  console.error("FAIL: " + m);
  process.exit(1);
};
const read = (f) => fs.readFileSync(f, "utf8");
const enFile = (p) => path.join(DIST, p + ".html");
const roFile = (p) => path.join(DIST, "ro", p + ".html");
const fileOf = (p) => (p === "index" ? "index.html" : p + ".html");
const rootOf = (html) => {
  const a = html.indexOf('<div id="root">');
  if (a < 0) fail("no #root in html");
  const s = a + 15;
  return html.slice(s, html.lastIndexOf("</div>", html.indexOf("</body>", s)));
};
const headOf = (html) => html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
const norm = (s) => s.replace(/\s+/g, " ").trim();
const clip = (s, n = 110) => (s.length > n ? s.slice(0, n) + "…" : s);

/* ---------------- html tokens ---------------- */
const VOID = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
const RAW = new Set(["script", "style"]);
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[n]);

function tokenize(html) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=>\/]+(?:="[^"]*")?)*)\s*(\/?)>|[^<]+|</g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[0];
    if (s.startsWith("<!--")) continue;
    if (m[2] === undefined) {
      out.push({ t: "text", text: decode(s) });
      continue;
    }
    const name = m[2].toLowerCase();
    if (m[1]) {
      out.push({ t: "close", name });
      continue;
    }
    const attrs = [];
    for (const a of m[3].matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) attrs.push([a[1], a[2] === undefined ? "" : decode(a[2])]);
    out.push({ t: "open", name, attrs, self: !!m[4] || VOID.has(name) });
    if (RAW.has(name) && !m[4]) {
      const end = html.indexOf("</" + name, re.lastIndex);
      if (end > -1) re.lastIndex = end;
    }
  }
  return out;
}
function mergeText(toks) {
  const out = [];
  for (const k of toks) {
    const last = out[out.length - 1];
    if (k.t === "text" && last && last.t === "text") last.text += k.text;
    else out.push({ ...k });
  }
  return out;
}
function stripSubtree(toks, pred) {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const k = toks[i];
    if (k.t === "open" && pred(k)) {
      if (k.self) continue;
      let depth = 1;
      while (++i < toks.length && depth) {
        const q = toks[i];
        if (q.t === "open" && q.name === k.name && !q.self) depth++;
        else if (q.t === "close" && q.name === k.name) depth--;
      }
      i--;
      continue;
    }
    out.push(k);
  }
  return out;
}
const isSwitch = (k) => k.attrs.some(([n]) => n === "data-lang-switch");
const attrOf = (k, name) => (k.attrs.find(([n]) => n === name) || [])[1] ?? "";
// Word-by-word reveal animations (FounderCarousel, ScrollRevealText) render one <span class="inline-block">word</span> per word,
// so EN and RO legitimately differ in span count. Collapse such a run into one text token and compare its classes instead.
const isWordSpan = (t, j) => t[j].t === "open" && t[j].name === "span" && !t[j].self && /\binline-block\b/.test(attrOf(t[j], "class")) && t[j + 1]?.t === "text" && t[j + 2]?.t === "close" && t[j + 2].name === "span";
function collapseRuns(toks) {
  const out = [];
  for (let i = 0; i < toks.length; ) {
    let j = i;
    const run = [];
    while (j + 2 < toks.length && isWordSpan(toks, j)) {
      run.push([toks[j], toks[j + 1].text]);
      j += 3;
    }
    if (run.length >= 2) {
      out.push({ t: "text", run: true, text: run.map(([, w]) => w.replace(/ /g, " ").trim()).join(" "), classes: [...new Set(run.map(([k]) => attrOf(k, "class")))] });
      i = j;
    } else out.push(toks[i++]);
  }
  return out;
}
const prepared = (root) => collapseRuns(mergeText(stripSubtree(tokenize(root), isSwitch)));
const tokStr = (k) =>
  !k ? "<end of markup>" : k.t === "text" ? JSON.stringify(clip(k.text, 60)) : k.t === "close" ? `</${k.name}>` : `<${k.name}${k.attrs.map(([n, v]) => ` ${n}="${clip(v, 40)}"`).join("")}>`;

/* ---------------- text rules ---------------- */
const digits = (s) => s.replace(/\D/g, "");
const TRANSLATABLE = new Set(["alt", "aria-label", "title", "placeholder", "aria-description", "aria-roledescription", "aria-valuetext", "label"]);

// Where does an English string live in src/? (best effort, so a failing line says which file to fix.)
let srcIndex;
function sourcesOf(text) {
  if (!srcIndex) {
    srcIndex = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (/\.(jsx?|mjs)$/.test(e.name))
          srcIndex.push([
            path.relative(ROOT, f).replace(/\\/g, "/"),
            norm(
              read(f)
                .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
                .replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
                .replace(/&apos;|&#39;/g, "'")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/\\(['"])/g, "$1"),
            ),
          ]);
      }
    };
    walk(path.join(ROOT, "src"));
  }
  const needle = norm(text).slice(0, 50);
  if (needle.length < 3) return "";
  // short strings must stand alone between quotes / JSX delimiters, otherwise "Team" matches half the code base
  const alone = needle.length < 20 ? new RegExp("(?:^|[\"'`>{ ])" + needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:[\"'`<} ]|$)") : null;
  const hits = srcIndex.filter(([f, body]) => !f.startsWith("src/entries/") && (alone ? alone.test(body) : body.includes(needle))).map(([f]) => f.replace(/^src\//, ""));
  return hits.length ? " [" + hits.slice(0, 3).join(", ") + "]" : " [composed text, not found verbatim in src]";
}

/* ---------------- EN vs RO comparison ---------------- */
function compare(page, enRoot, roRoot) {
  const issues = [];
  const stats = { text: 0, attrs: 0 };
  const add = (kind, en, ro, extra = "") => issues.push({ page, kind, en, ro, extra });
  const a = prepared(enRoot);
  const b = prepared(roRoot);

  const text = (en, ro, kind) => {
    const E = norm(en);
    const R = norm(ro);
    if (!E && !R) return;
    stats.text++;
    if (/^\s/.test(en) !== /^\s/.test(ro) || /\s$/.test(en) !== /\s$/.test(ro)) add(kind + ":spacing", en, ro, " (leading/trailing space differs)");
    if (digits(E) !== digits(R)) add(kind + ":digits", E, R, sourcesOf(E));
    if (E === R) {
      if (foreignWords(E).length) add(kind + ":untranslated", E, R, sourcesOf(E));
    } else {
      const left = englishLeft(R);
      if (left.length) add(kind + ":english-left", E, R, ` (${[...new Set(left)].join(", ")})` + sourcesOf(E));
    }
    if (CEDILLA.test(R)) add(kind + ":cedilla", E, R, " (use comma-below ș ț, not cedilla ş ţ)");
    const asc = R.match(ASCII_RO);
    if (asc) add(kind + ":no-diacritics", E, R, ` ("${asc[0]}")`);
    if (MOJIBAKE.test(R)) add(kind + ":mojibake", E, R);
  };
  const attrs = (x, y) => {
    if (x.attrs.map((q) => q[0]).join() !== y.attrs.map((q) => q[0]).join()) {
      add("attr-names", tokStr(x), tokStr(y), sourcesOf(tokStr(x)));
      return;
    }
    for (const [k, v] of x.attrs) {
      const w = y.attrs.find((q) => q[0] === k)[1];
      stats.attrs++;
      if (TRANSLATABLE.has(k)) text(v, w, "attr:" + k);
      else if (k === "href") {
        const nw = w.startsWith("/ro/") ? w.slice(4) : w === "/ro" ? "index.html" : w;
        if (nw !== v) add("href", `${k}="${v}"`, `${k}="${w}"`, " (RO link must be /ro/<same file>)");
      } else if (v !== w) add("attr-value", `${k}="${clip(v, 60)}"`, `${k}="${clip(w, 60)}"`);
    }
  };

  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i];
    const y = b[i];
    if (!x || !y || x.t !== y.t || (x.t !== "text" && x.name !== y.name) || (x.t === "text" && !!x.run !== !!y.run)) {
      add("structure", tokStr(x), tokStr(y), ` at token ${i}; before: ${a.slice(Math.max(0, i - 3), i).map(tokStr).join(" ")}`);
      break;
    }
    if (x.t === "open") attrs(x, y);
    else if (x.t === "text") {
      text(x.text, y.text, x.run ? "words" : "text");
      if (x.run && x.classes.join("|") !== y.classes.join("|")) add("words:classes", x.classes.join(" | "), y.classes.join(" | "), " (accent styling lost? the RO accentFrom text must occur in the RO sentence)");
    }
  }
  return { issues, stats };
}

function report(all) {
  const byKind = {};
  for (const i of all) byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  const cap = process.argv.includes("--all") ? Infinity : 300;
  for (const i of all.slice(0, cap)) console.error(`  [${i.page}] ${i.kind}\n      EN: ${clip(i.en)}\n      RO: ${clip(i.ro)}${i.extra ? "\n      " + i.extra.trim() : ""}`);
  if (all.length > cap) console.error(`  ... ${all.length - cap} more (use --all)`);
  console.error("  by kind: " + JSON.stringify(byKind));
}

/* ---------------- EN must not change ---------------- */
const baseRoot = (p) => rootOf(read(path.join(REF, "en", p + ".html"))).replace(/<!--[\s\S]*?-->/g, "");
function normEN(root, p) {
  const sw = (root.match(/<div data-lang-switch=""/g) || []).length;
  if (sw !== 3) fail(`${p}: expected 3 language switches (desktop nav, mobile header, footer), found ${sw}`);
  if (root.split('<div class="relative z-20 flex items-center gap-3">').length !== 2) fail(`${p}: desktop nav wrapper not found exactly once`);
  if (root.split('<div class="flex items-center gap-1">').length !== 2) fail(`${p}: mobile header wrapper not found exactly once`);
  return root
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div data-lang-switch=""[^>]*>[\s\S]*?<\/div>/g, "")
    .replace(/<div class="flex items-center gap-1">(<button\b[\s\S]*?<\/button>)<\/div>/g, "$1")
    .replace('<div class="relative z-20 flex items-center gap-3">', '<div class="relative z-20">')
    .replace(/(\s(?:src|href)=")\/assets\//g, "$1assets/");
}
function enDiff(p, enRoot) {
  const want = baseRoot(p);
  const got = normEN(enRoot, p);
  if (got === want) return null;
  // say what changed: the first few tags whose attributes or text differ (class lists as -removed +added)
  const a = tokenize(want);
  const b = tokenize(got);
  const sample = [];
  for (let i = 0; i < Math.min(a.length, b.length) && sample.length < 4; i++) {
    const x = a[i];
    const y = b[i];
    if (x.t === "open" && y.t === "open" && x.name === y.name) {
      const px = Object.fromEntries(x.attrs);
      const py = Object.fromEntries(y.attrs);
      for (const k of new Set([...Object.keys(px), ...Object.keys(py)])) {
        if (px[k] === py[k]) continue;
        const sa = new Set((px[k] ?? "").split(/\s+/));
        const sb = new Set((py[k] ?? "").split(/\s+/));
        const gone = [...sa].filter((c) => !sb.has(c));
        const added = [...sb].filter((c) => !sa.has(c));
        sample.push(`  <${x.name}> ${k}: ${gone.map((c) => "-" + c).join(" ")} ${added.map((c) => "+" + c).join(" ")}`.trimEnd());
      }
    } else if (tokStr(x) !== tokStr(y)) sample.push(`  was ${tokStr(x)}\n  now ${tokStr(y)}`);
  }
  if (a.length !== b.length) sample.push(`  (${a.length} tokens before, ${b.length} now)`);
  return `${p} EN differs from the pre-change render (after an intentional English change run: node .unlazy/ro-react/verify.mjs refresh-en)\n${sample.join("\n")}`;
}

/* ---------------- dist helpers ---------------- */
function needDist(skipStale = false) {
  for (const p of PAGES) for (const f of [enFile(p), roFile(p)]) if (!fs.existsSync(f)) fail(`missing ${path.relative(ROOT, f)}: run "node .unlazy/ro-react/verify.mjs build"`);
  if (skipStale) return;
  const built = fs.statSync(enFile("index")).mtimeMs;
  const stale = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (fs.statSync(f).mtimeMs > built + 1) stale.push(path.relative(ROOT, f));
    }
  };
  walk(path.join(ROOT, "src"));
  walk(path.join(ROOT, "ro"));
  for (const f of ["index", ...PAGES].map((p) => p + ".html").concat(["vite.config.js", "vercel.json", "scripts/prerender.mjs"])) if (fs.existsSync(path.join(ROOT, f)) && fs.statSync(path.join(ROOT, f)).mtimeMs > built + 1) stale.push(f);
  if (stale.length) fail("dist is older than its sources (" + stale.slice(0, 4).join(", ") + "): run \"node .unlazy/ro-react/verify.mjs build\"");
}

async function ssrRenderer() {
  const out = path.join(ROOT, ".tmp-ssr", `${process.pid}-${Date.now()}`);
  execFileSync(process.execPath, [path.join(ROOT, "node_modules/vite/bin/vite.js"), "build", "--ssr", "src/entry-server.jsx", "--outDir", out, "--logLevel", "error"], { cwd: ROOT, stdio: "pipe" });
  const mod = await import(pathToFileURL(path.join(out, "entry-server.js")).href);
  // remove only this run's folder: other runs share .tmp-ssr; drop the parent only when it is empty
  const done = () => {
    fs.rmSync(out, { recursive: true, force: true });
    try {
      fs.rmdirSync(path.join(ROOT, ".tmp-ssr"));
    } catch {}
  };
  process.on("exit", done); // also runs when a failing check calls process.exit(1)
  return { render: mod.render, done };
}

/* ---------------- commands ---------------- */
if (cmd === "build") {
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  for (const f of [...PAGES.map((p) => p + ".html"), ...PAGES.map((p) => "ro/" + p + ".html"), "industries.html"]) if (!fs.existsSync(path.join(DIST, f))) fail("missing dist/" + f);
  for (const p of PAGES) {
    if (rootOf(read(enFile(p))).length < 5000) fail(p + " EN #root is not prerendered");
    const ro = read(roFile(p));
    if (rootOf(ro).length < 5000) fail(p + " RO #root is not prerendered");
    if (!/<html lang="ro"/.test(ro)) fail(p + " RO page is not <html lang=\"ro\">");
    if (!/<html lang="en"/.test(read(enFile(p)))) fail(p + " EN page is not <html lang=\"en\">");
  }
  console.log("ro build verification passed");
} else if (cmd === "en") {
  needDist();
  const bad = [];
  for (const p of PAGES) {
    const d = enDiff(p, rootOf(read(enFile(p))));
    if (d) bad.push(d);
  }
  // control: a one-character change must be seen
  const probe = rootOf(read(enFile("index"))).replace("</main>", "x</main>");
  if (!enDiff("index", probe)) fail("control failed: a changed EN page was not detected");
  if (bad.length) fail(bad.join("\n"));
  console.log(`ro en-unchanged verification passed (${PAGES.length} pages)`);
} else if (cmd === "ro" || cmd === "page") {
  let pages = PAGES;
  let enRoots;
  let roRoots;
  let done = () => {};
  if (cmd === "page") {
    const p = process.argv[3];
    if (!PAGES.includes(p)) fail("usage: page <" + PAGES.join("|") + ">");
    pages = [p];
    const r = await ssrRenderer();
    done = r.done;
    enRoots = { [p]: r.render(p, "en") };
    roRoots = { [p]: r.render(p, "ro") };
  } else {
    needDist();
    enRoots = Object.fromEntries(PAGES.map((p) => [p, rootOf(read(enFile(p)))]));
    roRoots = Object.fromEntries(PAGES.map((p) => [p, rootOf(read(roFile(p)))]));
  }
  try {
    const all = [];
    let text = 0;
    for (const p of pages) {
      const { issues, stats } = compare(p, enRoots[p], roRoots[p]);
      all.push(...issues);
      text += stats.text;
      // the fast loop also guards the English render; the dist gate leaves that to gate `en` so RO parity never depends on the baseline
      const en = cmd === "page" ? enDiff(p, enRoots[p]) : null;
      if (en) all.push({ page: p, kind: "en-changed", en: "", ro: "", extra: "\n" + en });
    }
    // control: comparing a page with itself must report untranslated text, otherwise the checker is blind
    const ctl = compare("control", enRoots[pages[0]], enRoots[pages[0]]);
    if (!ctl.issues.some((i) => i.kind === "text:untranslated")) fail("control failed: EN compared with EN reported nothing untranslated");
    const ctl2 = compare("control", enRoots[pages[0]], roRoots[pages[0]].replace(/(<h1\b[^>]*>)/, "$1ş 9 "));
    if (!ctl2.issues.some((i) => i.kind.endsWith(":cedilla")) || !ctl2.issues.some((i) => i.kind.endsWith(":digits"))) fail("control failed: injected cedilla/digit change was not detected");
    if (all.length) {
      console.error(`FAIL: ${all.length} issue(s) in ${pages.join(", ")}`);
      report(all);
      process.exit(1);
    }
    console.log(`ro parity verification passed (${pages.length} page(s), ${text} text nodes)`);
  } finally {
    done();
  }
} else if (cmd === "head") {
  needDist();
  const meta = (head, re) => (head.match(re) || [])[1];
  const attrIn = (tagStr, name) => (tagStr.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const tags = (head) => head.match(/<link\b[^>]*>|<meta\b[^>]*>/g) || [];
  const find = (head, kind, key, val) => tags(head).find((t) => t.startsWith("<" + kind) && attrIn(t, key) === val);
  const info = (html) => {
    const head = headOf(html);
    return {
      head,
      lang: (html.match(/<html lang="([^"]*)"/) || [])[1],
      title: meta(head, /<title>([^<]*)<\/title>/),
      desc: attrIn(find(head, "meta", "name", "description") || "", "content"),
      canon: attrIn(find(head, "link", "rel", "canonical") || "", "href"),
      alt: Object.fromEntries(tags(head).filter((t) => attrIn(t, "rel") === "alternate").map((t) => [attrIn(t, "hreflang"), attrIn(t, "href")])),
      og: Object.fromEntries(tags(head).filter((t) => /property="og:/.test(t)).map((t) => [attrIn(t, "property"), attrIn(t, "content")])),
    };
  };
  const bad = [];
  for (const p of PAGES) {
    const en = info(read(enFile(p)));
    const ro = info(read(roFile(p)));
    const enUrl = p === "index" ? SITE + "/" : `${SITE}/${p}.html`;
    const roUrl = p === "index" ? SITE + "/ro" : `${SITE}/ro/${p}.html`;
    const eq = (what, got, want) => got !== want && bad.push(`${p}: ${what} is ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
    eq("EN <html lang>", en.lang, "en");
    eq("RO <html lang>", ro.lang, "ro");
    eq("EN canonical", en.canon, enUrl);
    eq("RO canonical", ro.canon, roUrl);
    for (const [who, i] of [["EN", en], ["RO", ro]]) {
      eq(who + " hreflang en", i.alt.en, enUrl);
      eq(who + " hreflang ro", i.alt.ro, roUrl);
      eq(who + " hreflang x-default", i.alt["x-default"], enUrl);
      eq(who + " og:url", i.og["og:url"], i.canon);
      eq(who + " og:title", i.og["og:title"], i.title);
      eq(who + " og:description", i.og["og:description"], i.desc);
    }
    eq("EN og:locale", en.og["og:locale"], "en_GB");
    eq("EN og:locale:alternate", en.og["og:locale:alternate"], "ro_RO");
    eq("RO og:locale", ro.og["og:locale"], "ro_RO");
    eq("RO og:locale:alternate", ro.og["og:locale:alternate"], "en_GB");
    if (ro.title === en.title && p !== "contact") bad.push(`${p}: RO <title> equals EN`);
    if (ro.desc === en.desc) bad.push(`${p}: RO description equals EN`);
    for (const [what, s] of [["title", ro.title], ["description", ro.desc]]) {
      if (englishLeft(s || "").length) bad.push(`${p}: RO ${what} has English words (${englishLeft(s).join(", ")})`);
      if (CEDILLA.test(s || "") || ASCII_RO.test(s || "")) bad.push(`${p}: RO ${what} has wrong diacritics`);
    }
    // RO head must use root-absolute URLs (the page may be served as /ro, without a trailing slash)
    for (const t of tags(ro.head)) {
      const u = attrIn(t, "href");
      if (u && !/^(https?:|\/)/.test(u)) bad.push(`${p}: RO head link is not root-absolute: ${u}`);
    }
    if (/l\.href="assets\//.test(ro.head)) bad.push(`${p}: RO font preload script uses a relative path`);
    for (const [who, html] of [["EN", read(enFile(p))], ["RO", read(roFile(p))]]) {
      const css = html.match(/<link rel="stylesheet"[^>]*>/g) || [];
      const js = html.match(/<script type="module"[^>]*>/g) || [];
      if (css.length !== 1 || js.length !== 1) bad.push(`${p}: ${who} has ${css.length} stylesheets and ${js.length} module scripts`);
    }
    // EN head: unchanged from the pre-change render apart from hreflang and og:locale
    const strip = (head) =>
      (head.match(/<title>[^<]*<\/title>|<meta\b[^>]*>|<link\b[^>]*>|<script>[\s\S]*?<\/script>|<noscript>[\s\S]*?<\/noscript>/g) || [])
        .filter((t) => !/rel="stylesheet"|type="module"|rel="modulepreload"/.test(t))
        .filter((t) => !/rel="alternate"|property="og:locale/.test(t));
    const want = strip(headOf(read(path.join(REF, "en", p + ".html"))));
    const got = strip(en.head);
    if (JSON.stringify(want) !== JSON.stringify(got)) bad.push(`${p}: EN head changed:\n  ${want.filter((t) => !got.includes(t)).join("\n  ")}\n  --\n  ${got.filter((t) => !want.includes(t)).join("\n  ")}`);
  }
  // control: the lang check must see a wrong value
  if (info(read(roFile("index")).replace('<html lang="ro"', '<html lang="en"')).lang !== "en") fail("control failed");
  if (bad.length) fail(bad.join("\n"));
  console.log("ro head verification passed");
} else if (cmd === "links") {
  needDist();
  const bad = [];
  const exists = (u, fromRO) => {
    const clean = u.split(/[?#]/)[0];
    if (clean === "/ro") return fs.existsSync(path.join(DIST, "ro/index.html"));
    const rel = clean.startsWith("/") ? clean.slice(1) : clean;
    return fs.existsSync(path.join(DIST, rel));
  };
  for (const [lang, fileFn] of [["en", enFile], ["ro", roFile]]) {
    for (const p of PAGES) {
      const html = read(fileFn(p));
      for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        const u = decode(m[1]);
        if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
        if (/\/favicon\.svg$|\/apple-touch-icon\.png$|^favicon\.svg$|^apple-touch-icon\.png$/.test(u)) continue; // absent on the current site too
        if (lang === "ro" && !u.startsWith("/")) bad.push(`ro/${p}: internal URL is not root-absolute: ${u}`);
        else if (!exists(u)) bad.push(`${lang}/${p}: unresolved ${u}`);
        if (u === "/" || u === "./" || u === "") bad.push(`${lang}/${p}: link to bare "/" would trigger the geo redirect: ${JSON.stringify(u)}`);
      }
      if (lang === "ro") {
        // every Romanian page link that is not the switcher must stay in /ro/
        for (const m of rootOf(html).matchAll(/<a\b[^>]*?\shref="([^"]+)"[^>]*>/g)) {
          const u = m[1];
          if (/^(https?:|mailto:|tel:|#)/.test(u)) continue;
          if (/ hreflang=/i.test(m[0])) continue; // the language switch
          if (!u.startsWith("/ro/") && u !== "/ro") bad.push(`ro/${p}: in-page link leaves Romanian: ${u}`);
        }
      }
    }
  }
  if (!fs.existsSync(path.join(DIST, "how-you-sell.html"))) bad.push("how-you-sell.html missing");
  // control: the resolver must reject a missing file
  if (exists("/ro/does-not-exist.html")) fail("control failed: resolver accepted a missing file");
  if (bad.length) fail("\n" + [...new Set(bad)].join("\n"));
  console.log("ro links verification passed");
} else if (cmd === "switch") {
  needDist();
  const bad = [];
  let n = 0;
  for (const [lang, fileFn] of [["en", enFile], ["ro", roFile]]) {
    const other = lang === "en" ? "ro" : "en";
    for (const p of PAGES) {
      const root = rootOf(read(fileFn(p)));
      const groups = [...root.matchAll(/<div data-lang-switch=""[^>]*>([\s\S]*?)<\/div>/g)];
      if (groups.length !== 3) {
        bad.push(`${lang}/${p}: ${groups.length} switches, want 3 (desktop nav, mobile header, footer)`);
        continue;
      }
      const target = other === "ro" ? `/ro/${fileOf(p)}` : `/${fileOf(p)}`;
      for (const [full, inner] of groups) {
        n++;
        const links = [...inner.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)];
        const here = [...inner.matchAll(/<span\b([^>]*)aria-current="true"([^>]*)>([^<]*)<\/span>/g)];
        if (links.length !== 1 || here.length !== 1) {
          bad.push(`${lang}/${p}: switch must hold one link and one current marker`);
          continue;
        }
        const a = links[0][1];
        const attr = (k) => (a.match(new RegExp(`\\s?${k}="([^"]*)"`)) || [])[1];
        if (attr("href") !== target) bad.push(`${lang}/${p}: switch href ${attr("href")}, want ${target}`);
        if (attr("lang") !== other || attr("hrefLang") !== other) bad.push(`${lang}/${p}: switch link lang/hreflang must be ${other}`);
        if (links[0][2] !== other.toUpperCase() || here[0][3] !== lang.toUpperCase()) bad.push(`${lang}/${p}: switch labels wrong (${links[0][2]} / ${here[0][3]})`);
        if (!attr("aria-label")) bad.push(`${lang}/${p}: switch link has no accessible name`);
        if (!/aria-label="[^"]+"/.test(full)) bad.push(`${lang}/${p}: switch group has no label`);
        const file = target.replace(/^\//, "");
        if (!fs.existsSync(path.join(DIST, file))) bad.push(`${lang}/${p}: switch target ${target} does not exist in dist`);
      }
      if (lang === "ro" && p === "index" && groups.some(([, inner]) => /href="\/"/.test(inner))) bad.push("ro/index: switch to EN points to bare / (geo redirect would bounce back)");
    }
  }
  // control: a wrong target must be caught
  if (/href="\/ro\/services\.html"/.test(read(enFile("services")).replace(/href="\/ro\/services\.html"/g, "href=\"/x\""))) fail("control failed");
  if (bad.length) fail("\n" + bad.join("\n"));
  console.log(`ro switch verification passed (${n} switches on ${PAGES.length * 2} pages)`);
} else if (cmd === "geo") {
  needDist();
  const config = JSON.parse(read(path.join(ROOT, "vercel.json")));
  // Minimal model of Vercel redirects: exact source, header conditions, first match wins.
  const route = (cfg, urlPath, headers) => {
    for (const r of cfg.redirects || []) {
      if (r.source !== urlPath) continue;
      const ok = (r.has || []).every((h) => h.type === "header" && String(headers[h.key.toLowerCase()] ?? "") === String(h.value)) && !(r.missing || []).length;
      if (ok) return { to: r.destination, permanent: !!r.permanent };
    }
    return null;
  };
  const bad = [];
  const RO = { "x-vercel-ip-country": "RO" };
  const hit = route(config, "/", RO);
  if (!hit || hit.to !== "/ro" || hit.permanent) bad.push("RO visitor on / must get a temporary redirect to /ro, got " + JSON.stringify(hit));
  for (const c of ["US", "DE", "GB", "MD", "HU", "FR", ""]) if (route(config, "/", c ? { "x-vercel-ip-country": c } : {})) bad.push(`visitor from ${c || "unknown country"} must stay on English /`);
  for (const p of ["/index.html", "/services.html", "/contact.html", "/ro", "/ro/index.html", "/ro/services.html"]) if (route(config, p, RO)) bad.push(`${p} must not redirect (it would trap the language switch or loop)`);
  if (config.trailingSlash !== false) bad.push('trailingSlash must be false so /ro is served as /ro, matching the canonical URL');
  if ((config.redirects || []).length !== 1) bad.push("expected exactly one redirect rule");
  if (!fs.existsSync(path.join(DIST, "ro/index.html")) || !/<html lang="ro"/.test(read(path.join(DIST, "ro/index.html")))) bad.push("redirect target /ro has no Romanian page in dist");
  if (!fs.existsSync(path.join(DIST, "index.html")) || !/<html lang="en"/.test(read(path.join(DIST, "index.html")))) bad.push("/ has no English page in dist");
  // control: the model must follow a changed rule (otherwise it proves nothing)
  const flipped = JSON.parse(JSON.stringify(config));
  flipped.redirects[0].has[0].value = "US";
  if (route(flipped, "/", RO) || !route(flipped, "/", { "x-vercel-ip-country": "US" })) fail("control failed: simulator ignores the country condition");
  if (bad.length) fail("\n" + bad.join("\n"));
  console.log("ro geo verification passed");
} else if (cmd === "fonts") {
  const out = execFileSync("python", [path.join(ROOT, ".unlazy/ro-react/fontcheck.py")], { cwd: ROOT, encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
  process.stdout.write(out);
} else if (cmd === "deps") {
  const pkg = JSON.parse(read(path.join(ROOT, "package.json")));
  const want = JSON.parse(read(path.join(REF, "deps.json")));
  // removing a dependency is fine (dead code gets cut); adding or re-versioning one is what the RO work must not do
  const added = [];
  for (const kind of ["dependencies", "devDependencies"]) for (const [name, ver] of Object.entries(pkg[kind] || {})) if (want[kind]?.[name] !== ver) added.push(`${kind}.${name}@${ver}`);
  if (added.length) fail("package.json gained or changed " + added.join(", ") + "; the RO work needs no new library");
  // control: the comparison must notice a new package
  if (!(want.dependencies && !("left-pad" in want.dependencies))) fail("control failed");
  console.log("ro deps verification passed (no dependency added)");
} else if (cmd === "refresh-en") {
  // after an intentional English change: make the current English render the new baseline for gate `en` (build first)
  needDist();
  // the baseline holds the English page as it would be without the language layer (no switches, no wrappers, relative asset paths)
  for (const p of PAGES) {
    const html = read(enFile(p));
    const root = rootOf(html);
    const plain = normEN(root, p);
    fs.writeFileSync(path.join(REF, "en", p + ".html"), html.replace(root, () => plain));
  }
  const pkg = JSON.parse(read(path.join(ROOT, "package.json")));
  fs.writeFileSync(path.join(REF, "deps.json"), JSON.stringify({ dependencies: pkg.dependencies, devDependencies: pkg.devDependencies }, null, 2) + "\n");
  console.log(`ro refresh-en: ref/en and ref/deps.json now hold the current build (${PAGES.length} pages); run the gates again`);
} else if (cmd === "dump") {
  // review aid: the aligned English | Romanian text of the built pages, one pair per line (node verify.mjs dump <page|all>)
  needDist(true);
  const which = process.argv[3] === "all" || !process.argv[3] ? PAGES : [process.argv[3]];
  for (const p of which) {
    const a = prepared(rootOf(read(enFile(p))));
    const b = prepared(rootOf(read(roFile(p))));
    console.log(`\n######## ${p}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const x = a[i];
      const y = b[i];
      if (x.t !== y.t) {
        console.log(`!! markup differs at token ${i}`);
        break;
      }
      if (x.t === "text" && norm(x.text)) console.log(`${norm(x.text)} ||| ${norm(y.text)}`);
      else if (x.t === "open") for (const [k, v] of x.attrs) if (TRANSLATABLE.has(k) && v) console.log(`[${k}] ${v} ||| ${y.attrs.find((q) => q[0] === k)[1]}`);
    }
  }
} else fail("unknown command " + cmd);
