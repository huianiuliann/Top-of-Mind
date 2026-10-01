# Gates: port the prerendered site to an editable React + Vite source

OWNS: package.json, package-lock.json, vite.config.js, .gitignore, index.html, services.html, process.html, team.html, contact.html, how-you-sell.html, industries.html, public/**, src/**, scripts/**, assets/**, .claude/launch.json, .unlazy/react/**

Scope: the six pages (home, services, process, team, contact, how-you-sell) become readable React source (named components, split into layout/ui/page modules, Tailwind v4 source CSS) that `npm run dev` serves and `npm run build` prerenders to static HTML identical in markup to the current site.

- [x] G1: `npm run build` exits 0 and dist/ holds all six prerendered pages plus industries.html
  CHECK: node .unlazy/react/verify.mjs build
  EXPECT: react build verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=4801c7d8887c10ae333c69f55d969ea5f836d90a5ad6b2fea72020bdef4539a6; exit=0; EXPECT=matched; output-sha256=5663ed3120e5cde455a4b34f4f6a49d984d15b8cc4546dc37be4598c266f5e74; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G2: the prerendered #root of each of the five existing pages in dist/ is byte-identical to the current site's #root, and how-you-sell matches the render of its original bundle
  CHECK: node .unlazy/react/verify.mjs markup
  EXPECT: react markup verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=a7e8ac10f96d92fa81527a801edf905489e14c73be975efcda7d5de3fe0e2aba; exit=0; EXPECT=matched; output-sha256=b0528f75bd9dc46817df657da1d6627a2a603cfe623a3d14765f545d5af9affc; output-bytes=33; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G3: every page head in dist/ carries the same title, description, canonical, Open Graph, Twitter, icon and font-preload tags as the current page (how-you-sell gets its own), and loads one built stylesheet and one module script
  CHECK: node .unlazy/react/verify.mjs head
  EXPECT: react head verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=0ac026d190307eecea73db0ca4a7aa4ed5c6fe61686bd13e3ccdcdd5328c9938; exit=0; EXPECT=matched; output-sha256=57bd3c82c0f0842d2d1bc39dd8c408d81524e77613e6fcf0cacf7ffcc3e85b81; output-bytes=31; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G4: every class selector of the current site.css that the pages use also exists in the built CSS, and every custom theme token (colors, fonts, animations, theme-light/dark, keyframes, font-faces) is present
  CHECK: node .unlazy/react/verify.mjs css
  EXPECT: react css verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=e39fd6f9c99e65af6e22439dc8d8d903313bd8f68503aca5790950aa614ddc93; exit=0; EXPECT=matched; output-sha256=67a46247cc9966b54f7270585d411bd37bc25a616d421f0e8cac316062413a5d; output-bytes=52; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G5: the source is readable: no minified top-level names (<= 3 chars except cn), no `(0, x.y)` calls, no esbuild helpers, every page under src/pages/ and shared UI under src/components/
  CHECK: node .unlazy/react/verify.mjs source
  EXPECT: react source verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=51e70a9394aa748573402d19b50c131f98d72507049fd803120636eac1cebd33; exit=0; EXPECT=matched; output-sha256=512248fbba70af9e795cc97dd3ec0e37c0e1f4fd271c2538656a9c1a9788b597; output-bytes=44; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G6: every internal href/src in the six dist pages resolves to a file in dist/ (the nav link to how-you-sell.html no longer 404s)
  CHECK: node .unlazy/react/verify.mjs links
  EXPECT: react links verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=49d1663d8c3ffce9192e5460280e2fe29563977b725ca80c69809da42642bc6c; exit=0; EXPECT=matched; output-sha256=fb5c24c613fe556c3ac51cf6fc357b5dd896f129a98d6de88a14d07a5d1c5d77; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G7: in the browser (vite preview of dist), all six pages hydrate with no console error or hydration warning at 1280 and 375 px, the mobile menu opens and closes, the desktop nav shrinks on scroll, and scroll-reveal content becomes visible
  EVIDENCE: 2026-10-01, final build after local renames. Headless Chrome (puppeteer-core, system Chrome) against dist served locally, pages loaded with window.__TOM_DEBUG__=true so hydration errors log; positive control (text altered in prerendered root) logged React #418, the six real pages logged nothing except the favicon.svg 404 on index that the old site also has. Same script on the old site (git 86ad6b5) vs new, per page: elements hidden at load 70/75/31/8/14 equal, hidden after full scroll 7/1/1/1/1 equal, nav after scroll blur=true width=900 equal, text length equal, 375px menu open aria=true 8 links / closed aria=false equal, 375px overflow 0. how-you-sell (no old HTML): 22 hidden at load -> 3, nav/menu same. Computed styles of every #root element (25 properties, reduced motion) old vs new at 1280 and 375: 0 diffs on 5 pages; how-you-sell vs client render of its original bundle: 678/678 elements, only diff is a useId-generated mask id. Built-in browser pane was hidden (rAF paused), so it was used only for the hydration check.

- [x] G8: `npm run dev` serves the pages and an edit to a text string in src/ shows up without a rebuild (hot reload)
  EVIDENCE: 2026-10-01, dev server on 127.0.0.1:5175 (launch.json "dev"). All six pages render in headless Chrome with no console/page errors (8812/5104/4746/1874/1903/5049 chars). Appending " HMR-PROBE" to "Talk to us" in src/components/layout/Footer.jsx appeared on the open team page with window marker intact (no full reload); file restored, grep count 0.
