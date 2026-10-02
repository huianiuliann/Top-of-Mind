// Median-of-N Lighthouse mobile runs (same engine and Slow 4G / Moto G Power profile as PageSpeed Insights)
// against an already running preview server: `npm run build`, then the "preview" entry of .claude/launch.json.
// Usage: node .unlazy/perf/lh.mjs [baseUrl=http://127.0.0.1:4173] [runs=3] [page ...]
// Reports are kept in a temp dir; the last line of output is the JSON summary.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base = "http://127.0.0.1:4173", runs = "3", ...rest] = process.argv.slice(2);
const pages = rest.length ? rest : ["/", "/ro", "/services.html", "/team.html"];
const dir = mkdtempSync(join(tmpdir(), "tom-lh-"));
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const metric = (r, id) => r.audits[id].numericValue;

const summary = {};
for (const page of pages) {
  const rows = [];
  for (let i = 0; i < Number(runs); i++) {
    const out = join(dir, `${page.replace(/\W+/g, "_")}-${i}.json`);
    execFileSync(
      "npx",
      ["--yes", "lighthouse@13", base + page, "--only-categories=performance", "--output=json", `--output-path=${out}`, "--quiet", '--chrome-flags="--headless=new"'],
      { stdio: "inherit", shell: true },
    );
    const r = JSON.parse(readFileSync(out, "utf8"));
    rows.push({
      score: Math.round(r.categories.performance.score * 100),
      fcp: metric(r, "first-contentful-paint"),
      lcp: metric(r, "largest-contentful-paint"),
      tbt: metric(r, "total-blocking-time"),
      cls: metric(r, "cumulative-layout-shift"),
      si: metric(r, "speed-index"),
      kb: metric(r, "total-byte-weight") / 1024,
    });
  }
  summary[page] = Object.fromEntries(Object.keys(rows[0]).map((k) => [k, +median(rows.map((x) => x[k])).toFixed(k === "cls" ? 3 : 0)]));
  console.log(page, JSON.stringify(summary[page]));
}
console.log(`reports: ${dir}`);
console.log(JSON.stringify(summary));
