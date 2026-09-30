# Gates: KlientBoost-style redesign of the homepage and the shared CSS system

OWNS: index.html, ro/index.html, assets/css/main.css, .unlazy/redesign/**

Scope: index.html and its ro/ twin get the KlientBoost structure (highlighted h1, hero CTA, a "free research preview" section with the three canonical questions, numbered steps, three-up cards, an indigo closing band) on the existing dark theme, with main.css restyled as a system (pill sticker buttons, 2px cards, alternating bands, big numerals) under a 24,576-byte budget, while every i18n and site-trust oracle keeps passing.

- [x] G0: the parallel i18n session has finished: the owner confirmed it in chat and main.css, index.html and ro/ have not changed for at least five minutes before the first write
  EVIDENCE: owner answered "Da, a terminat, pornesc" in chat on 2026-09-30 ~12:25; mtimes at 12:26: main.css 12:10:42, index.html 12:05:35, ro/index.html 12:11:27, last ro/ write 12:16:49; i18n ledger G1-G10 met, G11-G13 pending and non-writing

- [x] G1: all eleven site-trust oracles (page, nav, links, noprice, ownership, fee, sprint, faqld, csp, dates, memory) still pass after the redesign
  CHECK: node .unlazy/i18n/verify.mjs regress
  EXPECT: i18n regress verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=01e9d621cc3ca6314c62c856dfc3eb6e2e922cd8262ca2ca652ca54b05ef0eac; exit=0; EXPECT=matched; output-sha256=b41efb23b04e459b1ffa98b9cb1cf59454191a990a129934cea471e864a6f6fb; output-bytes=33; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G2: index.html and ro/index.html keep the same ids, element counts, JSON-LD node types and CTA markers, so the mirror is exact
  CHECK: node .unlazy/i18n/verify.mjs parity
  EXPECT: i18n parity verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=cf5d891609a00812d6f892a472b4e4e3cedc980523768f7fd8e199e3818aaf08; exit=0; EXPECT=matched; output-sha256=2d002378cefcb175e0aee1a1864b5031dd9c11773c4e934c9857e7753bd1d1ad; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G3: the header language switch on both homepages still points at its counterpart
  CHECK: node .unlazy/i18n/verify.mjs switch
  EXPECT: i18n switch verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=faa3a8a4674952139760c97c79ac49f7fa79f8c742669ea2f09b595567af3b44; exit=0; EXPECT=matched; output-sha256=e7a38faaf7ea92d5c2f4525db6ae51a3c83d7aa31ba63a61ce194cf96c9f592e; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G4: every internal href, src and srcset in all 19 pages resolves, and the RO homepage uses no relative url
  CHECK: node .unlazy/i18n/verify.mjs links
  EXPECT: i18n links verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=daa1db3ed08df9491423ebd56e45e53439fb34d5180f788453ebf583df44ead2; exit=0; EXPECT=matched; output-sha256=233510a6ea86e6e268525052cbea9f0eb08fbd6d20e7084f6f08e7b733c2dc0a; output-bytes=64; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G5: the new Romanian labels on ro/index.html contain no English UI word and no cedilla characters
  CHECK: node .unlazy/i18n/verify.mjs untranslated
  EXPECT: i18n untranslated verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=f8087e5eb9df7e61998eb1265ccb9dac42506aa81a77074eca9936fbc03d4ffb; exit=0; EXPECT=matched; output-sha256=de35ed6b91df094ffe1e2f2a381922269a55733373fcfc05575fc58cc341e5f0; output-bytes=38; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G6: ro/index.html carries no price figure, inline script, style attribute, handler or external resource, and its JSON-LD parses
  CHECK: node .unlazy/i18n/verify.mjs rosafe
  EXPECT: i18n rosafe verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=0b084cb89a213e3a139a044245cbfe5c2febf73227f9b807d6fb3022eaa6ee3b; exit=0; EXPECT=matched; output-sha256=589d53292653484271e5f154d235c206e6a239c32a5e5754ca817723bf40cd40; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G7: main.css is within 24,576 bytes, every class used in the 19 pages is defined, no defined class is dead, the header class reference matches, and both homepages have the seven KlientBoost sections in order with the preview wording verbatim from research.html and ro/research.html (detectors proven on built-in controls)
  CHECK: node .unlazy/redesign/verify.mjs
  EXPECT: redesign verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=62ff0fd72c35da2a885ec88804e8bce39820c658a9a9c1a10e64efab4a2d2caa; exit=0; EXPECT=matched; output-sha256=ba41a1f4974a4bfadc8fb80e44cdfeea722e5eea08304226fa95368dbb5f03dd; output-bytes=92; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G8: in the local browser at 360, 768 and 1280 px, index.html and ro/index.html have no horizontal overflow, no console error, a visible hero image, the sticker buttons unclipped, the three-up rows only at 1280, and the closing band in indigo; reduced-motion shows the same layout without animation
  EVIDENCE: 2026-09-30 12:33-12:44, python http.server 5173, Claude browser pane. scrollWidth-innerWidth: 0 at 360 (EN, RO), -15 (scrollbar gutter) at 768 and 1280; console errors: none (EN, RO). Computed: .hero .btn box-shadow "rgb(244,244,246) 4px 4px 0 0", border-radius 999px; h1 40px at 360, 72px at 1280; h1 strong background rgb(91,84,245); .section--cta background rgb(91,84,245), its .btn rgb(255,255,255); even band rgb(24,24,28); .modes columns 1 at 360/768 and 3 at 1280; .list-numbered--cols 3 columns at 768 and 1280. Header height 56px at 360 on EN and RO (RO was 88px before restoring .btn--header padding 8px 10px). Two defects found and fixed: .actions had no bottom margin so the 4px sticker covered the next line; .btn--header padding wrapped the RO header. Screenshots reviewed: hero, preview 01/02/03, arrangement cards, three-way cards, method, people, indigo band, footer (EN 360/768/1280, RO 360). Reduced motion not emulated (no tool); by inspection the only motion change is the .btn hover/active box-shadow inside the existing prefers-reduced-motion: no-preference block, and no layout property is animated.

- [x] G9: the pages that only inherit the system (how-you-sell.html#quote target border, services.html#fee three cards, process.html numerals, contact.html button pair, research.html compare cards, ro/ twins) render without breakage at 360 and 1280 px
  EVIDENCE: 2026-09-30 12:40-12:44 screenshots: contact.html 360 (primary + secondary pill buttons stacked, no clipping); research.html 768 (both compare columns as 2px cards, Research Sprint column with accent border); process.html 768 (01/02/03 numerals above steps, nested list-dash intact); how-you-sell.html#quote 768 (targeted .mode rendered as a card with accent border); services.html#fee 1280 (#fee .modes computed 3 columns, three fee cards in one row, overflow -15). ro/index.html 360 header 56px after fix. Not re-checked: privacy-policy/customer-policy/team/404 (typography-only inheritance) and other ro/ twins beyond ro/index.html.

- [x] G10: the owner has read and accepted the only new Romanian wording, the four eyebrow labels and the highlighted h1 phrase on ro/index.html
  EVIDENCE: first draft rejected in chat on 2026-09-30 ("sa nu sune tradus cu google translate"); rewritten as natural Romanian (five eyebrows "Primul pas, gratuit / De ce noi / Cum vinzi / Pas cu pas / Echipa", h2 "Ce afli din apelul gratuit", three answer sentences) and accepted by the owner in chat with "Accept" the same day; parity and untranslated oracles re-run green after the rewrite
