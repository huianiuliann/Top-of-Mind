// Verifies the trimmed homepage in the prerendered build (dist/index.html).
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../../dist/index.html", import.meta.url), "utf8");
const main = html.slice(html.indexOf('<main id="main"'), html.indexOf("</main>"));
const fail = (m) => { console.error("FAIL: " + m); process.exit(1); };
const mode = process.argv[2];
const has = (s) => main.includes(s);

if (mode === "order") {
  const markers = [
    "We research your market",
    "You&#x27;ve paid an agency before",
    "There&#x27;s no template industry",
    "Three steps.",
    "Four disciplines.",
    "Built to be <em",
    "No account managers.",
    "Tell us what <em",
  ];
  let last = -1;
  for (const m of markers) {
    const i = main.indexOf(m);
    if (i < 0) fail("missing " + m);
    if (i < last) fail("out of order " + m);
    last = i;
  }
  console.log("ORDER OK " + markers.length);
} else if (mode === "removed") {
  // Positive control: the detector must see a string that is known to be present.
  if (!has("Four disciplines.")) fail("control: detector cannot see present text");
  for (const gone of ["animate-marquee", "Isn&#x27;t ads", "caps lock", "h-[300vh]"]) {
    if (has(gone)) fail("still present " + gone);
  }
  console.log("REMOVED OK");
} else if (mode === "sections") {
  const n = (main.match(/<section[\s>]/g) || []).length;
  if (n !== 8) fail("expected 8 sections, got " + n);
  console.log("SECTIONS OK 8");
} else fail("unknown mode");
