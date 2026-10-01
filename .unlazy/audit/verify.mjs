// Oracles for the 2026-10-01 code audit report. Usage: node .unlazy/audit/verify.mjs <paths|coverage|dead|net|html>
import fs from "node:fs";
import path from "node:path";

const REPORT = ".claude/plans/audit-cod-2026-10-01.md";
const report = fs.readFileSync(REPORT, "utf8");
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const srcFiles = walk("src").map((f) => f.split(path.sep).join("/")).sort();
const fail = (msg) => {
  console.error("FAIL: " + msg);
  process.exit(1);
};
const findingLines = report.split("\n").filter((l) => /^\d+\. `(delete|stdlib|native|yagni|shrink):`/.test(l));

const checks = {
  // every [path] / [path:line] cited by a finding or efficiency note exists and the line is in range
  paths() {
    const refs = [...report.matchAll(/\[([^\]]+)\]/g)].flatMap((m) => m[1].split(", ")).filter((r) => /^[\w./-]+\.(jsx?|css|html|json|mjs)(:\d+)?$/.test(r));
    if (refs.length < 40) fail(`only ${refs.length} path refs parsed`);
    for (const ref of refs) {
      const [file, line] = ref.split(":");
      if (!fs.existsSync(file)) fail(`missing file ${file}`);
      if (line && Number(line) > fs.readFileSync(file, "utf8").split("\n").length) fail(`${ref} past end of file`);
    }
    console.log(`${refs.length} refs ok`);
  },
  // coverage section lists every file under src/ plus the build files
  coverage() {
    const section = report.slice(report.indexOf("## Acoperire"));
    const listed = new Set(section.split("\n")[2].split(", ").map((s) => s.trim()));
    const missing = [...srcFiles, "scripts/prerender.mjs", "vite.config.js", "package.json"].filter((f) => !listed.has(f));
    if (missing.length) fail(`not covered: ${missing.join(", ")}`);
    if (!report.includes(`(${srcFiles.length} fișiere`)) fail(`report file count != ${srcFiles.length}`);
    const lines = srcFiles.reduce((n, f) => n + fs.readFileSync(f, "utf8").split("\n").length - 1, 0);
    if (!report.includes(`${lines.toLocaleString("de-DE")} linii`)) fail(`report line count != ${lines}`);
    console.log(`${srcFiles.length} src files / ${lines} lines covered`);
  },
  // the three files reported dead are imported nowhere; positive control: a live file is found by the same scan
  dead() {
    const importers = (base) =>
      srcFiles.filter((f) => /\.jsx?$/.test(f) && new RegExp(`from "[^"]*/${base}"`).test(fs.readFileSync(f, "utf8")));
    if (importers("Hero").length === 0) fail("positive control: scan found no importer of Hero");
    for (const base of ["ResearchBoard", "ServicesMarquee"]) if (importers(base).length) fail(`${base} is imported`);
    const mb = importers("MacbookScroll");
    if (mb.length !== 1 || !mb[0].endsWith("ResearchBoard.jsx")) fail(`MacbookScroll importers: ${mb}`);
    const css = fs.readFileSync("src/index.css", "utf8");
    for (const fam of ["Bricolage", "WorkSans"]) {
      if (!css.includes(`font-family: ${fam}`)) fail(`positive control: @font-face ${fam} not found`);
      const users = [...srcFiles, "public/industries.html"].filter((f) => !f.endsWith("index.css") && fs.readFileSync(f, "utf8").includes(fam));
      if (users.length) fail(`${fam} used in ${users}`);
    }
    console.log("dead files and fonts confirmed");
  },
  // the net line in the report equals the sum of the per-finding estimates
  net() {
    if (findingLines.length !== 25) fail(`expected 25 findings, got ${findingLines.length}`);
    const sum = report
      .split(/\n(?=\d+\. `)/)
      .filter((b) => /^\d+\. `(delete|stdlib|native|yagni|shrink):`/.test(b))
      .reduce((n, b) => n + Number(b.match(/≈ -(\d+)/)[1]), 0);
    const net = Number(report.match(/^net: -(\d+) lines/m)?.[1]);
    if (sum !== net) fail(`sum ${sum} != net ${net}`);
    console.log(`net ${net} matches`);
  },
  // the six HTML pages share the same head apart from title/description/canonical/og:url/entry
  html() {
    const pages = ["index", "services", "process", "team", "contact", "how-you-sell"].map((p) => fs.readFileSync(`${p}.html`, "utf8").split("\n"));
    const varying = /<title>|name="description"|rel="canonical"|og:title|og:description|og:url|type="module"/;
    const base = pages[0];
    let shared = 0;
    for (let i = 0; i < base.length; i++) {
      if (varying.test(base[i])) continue;
      if (pages.some((p) => p[i] !== base[i])) fail(`line ${i + 1} differs outside the expected fields`);
      if (base[i].trim()) shared++;
    }
    if (shared !== 19) fail(`shared non-empty lines: ${shared}`);
    console.log("html heads share 19 lines");
  },
};

const mode = process.argv[2];
if (!checks[mode]) fail(`unknown mode ${mode}`);
checks[mode]();
console.log(`audit ${mode} verification passed`);
