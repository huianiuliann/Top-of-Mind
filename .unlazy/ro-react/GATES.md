# Gates: bilingual site (English at /, Romanian at /ro/, Romania lands on Romanian)

OWNS: src/**, ro/**, index.html, services.html, process.html, team.html, contact.html, how-you-sell.html, vite.config.js, vercel.json, scripts/prerender.mjs, .unlazy/ro-react/**

Scope: all six pages exist in Romanian under /ro/ (same file names) with no English left, an EN | RO switch on every page links to the same page in the other language, a visitor whose Vercel country header is RO is sent from / to /ro while everyone else gets English, and the English site is unchanged.

- [x] G0: this ledger states outcomes that can fail
  CHECK: node C:/Users/Administrator/.claude/skills/unlazy/scripts/gate-lint.mjs .unlazy/ro-react/GATES.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=aabb663ecb2104bc7224ae9526696f475ec17c45935709f6e20e0fbd8fdf1587; exit=0; EXPECT=matched; output-sha256=14c2dbbbd56db03e4c4bee6f7ab2c9dd3b42dfacae84bc2f406793220265d892; output-bytes=932; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G1: `npm run build` exits 0 and dist/ holds the six English pages and the six Romanian pages (dist/ro/*.html), each prerendered, with <html lang> en / ro
  CHECK: node .unlazy/ro-react/verify.mjs build
  EXPECT: ro build verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=716b8ead1937d39ad88c620b530bfa3f6b57b8145bd4b2d266b6c034fa9c941b; exit=0; EXPECT=matched; output-sha256=c06360a1b754b4b5ef65801187810d0ee75fbfa144503f6609386b2e5948cab9; output-bytes=29; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G2: the English pages are unchanged: each dist #root is byte-identical to the pre-change render once the language switches, the two wrappers that hold them and the root-absolute /assets paths are normalised away
  CHECK: node .unlazy/ro-react/verify.mjs en
  EXPECT: ro en-unchanged verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=77e2bcab0105dec5a4a0356383166a5b16b30fd433f54507f583aff03a540f91; exit=0; EXPECT=matched; output-sha256=592044dfb7bc41516840206c8365f7247982a424399111c78e9e84a6a33edadc; output-bytes=46; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G3: every Romanian page mirrors its English page element for element and no text or aria-label/alt is left in English, digits are preserved, diacritics are comma-below ș ț (no cedilla, none missing)
  CHECK: node .unlazy/ro-react/verify.mjs ro
  EXPECT: ro parity verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=949de93211827a16f1bfcd2ee67360846bbf84ff3625ce6628a27d7ca937c268; exit=0; EXPECT=matched; output-sha256=bae7add9b2cdfe4cb891dfd6de0f8a7ef347d0b718c831393f56319314390ab1; output-bytes=59; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G3b: no English-looking string is left outside a t()/L() call anywhere in src/ (closed accordions, quiz results, timed visuals and dead branches included), so nothing can leak English into Romanian after an interaction
  CHECK: node .unlazy/ro-react/source.mjs
  EXPECT: ro source verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=429e6f9d10a84a7d970c3505f2dd7cf2ae1de7b10c4cd08eb04d5f8d27d1b03a; exit=0; EXPECT=matched; output-sha256=1352648c5d46cd4fb466a901525bfc313783c0f8e23786848b2fb904ad35fc53; output-bytes=237; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G4: every page head is right in both languages: html lang, translated title and description, canonical, reciprocal hreflang en/ro/x-default, og:locale, root-absolute URLs in the RO head, and the EN head differs from before only by the hreflang/og:locale tags
  CHECK: node .unlazy/ro-react/verify.mjs head
  EXPECT: ro head verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=945b48c81e5e25551a87543b998b90ede4f29b0e5bf42c7241cdbf27676a9427; exit=0; EXPECT=matched; output-sha256=992647740d7270c852de95d9ee5cad23609f92665ac8e309c189fdf5f2ae6ce8; output-bytes=28; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G5: every internal link and asset of the 12 pages resolves in dist/; Romanian pages link only to /ro/ pages with root-absolute URLs; no page links to the bare "/" that the geo redirect would catch
  CHECK: node .unlazy/ro-react/verify.mjs links
  EXPECT: ro links verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=90bda6ae5462781e7e95971e68c421ff0a528d1f352408b916f371997f065118; exit=0; EXPECT=matched; output-sha256=5b5d39b567a179d08b1df5689d57d9a51830689e388cc2fa0c1ed34ae79b3c18; output-bytes=29; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G6: each of the 12 pages carries three EN | RO switches (desktop nav, mobile header, footer) whose link goes to the same page in the other language (RO to EN home is /index.html, not /) with lang/hreflang and an accessible name
  CHECK: node .unlazy/ro-react/verify.mjs switch
  EXPECT: ro switch verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=30f62fe8d4b410cbd267749da2816725c4fa48490ae733e47a17bbab5a6c3048; exit=0; EXPECT=matched; output-sha256=ede81301bd9a420cb78aef9171e257c86e04ecb630962b7a72a96b75f7a4ef3b; output-bytes=56; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G7: vercel.json sends a visitor with x-vercel-ip-country RO from / to /ro (temporary redirect) and nobody else; deep links and /index.html are never redirected; trailingSlash is false; the target exists in dist
  CHECK: node .unlazy/ro-react/verify.mjs geo
  EXPECT: ro geo verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=c327b382e7812eb4204811235452f277b546b1f9f46cb29b3f1a178811e63044; exit=0; EXPECT=matched; output-sha256=54da92cefde0affa84715ecf23c4b110d35a7c4232cfd3376e4a188aef6fb7c3; output-bytes=27; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G8: every font file src/index.css loads contains ă â î ș ț (and „ ” — ·), so Romanian text never falls back to another typeface
  CHECK: python .unlazy/ro-react/fontcheck.py
  EXPECT: ro fonts verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=77d4916c47ef98b181f63f0bde4d1af837c44792eafd5aa286afe83b48757e2d; exit=0; EXPECT=matched; output-sha256=168546b2d7f5cdc055182d2832f9eecadba0a49102cf1a5c4b711898ebd9e942; output-bytes=67; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G9: no dependency was added to package.json
  CHECK: node .unlazy/ro-react/verify.mjs deps
  EXPECT: ro deps verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=1a9f1cbf3f647e997f9fcc46af116d0d2edde57ed502729c1036e5010ae5e9bf; exit=0; EXPECT=matched; output-sha256=5c69fc5c9cfa148b86fb53c2c2df31618cb4feb69635c232b9c01f20d3749ddf; output-bytes=50; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G10: in headless Chrome all 12 pages hydrate with no console error or hydration warning, the switch lands on the same page in the other language from every page in both directions, the header never overlaps and Romanian text never overflows or gets clipped where English did not, at 1280 and 375 px
  CHECK: node .unlazy/ro-react/browser.mjs
  EXPECT: ro browser verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=746fb51b6cabd6782648914088dd7465eeb0f339aad5745517cf23e19b766169; exit=0; EXPECT=matched; output-sha256=8651b5c8428d0059b4d76e3b8e9f88b82280cb3aa657dbeabcdac2139639598e; output-bytes=169; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G11: the Romanian copy reads as native Romanian and says exactly what the English says on money and ownership (retainer with a result-tied part, no prices, Research Sprint fixed price confirmed in writing, ownership from day 1), and screenshots of the Romanian pages show no broken layout, checked by reading the rendered pages against the English and the static reference
  EVIDENCE: 2026-10-01. Read all six RO pages against the English (aligned dump, about 1,100 pairs) plus the 778 lines the browser oracle saw after interaction (FAQ answers 2-6, quiz results, timed visuals). Money: fee lines say "abonament lunar" and "o parte din tarif depinde de rezultate" (per lead calificat / performanta reclamelor / rezervari directe), same as the English; the only euro figure is the mock report metric 0.38 EUR, kept as 0,38 EUR; no price appears in any RO string (digits oracle). The React English copy has no Research Sprint or ownership sentence, so there was nothing to mirror. Cross-page wording: 8 English strings had two Romanian renderings, 5 unified, 3 left as deliberate width variants (header CTA "Apel gratuit", hero CTA, narrow chip labels). Screenshots at 1280 and 375 of index, services, process, team, contact, how-you-sell: no overlap or clipped text; three labels that clipped at 375 were shortened. Needs the owner's read: contact "Lucrăm în română și în engleză" (English says English only), FAQ "o pagină de Facebook" (English says "a page"), hero CTA shortened to "Apel gratuit de 30 de minute", "Schiță de poziționare" for "positioning draft".

- [x] G12: the work is merged into the live working tree without losing the parallel session's edits, and G1 to G9 pass there
  EVIDENCE: 2026-10-01. 3-way git merge-file against the 10:09 snapshot: 57 files merged clean, 43 created, 0 conflicts. home/Team.jsx had CRLF in the live tree (font/team-cards session) while all else is LF, so it was merged as LF; their card layout (size-28 frame) is intact and .unlazy/team-cards/check-source.mjs prints team-source-ok. The live manifest (102 files) was identical to the snapshot at apply time. All 12 runnable gates re-ran green in the live tree after the merge and after the dev-only /ro rewrite in vite.config.js. vite dev (5177) and vite preview (5178): /ro serves Romanian, hydrates, no console errors, the EN switch lands on /index.html. Nothing committed or pushed. Ledgers that count files or lines (.unlazy/audit) will show stale numbers.
