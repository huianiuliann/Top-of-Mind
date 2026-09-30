// Oracle for .unlazy/redesign/GATES.md. Usage: node verify.mjs
// Pure Node, no dependencies. Checks the CSS system budget and class inventory,
// the KlientBoost-style structure of index.html and its exact mirror in ro/index.html.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const BUDGET = 24576;
const ORDER = ["hero", "preview", "how-we-work", "how-you-sell", "method", "people", "start"];
const QUESTIONS = ["How do your customers buy?", "Where is the money leaking today?", "Are we the right fit?"];
const INTRO = "The 30-minute call, where we put the research questions to you. It covers three questions, in this order.";
const NOOBLIG = "Free, no obligation and an honest answer, including when the answer is no.";

const errors = [];
const fail = (m) => errors.push(m);
const read = (f) => readFileSync(join(root, f), "utf8");
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
const visible = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const htmlFiles = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".html")).map((f) => (dir === "." ? f : dir + "/" + f));

// Class inventory: every class used in a page is defined; every defined class is used somewhere (pages or main.js).
function inventory(css, pages, js) {
  const out = [];
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/url\([^)]*\)/g, "");
  const defined = new Set([...bare.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]));
  const used = new Set();
  for (const html of Object.values(pages)) for (const m of html.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => used.add(c));
  for (const c of used) if (!defined.has(c)) out.push(`class "${c}" used in a page but not defined in main.css`);
  for (const c of defined) if (!used.has(c) && !js.includes(c)) out.push(`class "${c}" defined in main.css but used nowhere`);
  return { defined, problems: out };
}
// Controls: the detector must flag both directions on known fixtures.
if (!inventory(".a{}", { "x.html": '<p class="nope">' }, "").problems.length) fail("control: undefined-class detector misses");
if (!inventory(".zzz{}", { "x.html": '<p class="a">' }, "").problems.some((p) => p.includes("zzz"))) fail("control: dead-class detector misses");

const css = read("assets/css/main.css");
const size = Buffer.byteLength(css);
if (size > BUDGET) fail(`main.css is ${size} bytes, budget ${BUDGET}`);
const pages = Object.fromEntries([...htmlFiles("."), ...htmlFiles("ro")].map((f) => [f, read(f)]));
const inv = inventory(css, pages, read("assets/js/main.js"));
inv.problems.forEach(fail);

// Header comment "Class reference" lists exactly the page-facing classes (consent/js state classes are JS-generated).
const ref = (css.match(/Class reference[\s\S]*?\*\//) || [""])[0];
const listed = new Set([...ref.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]));
const pageFacing = [...inv.defined].filter((c) => !/^(consent|is-|js$)/.test(c));
for (const c of pageFacing) if (!listed.has(c)) fail(`main.css header comment lacks .${c}`);
for (const c of listed) if (!inv.defined.has(c)) fail(`main.css header comment lists .${c}, which is not defined`);

// Homepage structure, EN and its RO mirror.
const sections = (html) => [...html.matchAll(/<section\b([^>]*)>/g)].map((m) => (m[1].match(/(?:aria-labelledby|id)="([^"]+)"/) || [, "hero"])[1]);
function structure(f, html, questions, intro, nooblig) {
  const seq = sections(html);
  if (seq.join(",") !== ORDER.join(",")) fail(`${f}: section order is ${seq.join(",")}; expected ${ORDER.join(",")}`);
  if (!/<h1[^>]*>[^<]+<strong>[^<]+<\/strong>\s*<\/h1>/.test(html)) fail(`${f}: h1 lacks a trailing <strong> highlight`);
  if (!/<section class="section hero">/.test(html)) fail(`${f}: hero section class changed`);
  if (!/<section class="section section--cta"/.test(html)) fail(`${f}: no .section--cta closing section`);
  const eyebrows = (html.match(/<p class="eyebrow">/g) || []).length;
  if (eyebrows < 4) fail(`${f}: ${eyebrows} eyebrows, need at least 4`);
  if (!/<h2 id="preview">/.test(html)) fail(`${f}: no <h2 id="preview">`);
  if ((html.match(/class="list-numbered list-numbered--cols"/g) || []).length !== 2) fail(`${f}: need exactly 2 .list-numbered--cols lists`);
  if (!/<figure class="figure">\s*<img [^>]*fetchpriority="high"/.test(html)) fail(`${f}: hero figure lost fetchpriority="high"`);
  const hero = (html.match(/<section class="section hero">([\s\S]*?)<\/section>/) || [, ""])[1];
  if (!/<div class="actions">\s*<a class="btn" data-cta/.test(hero)) fail(`${f}: hero has no primary CTA button`);
  const text = visible(html);
  for (const q of questions) if (!text.includes(q)) fail(`${f}: preview lacks "${q}"`);
  if (!text.includes(intro)) fail(`${f}: preview intro sentence missing or altered`);
  if (!text.includes(nooblig)) fail(`${f}: "no obligation" sentence missing or altered`);
  if ((html.match(/research\.html"/g) || []).length < 2) fail(`${f}: fewer than 2 links to research.html`);
  return { eyebrows };
}
const en = structure("index.html", pages["index.html"], QUESTIONS, INTRO, NOOBLIG);

// RO wording comes from ro/research.html's free-preview column, verbatim.
const roResearch = pages["ro/research.html"] || "";
const roCol = (roResearch.match(/<div class="compare__col">([\s\S]*?)<\/div>/) || [, ""])[1];
const roQuestions = [...(roCol.match(/<ul class="list-dash">([\s\S]*?)<\/ul>/) || [, ""])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => visible(m[1]));
const roIntro = visible((roCol.match(/<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>/) || [, ""])[1]);
const roNooblig = visible((roCol.match(/<p class="small muted">([\s\S]*?)<\/p>/) || [, ""])[1]);
if (roQuestions.length !== 3 || !roIntro || !roNooblig) fail("ro/research.html: could not extract the three preview questions, intro and no-obligation sentence");
else {
  const ro = structure("ro/index.html", pages["ro/index.html"] || "", roQuestions, roIntro, roNooblig);
  if (ro.eyebrows !== en.eyebrows) fail(`ro/index.html has ${ro.eyebrows} eyebrows, index.html has ${en.eyebrows}`);
}

if (errors.length) {
  for (const e of errors) console.log("FAIL: " + e);
  process.exit(1);
}
console.log(`main.css ${size} bytes of ${BUDGET}; ${inv.defined.size} classes, all used and listed`);
console.log("redesign verification passed");
