# Gates: bilingual site (EN at /, RO at /ro/, geo redirect on the home page)

OWNS: *.html, ro/**, assets/css/main.css, assets/js/main.js, vercel.json, sitemap.xml, llms.txt, .unlazy/i18n/**, .unlazy/site-trust/verify.mjs

Scope: every EN page has a complete Romanian twin under /ro/ with reciprocal hreflang and a header language switch, Romanian visitors opening the bare domain land on /ro via one Vercel geo redirect, and nothing the site-trust ledger proved regresses.

- [x] G1: each of the 9 EN pages and its ro/ twin have the right html lang, a self canonical, the en/ro/x-default hreflang trio, og:url, og:locale and og:locale:alternate, and a page JSON-LD node whose url, @id and inLanguage match
  CHECK: node .unlazy/i18n/verify.mjs pairs
  EXPECT: i18n pairs verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=731f51666a85e22e669472e1a43443ea6b37349c79c6c2cf485fb10ff50c47c6; exit=0; EXPECT=matched; output-sha256=41b789fc7d4847b372044e767f5a4c28b1b09b924f6a0e739bbd6ce89dda2660; output-bytes=31; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G2: every page, including 404, has exactly one header lang-switch pointing at its counterpart (RO pages point back with /index.html, never a bare "/"), and 404 carries a Romanian paragraph
  CHECK: node .unlazy/i18n/verify.mjs switch
  EXPECT: i18n switch verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=faa3a8a4674952139760c97c79ac49f7fa79f8c742669ea2f09b595567af3b44; exit=0; EXPECT=matched; output-sha256=e7a38faaf7ea92d5c2f4525db6ae51a3c83d7aa31ba63a61ce194cf96c9f592e; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G3: every internal href, src and srcset in all 19 pages resolves to an existing file and id, and no RO page uses a relative url; the relative-url detector is proven on positive and negative controls
  CHECK: node .unlazy/i18n/verify.mjs links
  EXPECT: i18n links verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=daa1db3ed08df9491423ebd56e45e53439fb34d5180f788453ebf583df44ead2; exit=0; EXPECT=matched; output-sha256=233510a6ea86e6e268525052cbea9f0eb08fbd6d20e7084f6f08e7b733c2dc0a; output-bytes=64; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G4: each EN/RO pair has the same ids, the same element counts, the same JSON-LD node types and the same CTA, consent and new-tab markers, so no section was lost in translation
  CHECK: node .unlazy/i18n/verify.mjs parity
  EXPECT: i18n parity verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=cf5d891609a00812d6f892a472b4e4e3cedc980523768f7fd8e199e3818aaf08; exit=0; EXPECT=matched; output-sha256=2d002378cefcb175e0aee1a1864b5031dd9c11773c4e934c9857e7753bd1d1ad; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G5: no English function word or short English UI word (book, call, menu...) and no cedilla ş/ţ remains in RO visible text, alt/aria-label/title attributes, meta descriptions, OG text or JSON-LD strings; the detector is proven on positive and negative controls
  CHECK: node .unlazy/i18n/verify.mjs untranslated
  EXPECT: i18n untranslated verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=f8087e5eb9df7e61998eb1265ccb9dac42506aa81a77074eca9936fbc03d4ffb; exit=0; EXPECT=matched; output-sha256=de35ed6b91df094ffe1e2f2a381922269a55733373fcfc05575fc58cc341e5f0; output-bytes=38; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G6: the Romanian ownership, Research Sprint price, fee-mechanism and call-question sentences are identical wherever the English ones are required, and the RO FAQ equals its FAQPage JSON-LD one to one
  CHECK: node .unlazy/i18n/verify.mjs roinv
  EXPECT: i18n roinv verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=8e6a1e30f611428bb68d8f4ac66c78614e769578b2bafceda180edf8c056c159; exit=0; EXPECT=matched; output-sha256=70157ccc5e7b092cf6d98427f27c3b1e6ef889d1ddb75d2d9031c63523c8cf0e; output-bytes=31; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G7: RO pages and 404 carry no price figure, no inline script, style or handler, no external resource, and every JSON-LD block parses; the price regex is proven on controls
  CHECK: node .unlazy/i18n/verify.mjs rosafe
  EXPECT: i18n rosafe verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=0b084cb89a213e3a139a044245cbfe5c2febf73227f9b807d6fb3022eaa6ee3b; exit=0; EXPECT=matched; output-sha256=589d53292653484271e5f154d235c206e6a239c32a5e5754ca817723bf40cd40; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G8: vercel.json has exactly one geo redirect ("/" with x-vercel-ip-country RO to /ro, not permanent), nothing redirects /index.html, and every other key equals HEAD
  CHECK: node .unlazy/i18n/verify.mjs redirect
  EXPECT: i18n redirect verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=ad8ab06663cf0291c4dd73e0736297725b74af540c68befc302e942752295f21; exit=0; EXPECT=matched; output-sha256=2b17c9c754be345727d8fbcaf0ca9f922d134bfe59e030bca9544e8ee72d7dec; output-bytes=34; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G9: all eleven site-trust oracles still pass after the change
  CHECK: node .unlazy/i18n/verify.mjs regress
  EXPECT: i18n regress verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=01e9d621cc3ca6314c62c856dfc3eb6e2e922cd8262ca2ca652ca54b05ef0eac; exit=0; EXPECT=matched; output-sha256=b41efb23b04e459b1ffa98b9cb1cf59454191a990a129934cea471e864a6f6fb; output-bytes=33; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G10: sitemap.xml lists all 9 RO URLs, llms.txt links the RO home, and both privacy policies disclose the country lookup with dates set to 2026-09-30
  CHECK: node .unlazy/i18n/verify.mjs publish
  EXPECT: i18n publish verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=b534f8b77b5ed9ee8c222141ac1cb7a1a3697931dd4af614e9e02e16edb56cbe; exit=0; EXPECT=matched; output-sha256=1140fab32bebbe156229cc649f48e8d60526196340e6071219cf9e791702f727; output-bytes=33; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=5c34d2cc3e84/41 entries

- [x] G11: in the local browser at 375px and 1280px, all 19 pages have no horizontal overflow and a one-row header, the switch round-trips on every page, the consent banner is Romanian on /ro/, and the console shows no errors
  EVIDENCE: driver, 2026-09-30, Browser pane on python http.server :5174. Header one row and zero horizontal overflow on all 19 pages at 360, 375, 480, 600, 768, 1024, 1280 and 1440px (iframe per width with the desktop scrollbar hidden, since phones use overlay scrollbars; a first 360px run failed only because the 15px desktop scrollbar left 345px). Tightest case: RO header at 360px with 6px spare, EN 11px, after the lang-switch went from min-width 44px to 32px and the RO header CTA became "Apel gratuit". Switch round-trip fetched on all 18 paired pages: target 200 and its switch points back. Real clicks at 375px mobile emulation: consent banner Romanian on /ro/index.html (title, 4 buttons, link /ro/privacy-policy.html#cookies), EN banner unchanged on /index.html, RO mobile menu shows the 6 RO items, EN switch lands on /index.html in English. Screenshots: RO home 375px with banner, RO menu open, EN home 375px, RO services and research 1280px. Console: "AbortError: Transition was skipped" appeared in the stress tab (rapid iframe loads, tool-driven navigation in a hidden pane); A/B in fresh tabs showed no console messages on a HEAD snapshot (services -> process) nor on the working tree (services -> process -> RO switch -> RO research), so it is not from this change. Server log: only /favicon.ico 404, present from the first request before any change (browser auto-request; pages declare favicon.svg). Not tested: real devices, Safari, Firefox.

- [ ] G12: on the deployed site, a Romanian IP gets / -> 307 /ro and /index.html -> 200 English, a non-Romanian location gets / -> 200 English, and /ro returns 200
  EVIDENCE: pending

- [ ] G13: the owner has read the Romanian copy, including the two legal pages, and accepts it
  EVIDENCE: pending
