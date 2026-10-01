// Oracles for .unlazy/apply/GATES.md (applying the 2026-10-01 audit cuts without changing what the site renders).
// Usage: node .unlazy/apply/verify.mjs <snapshot|build|markup|head|dead|props|artifacts|lines>
//   snapshot  build the current source and store the per-page #root + src line count as the baseline (run once, before cutting)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "../..");
const BASE = path.join(ROOT, ".unlazy/apply/baseline");
const DIST = path.join(ROOT, "dist");
const PAGES = ["index", "services", "process", "team", "contact", "how-you-sell"];
const fail = (m) => {
  console.error("FAIL: " + m);
  process.exit(1);
};
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const srcFiles = () => walk(path.join(ROOT, "src")).map((f) => path.relative(ROOT, f).split(path.sep).join("/"));
const srcLines = () => srcFiles().reduce((n, f) => n + read(f).split("\n").length - 1, 0);
const rootOf = (html) => html.slice(html.indexOf('<div id="root">'), html.indexOf("</body>"));

// Semantically neutral normalisation: class token order and empty class attributes do not change rendering.
const normalize = (html) =>
  html
    .replace(/ class="([^"]*)"/g, (_, c) => {
      const t = c.split(/\s+/).filter(Boolean).sort();
      return t.length ? ` class="${t.join(" ")}"` : "";
    });

// Intended markup changes, each one documented in GATES.md. Applied to the new build only.
const INTENDED = [
  // TiltCard: hover depth moved from a JS effect (inline style set after hydration) to a CSS group-hover class
  [/ ?group-hover\/card:\[transform:translateZ\(\d+px\)\]/g, ""],
];

const checks = {
  snapshot() {
    execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
    fs.mkdirSync(BASE, { recursive: true });
    for (const p of PAGES) fs.writeFileSync(path.join(BASE, p + ".root.html"), rootOf(read(`dist/${p}.html`)));
    fs.writeFileSync(path.join(BASE, "baseline.json"), JSON.stringify({ srcLines: srcLines(), srcFiles: srcFiles().length, at: new Date().toISOString() }, null, 2));
    console.log(`baseline stored: ${srcLines()} src lines`);
  },
  build() {
    execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
    for (const p of [...PAGES, "industries"]) if (!fs.existsSync(path.join(DIST, p + ".html"))) fail(`missing dist/${p}.html`);
    for (const p of PAGES) if (rootOf(read(`dist/${p}.html`)).length < 5000) fail(`${p} #root not prerendered`);
  },
  markup() {
    // control: the comparison must notice a real difference
    if (normalize(fs.readFileSync(path.join(BASE, "index.root.html"), "utf8")) === normalize(fs.readFileSync(path.join(BASE, "team.root.html"), "utf8")))
      fail("control: index and team baselines compare equal");
    let intendedHits = 0;
    for (const p of PAGES) {
      const want = normalize(fs.readFileSync(path.join(BASE, p + ".root.html"), "utf8"));
      let got = rootOf(read(`dist/${p}.html`));
      for (const [re, to] of INTENDED) got = got.replace(re, (m) => (intendedHits++, to));
      got = normalize(got);
      if (got !== want) {
        let i = 0;
        while (i < want.length && want[i] === got[i]) i++;
        fail(`${p} differs at ${i}\n want: ${JSON.stringify(want.slice(i - 120, i + 120))}\n got:  ${JSON.stringify(got.slice(i - 120, i + 120))}`);
      }
    }
    console.log(`6 pages identical to baseline (${intendedHits} intended tilt-depth classes)`);
  },
  head() {
    for (const p of PAGES) {
      const head = read(`dist/${p}.html`).split("</head>")[0];
      for (const f of ["spacegrotesk-var", "inter-var"])
        if (!new RegExp(`<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/${f}\\.woff2"\\s*/?>`).test(head)) fail(`${p}: no preload link for ${f}`);
      if (/createElement\("link"\)/.test(head)) fail(`${p}: inline preload script still present`);
    }
    const cssFile = fs.readdirSync(path.join(DIST, "assets")).filter((f) => f.endsWith(".css"));
    const css = cssFile.map((f) => fs.readFileSync(path.join(DIST, "assets", f), "utf8")).join("");
    for (const gone of ["Bricolage", "WorkSans", "@keyframes marquee", "mask-fade-x"]) if (css.includes(gone)) fail(`built CSS still has ${gone}`);
    for (const kept of ["Inter", "Space Grotesk", "InstrumentSerif", "RedHatMono", "@keyframes sweep", "grid-lines", "em-serif"])
      if (!css.includes(kept)) fail(`built CSS lost ${kept}`);
    for (const f of ["inter-var", "spacegrotesk-var", "instrumentserif-400", "instrumentserif-400-italic", "redhatmono-400", "redhatmono-700"])
      if (!fs.existsSync(path.join(DIST, "assets/fonts", f + ".woff2"))) fail(`dist lost font ${f}`);
  },
  dead() {
    const gone = [
      "src/pages/home/ResearchBoard.jsx",
      "src/pages/home/MacbookScroll.jsx",
      "src/pages/home/ServicesMarquee.jsx",
      "public/assets/img/research-board.webp",
      ...["bricolage-400", "bricolage-700", "worksans-400", "worksans-700", "worksans-400-italic"].map((f) => `public/assets/fonts/${f}.woff2`),
    ];
    for (const f of gone) if (fs.existsSync(path.join(ROOT, f))) fail(`${f} still exists`);
    const all = srcFiles().map((f) => read(f)).join("\n");
    if (!all.includes("tailwind-merge")) fail("control: scan cannot see tailwind-merge import");
    for (const w of ["MacbookScroll", "ResearchBoard", "ServicesMarquee", "research-board", "clsx", "Bricolage", "WorkSans", "marquee"])
      if (all.includes(w)) fail(`src still mentions ${w}`);
    const pkg = JSON.parse(read("package.json"));
    if ("clsx" in { ...pkg.dependencies, ...pkg.devDependencies }) fail("clsx still a dependency");
    if (read("package-lock.json").includes('"node_modules/clsx"')) fail("clsx still in package-lock.json");
  },
  // dead props/parameters named by the audit are gone from the component sources
  props() {
    const banned = {
      "src/components/effects/AnimatedBeam.jsx": ["pathColor", "pathWidth", "gradientStartColor", "gradientStopColor", "startXOffset", "endXOffset", ", className)", "cn("],
      "src/components/effects/Reveal.jsx": ["amount =", "duration =", "fade-down", "fade-right", "flip-up", "cn("],
      "src/components/ui/SectionHeading.jsx": ["titleClassName", "Eyebrow({ children, className })"],
      "src/components/sections/PageHero.jsx": ['className = ""'],
      "src/components/ui/Button.jsx": ["IconArrowUpRight", '"up"'],
      "src/components/effects/TextHoverEffect.jsx": ["duration ??", "(className", "setCursor", 'r="25%"'],
      "src/pages/home/Hero.jsx": ["rectangleClassName", "pointerClassName"],
      "src/pages/home/HowWeWork.jsx": ["initialSliderPercentage", "autoplay = false", "firstLabel &&"],
      "src/pages/team/Founders.jsx": ["autoplay", "setInterval"],
      "src/components/effects/BuyerResearchPanel.jsx": ["active = true", "(phrases, active)"],
      "src/pages/how-you-sell/QuickCheck.jsx": ["HowYouSellQuickCheck({ className })"],
      "src/components/layout/Navbar.jsx": ["navRef", "onItemClick", "onClose", "cloneElement", "MobileNavHeader"],
      "src/pages/process/DayOnePreview.jsx": ["translate={translate}", "React.", "span:"],
      "src/pages/team/TeamPage.jsx": ["designation:", "pos:"],
      "src/pages/home/Team.jsx": ["createContext", "useMouseEnter", "rotateZ"],
      "src/pages/team/WorkSplit.jsx": ["iulianRef", "sebastianRef", '"Iulian Huian"', "r: nodeRef"],
      "src/pages/services/AlignedChannels.jsx": ["ConvergingPathsEffect", "trackingPathLength"],
      "src/pages/home/FinalCta.jsx": ["LampContainer"],
      "src/pages/how-you-sell/Modes.jsx": ["m: Mode", "Number("],
      "src/pages/process/ProcessPage.jsx": ["Number("],
      "src/pages/home/HowYouSell.jsx": ["buyingModeIcons", "buyingModeVisuals", "fee:"],
    };
    // control: the same scan must find a prop that does exist
    if (!read("src/components/effects/AnimatedBeam.jsx").includes("curvature")) fail("control: curvature not found");
    for (const [f, words] of Object.entries(banned)) {
      const s = read(f);
      for (const w of words) if (s.includes(w)) fail(`${f} still contains ${w}`);
    }
  },
  // decompiler leftovers are gone
  artifacts() {
    const bad = [];
    for (const f of srcFiles().filter((f) => /\.jsx?$/.test(f))) {
      const s = read(f);
      const tests = [
        [/\b1 \/ 0\b/, "1 / 0"],
        [/(?<![\w.-])\d+e\d+\b/, "exponent literal"],
        [/\\u\{?[0-9A-Fa-f]{4,5}\}?|\\x[0-9A-Fa-f]{2}/, "unicode escape"],
        [/\b(\w+): \1(?=,|\s*\})/, "non-shorthand property"],
        [/\[0\.16, 1, 0\.3, 1\]/, "literal easeOutExpo"],
      ];
      for (const [re, what] of tests) if (re.test(s) && !(what === "literal easeOutExpo" && f.endsWith("motion.js"))) bad.push(`${f}: ${what} (${s.match(re)[0]})`);
    }
    if (bad.length) fail(bad.join("\n"));
  },
  lines() {
    const before = JSON.parse(fs.readFileSync(path.join(BASE, "baseline.json"), "utf8")).srcLines;
    const now = srcLines();
    console.log(`src lines: ${before} -> ${now} (-${before - now})`);
    if (before - now < 1500) fail("less than 1500 lines cut");
  },
};

const mode = process.argv[2];
if (!checks[mode]) fail(`unknown mode ${mode}`);
checks[mode]();
console.log(`apply ${mode} verification passed`);
