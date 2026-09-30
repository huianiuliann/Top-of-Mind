# Gates: inspiration research — successful sites in Top of Mind's domain

OWNS: .unlazy/inspo/**

Scope: sourced list of successful marketing-agency sites (RO/CEE, international boutique, niche per buying mode) with proof of success and concrete site patterns Top of Mind can borrow, delivered in chat.

- [x] G1: research.json holds >=12 sites covering ro-cee, boutique-intl and all three buying-mode niches, each with >=1 sourced success claim and >=2 borrowable site patterns
  CHECK: node .unlazy/inspo/verify.mjs structure
  EXPECT: research-structure verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=b1bff3fec5f3ea24f6dc166eae76cd9298c375bb5bc72ef7efdaac26431fc3f6; exit=0; EXPECT=matched; output-sha256=e7067cea840161a1e417b9d75e02cf2e5fca2edc4a950714944b6a3d105ccf63; output-bytes=128; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=308f4609ec0d/49 entries

- [x] G2: every site URL and every success-source URL answers over HTTP (no DNS failure, no 404/410, no 5xx)
  CHECK: node .unlazy/inspo/verify.mjs live
  EXPECT: url-liveness verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=2e1d87de05e425dfe67c582286d66a415075cf9f450661a09e42c80bde96f1c3; exit=0; EXPECT=matched; output-sha256=2a78f5a8a9aea3b0af4c0a59d727e8ad03b3dd6c5506bdf4898b63a42a186d13; output-bytes=3705; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=308f4609ec0d/49 entries

- [x] G3: success claims spot-checked by the driver against their source pages (at least one per category), wrong or unsupported claims removed
  EVIDENCE: driver WebFetch 2026-09-30, 8 claims: ro-cee Pixer totalfirme (match), Optimized totalfirme (match), Digital Diggers Clutch 5.0/5 (match); boutique-intl KlientBoost $502,500 MRR/45 people (match), Refine Labs TIMIA (2022 $21M was "on track" -> claim reworded); niche-quote Hook Courtney $105K/$6K (match); niche-cart Flighted Clutch 4.9/13 + 5x quote (match); niche-calendar Gourmet Wallace +94/+14/-26 (match). Self-reported claims labelled as such in reply. G2 note: 15/69 URLs return 403 bot walls (Clutch, Inc.), Clutch pages confirmed readable via WebFetch.

- [x] G4: final chat reply lists every site in research.json with link, proof and what to borrow, in Romanian
  EVIDENCE: reply tables: 8 ro-cee + 3 niche-quote + 3 niche-cart + 3 niche-calendar + 8 boutique-intl = 25 = research.json count
