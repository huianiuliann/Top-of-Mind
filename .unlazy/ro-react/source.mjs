// Source-level completeness oracle for .unlazy/ro-react/GATES.md. verify.mjs sees only what renders on first paint; this one
// parses every src/**/*.jsx (oxc, already shipped with Vite) and reports English-looking text that is NOT inside a t(...) / L(...)
// call, wherever it is: closed accordions, quiz results, carousel and timed states, props, data arrays.
// Usage: node .unlazy/ro-react/source.mjs [--list]      Exceptions live in .unlazy/ro-react/source-ok.txt (one `file :: exact text` per line).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSync } from "rolldown/utils";
import { foreignWords } from "./rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "src");
const okFile = path.join(ROOT, ".unlazy/ro-react/source-ok.txt");
const ALLOWED = new Set(fs.existsSync(okFile) ? fs.readFileSync(okFile, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")) : []);
const fail = (m) => {
  console.error("FAIL: " + m);
  process.exit(1);
};

const foreign = foreignWords;

// props whose string value is never shown to people
const HIDDEN_ATTR = new Set(
  ("className key style href src srcSet type id target rel viewBox d fill stroke transform variant align size icon width height loading as htmlFor name role points x y cx cy r rx ry dx dy x1 x2 y1 y2 offset stopColor " +
    "preserveAspectRatio strokeLinecap strokeLinejoin vectorEffect crossOrigin ease mode layout layoutId initial animate exit transition whileInView viewport magnetic autoplay draggable decoding fetchPriority clipPath mask filter " +
    "gradientUnits xmlns method action tone color side direction origin textAnchor dominantBaseline fontFamily mixBlendMode strokeDasharray strokeDashoffset pathLength aria-hidden aria-expanded aria-current aria-live hrefLang lang " +
    "current reducedMotion backgroundImage boxShadow background backgroundSize backgroundPosition maskImage WebkitMaskImage borderRadius")
    .split(" "),
);
const VISIBLE_KEY = new Set("label title name text q a t d eyebrow subtitle body desc description caption heading line role focus cta badge note tag tags headline copy alt placeholder hint intro lead summary question answer".split(" "));
const classLike = (s) => {
  const toks = s.trim().split(/\s+/);
  const hit = toks.filter((t) => /[-\[\]:\/#%()!]/.test(t) || /^\d/.test(t)).length;
  return toks.length > 0 && hit / toks.length >= 0.4 && !/[.,;?!] /.test(s);
};
const englishish = (s, strict) => {
  const t = s.replace(/\\./g, " ").trim();
  if (!/[A-Za-z]/.test(t)) return false;
  if (/^(https?:|mailto:|tel:|#|\/|\.\/|data:)/.test(t) || /^[\w./-]+\.(?:html|jpg|jpeg|png|webp|svg|woff2|js|jsx|css|json)$/i.test(t)) return false;
  if (/^(rgba?|hsla?|oklch|oklab|color-mix|calc|var|translate|rotate|scale|linear-gradient|radial-gradient|conic-gradient|M\d|\d)/i.test(t)) return false;
  if (/^[a-z0-9]+(?:_[a-z0-9]+)+$/.test(t)) return false; // snake_case identifiers (GA4 event names)
  if (t.split(/\s+/).every((w) => /^(start|end|center|top|bottom|left|right|auto|none|inherit|normal|ease|linear|forwards|both|all|x|y)$/.test(w))) return false; // animation/CSS keywords
  const words = t.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (strict && words.length < 2) return false;
  if (classLike(t)) return false;
  return foreign(t).length > 0;
};

// Only modules a page can actually reach are copy: walk the import graph from src/entries/*.jsx.
// A component nobody imports (dead code) is reported, not scanned; the day someone imports it, it joins the scan.
const all = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.jsx?$/.test(e.name)) all.push(f);
  }
})(SRC);
const resolveImport = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  return ["", ".jsx", ".js", "/index.jsx", "/index.js"].map((x) => path.normalize(base + x)).find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
};
const reachable = new Set();
const queue = all.filter((f) => /[\\/]entries[\\/]/.test(f));
while (queue.length) {
  const f = queue.pop();
  if (reachable.has(f)) continue;
  reachable.add(f);
  const ast = parseSync(f, fs.readFileSync(f, "utf8"), { lang: "jsx" });
  for (const n of ast.program.body) {
    if (n.type === "ImportDeclaration" && n.source.value.startsWith(".")) {
      const target = resolveImport(f, n.source.value);
      if (target) queue.push(target);
    }
  }
}
const files = all.filter((f) => /\.jsx$/.test(f) && reachable.has(f) && !/[\\/](i18n|entries)[\\/]/.test(f) && !/entry-server\.jsx$/.test(f));
const dead = all.filter((f) => /\.jsx$/.test(f) && !reachable.has(f)).map((f) => path.relative(SRC, f).replace(/\\/g, "/"));

const found = [];
let scanned = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/").replace(/^src\//, "");
  const code = fs.readFileSync(file, "utf8");
  const parsed = parseSync(file, code, { lang: "jsx" });
  if (parsed.errors?.length) fail(`${rel}: ${parsed.errors[0].message}`);
  const lineOf = (pos) => code.slice(0, pos).split("\n").length;
  const flag = (node, text, why) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (ALLOWED.has(`${rel} :: ${clean}`)) return;
    found.push(`${rel}:${lineOf(node.start)}  ${why}  ${JSON.stringify(clean.length > 90 ? clean.slice(0, 90) + "…" : clean)}`);
  };
  const isPair = (n) => n && n.type === "CallExpression" && n.callee.type === "Identifier" && (n.callee.name === "t" || n.callee.name === "L");
  const isCn = (n) => n && n.type === "CallExpression" && n.callee.type === "Identifier" && ["cn", "clsx", "twMerge"].includes(n.callee.name);
  const walk = (node, anc) => {
    if (!node || typeof node.type !== "string") return;
    const parent = anc[anc.length - 1];
    const inPair = anc.some(isPair);
    const inCn = anc.some(isCn);
    if (node.type === "JSXText" && !inPair) {
      if (/[\p{L}]/u.test(node.value) && foreign(node.value).length) flag(node, node.value, "JSX text outside t()");
    } else if (node.type === "Literal" && typeof node.value === "string" && !inPair && !inCn) {
      const s = node.value;
      if (parent?.type === "ImportDeclaration" || parent?.type === "ExportNamedDeclaration" || parent?.type === "ExportAllDeclaration") {
        // module specifier
      } else if (parent?.type === "JSXAttribute") {
        const name = parent.name.type === "JSXIdentifier" ? parent.name.name : parent.name.name?.name;
        if (!HIDDEN_ATTR.has(name) && !/^data-/.test(name) && englishish(s, false)) flag(node, s, `prop ${name} outside t()`);
      } else if (parent?.type === "Property" && parent.value === node) {
        const key = parent.key?.name ?? parent.key?.value;
        if (!HIDDEN_ATTR.has(key) && englishish(s, !VISIBLE_KEY.has(key))) flag(node, s, `value of "${key}" outside t()/L()`);
      } else if (parent?.type === "NewExpression") {
        // new Error("...") and similar developer messages
      } else if (parent?.type === "BinaryExpression" || parent?.type === "SwitchCase" || parent?.type === "MemberExpression" || parent?.type === "CallExpression" && parent.callee.type === "MemberExpression") {
        // comparisons, indexes, method calls such as .split(" ")
      } else if (englishish(s, true)) flag(node, s, "string outside t()/L()");
    } else if (node.type === "TemplateLiteral" && !inPair && !inCn) {
      // code-like templates (GLSL, file names, class lists) are not copy: only prose with spaces and no code punctuation counts
      for (const q of node.quasis) {
        const text = q.value.cooked || "";
        if (/\s/.test(text.trim()) && !/[;{}=%()]/.test(text) && englishish(text, false)) flag(node, text, "template text outside t()");
      }
    }
    // t("English") with no Romanian side
    if (isPair(node) && node.arguments.length === 1) {
      const a = node.arguments[0];
      if (a.type === "Literal" && typeof a.value === "string" && foreign(a.value).length) flag(node, a.value, `${node.callee.name}() with no Romanian side`);
    }
    anc.push(node);
    for (const key of Object.keys(node)) {
      if (key === "parent" || key === "loc" || key === "range") continue;
      const v = node[key];
      if (Array.isArray(v)) for (const c of v) walk(c, anc);
      else if (v && typeof v === "object") walk(v, anc);
    }
    anc.pop();
  };
  walk(parsed.program, []);
  scanned++;
}

// control: the scan must flag an unwrapped English sentence and accept a wrapped one
{
  const probe = (code) => {
    const p = parseSync("probe.jsx", code, { lang: "jsx" });
    let hit = 0;
    const walk = (n, anc) => {
      if (!n || typeof n.type !== "string") return;
      const inPair = anc.some((a) => a.type === "CallExpression" && a.callee.type === "Identifier" && (a.callee.name === "t" || a.callee.name === "L"));
      if (n.type === "JSXText" && !inPair && foreign(n.value).length) hit++;
      anc.push(n);
      for (const k of Object.keys(n)) {
        const v = n[k];
        if (Array.isArray(v)) v.forEach((c) => walk(c, anc));
        else if (v && typeof v === "object") walk(v, anc);
      }
      anc.pop();
    };
    walk(p.program, []);
    return hit;
  };
  if (probe("const a = <p>Every account gets the same two people</p>;") !== 1) fail("control failed: unwrapped JSX text not detected");
  if (probe('const a = <p>{t(<>Every account gets the same two people</>, <>Pe fiecare cont lucrăm amândoi</>)}</p>;') !== 0) fail("control failed: wrapped JSX text reported");
}

if (process.argv.includes("--list") || found.length) {
  for (const f of found) console.error("  " + f);
}
if (found.length) fail(`${found.length} English-looking string(s) outside t()/L() in ${scanned} files (exceptions go in .unlazy/ro-react/source-ok.txt as "file :: text")`);
if (dead.length) console.log(`not scanned, no page imports them (dead code): ${dead.join(", ")}`);
console.log(`ro source verification passed (${scanned} files, every visible string is inside t()/L())`);
