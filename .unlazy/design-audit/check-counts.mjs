// Re-measures the token inventory and checks every count quoted in the report's "Inventar" table.
// Table rows look like: | `radius` | 19 | ... |   (key in backticks, number in 2nd column)
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const REPORT = ".claude/plans/audit-design-2026-10-01.md";
const j = JSON.parse(execFileSync(process.execPath, [".unlazy/design-audit/inventory.mjs", "--json"], { encoding: "utf8", maxBuffer: 1 << 26 }));
const measured = { files: j.files };
for (const [k, v] of Object.entries(j.out)) measured[k] = Object.keys(v).length;
measured["textSize-arbitrar"] = Object.keys(j.out.textSize).filter((k) => k.includes("[")).length;
measured["radius-arbitrar"] = Object.keys(j.out.radius).filter((k) => k.includes("[")).length;
measured["rounded-full"] = j.out.radius["rounded-full"]?.length ?? 0;

const report = readFileSync(REPORT, "utf8");
const inv = report.split(/^## /m).find((s) => s.startsWith("Inventar"));
if (!inv) { console.error("no '## Inventar' section"); process.exit(1); }
const rows = [...inv.matchAll(/^\|\s*`([\w-]+)`\s*\|\s*(\d+)\s*\|/gm)];
if (rows.length < 6) { console.error(`only ${rows.length} inventory rows`); process.exit(1); }
const bad = [];
for (const [, key, num] of rows) {
  if (!(key in measured)) bad.push(`${key}: unknown key`);
  else if (measured[key] !== Number(num)) bad.push(`${key}: report ${num}, measured ${measured[key]}`);
}
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log(`checked ${rows.length} rows`);
console.log("counts-ok");
