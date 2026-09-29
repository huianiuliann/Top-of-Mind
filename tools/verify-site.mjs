#!/usr/bin/env node
// tools/verify-site.mjs - acceptance verifier for the topofmind.me static rewrite (spec section 16.1).
//
//   node tools/verify-site.mjs [--root <dir>] [--pages a.html,b.html] [--rules 1,2,3] [--self-test]
//
// Full run: rules 1..12 in order; stop at the first rule with failures, print each failure as
// "RULE <n> FAILED: <file>: <reason>" and exit 1; otherwise print a summary line and "SITE VERIFIED".
// Filtered runs (--pages and/or --rules) print "CHECKS PASSED" instead. --self-test (rule 13) builds a
// valid fixture site in os.tmpdir(), asserts it verifies, then injects one violation per case and
// asserts that the expected rule is the first to fail. Node >= 20, node: builtins only.
// Structure: a tolerant HTML parser, a small CSS parser, then one pure function per rule
// (ctx -> [{file, reason}]), the runner, the self-test and the CLI.

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync, mkdtempSync, rmSync, cpSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

// ---------------------------------------------------------------- site model
const SELF = fileURLToPath(import.meta.url);
const BASE = "https://topofmind.me/";
const CONTENT_PAGES = ["index.html", "how-you-sell.html", "services.html", "process.html", "team.html", "contact.html", "privacy-policy.html", "customer-policy.html"];
const NOINDEX_PAGES = ["404.html", "industries.html"];
const ALL_PAGES = [...CONTENT_PAGES, ...NOINDEX_PAGES];
const BARE_PAGE = "industries.html"; // redirect stub: no header, footer or main
const CSS = "assets/css/main.css", JS = "assets/js/main.js";
const REQUIRED_FILES = [CSS, JS, "robots.txt", "sitemap.xml", "llms.txt", "favicon.svg", "apple-touch-icon.png", "assets/img/og.png", "tools/verify-site.mjs"];
const DELETED_FILES = ["assets/js/home.js", "assets/js/services.js", "assets/js/process.js", "assets/js/team.js", "assets/js/contact.js", "assets/js/how-you-sell.js", "assets/js/gsap.min.js", "assets/js/ScrollTrigger.min.js", "assets/main.js", "assets/style.css", "assets/css/site.css", "assets/img/world-dots.webp"];
const OLD_FONT_PREFIXES = ["instrumentserif", "redhatmono", "jetbrains", "inter"];
const FONT_EXT = /\.(woff2?|ttf|otf|eot)$/i;
const BINARY_EXT = /\.(woff2?|ttf|otf|eot|png|jpe?g|webp|avif|gif|ico|pdf|mp4|webm|zip)$/i;
// Textual references to deleted files. Boundaries keep the new assets/js/main.js distinct from assets/main.js.
const bn = (s) => new RegExp(`(?<![\\w-])${s.replace(/[.]/g, "\\.")}(?![\\w-])`, "i");
const DELETED_REFS = [
  ["assets/main.js", /(?<![\w-])assets\/main\.js(?![\w-])/i], ["style.css", bn("style.css")], ["site.css", bn("site.css")],
  ["home.js", bn("home.js")], ["services.js", bn("services.js")], ["process.js", bn("process.js")], ["team.js", bn("team.js")],
  ["contact.js", bn("contact.js")], ["how-you-sell.js", bn("how-you-sell.js")], ["gsap", /gsap/i], ["ScrollTrigger", /scrolltrigger/i],
  ["world-dots", /world-dots/i], ["old font file", /(?<![\w-])(?:instrumentserif|redhatmono|jetbrains|inter)[\w.-]*\.(?:woff2?|ttf|otf|eot)\b/i],
];
const TAILWIND = /^(?:[a-z]+:)?-?(?:p|px|py|pt|pb|m|mx|my|mt|mb|w|h|text|bg|flex|grid|gap|rounded|border|items|justify|min-w|max-w|size|inset|top|left|z|opacity|translate|tracking|leading|font)-/;
const WORD_BUDGET = { "index.html": 550, "how-you-sell.html": 900, "services.html": 650, "process.html": 500, "team.html": 300, "contact.html": 550, "404.html": 60 };
const CTA_LIMIT = { "industries.html": 0, "privacy-policy.html": 1, "customer-policy.html": 1, "404.html": 1 };
const FAQ = ["Do you have case studies?", "How does pricing work?", "How fast will I see results?", "Do you work with small budgets?", "What happens if it isn't working?", "What do you need from me to start?"];
const REQUIRED_IDS = { "index.html": ["how-you-sell"], "how-you-sell.html": ["quote", "cart", "calendar"], "services.html": ["paid-advertising", "websites", "social", "lead-generation", "tracking"] };
const FOOTER_LINKS = ["https://calendly.com/huianiuliann/30min", "https://wa.me/40756883206", "mailto:iulian@topofmind.me", "tel:+40756883206"];
const OG_IMAGE = BASE + "assets/img/og.png";
const LIMITS = { image: 204800, page: 51200, css: 20480, js: 12288, fonts: 4, firstLoad: 256000, lcpWidth: 1170 };
const canonicalOf = (p) => (p === "index.html" ? BASE : BASE + p);
const RULE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// ---------------------------------------------------------------- small helpers
const fail = (file, reason) => ({ file, reason });
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const normQ = (s) => norm(String(s ?? "").replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"'));
const clip = (s, n = 70) => (s.length > n ? s.slice(0, n) + "..." : s);
const lines = (arr) => { const u = [...new Set(arr)]; return u.length > 8 ? u.slice(0, 8).join(", ") + ", ..." : u.join(", "); };
const cps = (s) => [...s].length;
const makeLineAt = (text) => {
  const starts = [0];
  for (let k = text.indexOf("\n"); k !== -1; k = text.indexOf("\n", k + 1)) starts.push(k + 1);
  return (off) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= off) lo = mid; else hi = mid - 1; } return lo + 1; };
};
const snippet = (text, idx) => norm(text.slice(Math.max(0, idx - 30), idx + 30));

// ---------------------------------------------------------------- HTML parser (tolerant, tree-building)
const VOID = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
const RAWTEXT = new Set(["script", "style", "xmp", "iframe", "noembed", "noframes"]);
const RCDATA = new Set(["title", "textarea"]);
const CLOSES_P = new Set("address article aside blockquote details dialog div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section summary table ul".split(" "));
const BLOCK = new Set("address article aside blockquote br dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr li main nav ol p pre section summary table td th tr ul".split(" "));
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00A0", copy: "\u00A9", reg: "\u00AE", trade: "\u2122", hellip: "\u2026",
  mdash: "\u2014", ndash: "\u2013", lsquo: "\u2018", rsquo: "\u2019", sbquo: "\u201A", ldquo: "\u201C", rdquo: "\u201D", bdquo: "\u201E",
  laquo: "\u00AB", raquo: "\u00BB", middot: "\u00B7", bull: "\u2022", times: "\u00D7", divide: "\u00F7", minus: "\u2212", plusmn: "\u00B1",
  euro: "\u20AC", pound: "\u00A3", yen: "\u00A5", cent: "\u00A2", deg: "\u00B0", sect: "\u00A7", para: "\u00B6", shy: "\u00AD",
  ensp: "\u2002", emsp: "\u2003", thinsp: "\u2009", zwnj: "\u200C", zwj: "\u200D", lrm: "\u200E", rlm: "\u200F", larr: "\u2190",
  rarr: "\u2192", uarr: "\u2191", darr: "\u2193", harr: "\u2194", le: "\u2264", ge: "\u2265", ne: "\u2260", check: "\u2713", star: "\u2606",
  starf: "\u2605", hearts: "\u2665", acirc: "\u00E2", Acirc: "\u00C2", icirc: "\u00EE", Icirc: "\u00CE", abreve: "\u0103", Abreve: "\u0102",
  eacute: "\u00E9", egrave: "\u00E8", ecirc: "\u00EA", aacute: "\u00E1", agrave: "\u00E0", oacute: "\u00F3", uacute: "\u00FA",
  auml: "\u00E4", ouml: "\u00F6", uuml: "\u00FC", szlig: "\u00DF", ccedil: "\u00E7", ntilde: "\u00F1", iexcl: "\u00A1", iquest: "\u00BF",
};
const LEGACY = new Set(["amp", "lt", "gt", "quot", "nbsp", "copy", "reg"]);
// HTML maps numeric references 0x80-0x9F through windows-1252 (so &#151; renders as an em dash).
const CP1252 = [0x20ac, 0, 0x201a, 0x192, 0x201e, 0x2026, 0x2020, 0x2021, 0x2c6, 0x2030, 0x160, 0x2039, 0x152, 0, 0x17d, 0, 0, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x2dc, 0x2122, 0x161, 0x203a, 0x153, 0, 0x17e, 0x178];

function decodeEntities(s) {
  if (!s.includes("&")) return s;
  return s.replace(/&(?:#(\d+);?|#[xX]([0-9a-fA-F]+);?|([A-Za-z][A-Za-z0-9]*)(;?))/g, (m, dec, hex, name, semi) => {
    if (dec !== undefined || hex !== undefined) {
      let cp = parseInt(dec ?? hex, dec !== undefined ? 10 : 16);
      if (cp >= 0x80 && cp <= 0x9f && CP1252[cp - 0x80]) cp = CP1252[cp - 0x80];
      return cp > 0 && cp <= 0x10ffff && !(cp >= 0xd800 && cp <= 0xdfff) ? String.fromCodePoint(cp) : "\uFFFD";
    }
    return Object.hasOwn(ENTITIES, name) && (semi || LEGACY.has(name)) ? ENTITIES[name] : m;
  });
}

function parseStartTag(src, lt) {
  const N = src.length, ws = /\s/;
  let j = lt + 1;
  while (j < N && !/[\s/>]/.test(src[j])) j++;
  const name = src.slice(lt + 1, j).toLowerCase(), attrList = [], seen = new Set();
  let selfClosing = false;
  while (j < N) {
    while (j < N && ws.test(src[j])) j++;
    if (j >= N) break;
    if (src[j] === ">") { j++; break; }
    if (src[j] === "/") { if (src[j + 1] === ">") { selfClosing = true; j += 2; break; } j++; continue; }
    const a0 = j++;
    while (j < N && !/[\s/>=]/.test(src[j])) j++;
    const an = src.slice(a0, j).toLowerCase();
    let val = "", k = j;
    while (k < N && ws.test(src[k])) k++;
    if (src[k] === "=") {
      k++;
      while (k < N && ws.test(src[k])) k++;
      const q = src[k];
      if (q === '"' || q === "'") { const e = src.indexOf(q, k + 1); val = src.slice(k + 1, e === -1 ? N : e); j = e === -1 ? N : e + 1; }
      else { const v0 = k; while (k < N && !/[\s>]/.test(src[k])) k++; val = src.slice(v0, k); j = k; }
    }
    if (!seen.has(an)) { seen.add(an); attrList.push([an, decodeEntities(val)]); }
  }
  return { name, attrList, selfClosing, end: j };
}

// Returns a document node; every element is {type:"el", tag, attrs:Map, attrList, children, parent, line}
// and doc.all lists all elements in document order. Raw text of script/style is kept undecoded.
function parseHTML(src) {
  const lineAt = makeLineAt(src);
  const doc = { type: "root", tag: "#document", children: [], parent: null, attrs: new Map(), attrList: [], all: [], comments: [] };
  const stack = [doc], top = () => stack[stack.length - 1], N = src.length;
  const addText = (from, to) => { if (to > from) top().children.push({ type: "text", text: decodeEntities(src.slice(from, to)), parent: top(), line: lineAt(from) }); };
  const closeInScope = (targets, boundaries) => {
    for (let k = stack.length - 1; k > 0; k--) {
      if (targets.has(stack[k].tag)) { stack.length = k; return; }
      if (boundaries.has(stack[k].tag)) return;
    }
  };
  const END_TAG = /<\/([A-Za-z][^\s/>]*)[^>]*>?/y;
  let i = 0, textFrom = 0;
  while (i < N) {
    const lt = src.indexOf("<", i);
    if (lt === -1) break;
    const c1 = src[lt + 1] || "", c2 = src[lt + 2] || "";
    if (src.startsWith("<!--", lt)) {
      addText(textFrom, lt);
      const end = src.indexOf("-->", lt + 4);
      const node = { type: "comment", text: src.slice(lt + 4, end === -1 ? N : end), parent: top(), line: lineAt(lt) };
      top().children.push(node); doc.comments.push(node);
      i = textFrom = end === -1 ? N : end + 3;
    } else if (c1 === "!" || c1 === "?" || (c1 === "/" && !/[A-Za-z]/.test(c2))) { // doctype, <?xml?>, CDATA, bogus
      addText(textFrom, lt);
      const end = src.indexOf(">", lt + 1);
      i = textFrom = end === -1 ? N : end + 1;
    } else if (c1 === "/") { // end tag: pop to the nearest open element of that name, ignore strays
      addText(textFrom, lt);
      END_TAG.lastIndex = lt;
      const m = END_TAG.exec(src), name = m[1].toLowerCase();
      i = textFrom = lt + m[0].length;
      if (/^h[1-6]$/.test(name)) closeInScope(new Set(["h1", "h2", "h3", "h4", "h5", "h6"]), new Set());
      else if (!VOID.has(name)) for (let k = stack.length - 1; k > 0; k--) if (stack[k].tag === name) { stack.length = k; break; }
    } else if (/[A-Za-z]/.test(c1)) { // start tag
      addText(textFrom, lt);
      const t = parseStartTag(src, lt), tag = t.name;
      if (CLOSES_P.has(tag)) closeInScope(new Set(["p"]), new Set(["button", "table", "td", "th", "template", "svg", "math"]));
      if (tag === "li") closeInScope(new Set(["li"]), new Set(["ul", "ol", "menu", "table", "template"]));
      if (tag === "dt" || tag === "dd") closeInScope(new Set(["dt", "dd"]), new Set(["dl", "table", "template"]));
      if (tag === "tr") closeInScope(new Set(["tr", "td", "th"]), new Set(["table", "thead", "tbody", "tfoot"]));
      if (tag === "td" || tag === "th") closeInScope(new Set(["td", "th"]), new Set(["tr", "table"]));
      if (tag === "option" && top().tag === "option") stack.pop();
      if (/^h[1-6]$/.test(tag) && /^h[1-6]$/.test(top().tag)) stack.pop();
      const el = { type: "el", tag, attrs: new Map(t.attrList), attrList: t.attrList, children: [], parent: top(), line: lineAt(lt) };
      top().children.push(el); doc.all.push(el);
      i = textFrom = t.end;
      if (RAWTEXT.has(tag) || RCDATA.has(tag)) {
        const re = new RegExp(`</${tag}(?=[\\s/>])`, "ig");
        re.lastIndex = i;
        const mm = re.exec(src), stop = mm ? mm.index : N;
        if (stop > i) el.children.push({ type: "text", text: RCDATA.has(tag) ? decodeEntities(src.slice(i, stop)) : src.slice(i, stop), parent: el, line: lineAt(i) });
        const gt = mm ? src.indexOf(">", stop) : -1;
        i = textFrom = gt === -1 ? N : gt + 1;
      } else if (!VOID.has(tag) && !(t.selfClosing && (tag === "svg" || tag === "math" || stack.some((n) => n.tag === "svg" || n.tag === "math")))) {
        stack.push(el);
      }
    } else {
      i = lt + 1; // a literal "<" stays in the text
    }
  }
  addText(textFrom, N);
  return doc;
}

// DOM-ish helpers
const attr = (el, a) => (el && el.attrs ? el.attrs.get(a) : undefined);
const classes = (el) => (attr(el, "class") || "").split(/\s+/).filter(Boolean);
const tokens = (el, a) => (attr(el, a) || "").toLowerCase().split(/\s+/).filter(Boolean);
const ancestor = (el, pred) => { for (let p = el.parent; p && p.type === "el"; p = p.parent) if (pred(p)) return p; return null; };
const descendants = (el) => { const out = []; const rec = (n) => { for (const c of n.children || []) if (c.type === "el") { out.push(c); rec(c); } }; rec(el); return out; };
const inSvg = (el) => !!ancestor(el, (p) => p.tag === "svg");
const metas = (doc, key) => doc.all.filter((e) => e.tag === "meta" && ((attr(e, "name") || "").toLowerCase() === key || (attr(e, "property") || "").toLowerCase() === key));
const headTitles = (doc) => doc.all.filter((e) => e.tag === "title" && !inSvg(e));
const ldScripts = (doc) => doc.all.filter((e) => e.tag === "script" && norm(attr(e, "type")).toLowerCase() === "application/ld+json");
const rawText = (el) => el.children.map((c) => c.text || "").join("");
// Text of a subtree. sep: string inserted around every element; blocks: space around block elements only.
function textOf(node, { sep = "", blocks = false, skip = new Set(["script", "style", "template"]) } = {}) {
  const out = [];
  const rec = (n) => {
    for (const c of n.children || []) {
      if (c.type === "text") out.push(c.text);
      else if (c.type === "el" && !skip.has(c.tag)) {
        const s = sep || (blocks && BLOCK.has(c.tag) ? " " : "");
        out.push(s); rec(c); out.push(s);
      }
    }
  };
  rec(node);
  return out.join("");
}
// Canonical outer HTML for the header/footer identity check (rule 8): whitespace collapsed, comments dropped,
// aria-current="page" removed, root-relative href/src "/x" written as "x" (404.html uses root-relative URLs).
function serialize(node, drop = new Set()) {
  if (node.type === "text") { const t = norm(node.text); return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  if (node.type !== "el" || drop.has(node)) return "";
  let s = "<" + node.tag;
  for (const [a, v] of node.attrList) {
    if (a === "aria-current" && v.trim() === "page") continue;
    let val = norm(v);
    if ((a === "href" || a === "src") && /^\/(?!\/)/.test(val)) val = val.slice(1);
    s += ` ${a}="${val.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`;
  }
  s += ">";
  if (VOID.has(node.tag)) return s;
  for (const c of node.children) s += serialize(c, drop);
  return s + `</${node.tag}>`;
}

// ---------------------------------------------------------------- URL resolution
// kind: "internal" (path relative to root, fragment), "external", "other" (mailto:, tel:, data:...) or "invalid".
function resolveRef(from, ref) {
  const raw = String(ref ?? "").trim();
  if (/^(mailto|tel|sms|data|javascript|blob):/i.test(raw)) return { kind: "other" };
  let u;
  try { u = new URL(raw, BASE + from); } catch { return { kind: "invalid" }; }
  if (u.protocol !== "https:" || u.host !== "topofmind.me") return { kind: "external" };
  let path, fragment;
  try { path = decodeURIComponent(u.pathname).replace(/^\/+/, ""); fragment = decodeURIComponent(u.hash.slice(1)); } catch { return { kind: "invalid" }; }
  if (path === "" || path.endsWith("/")) path += "index.html";
  return { kind: "internal", path, fragment };
}

function parseSrcset(s) {
  const out = [], N = s.length;
  let i = 0;
  while (i < N) {
    while (i < N && /[\s,]/.test(s[i])) i++;
    if (i >= N) break;
    let j = i;
    while (j < N && !/\s/.test(s[j])) j++;
    let url = s.slice(i, j), desc = "";
    if (url.endsWith(",")) { url = url.replace(/,+$/, ""); i = j; }
    else { let k = j, depth = 0; while (k < N && (s[k] !== "," || depth)) { if (s[k] === "(") depth++; else if (s[k] === ")") depth--; k++; } desc = s.slice(j, k).trim(); i = k + 1; }
    const c = { url }, mw = /^(\d+)w$/i.exec(desc), mx = /^(\d*\.?\d+)x$/i.exec(desc);
    if (mw) c.w = +mw[1]; else if (mx) c.x = +mx[1]; else if (!desc) c.x = 1; else c.bad = desc;
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- CSS parser
// Comments become spaces (newlines kept, so offsets and line numbers match the raw file).
function stripCssComments(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c && css[j] !== "\n") j += css[j] === "\\" ? 2 : 1;
      out.push(css.slice(i, j + 1)); i = j + 1;
    } else if (c === "/" && css[i + 1] === "*") {
      const e = css.indexOf("*/", i + 2), end = e === -1 ? css.length : e + 2;
      out.push(css.slice(i, end).replace(/[^\n]/g, " ")); i = end;
    } else { out.push(c); i++; }
  }
  return out.join("");
}

function splitTop(s, sep) {
  const parts = [];
  let depth = 0, q = null, last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === sep && depth === 0) { parts.push(s.slice(last, i)); last = i + 1; }
  }
  parts.push(s.slice(last));
  return parts;
}

// Items: {type:"decl", prop, rawProp, value, important, line} | {type:"rule", selectors, items, line}
//      | {type:"at", name, prelude, items|null, line}. Nested rules (CSS nesting) are supported.
function parseCss(raw) {
  const text = stripCssComments(raw), lineAt = makeLineAt(text), errors = [], N = text.length;
  let i = 0;
  const scan = () => { // advance to the next top-level ; { or }
    let depth = 0;
    while (i < N) {
      const c = text[i];
      if (c === '"' || c === "'") { i++; while (i < N && text[i] !== c && text[i] !== "\n") i += text[i] === "\\" ? 2 : 1; i++; continue; }
      if (c === "\\") { i += 2; continue; }
      if (c === "(" || c === "[") depth++;
      else if ((c === ")" || c === "]") && depth > 0) depth--;
      else if (!depth && (c === ";" || c === "{" || c === "}")) return;
      i++;
    }
  };
  const atRule = (chunk, items, line) => { const m = /^@([-\w]+)([\s\S]*)$/.exec(chunk); return { type: "at", name: m ? m[1].toLowerCase() : "", prelude: m ? m[2].trim() : chunk, items, line }; };
  const block = (isTop) => {
    const items = [];
    for (;;) {
      while (i < N && /\s/.test(text[i])) i++;
      if (i >= N) { if (!isTop) errors.push('unclosed "{" block at end of file'); return items; }
      if (text[i] === "}") { i++; if (isTop) { errors.push(`line ${lineAt(i - 1)}: unmatched "}"`); continue; } return items; }
      if (text[i] === ";") { i++; continue; }
      const start = i, line = lineAt(i);
      scan();
      const chunk = text.slice(start, i).trim(), stop = text[i];
      if (stop === "{") {
        i++;
        if (chunk.startsWith("@")) items.push(atRule(chunk, block(false), line));
        else items.push({ type: "rule", selectors: splitTop(chunk, ",").map(norm).filter(Boolean), items: block(false), line });
        continue;
      }
      if (stop === ";") i++;
      if (chunk.startsWith("@")) { items.push(atRule(chunk, null, line)); continue; }
      const k = chunk.indexOf(":");
      if (k <= 0) { errors.push(`line ${line}: cannot parse "${clip(chunk, 40)}"`); continue; }
      if (isTop) errors.push(`line ${line}: declaration outside any rule`);
      const rawProp = chunk.slice(0, k).trim();
      let value = chunk.slice(k + 1).trim();
      const important = /!\s*important\s*$/i.test(value);
      value = value.replace(/!\s*important\s*$/i, "").trim();
      items.push({ type: "decl", prop: rawProp.toLowerCase(), rawProp, value, important, line });
    }
  };
  return { raw, text, items: block(true), errors, lineAt };
}

// Walk CSS items; onDecl(decl, effectiveSelectors|null), onAt(atRule). Nested selectors are expanded (& or descendant).
function walkCss(items, onDecl, onAt, sels = null) {
  for (const it of items) {
    if (it.type === "decl") onDecl(it, sels);
    else if (it.type === "rule") {
      const own = it.selectors;
      const eff = !sels ? own : own.flatMap((s) => sels.map((p) => (s.includes("&") ? s.replace(/&/g, p) : `${p} ${s}`)));
      walkCss(it.items, onDecl, onAt, eff);
    } else {
      if (onAt) onAt(it);
      const ctxSels = /^(font-face|page|property|counter-style|font-feature-values)$/.test(it.name) || /keyframes$/.test(it.name) ? null : sels;
      if (it.items) walkCss(it.items, onDecl, onAt, ctxSels);
    }
  }
}

function cssUrls(css) {
  const out = [];
  for (const m of css.text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"'\s]*))\s*\)/gi)) out.push({ url: m[1] ?? m[2] ?? m[3], line: css.lineAt(m.index) });
  return out;
}

// Expand var(--x[, fallback]) against every definition of --x in the stylesheet (cartesian, capped).
function expandVars(value, defs, depth = 0) {
  const idx = value.search(/var\(/i);
  if (idx === -1 || depth > 8) return { values: [value], undef: [] };
  let d = 0, j = idx + 3;
  for (; j < value.length; j++) { if (value[j] === "(") d++; else if (value[j] === ")" && --d === 0) break; }
  const inner = value.slice(idx + 4, j), parts = splitTop(inner, ",");
  const name = parts[0].trim(), fallback = parts.length > 1 ? parts.slice(1).join(",").trim() : null;
  const alts = [...(defs.get(name) || [])];
  if (fallback !== null) alts.push(fallback);
  const undef = !defs.has(name) && fallback === null ? [name] : [];
  if (!alts.length) alts.push("");
  const values = [];
  for (const alt of alts) {
    const r = expandVars(value.slice(0, idx) + alt + value.slice(j + 1), defs, depth + 1);
    values.push(...r.values); undef.push(...r.undef);
    if (values.length > 256) break;
  }
  return { values, undef };
}

// ---------------------------------------------------------------- site context
function listFiles(root, relDir) {
  const out = [];
  const rec = (rel) => {
    let ents;
    try { ents = readdirSync(rel ? join(root, ...rel.split("/")) : root, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith(".")) continue; // .DS_Store and friends are not site files
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) rec(r); else if (e.isFile()) out.push(r);
    }
  };
  rec(relDir);
  return out.sort();
}

function makeCtx(root, { pages = null, explicitRules = new Set() } = {}) {
  const texts = new Map(), docs = new Map(), dirs = new Map();
  const abs = (rel) => join(root, ...rel.split("/"));
  const entries = (relDir) => {
    if (!dirs.has(relDir)) { let e = null; try { e = readdirSync(relDir ? abs(relDir) : root); } catch {} dirs.set(relDir, e); }
    return dirs.get(relDir);
  };
  let css;
  const ctx = {
    root, info: [], scope: pages || ALL_PAGES,
    fullSet: (n) => !pages || explicitRules.has(n), // rule 1 file checks and rule 10 sitemap equality
    abs,
    exists(rel) { // exact-case existence: Vercel is case-sensitive even when the local disk is not
      const parts = rel.split("/").filter(Boolean);
      if (!parts.length || parts.some((p) => p === "." || p === "..")) return false;
      for (let k = 0; k < parts.length; k++) { const e = entries(parts.slice(0, k).join("/")); if (!e || !e.includes(parts[k])) return false; }
      try { return statSync(abs(rel)).isFile(); } catch { return false; }
    },
    size(rel) { try { return statSync(abs(rel)).size; } catch { return -1; } },
    read(rel) {
      if (!texts.has(rel)) { let t = null; try { if (statSync(abs(rel)).isFile()) t = readFileSync(abs(rel), "utf8"); } catch {} texts.set(rel, t); }
      return texts.get(rel);
    },
    page(rel) {
      if (!docs.has(rel)) { const src = ctx.exists(rel) ? ctx.read(rel) : null; docs.set(rel, src === null ? null : { name: rel, src, doc: parseHTML(src) }); }
      return docs.get(rel);
    },
    css() { if (css === undefined) css = ctx.exists(CSS) ? parseCss(ctx.read(CSS)) : null; return css; },
  };
  return ctx;
}

// Iterate the pages in scope; a missing page is itself a failure of the rule being checked.
function eachPage(ctx, F, fn, only = null) {
  for (const name of ctx.scope) {
    if (only && !only(name)) continue;
    const pg = ctx.page(name);
    if (!pg) { F.push(fail(name, "page does not exist")); continue; }
    fn(pg, (reason) => F.push(fail(name, reason)));
  }
}

// ---------------------------------------------------------------- rule 1: files and hygiene
function rule1(ctx) {
  const F = [];
  if (ctx.fullSet(1)) {
    for (const f of [...ALL_PAGES, ...REQUIRED_FILES]) if (!ctx.exists(f)) F.push(fail(f, "required file is missing"));
    for (const f of DELETED_FILES) if (existsSync(ctx.abs(f))) F.push(fail(f, "deleted file must not exist"));
    const assets = listFiles(ctx.root, "assets");
    for (const f of assets) {
      const b = f.split("/").pop().toLowerCase();
      if (FONT_EXT.test(b) && OLD_FONT_PREFIXES.some((p) => b.startsWith(p))) F.push(fail(f, "old font file must be deleted"));
    }
    // References to deleted files in site files (tools/ and .unlazy/ are deliberately not scanned).
    let rootFiles = [];
    try { rootFiles = readdirSync(ctx.root, { withFileTypes: true }).filter((e) => e.isFile() && (/\.(html|txt|xml)$/i.test(e.name) || e.name === "vercel.json")).map((e) => e.name).sort(); } catch {}
    const siteFiles = [...rootFiles, ...assets.filter((f) => !BINARY_EXT.test(f))];
    for (const f of siteFiles) {
      const text = ctx.read(f);
      if (!text) continue;
      const lineAt = makeLineAt(text);
      for (const [label, re] of DELETED_REFS) { const m = re.exec(text); if (m) F.push(fail(f, `references deleted ${label} ("${m[0]}", line ${lineAt(m.index)})`)); }
    }
    // Fonts: at most 4 files in assets/fonts, each referenced by url() in main.css; every url() resolves.
    const fonts = listFiles(ctx.root, "assets/fonts");
    if (fonts.length > LIMITS.fonts) F.push(fail("assets/fonts", `holds ${fonts.length} files, at most ${LIMITS.fonts} allowed`));
    const css = ctx.css();
    if (css) {
      const referenced = new Set();
      for (const { url, line } of cssUrls(css)) {
        if (/^data:/i.test(url) || url.startsWith("#")) continue;
        const r = resolveRef(CSS, url);
        if (r.kind !== "internal") F.push(fail(CSS, `line ${line}: url(${url}) is not a local file`));
        else if (!ctx.exists(r.path)) F.push(fail(CSS, `line ${line}: url(${url}) does not resolve (${r.path} missing)`));
        else referenced.add(r.path);
      }
      for (const f of fonts) if (!referenced.has(f)) F.push(fail(f, "font file is not referenced by any url() in main.css"));
    }
  }
  eachPage(ctx, F, (pg, f) => {
    const hits = new Map(), tw = new Map();
    const hit = (what, line) => { if (!hits.has(what)) hits.set(what, []); hits.get(what).push(line); };
    for (const c of pg.doc.comments) if (/generated\s+by/i.test(c.text)) hit('"generated by" comment', c.line);
    for (const el of pg.doc.all) {
      for (const [a, v] of el.attrList) {
        if (a === "style") hit("style= attribute", el.line);
        if (a === "id" && v === "root") hit('id="root"', el.line);
        if (a.startsWith("data-framer") || a === "data-reactroot" || a === "data-reactid") hit(`${a} attribute`, el.line);
        if (/^on[a-z]+$/.test(a)) hit(`inline event handler ${a}=`, el.line);
        if (/^\s*javascript:/i.test(v)) hit("javascript: URL", el.line);
      }
      if (el.tag === "style") hit("<style> element", el.line);
      if (el.tag === "script" && !el.attrs.has("src") && norm(attr(el, "type")).toLowerCase() !== "application/ld+json") hit("inline <script> without src", el.line);
      if (el.tag === "meta" && (attr(el, "name") || "").toLowerCase() === "generator") hit('<meta name="generator">', el.line);
      for (const c of classes(el)) if (TAILWIND.test(c) || /[[\]/:]/.test(c)) { if (!tw.has(c)) tw.set(c, el.line); }
    }
    for (const [what, ls] of hits) f(`${what} (${ls.length}x, line ${lines(ls)})`);
    if (tw.size) f(`${tw.size} Tailwind-looking class(es): ${lines([...tw].map(([c, l]) => `"${c}" (line ${l})`))}`);
  }, (name) => !ctx.fullSet(1) || ctx.exists(name)); // missing pages were already reported above
  return F;
}

// ---------------------------------------------------------------- rule 2: head, SEO metadata, headings
function rule2(ctx) {
  const F = [];
  const titleOf = (doc) => { const t = headTitles(doc)[0]; return t ? norm(textOf(t)) : ""; };
  const descOf = (doc) => norm(attr(metas(doc, "description")[0], "content"));
  const titles = new Map(), descs = new Map(); // uniqueness is checked against ALL existing pages
  for (const name of ALL_PAGES) {
    const pg = ctx.page(name);
    if (!pg) continue;
    const t = titleOf(pg.doc), d = descOf(pg.doc);
    if (t) titles.set(t.toLowerCase(), [...(titles.get(t.toLowerCase()) || []), name]);
    if (d) descs.set(d.toLowerCase(), [...(descs.get(d.toLowerCase()) || []), name]);
  }
  eachPage(ctx, F, (pg, f) => {
    const { doc, name } = pg;
    const html = doc.all.find((e) => e.tag === "html");
    if (attr(html, "lang") !== "en") f(`<html lang="en"> required (found lang=${JSON.stringify(attr(html, "lang") ?? null)})`);
    if (!metas(doc, "viewport").some((m) => norm(attr(m, "content")))) f('missing <meta name="viewport">');
    const tEls = headTitles(doc), title = titleOf(doc);
    if (!title) f("missing or empty <title>");
    if (tEls.length > 1) f(`${tEls.length} <title> elements, expected one`);
    const noindex = metas(doc, "robots").some((m) => /\bnoindex\b/i.test(attr(m, "content") || ""));
    if (NOINDEX_PAGES.includes(name)) { if (!noindex) f('noindex page must carry <meta name="robots" content="noindex...">'); return; }
    if (noindex) f("content page must be indexable, but its robots meta contains noindex");

    const h1 = doc.all.filter((e) => e.tag === "h1");
    if (h1.length !== 1) f(`expected exactly one <h1>, found ${h1.length}`);
    if (title) {
      const n = cps(title);
      if (n < 30 || n > 60) f(`<title> is ${n} characters, must be 30-60: "${title}"`);
      const same = titles.get(title.toLowerCase()).filter((p) => p !== name);
      if (same.length) f(`<title> "${title}" is not unique (also on ${same.join(", ")})`);
    }
    const dEls = metas(doc, "description"), desc = descOf(doc);
    if (dEls.length !== 1) f(`expected one <meta name="description">, found ${dEls.length}`);
    if (dEls.length) {
      const n = cps(desc);
      if (n < 110 || n > 160) f(`meta description is ${n} characters, must be 110-160`);
      const same = (descs.get(desc.toLowerCase()) || []).filter((p) => p !== name);
      if (same.length) f(`meta description is not unique (also on ${same.join(", ")})`);
    }
    const canon = canonicalOf(name), canEls = doc.all.filter((e) => e.tag === "link" && tokens(e, "rel").includes("canonical"));
    if (canEls.length !== 1) f(`expected one <link rel="canonical">, found ${canEls.length}`);
    else if ((attr(canEls[0], "href") || "").trim() !== canon) f(`canonical is "${attr(canEls[0], "href")}", expected "${canon}"`);
    const expect = { "og:type": null, "og:site_name": null, "og:title": null, "og:description": null, "og:url": canon, "og:image": OG_IMAGE, "og:image:alt": null, "og:locale": "en_GB", "twitter:card": "summary_large_image" };
    for (const [key, want] of Object.entries(expect)) {
      const m = metas(doc, key), v = norm(attr(m[0], "content"));
      if (m.length !== 1) f(`expected one <meta ${key.startsWith("og:") ? "property" : "name"}="${key}">, found ${m.length}`);
      else if (!v) f(`<meta ${key}> has empty content`);
      else if (want !== null && v !== want) f(`<meta ${key}> is "${v}", expected "${want}"`);
    }
    const links = doc.all.filter((e) => e.tag === "link");
    if (!links.some((e) => tokens(e, "rel").includes("icon") && resolveRef(name, attr(e, "href")).path === "favicon.svg")) f('missing <link rel="icon" href="favicon.svg">');
    if (!links.some((e) => tokens(e, "rel").includes("apple-touch-icon") && norm(attr(e, "href")))) f('missing <link rel="apple-touch-icon">');
    const ld = ldScripts(doc);
    if (!ld.length) f('no <script type="application/ld+json">');
    for (const s of ld) { try { JSON.parse(rawText(s)); } catch (e) { f(`JSON-LD block at line ${s.line} does not parse: ${e.message}`); } }
    // Heading levels never skip; the first heading is the h1. No duplicate h2 texts.
    const hs = doc.all.filter((e) => /^h[1-6]$/.test(e.tag));
    if (hs.length && hs[0].tag !== "h1") f(`first heading is <${hs[0].tag}> (line ${hs[0].line}), must be <h1>`);
    for (let k = 1; k < hs.length; k++) {
      const a = +hs[k - 1].tag[1], b = +hs[k].tag[1];
      if (b > a + 1) f(`heading level skips from <h${a}> to <h${b}> at line ${hs[k].line} ("${clip(norm(textOf(hs[k])), 40)}")`);
    }
    const seen = new Map();
    for (const h of hs.filter((e) => e.tag === "h2")) {
      const t = norm(textOf(h)).toLowerCase();
      if (seen.has(t)) f(`duplicate <h2> "${norm(textOf(h))}" (lines ${seen.get(t)} and ${h.line})`); else seen.set(t, h.line);
    }
  });
  return F;
}

// ---------------------------------------------------------------- rule 3: CTAs
function rule3(ctx) {
  const F = [];
  eachPage(ctx, F, ({ doc, name }, f) => {
    const ctas = doc.all.filter((e) => e.attrs.has("data-cta")), limit = CTA_LIMIT[name] ?? 2;
    if (ctas.length > limit) f(`${ctas.length} elements with data-cta (lines ${lines(ctas.map((e) => e.line))}), at most ${limit} allowed`);
    for (const el of doc.all) {
      if (classes(el).includes("btn") && !el.attrs.has("data-cta") && !ancestor(el, (p) => attr(p, "id") === "cookie-consent")) f(`line ${el.line}: <${el.tag} class="${attr(el, "class")}"> is a .btn without data-cta`);
    }
    if (name === "contact.html") {
      for (const h of doc.all.filter((e) => e.tag === "header" && classes(e).includes("site-header"))) {
        for (const el of [h, ...descendants(h)]) if (el.attrs.has("data-cta")) f(`line ${el.line}: the site header on contact.html must not contain a data-cta element`);
      }
    }
  });
  return F;
}

// ---------------------------------------------------------------- rule 4: main.css restrictions
function checkMediaPrelude(prelude) {
  if (/max-width/i.test(prelude)) return "uses max-width";
  for (const q of splitTop(prelude, ",")) {
    const toks = q.trim().match(/\([^()]*\)|[^\s()]+|[()]/g) || [];
    if (!toks.length) return "has an empty media query";
    for (const t of toks) {
      if (t.length > 2 && t.startsWith("(") && t.endsWith(")")) {
        const inner = t.slice(1, -1).trim();
        if (/^min-width\s*:\s*\S/i.test(inner) || /^prefers-reduced-motion(\s*:\s*(reduce|no-preference))?$/i.test(inner)) continue;
        return `has feature ${t}; only (min-width: ...) and (prefers-reduced-motion...) are allowed`;
      }
      if (!/^(screen|print|all|and)$/i.test(t)) return `has token "${t}"; only screen, print, all and "and" are allowed`;
    }
  }
  return null;
}

function rule4(ctx) {
  const css = ctx.css();
  if (!css) return [fail(CSS, "file is missing")];
  const F = [], f = (r) => F.push(fail(CSS, r));
  for (const e of css.errors) f(`CSS parse error: ${e}`);
  const g = /gradient\(/i.exec(css.raw);
  if (g) f(`contains "gradient(" (line ${css.lineAt(g.index)})`);
  const kf = /@(?:-[a-z]+-)?keyframes\b/i.exec(css.text);
  if (kf) f(`contains @keyframes (line ${css.lineAt(kf.index)})`);
  const defs = new Map();
  walkCss(css.items, (d) => { if (d.rawProp.startsWith("--")) defs.set(d.rawProp, [...(defs.get(d.rawProp) || []), d.value]); });
  let reduced = false;
  const onlyIn = (sels, word) => !!sels && sels.length > 0 && sels.every((s) => s.includes(word));
  walkCss(css.items, (d, sels) => {
    const at = `line ${d.line}: ${d.prop}: ${clip(d.value, 50)}`, p = d.prop, v = d.value.toLowerCase();
    const { values, undef } = /^(-[a-z]+-)?(border(-[a-z]+)*-radius|transition(-duration|-delay)?)$/.test(p) ? expandVars(d.value, defs) : { values: [], undef: [] };
    for (const u of undef) f(`${at}: var(${u}) is not defined in main.css`);
    if (/^(-[a-z]+-)?border(-[a-z]+)*-radius$/.test(p)) {
      for (const val of values) {
        if (val.includes("(")) { f(`${at}: functions (calc/min/max/var cycles) cannot be verified in a radius; use plain lengths <= 8px`); continue; }
        for (const t of val.trim().split(/[\s/]+/).filter(Boolean)) {
          if (t.includes("%")) { f(`${at}: percentage radius "${t}" is not allowed`); continue; }
          if (/^(inherit|initial|unset|revert|revert-layer)$/i.test(t)) continue;
          const m = /^([+-]?(?:\d+\.?\d*|\.\d+))(px|rem|em)?$/i.exec(t);
          if (!m) { f(`${at}: radius value "${t}" is not a px/rem/em length`); continue; }
          const px = +m[1] * (m[2] && /r?em/i.test(m[2]) ? 16 : 1);
          if (!m[2] && +m[1] !== 0) f(`${at}: unitless radius "${t}"`);
          else if (px > 8) f(`${at}: radius ${t} = ${px}px exceeds 8px`);
        }
      }
    }
    if (/^(-[a-z]+-)?backdrop-filter$/.test(p) && v !== "none" && !onlyIn(sels, "consent-overlay")) f(`${at}: backdrop-filter only allowed in rules whose every selector contains "consent-overlay" (selectors: ${sels ? sels.join(", ") : "none"})`);
    if (/^(-[a-z]+-)?box-shadow$/.test(p) && v !== "none" && !onlyIn(sels, "consent")) f(`${at}: box-shadow only allowed in rules whose every selector contains "consent" (selectors: ${sels ? sels.join(", ") : "none"})`);
    if (/^(-[a-z]+-)?transition(-duration|-delay)?$/.test(p)) {
      for (const val of values) {
        if (/\b(calc|min|max|clamp|var)\(/i.test(val)) { f(`${at}: time value cannot be verified (${clip(val, 40)})`); continue; }
        for (const m of val.matchAll(/(?<![\w.-])([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(ms|s)\b/gi)) {
          const ms = +m[1] * (m[2].toLowerCase() === "s" ? 1000 : 1);
          if (ms > 200) f(`${at}: time ${m[0]} exceeds 200ms`);
        }
      }
    }
    if (/^(-[a-z]+-)?animation(-name)?$/.test(p) && v !== "none") f(`${at}: animations are not allowed (only "none")`);
  }, (a) => {
    if (a.name === "import") f(`line ${a.line}: @import is not allowed; all CSS lives in main.css`);
    if (a.name === "media") {
      const why = checkMediaPrelude(a.prelude);
      if (why) f(`line ${a.line}: @media ${a.prelude} ${why}`);
      if (/\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(a.prelude)) reduced = true;
    }
  });
  if (!reduced) f("no @media (prefers-reduced-motion: reduce) block");
  return F;
}

// ---------------------------------------------------------------- rule 5: no em dash, no emoji
const EMOJI = /[\p{Emoji_Presentation}\u{FE0F}]/u;
const textChecker = (f) => (where, text) => {
  if (!text) return;
  const d = text.indexOf("\u2014");
  if (d !== -1) f(`em dash (U+2014) in ${where}: "${snippet(text, d)}"`);
  const e = EMOJI.exec(text);
  if (e) f(`emoji U+${e[0].codePointAt(0).toString(16).toUpperCase()} in ${where}: "${snippet(text, e.index)}"`);
};
// JS source without comments (strings and template literals are kept), with \u escapes and entities decoded.
function jsText(src) {
  const out = [];
  for (let i = 0; i < src.length;) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") { let j = i + 1; while (j < src.length && src[j] !== c) j += src[j] === "\\" ? 2 : 1; out.push(src.slice(i, j + 1)); i = j + 1; }
    else if (c === "/" && src[i + 1] === "/") { const e = src.indexOf("\n", i); i = e === -1 ? src.length : e; }
    else if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); i = e === -1 ? src.length : e + 2; }
    else { out.push(c); i++; }
  }
  const unesc = out.join("").replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (m, a, b) => { const cp = parseInt(a ?? b, 16); return cp <= 0x10ffff ? String.fromCodePoint(cp) : m; });
  return decodeEntities(unesc);
}
function rule5(ctx) {
  const F = [];
  // Text generated outside the HTML is visible on every page too: main.js (cookie banner) and CSS content.
  const js = ctx.read(JS);
  if (js !== null) textChecker((r) => F.push(fail(JS, `${r} (main.js text is shown on every page, e.g. the cookie banner)`)))("main.js strings", jsText(js));
  const css = ctx.css();
  if (css) {
    const unesc = (v) => v.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (m, h) => (parseInt(h, 16) <= 0x10ffff ? String.fromCodePoint(parseInt(h, 16)) : m));
    walkCss(css.items, (d) => { if (d.prop === "content" || d.rawProp.startsWith("--")) textChecker((r) => F.push(fail(CSS, r)))(`line ${d.line}: ${d.prop} value`, unesc(d.value)); });
  }
  eachPage(ctx, F, ({ doc }, f) => {
    const check = textChecker(f);
    const rec = (n) => {
      for (const c of n.children || []) {
        if (c.type === "text") check(`visible text (line ${c.line})`, c.text);
        else if (c.type === "el" && !["script", "style", "template"].includes(c.tag) && !(c.tag === "title" && !inSvg(c))) rec(c);
      }
    };
    rec(doc);
    for (const t of headTitles(doc)) check("<title>", textOf(t));
    for (const key of ["description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"]) for (const m of metas(doc, key)) check(`meta ${key}`, attr(m, "content"));
    for (const el of doc.all) {
      for (const a of ["alt", "title", "placeholder", "aria-label"]) if (el.attrs.has(a)) check(`${a}= of <${el.tag}> (line ${el.line})`, attr(el, a));
      if (el.tag === "input" && /^(button|submit|reset)$/i.test(attr(el, "type") || "")) check(`value= of <input> (line ${el.line})`, attr(el, "value"));
    }
  });
  return F;
}

// ---------------------------------------------------------------- rule 6: one <main id="main">, word budgets
const countWords = (el) => textOf(el, { sep: " ", skip: new Set(["script", "style"]) }).split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
function rule6(ctx) {
  const F = [];
  eachPage(ctx, F, ({ doc, name }, f) => {
    const mains = doc.all.filter((e) => e.tag === "main");
    if (mains.length !== 1) f(`expected exactly one <main id="main">, found ${mains.length} <main> elements`);
    else if (attr(mains[0], "id") !== "main") f('<main> must have id="main"');
    const budget = WORD_BUDGET[name];
    if (budget && mains.length) { const n = countWords(mains[0]); if (n > budget) f(`<main> has ${n} words, budget is ${budget}`); }
  }, (name) => name !== BARE_PAGE);
  return F;
}

// ---------------------------------------------------------------- rule 7: FAQ and required anchors
function* jsonObjects(v) {
  if (Array.isArray(v)) for (const x of v) yield* jsonObjects(x);
  else if (v && typeof v === "object") { yield v; for (const x of Object.values(v)) yield* jsonObjects(x); }
}
const typesOf = (o) => [].concat(o["@type"] ?? []);
function rule7(ctx) {
  const F = [];
  eachPage(ctx, F, ({ doc, name }, f) => {
    const ids = new Set(doc.all.map((e) => attr(e, "id")).filter((x) => x !== undefined));
    for (const id of REQUIRED_IDS[name] || []) if (!ids.has(id)) f(`missing element with id="${id}"`);
    if (name !== "contact.html") return;
    const main = doc.all.find((e) => e.tag === "main") || doc;
    const details = descendants(main).filter((e) => e.tag === "details");
    if (details.length !== FAQ.length) f(`expected exactly ${FAQ.length} <details> FAQ items in <main>, found ${details.length}`);
    const items = details.map((d) => {
      const s = d.children.find((c) => c.type === "el" && c.tag === "summary");
      return { q: s ? normQ(textOf(s)) : null, a: normQ(textOf(d, { blocks: true, skip: new Set(["script", "style", "template", "summary"]) })) };
    });
    FAQ.forEach((q, k) => {
      const it = items[k];
      if (!it) f(`FAQ item ${k + 1} is missing (expected "${q}")`);
      else if (it.q === null) f(`FAQ <details> ${k + 1} has no <summary>`);
      else if (it.q !== normQ(q)) f(`FAQ item ${k + 1} summary is "${it.q}", expected "${q}"`);
    });
    if (details[0] && !details[0].attrs.has("open")) f("the first FAQ <details> must have the open attribute");
    const objs = [];
    for (const s of ldScripts(doc)) { try { objs.push(...jsonObjects(JSON.parse(rawText(s)))); } catch (e) { f(`JSON-LD at line ${s.line} does not parse: ${e.message}`); } }
    const faqs = objs.filter((o) => typesOf(o).includes("FAQPage"));
    if (faqs.length !== 1) { f(`expected exactly one JSON-LD object of @type FAQPage, found ${faqs.length}`); return; }
    const qs = [].concat(faqs[0].mainEntity ?? []);
    if (qs.length !== items.length) f(`FAQPage has ${qs.length} Question(s) but the page has ${items.length} <details>`);
    qs.forEach((q, k) => {
      const it = items[k];
      if (!q || typeof q !== "object" || !typesOf(q).includes("Question")) { f(`FAQPage mainEntity[${k}] is not a Question object`); return; }
      const qn = normQ(q.name);
      if (!it || qn !== it.q) f(`FAQPage Question ${k + 1} name "${qn}" does not match <summary> "${it ? it.q : "(none)"}"`);
      const ans = [].concat(q.acceptedAnswer ?? [])[0];
      if (!ans || typeof ans !== "object" || !typesOf(ans).includes("Answer")) { f(`FAQPage Question ${k + 1} has no acceptedAnswer of @type Answer`); return; }
      const at = normQ(textOf(parseHTML(String(ans.text ?? "")), { blocks: true }));
      if (!it || at !== it.a) f(`FAQPage Question ${k + 1} acceptedAnswer.text differs from the visible answer: JSON-LD "${clip(at, 50)}" vs page "${clip(it ? it.a : "", 50)}"`);
    });
  }, (name) => name === "contact.html" || !!REQUIRED_IDS[name]);
  return F;
}

// ---------------------------------------------------------------- rule 8: links, footer contacts, header/footer identity
function rule8(ctx) {
  const F = [], idCache = new Map();
  const idsOf = (rel) => {
    if (!idCache.has(rel)) { const pg = ctx.page(rel); idCache.set(rel, pg ? new Set(pg.doc.all.map((e) => attr(e, "id")).filter((x) => x !== undefined)) : null); }
    return idCache.get(rel);
  };
  const chrome = (doc) => {
    const footers = doc.all.filter((e) => e.tag === "footer");
    return { headers: doc.all.filter((e) => e.tag === "header" && classes(e).includes("site-header")), footer: footers[footers.length - 1] || null };
  };
  eachPage(ctx, F, ({ doc, name }, f) => {
    const seen = new Map();
    for (const el of doc.all) {
      const id = attr(el, "id");
      if (id !== undefined) { if (seen.has(id)) f(`duplicate id="${id}" (lines ${seen.get(id)} and ${el.line})`); else seen.set(id, el.line); }
      const refs = el.attrList.filter(([a]) => a === "href" || a === "xlink:href" || (a === "src" && el.tag !== "img" && el.tag !== "source"));
      if (el.tag === "meta" && (attr(el, "http-equiv") || "").toLowerCase() === "refresh") { const m = /url\s*=\s*['"]?([^'"\s;]+)/i.exec(attr(el, "content") || ""); if (m) refs.push(["content", m[1]]); }
      for (const [a, v] of refs) {
        const r = resolveRef(name, v), where = `line ${el.line}: <${el.tag} ${a}="${v}">`;
        if (r.kind === "invalid") f(`${where} is not a valid URL`);
        if (r.kind !== "internal") continue;
        if (!ctx.exists(r.path)) f(`${where} points to missing file ${r.path}`);
        else if (r.fragment && /\.html?$/i.test(r.path) && !idsOf(r.path)?.has(r.fragment)) f(`${where}: ${r.path} has no element with id="${r.fragment}"`);
      }
      if (norm(attr(el, "target")).toLowerCase() === "_blank" && !tokens(el, "rel").includes("noopener")) f(`line ${el.line}: <${el.tag}> with target="_blank" lacks rel="noopener"`);
    }
    const { headers, footer } = chrome(doc);
    if (name !== BARE_PAGE && headers.length !== 1) f(`expected exactly one <header class="site-header">, found ${headers.length}`);
    if (name !== BARE_PAGE && !footer) f("missing site <footer>");
    if (footer) {
      const hrefs = descendants(footer).filter((e) => e.tag === "a").map((e) => (attr(e, "href") || "").trim());
      for (const pre of FOOTER_LINKS) if (!hrefs.some((h) => h.startsWith(pre))) f(`footer has no link with href starting "${pre}"`);
    }
  });
  // Identity: compare each page with the majority variant; contact.html is compared with its header CTA removed.
  const H = [], Hs = new Map(), Ft = [];
  const dropCta = (h) => {
    const drop = new Set([h, ...descendants(h)].filter((e) => e.attrs.has("data-cta")));
    for (const el of [...drop]) { // also drop wrappers left empty (e.g. an <li> around the CTA)
      for (let p = el.parent; p && p !== h; p = p.parent) {
        if (p.children.every((c) => (c.type === "el" && drop.has(c)) || (c.type === "text" && !norm(c.text)) || c.type === "comment")) drop.add(p); else break;
      }
    }
    return serialize(h, drop);
  };
  for (const name of ALL_PAGES) {
    const pg = ctx.page(name);
    if (!pg) continue;
    const { headers, footer } = chrome(pg.doc);
    if (headers.length === 1) { H.push([name, serialize(headers[0])]); Hs.set(name, dropCta(headers[0])); }
    if (footer) Ft.push([name, serialize(footer)]);
  }
  const majority = (entries) => { // the variant shared by most pages; ties go to the earliest page in site order
    const groups = new Map();
    for (const [n, v] of entries) groups.set(v, [...(groups.get(v) || []), n]);
    let best = null;
    for (const [value, names] of groups) if (!best || names.length > best.names.length) best = { name: names[0], names, value };
    return best;
  };
  const diff = (a, b) => { let k = 0; while (k < a.length && a[k] === b[k]) k++; return `first difference at char ${k}: expected "${a.slice(Math.max(0, k - 25), k + 45)}" but found "${b.slice(Math.max(0, k - 25), k + 45)}"`; };
  const refH = majority(H.filter(([n]) => n !== "contact.html")), refF = majority(Ft);
  for (const [name, s] of H) {
    if (!ctx.scope.includes(name) || !refH) continue;
    if (name === "contact.html") { if (Hs.get(name) !== Hs.get(refH.name)) F.push(fail(name, `site header differs from the one on ${refH.names.join(", ")} (header CTA ignored); ${diff(Hs.get(refH.name), Hs.get(name))}`)); }
    else if (s !== refH.value) F.push(fail(name, `site header differs from the one shared by ${refH.names.join(", ")}; ${diff(refH.value, s)}`));
  }
  for (const [name, s] of Ft) if (ctx.scope.includes(name) && s !== refF.value) F.push(fail(name, `footer differs from the one shared by ${refF.names.join(", ")}; ${diff(refF.value, s)}`));
  return F;
}

// ---------------------------------------------------------------- rule 9: images
function rule9(ctx) {
  const F = [];
  eachPage(ctx, F, ({ doc, name }, f) => {
    const file = (url, where) => {
      const r = resolveRef(name, url);
      if (r.kind === "invalid") f(`${where}: "${url}" is not a valid URL`);
      if (r.kind !== "internal") return;
      if (!ctx.exists(r.path)) f(`${where}: ${r.path} does not exist`);
      else if (ctx.size(r.path) > LIMITS.image) f(`${where}: ${r.path} is ${ctx.size(r.path)} bytes, max ${LIMITS.image}`);
    };
    const srcset = (el, where) => {
      if (!el.attrs.has("srcset")) return;
      const cands = parseSrcset(attr(el, "srcset"));
      if (!cands.length) f(`${where}: empty srcset`);
      for (const c of cands) { if (c.bad) f(`${where}: invalid srcset descriptor "${c.bad}"`); file(c.url, `${where} srcset`); }
    };
    for (const el of doc.all) {
      const where = `line ${el.line}: <${el.tag}>`;
      if (el.tag === "img") {
        if (!el.attrs.has("alt")) f(`${where} has no alt attribute`);
        else if (!norm(attr(el, "alt")) && !/^(presentation|none)$/i.test(norm(attr(el, "role"))) && norm(attr(el, "aria-hidden")).toLowerCase() !== "true") f(`${where} has empty alt without role="presentation" or aria-hidden="true"`);
        for (const a of ["width", "height"]) if (!/^\d+$/.test(norm(attr(el, a))) || +attr(el, a) <= 0) f(`${where} needs a positive integer ${a} attribute`);
        if (!norm(attr(el, "src"))) f(`${where} has no src`); else file(attr(el, "src"), `${where} src`);
        srcset(el, where);
      } else if (el.tag === "source") srcset(el, where);
    }
  });
  return F;
}

// ---------------------------------------------------------------- rule 10: robots.txt, sitemap.xml, llms.txt
function rule10(ctx) {
  const F = [];
  const robots = ctx.read("robots.txt");
  if (robots === null) F.push(fail("robots.txt", "file is missing"));
  else {
    if (!/^\s*sitemap\s*:\s*https:\/\/topofmind\.me\/sitemap\.xml\s*$/im.test(robots)) F.push(fail("robots.txt", "missing line \"Sitemap: https://topofmind.me/sitemap.xml\""));
    const groups = [];
    let g = null, lastUA = false;
    for (const ln of robots.split(/\r?\n/)) {
      const m = /^\s*([A-Za-z-]+)\s*:\s*(.*?)\s*$/.exec(ln.replace(/#.*/, ""));
      if (!m) continue;
      const key = m[1].toLowerCase();
      if (key === "user-agent") { if (!g || !lastUA) groups.push((g = { agents: [], rules: [] })); g.agents.push(m[2].toLowerCase()); lastUA = true; }
      else if (key !== "sitemap") { if (g) g.rules.push([key, m[2]]); lastUA = false; }
    }
    const star = groups.filter((x) => x.agents.includes("*")).flatMap((x) => x.rules);
    if (!groups.some((x) => x.agents.includes("*"))) F.push(fail("robots.txt", 'no "User-agent: *" group'));
    else {
      if (!star.some(([k, v]) => k === "allow" && v === "/")) F.push(fail("robots.txt", 'the "User-agent: *" group has no "Allow: /"'));
      if (star.some(([k, v]) => k === "disallow" && (v === "/" || v === "/*"))) F.push(fail("robots.txt", 'the "User-agent: *" group contains "Disallow: /"'));
    }
  }
  const sm = ctx.read("sitemap.xml");
  if (sm === null) F.push(fail("sitemap.xml", "file is missing"));
  else {
    const doc = parseHTML(sm), f = (r) => F.push(fail("sitemap.xml", r));
    for (const e of doc.all) {
      if (e.tag === "priority" || e.tag === "changefreq") f(`line ${e.line}: <${e.tag}> is not allowed`);
      if (e.tag === "lastmod") {
        const v = norm(textOf(e)), m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v), d = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
        if (!m || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) f(`line ${e.line}: <lastmod>${v}</lastmod> must be a real YYYY-MM-DD date`);
      }
    }
    if (ctx.fullSet(10)) {
      const locs = doc.all.filter((e) => e.tag === "loc").map((e) => norm(textOf(e))), want = CONTENT_PAGES.map(canonicalOf);
      const counts = new Map();
      for (const l of locs) counts.set(l, (counts.get(l) || 0) + 1);
      for (const [l, n] of counts) {
        if (n > 1) f(`<loc>${l}</loc> appears ${n} times`);
        const noindex = NOINDEX_PAGES.find((p) => canonicalOf(p) === l);
        if (noindex) f(`contains noindex page ${noindex} (${l})`);
        else if (!want.includes(l)) f(`unexpected <loc>${l}</loc> (not a canonical URL of an indexable page)`);
      }
      for (const w of want) if (!counts.has(w)) f(`missing <loc>${w}</loc>`);
    }
  }
  const llms = ctx.read("llms.txt");
  if (llms === null) F.push(fail("llms.txt", "file is missing"));
  else {
    if (llms.replace(/^\uFEFF/, "").split(/\r?\n/)[0].trimEnd() !== "# Top of Mind") F.push(fail("llms.txt", 'first line must be "# Top of Mind"'));
    const urls = new Set([...llms.matchAll(/https?:\/\/[^\s<>()[\]"'`]+/g)].map((m) => m[0].replace(/[.,;:!?]+$/, "")));
    for (const p of CONTENT_PAGES) if (!urls.has(canonicalOf(p))) F.push(fail("llms.txt", `no link to ${canonicalOf(p)}`));
  }
  return F;
}

// ---------------------------------------------------------------- rule 11: cookie consent wiring
function rule11(ctx) {
  const F = [];
  const js = ctx.read(JS);
  if (js === null) F.push(fail(JS, "file is missing"));
  else for (const s of ["1500", "cookie-consent", "role", "dialog", "aria-modal"]) if (!js.includes(s)) F.push(fail(JS, `does not contain "${s}"`));
  const css = ctx.css();
  if (!css) F.push(fail(CSS, "file is missing"));
  else {
    const decls = [];
    walkCss(css.items, (d) => decls.push(d));
    if (!decls.some((d) => d.prop === "backdrop-filter" && /^blur\s*\(/i.test(d.value))) F.push(fail(CSS, 'has no "backdrop-filter: blur(...)" declaration'));
    if (!decls.some((d) => d.prop === "-webkit-backdrop-filter")) F.push(fail(CSS, 'has no "-webkit-backdrop-filter" declaration'));
  }
  eachPage(ctx, F, ({ doc, name }, f) => {
    if (name === BARE_PAGE && !doc.all.some((e) => e.tag === "footer")) return;
    if (!doc.all.some((e) => e.tag === "button" && norm(textOf(e)) === "Cookie settings")) f('no <button> with the text "Cookie settings"');
  });
  return F;
}

// ---------------------------------------------------------------- rule 12: byte budgets and home first load
function rule12(ctx) {
  const F = [];
  eachPage(ctx, F, ({ name }, f) => { const n = ctx.size(name); if (n > LIMITS.page) f(`${n} bytes, max ${LIMITS.page}`); });
  for (const [file, max] of [[CSS, LIMITS.css], [JS, LIMITS.js]]) {
    const n = ctx.size(file);
    if (n < 0) F.push(fail(file, "file is missing")); else if (n > max) F.push(fail(file, `${n} bytes, max ${max}`));
  }
  const fonts = listFiles(ctx.root, "assets").filter((p) => FONT_EXT.test(p));
  if (fonts.length > LIMITS.fonts) F.push(fail("assets", `${fonts.length} font files (${lines(fonts)}), at most ${LIMITS.fonts}`));
  if (!ctx.scope.includes("index.html")) return F; // the first-load budget is a check of index.html
  const idx = ctx.page("index.html"), css = ctx.css();
  if (!idx || !css) { F.push(fail("index.html", "cannot compute the home first load (index.html or main.css missing)")); return F; }
  const fontPaths = new Set();
  for (const { url } of cssUrls(css)) {
    const r = resolveRef(CSS, url);
    if (r.kind !== "internal" || !FONT_EXT.test(r.path)) continue;
    if (ctx.exists(r.path)) fontPaths.add(r.path); else F.push(fail(CSS, `font ${r.path} is missing, first load cannot be computed`));
  }
  const fontBytes = [...fontPaths].reduce((s, p) => s + ctx.size(p), 0);
  const lcp = idx.doc.all.filter((e) => e.tag === "img" && norm(attr(e, "fetchpriority")).toLowerCase() === "high");
  let lcpPath = null, lcpBytes = 0;
  if (lcp.length !== 1) F.push(fail("index.html", `expected exactly one <img fetchpriority="high"> (the LCP image), found ${lcp.length}`));
  else {
    // With w descriptors: smallest candidate >= 1170w (390px x 3 DPR), else the largest. Sources of a
    // surrounding <picture> are evaluated the same way and the heaviest choice counts (worst case).
    const pick = (el, useSrc) => {
      const c = el.attrs.has("srcset") ? parseSrcset(attr(el, "srcset")) : [];
      if (!c.length) return useSrc ? attr(el, "src") : null;
      const ws = c.filter((x) => x.w).sort((a, b) => a.w - b.w);
      if (ws.length) return (ws.find((x) => x.w >= LIMITS.lcpWidth) || ws[ws.length - 1]).url;
      const xs = c.filter((x) => x.x).sort((a, b) => a.x - b.x);
      return xs.length ? (xs.find((x) => x.x >= 3) || xs[xs.length - 1]).url : attr(el, "src");
    };
    const img = lcp[0], pic = img.parent && img.parent.tag === "picture" ? img.parent : null;
    const urls = [pick(img, true), ...(pic ? pic.children.filter((c) => c.type === "el" && c.tag === "source").map((s) => pick(s, false)) : [])].filter(Boolean);
    for (const u of urls) {
      const r = resolveRef("index.html", u);
      if (r.kind !== "internal" || !ctx.exists(r.path)) { F.push(fail("index.html", `LCP image "${u}" is not an existing local file`)); continue; }
      if (ctx.size(r.path) >= lcpBytes) { lcpBytes = ctx.size(r.path); lcpPath = r.path; }
    }
  }
  const parts = [["index.html", ctx.size("index.html")], ["main.css", ctx.size(CSS)], ["main.js", Math.max(0, ctx.size(JS))], [`${fontPaths.size} font(s)`, fontBytes], [`LCP ${lcpPath || "none"}`, lcpBytes]];
  const total = parts.reduce((s, [, n]) => s + n, 0), detail = parts.map(([k, n]) => `${k} ${n}`).join(" + ");
  ctx.info.push(`home first load = ${total} bytes (${detail}); budget ${LIMITS.firstLoad}`);
  if (total > LIMITS.firstLoad) F.push(fail("index.html", `home first load is ${total} bytes, max ${LIMITS.firstLoad} (${detail})`));
  return F;
}

// ---------------------------------------------------------------- runner
const RULES = { 1: rule1, 2: rule2, 3: rule3, 4: rule4, 5: rule5, 6: rule6, 7: rule7, 8: rule8, 9: rule9, 10: rule10, 11: rule11, 12: rule12 };
function runChecks(root, { pages = null, rules = null } = {}) {
  const ctx = makeCtx(root, { pages, explicitRules: new Set(rules || []) });
  const list = rules ? [...new Set(rules)].sort((a, b) => a - b) : RULE_NUMBERS, ran = [];
  for (const n of list) {
    let failures;
    try { failures = RULES[n](ctx); } catch (e) { failures = [fail("tools/verify-site.mjs", `internal error while checking rule ${n}: ${e && e.stack ? e.stack : e}`)]; }
    ran.push(n);
    const uniq = [...new Map(failures.map((x) => [`${x.file}\u0000${x.reason}`, x])).values()];
    if (uniq.length) return { ok: false, failedRule: n, failures: uniq, ran, info: ctx.info, scope: ctx.scope };
  }
  return { ok: true, failedRule: 0, failures: [], ran, info: ctx.info, scope: ctx.scope };
}

// ---------------------------------------------------------------- rule 13: self-test
const PNG_1PX = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
const FX_ANSWERS = ["Yes, we walk you through real results on the call.", "A fixed monthly fee agreed before we start.", "Most clients see first leads within weeks.", "Yes, we size the plan to your budget.", "We change course, or you can stop at any time.", "Access to your accounts and one short call."];

function buildFixture(dir) {
  const wr = (rel, content) => { const p = join(dir, ...rel.split("/")); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); };
  const nav = [["services.html", "Services"], ["process.html", "Process"], ["how-you-sell.html", "How you sell"], ["team.html", "Team"], ["contact.html", "Contact"]];
  // 404.html uses root-relative URLs, like the real one (contract rev 2).
  const header = (page, r) => `<header class="site-header">
  <a class="brand" href="${r}index.html">Top of Mind</a>
  <nav aria-label="Main"><ul>${nav.map(([h, t]) => `<li><a href="${r}${h}"${h === page ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul></nav>
  ${page === "contact.html" ? "" : '<div class="site-header__cta"><a class="btn btn--primary" data-cta href="https://calendly.com/huianiuliann/30min" target="_blank" rel="noopener noreferrer">Book a call</a></div>'}
</header>`;
  const footer = (r) => `<footer class="site-footer">
  <p>\u00A9 2026 Top of Mind \u2013 growth marketing for service firms.</p>
  <ul>
    <li><a href="https://calendly.com/huianiuliann/30min" target="_blank" rel="noopener">Book a call</a></li>
    <li><a href="https://wa.me/40756883206" target="_blank" rel="noopener">WhatsApp</a></li>
    <li><a href="mailto:iulian@topofmind.me">iulian@topofmind.me</a></li>
    <li><a href="tel:+40756883206">+40 756 883 206</a></li>
    <li><a href="${r}privacy-policy.html">Privacy policy</a></li>
    <li><a href="${r}customer-policy.html">Customer policy</a></li>
    <li hidden><button type="button" class="link-button" data-consent-open>Cookie settings</button></li>
  </ul>
</footer>`;
  const services = ["paid-advertising", "websites", "social", "lead-generation", "tracking"];
  const pages = {
    "index.html": ["Growth marketing for service firms | Top of Mind", `<h1>Growth marketing for service firms</h1>
<img src="assets/img/hero-800.png" srcset="assets/img/hero-800.png 800w, assets/img/hero-1200.png 1200w" sizes="100vw" width="1200" height="600" alt="The team at work" fetchpriority="high">
<section id="how-you-sell"><h2>How you sell</h2><p>We adapt to <a href="how-you-sell.html#quote">quotes</a>, carts and calendars.</p></section>
<section><h2>What we do</h2><p>See our <a href="services.html#websites">website work</a>.</p><h3>Next step</h3><a class="btn" data-cta href="contact.html">Talk to us</a></section>`],
    "how-you-sell.html": ["How you sell shapes your marketing | Top of Mind", `<h1>How you sell</h1>
<section id="quote"><h2>Quote</h2><p>Leads ask for a quote.</p></section>
<section id="cart"><h2>Cart</h2><p>Buyers check out online.</p></section>
<section id="calendar"><h2>Calendar</h2><p>Clients book a slot.</p></section>`],
    "services.html": ["Services: ads, websites and tracking | Top of Mind", `<h1>Services</h1>\n${services.map((id) => `<section id="${id}"><h2>${id.replace("-", " ")}</h2><p>Details about ${id.replace("-", " ")}.</p></section>`).join("\n")}`],
    "process.html": ["Our process from audit to growth | Top of Mind", "<h1>Our process</h1>\n<h2>Audit</h2><p>We look at your numbers.</p>\n<h2>Build</h2><p>We build what is missing.</p>"],
    "team.html": ["The team behind Top of Mind marketing", '<h1>The team</h1>\n<img src="assets/img/team.png" width="1" height="1" alt="" role="presentation">\n<h2>Iulian</h2><p>Strategy and ads.</p>\n<h2>Sebastian</h2><p>Websites and tracking.</p>'],
    "contact.html": ["Contact Top of Mind and book a free call", `<h1>Contact</h1>\n<h2>Questions</h2>\n${FAQ.map((q, k) => `<details${k === 0 ? " open" : ""}><summary>${q}</summary><p>${FX_ANSWERS[k]}</p></details>`).join("\n")}`],
    "privacy-policy.html": ["Privacy policy for the Top of Mind website", "<h1>Privacy policy</h1>\n<h2>Data we collect</h2><p>Only what you send us.</p>"],
    "customer-policy.html": ["Customer policy and terms | Top of Mind", "<h1>Customer policy</h1>\n<h2>Payments</h2><p>Invoices are due in 14 days.</p>"],
    "404.html": ["Page not found | Top of Mind", '<h1>Page not found</h1>\n<p>This page does not exist. Go to the <a href="/index.html">home page</a>.</p>'],
  };
  for (const [name, [title, main]] of Object.entries(pages)) {
    const canon = canonicalOf(name), desc = `Fixture description for ${name}: a unique summary long enough to satisfy the 110 to 160 character rule of the site verifier.`;
    const is404 = name === "404.html", r = is404 ? "/" : "";
    let ld = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canon };
    if (name === "contact.html") ld = { "@context": "https://schema.org", "@graph": [ld, { "@type": "FAQPage", mainEntity: FAQ.map((q, k) => ({ "@type": "Question", name: q.replace("'", "\u2019"), acceptedAnswer: { "@type": "Answer", text: FX_ANSWERS[k] } })) }] };
    const seo = is404 ? '<meta name="robots" content="noindex, follow">' : `<meta name="description" content="${desc}">
<link rel="canonical" href="${canon}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Top of Mind">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:alt" content="Top of Mind logo">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">`;
    wr(name, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${seo}
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${r}apple-touch-icon.png">
<link rel="stylesheet" href="${r}assets/css/main.css">
<script src="${r}assets/js/main.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(name, r)}
<main id="main">
${main}
</main>
${footer(r)}
</body>
</html>
`);
  }
  wr("industries.html", `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=how-you-sell.html">
<link rel="canonical" href="https://topofmind.me/how-you-sell.html">
<title>Moved to How you sell | Top of Mind</title>
</head>
<body>
<p>This page has moved to <a href="how-you-sell.html">How you sell</a>.</p>
</body>
</html>
`);
  wr(CSS, `/* Fixture stylesheet for the verify-site self-test. */
@font-face { font-family: "Body"; src: url("../fonts/body.woff2") format("woff2"); font-display: swap; }
:root { --radius: 8px; --speed: 150ms; }
body { margin: 0; font-family: "Body", system-ui, sans-serif; }
.btn { border-radius: var(--radius); transition: color var(--speed) ease, background-color 0.2s ease; }
.card { border-radius: 0.5rem 4px / 2px; }
.nav a { box-shadow: none; }
.consent-overlay { position: fixed; inset: 0; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .consent-overlay { background: rgba(0, 0, 0, 0.6); } }
#cookie-consent, .consent__panel { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); border-radius: 8px; }
@media (min-width: 48em) { .site-header { display: flex; } }
@media screen and (min-width: 64em) { .grid { display: grid; } }
@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation: none !important; } }
`);
  wr(JS, `// Fixture script \u2014 shows #cookie-consent after 1500 ms as role="dialog" with aria-modal.
var TEXT = "We use cookies to measure visits \u2013 you choose.";
setTimeout(function () { var d = document.getElementById("cookie-consent"); if (d) { d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.textContent = TEXT; } }, 1500);
`);
  wr("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: https://topofmind.me/sitemap.xml\n");
  wr("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${CONTENT_PAGES.map((p) => `<url><loc>${canonicalOf(p)}</loc><lastmod>2026-09-28</lastmod></url>`).join("\n")}\n</urlset>\n`);
  const label = (p) => (p === "index.html" ? "Home" : p.replace(".html", "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()));
  wr("llms.txt", `# Top of Mind\n\n> Fixture site for the verifier self-test.\n\n${CONTENT_PAGES.map((p) => `- [${label(p)}](${canonicalOf(p)})`).join("\n")}\n`);
  wr("favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>\n');
  for (const f of ["apple-touch-icon.png", "assets/img/og.png", "assets/img/hero-800.png", "assets/img/hero-1200.png", "assets/img/team.png"]) wr(f, PNG_1PX);
  wr("assets/fonts/body.woff2", Buffer.alloc(64, 1));
  wr("tools/verify-site.mjs", readFileSync(SELF));
}

// Each case: [expected first failing rule (0 = must pass), label, mutate(dir), runOptions?]
function selfTestCases() {
  const P = (d, f) => join(d, ...f.split("/"));
  const rd = (d, f) => readFileSync(P(d, f), "utf8");
  const wr = (d, f, s) => { mkdirSync(dirname(P(d, f)), { recursive: true }); writeFileSync(P(d, f), s); };
  const sub = (d, f, a, b) => { const s = rd(d, f), k = s.indexOf(a); if (k === -1) throw new Error(`fixture mutation: ${JSON.stringify(a)} not found in ${f}`); wr(d, f, s.slice(0, k) + b + s.slice(k + a.length)); };
  const app = (d, f, s) => wr(d, f, rd(d, f) + s);
  const css = (s) => (d) => app(d, CSS, s + "\n");
  const chromePages = ALL_PAGES.filter((p) => p !== BARE_PAGE);
  const lastFaq = `<details><summary>${FAQ[5]}</summary><p>${FX_ANSWERS[5]}</p></details>`;
  return [
    [1, "required file missing (llms.txt)", (d) => rmSync(P(d, "llms.txt"))],
    [1, "deleted file still present (assets/js/gsap.min.js)", (d) => wr(d, "assets/js/gsap.min.js", "/* gsap */")],
    [1, "old font file present (inter-latin.woff2)", (d) => wr(d, "assets/fonts/inter-latin.woff2", "x")],
    [1, "reference to deleted world-dots.webp", (d) => sub(d, "index.html", '<link rel="stylesheet"', '<link rel="preload" as="image" href="assets/img/world-dots.webp">\n<link rel="stylesheet"')],
    [1, "reference to deleted assets/main.js", (d) => sub(d, "services.html", "assets/js/main.js", "assets/main.js")],
    [1, "font file not referenced by main.css", (d) => wr(d, "assets/fonts/extra.woff2", "x")],
    [1, "5 font files in assets/fonts", (d) => { for (const n of ["a", "b", "c", "e"]) { wr(d, `assets/fonts/${n}.woff2`, "x"); app(d, CSS, `@font-face { font-family: "${n}"; src: url("../fonts/${n}.woff2"); }\n`); } }],
    [1, "url() in main.css to a missing file", css('.x { background-image: url("../img/missing.png"); }')],
    [1, "style= attribute", (d) => sub(d, "process.html", "<h1>", '<h1 style="color: red">')],
    [1, "inline <script> without src", (d) => sub(d, "team.html", "</main>", "<script>console.log(1)</script></main>")],
    [1, "Tailwind utility class", (d) => sub(d, "services.html", "<h1>", '<h1 class="px-4">')],
    [1, 'id="root"', (d) => sub(d, "privacy-policy.html", "<body>", '<body id="root">')],
    [1, '"generated by" comment', (d) => sub(d, "customer-policy.html", "<head>", "<head>\n<!-- Generated by Framer -->")],
    [1, "meta generator", (d) => sub(d, "404.html", "<head>", '<head>\n<meta name="generator" content="Framer">')],
    [2, "duplicate H2", (d) => sub(d, "index.html", "<h3>Next step</h3>", "<h2>How you sell</h2>")],
    [2, "heading skip (h2 to h4)", (d) => sub(d, "process.html", "<h2>Build</h2>", "<h2>Build</h2><h4>Detail</h4>")],
    [2, "first heading is not the h1", (d) => sub(d, "team.html", "<h1>The team</h1>", "<h2>Intro</h2><h1>The team</h1>")],
    [2, "two h1", (d) => sub(d, "team.html", "<h2>Iulian</h2>", "<h1>Iulian</h1>")],
    [2, "title shorter than 30 characters", (d) => sub(d, "services.html", "<title>Services: ads, websites and tracking | Top of Mind</title>", "<title>Services</title>")],
    [2, "duplicate meta description", (d) => sub(d, "process.html", 'name="description" content="Fixture description for process.html', 'name="description" content="Fixture description for services.html')],
    [2, "description shorter than 110 characters", (d) => sub(d, "team.html", ": a unique summary long enough to satisfy the 110 to 160 character rule", "")],
    [2, "canonical mismatch", (d) => sub(d, "contact.html", 'rel="canonical" href="https://topofmind.me/contact.html"', 'rel="canonical" href="https://topofmind.me/contact"')],
    [2, "og:url differs from canonical", (d) => sub(d, "team.html", 'og:url" content="https://topofmind.me/team.html"', 'og:url" content="https://topofmind.me/"')],
    [2, "og:locale missing", (d) => sub(d, "services.html", '<meta property="og:locale" content="en_GB">', "")],
    [2, "JSON-LD does not parse", (d) => sub(d, "team.html", '<script type="application/ld+json">{', '<script type="application/ld+json">{,')],
    [2, "noindex page without robots noindex", (d) => sub(d, "404.html", '<meta name="robots" content="noindex, follow">', "")],
    [2, "content page marked noindex", (d) => sub(d, "process.html", "<title>", '<meta name="robots" content="noindex">\n<title>')],
    [2, 'html lang is not "en"', (d) => sub(d, "customer-policy.html", '<html lang="en">', '<html lang="ro">')],
    [3, "3 data-cta on a page", (d) => sub(d, "index.html", "</main>", '<a class="btn" data-cta href="contact.html">Again</a></main>')],
    [3, ".btn without data-cta", (d) => sub(d, "process.html", "</main>", '<a class="btn" href="contact.html">Go</a></main>')],
    [3, "data-cta in the contact.html header", (d) => sub(d, "contact.html", "</nav>", '</nav><a class="btn" data-cta href="https://calendly.com/huianiuliann/30min" target="_blank" rel="noopener">Book</a>')],
    [3, "2 data-cta on privacy-policy.html", (d) => sub(d, "privacy-policy.html", "</main>", '<a class="btn" data-cta href="contact.html">Ask</a></main>')],
    [4, "border-radius: 9999px", css(".pill { border-radius: 9999px; }")],
    [4, "border-radius: 50%", css(".avatar { border-radius: 50%; }")],
    [4, "border-radius: 1rem (16px)", css(".pill { border-radius: 1rem; }")],
    [4, "border-radius through var(--radius) = 999px", (d) => sub(d, CSS, "--radius: 8px", "--radius: 999px")],
    [4, "linear-gradient", css(".hero { background: linear-gradient(#000, #fff); }")],
    [4, "@keyframes", css("@keyframes pulse { to { opacity: 0.5; } }")],
    [4, "animation declaration", css(".x { animation: pulse 1s infinite; }")],
    [4, "max-width media query", css("@media (max-width: 600px) { .x { display: none; } }")],
    [4, "range media query (width < 600px)", css("@media (width < 600px) { .x { display: none; } }")],
    [4, "300ms transition", css(".x { transition: opacity 300ms ease; }")],
    [4, "0.25s transition-delay", css(".x { transition-delay: 0.25s; }")],
    [4, "transition speed through var() = 400ms", (d) => sub(d, CSS, "--speed: 150ms", "--speed: 400ms")],
    [4, "box-shadow outside consent rules", css(".card { box-shadow: 0 1px 2px #000; }")],
    [4, "box-shadow in a mixed selector list", css("#cookie-consent, .card { box-shadow: 0 1px 2px #000; }")],
    [4, "box-shadow in a nested non-consent rule", css(".card { &:hover { box-shadow: 0 1px 2px #000; } }")],
    [4, "backdrop-filter outside .consent-overlay", css(".site-header { backdrop-filter: blur(4px); }")],
    [4, "no prefers-reduced-motion block", (d) => sub(d, CSS, "@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation: none !important; } }", "")],
    [5, "em dash in visible text", (d) => sub(d, "process.html", "We look at your numbers.", "We look at your numbers \u2014 all of them.")],
    [5, "&mdash; entity in <title>", (d) => sub(d, "team.html", "<title>The team behind", "<title>The team &mdash; behind")],
    [5, "em dash in meta description", (d) => sub(d, "index.html", "Fixture description for index.html:", "Fixture description for index.html \u2014")],
    [5, "emoji in visible text", (d) => sub(d, "services.html", "<h1>Services</h1>", "<h1>Services \u{1F680}</h1>")],
    [5, "emoji as numeric entity in alt text", (d) => sub(d, "index.html", 'alt="The team at work"', 'alt="The team at work &#x1F680;"')],
    [5, "em dash in cookie banner text in main.js", (d) => sub(d, JS, "measure visits \u2013 you choose", "measure visits \\u2014 you choose")],
    [5, "emoji in CSS content", css('.x::before { content: "\\1F680"; }')],
    [6, "word budget exceeded (team.html > 300)", (d) => sub(d, "team.html", "</main>", `<p>${"word ".repeat(320)}</p></main>`)],
    [6, "404.html over 60 words", (d) => sub(d, "404.html", "</main>", `<p>${"lost ".repeat(60)}</p></main>`)],
    [6, 'main without id="main"', (d) => sub(d, "process.html", '<main id="main">', "<main>")],
    [7, "missing FAQ item", (d) => sub(d, "contact.html", lastFaq, "")],
    [7, "FAQ items out of order", (d) => { sub(d, "contact.html", lastFaq, ""); sub(d, "contact.html", "<details open>", `${lastFaq}\n<details open>`); }],
    [7, "first FAQ item not open", (d) => sub(d, "contact.html", "<details open>", "<details>")],
    [7, "FAQ JSON-LD answer differs from the page", (d) => sub(d, "contact.html", `<p>${FX_ANSWERS[1]}</p>`, "<p>A fixed fee.</p>")],
    [7, "missing id #cart on how-you-sell.html", (d) => sub(d, "how-you-sell.html", 'id="cart"', 'id="basket"')],
    [8, "broken internal anchor", (d) => sub(d, "index.html", "services.html#websites", "services.html#nope")],
    [8, "link to a missing page", (d) => sub(d, "process.html", "We build what is missing.", 'We build <a href="pricing.html">what is missing</a>.')],
    [8, "skip link without #main target", (d) => sub(d, "404.html", 'href="#main"', 'href="#content"')],
    [8, 'target="_blank" without noopener', (d) => sub(d, "team.html", "<p>Strategy and ads.</p>", '<p><a href="https://example.com/" target="_blank">Strategy</a> and ads.</p>')],
    [8, "footer lacks the WhatsApp link on every page", (d) => { for (const p of chromePages) sub(d, p, '<li><a href="https://wa.me/40756883206" target="_blank" rel="noopener">WhatsApp</a></li>', ""); }],
    [8, "header differs on one page", (d) => sub(d, "process.html", '<nav aria-label="Main">', '<nav aria-label="Primary">')],
    [8, "footer differs on one page", (d) => sub(d, "customer-policy.html", "growth marketing for service firms.", "growth marketing.")],
    [8, "duplicate id", (d) => { sub(d, "team.html", "<h2>Iulian</h2>", '<h2 id="bio">Iulian</h2>'); sub(d, "team.html", "<h2>Sebastian</h2>", '<h2 id="bio">Sebastian</h2>'); }],
    [9, "<img> without width", (d) => sub(d, "team.html", ' width="1" height="1" alt=""', ' height="1" alt=""')],
    [9, "<img> without alt", (d) => sub(d, "index.html", ' alt="The team at work"', "")],
    [9, "empty alt without role=presentation", (d) => sub(d, "team.html", ' role="presentation"', "")],
    [9, "image over 200 KB", (d) => wr(d, "assets/img/hero-800.png", Buffer.alloc(210000, 1))],
    [9, "srcset candidate missing", (d) => sub(d, "index.html", "hero-1200.png 1200w", "hero-1600.png 1600w")],
    [10, "sitemap containing a noindex page", (d) => sub(d, "sitemap.xml", "</urlset>", "<url><loc>https://topofmind.me/404.html</loc></url>\n</urlset>")],
    [10, "sitemap missing a page", (d) => sub(d, "sitemap.xml", "<url><loc>https://topofmind.me/team.html</loc><lastmod>2026-09-28</lastmod></url>", "")],
    [10, "lastmod not YYYY-MM-DD", (d) => sub(d, "sitemap.xml", "<lastmod>2026-09-28</lastmod>", "<lastmod>2026-09-28T10:00:00Z</lastmod>")],
    [10, "<priority> in sitemap", (d) => sub(d, "sitemap.xml", "</url>", "<priority>0.8</priority></url>")],
    [10, "robots.txt Disallow: /", (d) => sub(d, "robots.txt", "Allow: /", "Allow: /\nDisallow: /")],
    [10, "robots.txt without Sitemap line", (d) => sub(d, "robots.txt", "Sitemap: https://topofmind.me/sitemap.xml", "")],
    [10, "llms.txt missing a page link", (d) => sub(d, "llms.txt", "(https://topofmind.me/team.html)", "(https://topofmind.me/team)")],
    [10, "llms.txt first line", (d) => sub(d, "llms.txt", "# Top of Mind", "# TopOfMind")],
    [11, "main.js without 1500", (d) => wr(d, JS, rd(d, JS).replaceAll("1500", "2000"))],
    [11, "no Cookie settings button", (d) => { for (const p of chromePages) sub(d, p, ">Cookie settings<", ">Cookies<"); }],
    [11, "no -webkit-backdrop-filter declaration", (d) => sub(d, CSS, " -webkit-backdrop-filter: blur(6px);", "")],
    [12, "page over 50 KB", (d) => sub(d, "privacy-policy.html", "</body>", `<!-- ${"x".repeat(52000)} -->\n</body>`)],
    [12, "main.css over 20 KB", css(`/* ${"x".repeat(21000)} */`)],
    [12, "main.js over 12 KB", (d) => app(d, JS, `// ${"x".repeat(12500)}\n`)],
    [12, "home first load over 250 KB", (d) => { wr(d, "assets/img/hero-1200.png", Buffer.alloc(200000, 1)); wr(d, "assets/fonts/body.woff2", Buffer.alloc(60000, 1)); }],
    [12, "no fetchpriority=high LCP image", (d) => sub(d, "index.html", ' fetchpriority="high"', "")],
    [0, "--pages skips sitemap equality", (d) => sub(d, "sitemap.xml", "<url><loc>https://topofmind.me/team.html</loc><lastmod>2026-09-28</lastmod></url>", ""), { pages: ["services.html"] }],
    [10, "--pages with explicit --rules 10 keeps sitemap equality", (d) => sub(d, "sitemap.xml", "<url><loc>https://topofmind.me/team.html</loc><lastmod>2026-09-28</lastmod></url>", ""), { pages: ["services.html"], rules: [10] }],
    [0, "--pages ignores violations on other pages", (d) => sub(d, "team.html", "Strategy and ads.", "Strategy \u2014 ads."), { pages: ["services.html"] }],
    [2, "--pages still compares descriptions with all pages", (d) => sub(d, "process.html", 'name="description" content="Fixture description for process.html', 'name="description" content="Fixture description for services.html'), { pages: ["services.html"], rules: [2] }],
  ];
}

function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "verify-site-selftest-"));
  let bad = 0;
  const report = (ok, text) => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"}  ${text}`); };
  const cli = (args) => spawnSync(process.execPath, [SELF, ...args], { encoding: "utf8", timeout: 60000 });
  try {
    const fx = join(base, "fixture");
    buildFixture(fx);
    // Positive controls through the real CLI.
    let r = cli(["--root", fx]);
    report(r.status === 0 && /^SITE VERIFIED$/m.test(r.stdout) && !/RULE \d+ FAILED/.test(r.stdout), `positive control: full run on the valid fixture prints SITE VERIFIED (exit ${r.status})`);
    if (r.status !== 0) console.log(r.stdout + r.stderr);
    r = cli(["--root", fx, "--pages", "services.html,contact.html", "--rules", "2,3,7,8"]);
    report(r.status === 0 && /^CHECKS PASSED$/m.test(r.stdout) && !/SITE VERIFIED/.test(r.stdout), `positive control: filtered run prints CHECKS PASSED (exit ${r.status})`);
    const cases = selfTestCases();
    cases.forEach(([rule, label, mutate, opts], k) => {
      const dir = join(base, `case-${k + 1}`);
      cpSync(fx, dir, { recursive: true });
      try { mutate(dir); } catch (e) { report(false, `[rule ${rule}] ${label}: ${e.message}`); return; }
      const res = runChecks(dir, opts || {});
      const first = res.failures[0] ? `${res.failures[0].file}: ${res.failures[0].reason}` : "no failures";
      const ok = res.failedRule === rule && (rule === 0 || res.failures.length > 0);
      report(ok, `[rule ${String(rule || "-").padStart(2)}] ${label} -> ${rule ? `RULE ${res.failedRule} FAILED: ${clip(first, 90)}` : res.ok ? "passes" : `unexpected RULE ${res.failedRule} FAILED: ${clip(first, 90)}`}`);
      if (!ok && !rule) for (const x of res.failures.slice(0, 5)) console.log(`      ${x.file}: ${x.reason}`);
      if (!ok && rule) console.log(`      expected rule ${rule}, first failing rule was ${res.failedRule || "none"}`);
    });
    // Negative control through the real CLI: exit code and output format.
    const neg = join(base, "cli-negative");
    cpSync(fx, neg, { recursive: true });
    writeFileSync(join(neg, "assets", "css", "main.css"), readFileSync(join(neg, "assets", "css", "main.css"), "utf8") + ".pill { border-radius: 9999px; }\n");
    r = cli(["--root", neg]);
    report(r.status === 1 && /^RULE 4 FAILED: assets\/css\/main\.css: /m.test(r.stdout) && !/SITE VERIFIED|CHECKS PASSED/.test(r.stdout), `negative control: CLI exits 1 and prints "RULE 4 FAILED: assets/css/main.css: ..." (exit ${r.status})`);
    console.log(`${cases.length} violation cases, ${bad} unexpected result(s)`);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
  console.log(bad ? "SELF-TEST FAILED" : "SELF-TEST OK");
  return bad === 0;
}

// ---------------------------------------------------------------- CLI
function main(argv) {
  const usage = (msg) => { console.error(`verify-site: ${msg}\nusage: node tools/verify-site.mjs [--root <dir>] [--pages a.html,b.html] [--rules 1,2,3] [--self-test]`); process.exit(2); };
  let root = resolve(dirname(SELF), ".."), pages = null, rules = null, self = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], eq = a.indexOf("=");
    const key = eq > 0 ? a.slice(0, eq) : a;
    const val = () => { if (eq > 0) return a.slice(eq + 1); if (i + 1 >= argv.length) usage(`${a} needs a value`); return argv[++i]; };
    if (key === "--self-test") self = true;
    else if (key === "--root") root = resolve(val());
    else if (key === "--pages") pages = val().split(",").map((s) => s.trim().replace(/^\.?\//, "")).filter(Boolean);
    else if (key === "--rules") rules = val().split(",").map((s) => s.trim()).filter(Boolean).map(Number);
    else usage(`unknown argument ${a}`);
  }
  if (self) process.exit(selfTest() ? 0 : 1);
  if (pages && (!pages.length || pages.some((p) => !ALL_PAGES.includes(p)))) usage(`--pages must list pages of the site model: ${ALL_PAGES.join(", ")}`);
  if (rules && (!rules.length || rules.some((n) => !RULES[n]))) usage("--rules must list rule numbers between 1 and 12");
  try { if (!statSync(root).isDirectory()) usage(`root ${root} is not a directory`); } catch { usage(`root ${root} does not exist`); }
  const res = runChecks(root, { pages, rules });
  for (const line of res.info) console.log(`info: ${line}`);
  if (!res.ok) {
    for (const x of res.failures) console.log(`RULE ${res.failedRule} FAILED: ${x.file}: ${x.reason}`);
    console.log(`Stopped at rule ${res.failedRule} with ${res.failures.length} failure(s); rules checked: ${res.ran.join(",")}; root ${root}`);
    process.exit(1);
  }
  console.log(`Checked rules ${res.ran.join(",")} on ${res.scope.length} page(s) (${res.scope.join(", ")}) in ${root}: no failures`);
  console.log(pages || rules ? "CHECKS PASSED" : "SITE VERIFIED");
}

main(process.argv.slice(2));
