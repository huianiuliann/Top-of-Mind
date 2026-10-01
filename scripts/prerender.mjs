// After `vite build`, fills each dist/<page>.html (EN) and dist/ro/<page>.html (RO) empty #root with the
// server-rendered page, so the static HTML has full content (SEO, no-JS) and React hydrates it in the browser.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const { render, pageNames, langs } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);

for (const lang of langs) {
  for (const page of pageNames) {
    const rel = lang === "en" ? `${page}.html` : `${lang}/${page}.html`;
    const file = path.join(dist, rel);
    const html = fs.readFileSync(file, "utf8");
    const marker = '<div id="root"></div>';
    if (!html.includes(marker)) throw new Error(`${rel}: empty #root not found`);
    fs.writeFileSync(file, html.replace(marker, `<div id="root">${render(page, lang)}</div>`));
    console.log(`prerendered ${rel}`);
  }
}
fs.rmSync("dist-ssr", { recursive: true, force: true });
