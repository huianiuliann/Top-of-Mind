// Design-token inventory over src/**/*.jsx: counts each class family and where it occurs.
// Usage: node .unlazy/design-audit/inventory.mjs [--json]  (run from repo root)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    // dead files (no page imports them; being deleted by the code-cut session) are excluded so counts stay stable
    else if (/\.(jsx|js)$/.test(f) && !/^(MacbookScroll|ResearchBoard|ServicesMarquee|entry-server)\./.test(f)) files.push(p);
  }
})("src");

const families = {
  radius: /\brounded(?:-[a-z0-9]+)?(?:-\[[^\]]+\])?(?=[\s"'`]|$)/g,
  textSize: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl|\[[0-9.]+(?:px|rem|em)\])/g,
  fontFamily: /\bfont-(?:display|sans|mono|serif)\b|\bem-serif\b/g,
  fontWeight: /\bfont-(?:light|normal|medium|semibold|bold|extrabold|black)\b/g,
  tracking: /\btracking-(?:tight|tighter|wide|wider|widest|normal|\[[^\]]+\])/g,
  hexColor: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g,
  accent: /\b(?:bg|text|border|ring|from|via|to)-(?:accent|indigo|violet|purple|emerald|blue)-\d{2,3}(?:\/[\d.[\]]+)?/g,
  sectionPadY: /\bpy-(?:\d+|\[[^\]]+\])\b(?=[^"]*\b(?:section|border-t)\b)|(?<=<section[^>]*className="[^"]*)\bpy-\S+/g,
  border: /\bborder-(?:white|black|neutral|ink)[^\s"']*/g,
  shadow: /\bshadow-(?:\[[^\]]+\]|sm|md|lg|xl|2xl)/g,
};

const out = {};
for (const [fam] of Object.entries(families)) out[fam] = {};
const sections = [];
for (const f of files) {
  const rel = relative(".", f).replace(/\\/g, "/");
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const [fam, re] of Object.entries(families)) {
      for (const m of line.matchAll(re)) {
        const k = m[0];
        (out[fam][k] ??= []).push(`${rel}:${i + 1}`);
      }
    }
    if (/<section\b/.test(line)) {
      const cls = (line.match(/className="([^"]*)"/) || lines[i + 1]?.match(/className="([^"]*)"/) || [])[1] || "";
      const py = cls.match(/\bpy-\S+|\bpt-\S+|\bpb-\S+/g) || [];
      const md = cls.match(/\bmd:py-\S+|\blg:py-\S+/g) || [];
      sections.push({ at: `${rel}:${i + 1}`, py: py.join(" "), theme: /theme-light/.test(cls) ? "light" : "dark" });
    }
  });
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ files: files.length, out, sections }, null, 1));
} else {
  console.log(`files ${files.length}`);
  for (const [fam, m] of Object.entries(out)) {
    const entries = Object.entries(m).sort((a, b) => b[1].length - a[1].length);
    console.log(`\n## ${fam} (${entries.length} distinct)`);
    for (const [k, locs] of entries) console.log(`${String(locs.length).padStart(4)}  ${k}  ${locs.length <= 3 ? locs.join(", ") : ""}`);
  }
  console.log(`\n## sections (${sections.length})`);
  for (const s of sections) console.log(`${s.theme.padEnd(5)} ${s.py.padEnd(28)} ${s.at}`);
  console.log("\ninventory-ok");
}
