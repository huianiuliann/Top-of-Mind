// Oracles for .unlazy/react/GATES.md. Usage: node .unlazy/react/verify.mjs <build|markup|head|css|source|links>
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "../..");
const REF = path.join(ROOT, ".unlazy/react/ref");
const DIST = path.join(ROOT, "dist");
const PAGES = { home: "index", services: "services", process: "process", team: "team", contact: "contact", "how-you-sell": "how-you-sell" };
const fail = (m) => { console.error("FAIL: " + m); process.exit(1); };
const read = (f) => fs.readFileSync(f, "utf8");
const rootOf = (html) => {
  const a = html.indexOf('<div id="root">') + 15;
  const b = html.lastIndexOf("</div>", html.indexOf("<script", a) === -1 ? html.indexOf("</body>", a) : html.indexOf("</body>", a));
  return html.slice(a, b);
};
const distHtml = (pg) => read(path.join(DIST, PAGES[pg] + ".html"));
const cmd = process.argv[2];

function selectors(css) {
  const out = new Set();
  for (const m of css.matchAll(/\.((?:\\.|[\w-])+)/g)) out.add(m[1].replace(/\\(.)/g, "$1"));
  return out;
}

if (cmd === "build") {
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  for (const f of [...Object.values(PAGES).map((p) => p + ".html"), "industries.html"])
    if (!fs.existsSync(path.join(DIST, f))) fail("missing dist/" + f);
  for (const pg of Object.keys(PAGES)) if (rootOf(distHtml(pg)).length < 5000) fail(pg + " #root is not prerendered");
  console.log("react build verification passed");
} else if (cmd === "markup") {
  // control: a known-different pair must be detected
  if (read(path.join(REF, "home.root.html")) === read(path.join(REF, "team.root.html"))) fail("control failed");
  for (const pg of Object.keys(PAGES)) {
    const want = read(path.join(REF, pg + ".root.html"));
    const got = rootOf(distHtml(pg));
    if (got !== want) {
      let i = 0; while (i < want.length && want[i] === got[i]) i++;
      fail(`${pg} differs at ${i}\n want: ${JSON.stringify(want.slice(i - 80, i + 80))}\n got:  ${JSON.stringify(got.slice(i - 80, i + 80))}`);
    }
  }
  console.log("react markup verification passed");
} else if (cmd === "head") {
  const tags = (html) => (html.match(/<head>([\s\S]*?)<\/head>/)[1].match(/<(title|meta|link)\b[^>]*>(?:[^<]*<\/title>)?|<script>[\s\S]*?<\/script>|<noscript>[\s\S]*?<\/noscript>/g) || [])
    .filter((t) => !/rel="stylesheet"|type="module"|rel="modulepreload"/.test(t))
    // Vite minifies the inline <noscript><style>; compare it as selector + sorted declarations
    .map((t) => t.startsWith("<noscript>") ? t.replace(/<style>([^{]*)\{([^}]*)\}<\/style>/, (_, s, d) => `<style>${s.replace(/["\\]/g, "")}{${d.split(";").sort().join(";")}}</style>`) : t);
  for (const pg of Object.keys(PAGES)) {
    const html = distHtml(pg);
    const got = tags(html);
    if (pg === "how-you-sell") {
      if (!got.some((t) => t === "<title>How you sell — Top of Mind</title>")) fail("how-you-sell title");
      if (!got.some((t) => t.includes('rel="canonical" href="https://topofmind.me/how-you-sell.html"'))) fail("how-you-sell canonical");
      if (got.length !== tags(read(path.join(REF, "team.head.html")).replace(/^/, "<head>") + "</head>").length) fail("how-you-sell tag count");
    } else {
      const want = tags(read(path.join(REF, pg + ".head.html")));
      if (JSON.stringify(got) !== JSON.stringify(want)) fail(pg + " head tags differ:\n" + want.filter((t) => !got.includes(t)).join("\n") + "\n--\n" + got.filter((t) => !want.includes(t)).join("\n"));
    }
    const css = html.match(/<link rel="stylesheet"[^>]*>/g) || [];
    const js = html.match(/<script type="module"[^>]*>/g) || [];
    if (css.length !== 1 || js.length !== 1) fail(`${pg}: ${css.length} stylesheets, ${js.length} module scripts`);
  }
  console.log("react head verification passed");
} else if (cmd === "css") {
  const cssFiles = fs.readdirSync(path.join(DIST, "assets")).filter((f) => f.endsWith(".css"));
  if (cssFiles.length !== 1) fail("expected one built css, got " + cssFiles.length);
  const built = read(path.join(DIST, "assets", cssFiles[0]));
  const orig = read(path.join(REF, "site.css"));
  const used = new Set();
  for (const pg of Object.keys(PAGES)) for (const m of rootOf(distHtml(pg)).matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach((c) => c && used.add(c));
  const have = selectors(built), had = selectors(orig);
  const missing = [...used].filter((c) => had.has(c) && !have.has(c));
  if (missing.length) fail("class selectors lost: " + missing.join(" "));
  // control: the checker must see a class that exists
  if (!have.has("bg-accent-500") || !have.has("em-serif")) fail("control selectors missing");
  for (const token of ["--color-ink-950:#131316", "--color-accent-500:#5b54f5", "--font-display:", "--animate-marquee:", "--animate-sweep-once:", ".theme-light{", ".theme-dark{", "@keyframes marquee{", "@keyframes sweep{", "font-family:Bricolage", "font-family:RedHatMono", "font-family:InstrumentSerif", "font-family:WorkSans", "scroll-padding-top:96px"])
    if (!built.replace(/\s+/g, "").includes(token.replace(/\s+/g, ""))) fail("missing token " + token);
  console.log(`react css verification passed (${used.size} classes checked)`);
} else if (cmd === "source") {
  const files = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name)); };
  walk(path.join(ROOT, "src"));
  let bad = [];
  for (const f of files.filter((f) => /\.(jsx?|css)$/.test(f))) {
    const s = read(f);
    for (const m of s.matchAll(/^(?:export\s+(?:default\s+)?)?(?:function|const|let|var)\s+([\w$]+)/gm))
      if (m[1].length <= 3 && m[1] !== "cn") bad.push(`${path.relative(ROOT, f)}: short name ${m[1]}`);
    if (/\(0,\s*[\w$]+\.[\w$]+\)/.test(s)) bad.push(`${path.relative(ROOT, f)}: (0, x.y) call`);
    if (/__toESM|__commonJS|\bvar\s/.test(s)) bad.push(`${path.relative(ROOT, f)}: bundler helper or var`);
  }
  for (const pg of Object.keys(PAGES)) if (!fs.existsSync(path.join(ROOT, "src/pages", pg))) bad.push("missing src/pages/" + pg);
  if (!fs.existsSync(path.join(ROOT, "src/components"))) bad.push("missing src/components");
  // control: the name check must catch a minified declaration
  if (![..."function Gg() {}".matchAll(/^(?:export\s+(?:default\s+)?)?(?:function|const|let|var)\s+([\w$]+)/gm)].some((m) => m[1].length <= 3)) bad.push("control failed");
  if (bad.length) fail(bad.join("\n"));
  console.log(`react source verification passed (${files.length} files)`);
} else if (cmd === "links") {
  const bad = [];
  for (const pg of Object.keys(PAGES)) {
    const html = distHtml(pg);
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
      const p = u.split(/[?#]/)[0].replace(/^\//, "");
      if (p === "favicon.svg" || p === "apple-touch-icon.png") continue; // absent on the current site too
      if (!fs.existsSync(path.join(DIST, p))) bad.push(`${pg}: ${u}`);
    }
    for (const m of html.matchAll(/srcSet="([^"]+)"|srcset="([^"]+)"/g)) for (const part of (m[1] || m[2]).split(",")) {
      const u = part.trim().split(/\s+/)[0].replace(/^\//, "");
      if (u && !/^https?:/.test(u) && !fs.existsSync(path.join(DIST, u))) bad.push(`${pg}: srcset ${u}`);
    }
  }
  if (!fs.existsSync(path.join(DIST, "how-you-sell.html"))) bad.push("how-you-sell.html missing");
  if (bad.length) fail("unresolved: " + [...new Set(bad)].join("\n"));
  console.log("react links verification passed");
} else fail("unknown command " + cmd);
