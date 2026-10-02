// After `npm run build`: every prerendered page (EN + RO) ships its <h1> visible (no inline opacity:0).
import { readFileSync, existsSync } from "node:fs";

const pages = ["index", "services", "process", "how-you-sell", "team", "contact"];
const fails = [];
let checked = 0;
for (const dir of ["dist", "dist/ro"]) {
  for (const p of pages) {
    const f = `${dir}/${p}.html`;
    if (!existsSync(f)) { fails.push(`missing ${f}`); continue; }
    const h1 = readFileSync(f, "utf8").match(/<h1\b[^>]*>/);
    if (!h1) { fails.push(`${f}: no <h1>`); continue; }
    checked++;
    if (/opacity:\s*0/.test(h1[0])) fails.push(`${f}: h1 prerendered invisible`);
  }
}
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log(`checked ${checked} pages`);
console.log("dist-h1-visible-ok");
