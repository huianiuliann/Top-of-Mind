// Structural check of the design audit report: page sections present, every code reference resolves.
// A reference is `src/path.ext` optionally followed by → `snippet`; the file must exist and contain the snippet.
import { readFileSync, existsSync } from "node:fs";

const REPORT = ".claude/plans/audit-design-2026-10-01.md";
if (!existsSync(REPORT)) { console.error("report missing"); process.exit(1); }
const r = readFileSync(REPORT, "utf8");
const fails = [];
const required = ["Home", "Services", "Process", "How you sell", "Team", "Contact", "Transversal"];
const headings = [...r.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1]);
for (const name of required) if (!headings.some((h) => h.includes(name))) fails.push(`missing section heading: ${name}`);

const refs = [...r.matchAll(/`(src\/[^`\s]+\.(?:jsx|js|css))`(?:\s*→\s*`([^`]+)`)?/g)];
if (refs.length < 20) fails.push(`only ${refs.length} code references`);
let snippets = 0;
for (const [, file, snippet] of refs) {
  if (!existsSync(file)) { fails.push(`missing file ${file}`); continue; }
  if (snippet) {
    snippets++;
    if (!readFileSync(file, "utf8").includes(snippet)) fails.push(`${file}: snippet not found: ${snippet}`);
  }
}
if (snippets < 15) fails.push(`only ${snippets} snippet-anchored references`);
// every finding row in a table needs a severity marker
const findingRows = r.split("\n").filter((l) => /^\|\s*[A-Z]\d+\s*\|/.test(l));
if (findingRows.length < 10) fails.push(`only ${findingRows.length} numbered findings`);
for (const l of findingRows) if (!/(Critic|Mediu|Minor)/.test(l)) fails.push(`no severity: ${l.slice(0, 60)}`);

if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log(`${refs.length} refs (${snippets} anchored), ${findingRows.length} findings`);
console.log("report-ok");
