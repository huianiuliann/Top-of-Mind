// Source-level oracle for the design-coherence fixes (audit .claude/plans/audit-design-2026-10-01.md).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : /\.(jsx|js)$/.test(f) && files.push(p.replace(/\\/g, "/"));
  }
})("src");
const read = (f) => readFileSync(f, "utf8");
const fails = [];
const forbid = (label, re, filter = () => true) => {
  for (const f of files) {
    read(f).split(/\r?\n/).forEach((line, i) => {
      if (re.test(line) && filter(line, f)) fails.push(`${label}: ${f}:${i + 1}`);
    });
  }
};

// T4 card radius scale: no ad-hoc card radii left
forbid("T4 ad-hoc radius", /rounded-\[(1\.6rem|1\.2rem|1\.8rem|1\.4rem|2rem|30px|20px)\]|rounded-3xl/);
// T7 typography outliers
forbid("T7 ad-hoc text size", /text-\[(12\.5px|10\.5px|2\.6rem|2\.4rem|1\.9rem|2rem|1\.5rem)\]/);
// T13
forbid("T13 tracking-tight", /\btracking-tight\b/);
// T6 hover colour as token, not hex
forbid("T6 hex hover", /#6660f6/i);
// T3 section rhythm: every <section> uses the 64/96 scale
forbid("T3 section padding", /<section[^>]*\b(md:py-28|md:pb-28|md:py-20)\b/);
// T10 border levels: subtle 0.06, default 10, strong 15/20 (hover 25+ stays)
forbid("T10 off-scale border", /\bborder-white\/(\[0\.0[4578]\]|\[0\.1\]|12|5)(?![\d\]])/);
// T12 grey strokes
forbid("T12 hex greys", /"#666"|"#555"|"#777"|"#4a4a4a"/);
// T14 RO CTA label that wraps on mobile
forbid("T14 long RO CTA", /t\("Book a free 30-min(ute)? call", "Programează un apel gratuit de 30 de minute"\)/);
// M1 team page headings left-aligned
forbid("M1 centered heading", /align="center"/, (_l, f) => f.endsWith("team/TeamPage.jsx"));
// H1 home: Team section no longer a second consecutive light section
forbid("H1 home team light", /theme-light/, (_l, f) => f.endsWith("home/Team.jsx"));

const css = readFileSync("src/index.css", "utf8");
for (const tok of ["--radius-card: 20px", "--radius-card-inner: 12px", "--color-accent-450: #6660f6"])
  if (!css.includes(tok)) fails.push(`token missing: ${tok}`);

const button = read("src/components/ui/Button.jsx");
const primary = button.slice(button.indexOf("export function PrimaryButton"), button.indexOf("export function SecondaryButton"));
if (!/\bborder border-transparent\b/.test(primary)) fails.push("T5 primary button has no transparent border");

const hero = read("src/components/sections/PageHero.jsx");
if (/motion\.h1|initial=\{\{\s*opacity:\s*0,\s*y:\s*22/.test(hero)) fails.push("T1 PageHero h1 still animates from opacity 0");
if (!/lg:text-\[5\.2rem\]/.test(hero)) fails.push("T2 PageHero h1 not on the home size");

const finalCta = read("src/pages/home/FinalCta.jsx");
if (/md:text-7xl/.test(finalCta)) fails.push("T9 FinalCta heading still 7xl");

const quick = read("src/pages/how-you-sell/QuickCheck.jsx");
if (!/SerifEm/.test(quick)) fails.push("Y1 QuickCheck title has no serif accent");

if (!/\bpy-1\b/.test(read("src/pages/home/shared.jsx"))) fails.push("T15 ArrowTextLink has no vertical padding");

if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("design-fix-source-ok");
