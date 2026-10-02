# Gates: design coherence fixes (from audit-design-2026-10-01)

OWNS: src/index.css, src/components/**, src/pages/**, .claude/plans/audit-design-2026-10-01.md, .unlazy/design-fix/**

Scope: Apply the audit fixes T1-T10, T12-T15, H1, P1, Y1, Y2, M1, M2, C1 across EN+RO; record what was deliberately not done (T11, T16/M3/C3, S1-S3, C2, H2, S2) as owner decisions in the report. Defaults chosen without owner answer: home hero stays centered, cards 20px like the navbar, WhatsApp green stays.

- [x] G1: Source carries every fix (radius/colour tokens, no ad-hoc card radii or text outliers, section padding scale, primary button border, visible PageHero h1 at home size, CTA heading size, RO CTA label, Team left-aligned, home Team dark, QuickCheck serif, tap-target padding)
  CHECK: node .unlazy/design-fix/check-source.mjs
  EXPECT: design-fix-source-ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=8a72e776605f2d0ea909f0f15f1b7fd737d89a3e6c5d039af6d359d0c41006c8; exit=0; EXPECT=matched; output-sha256=f145f446cdda5fcaa71759234435a7289dc04d5a3a53dd96d0f2e8af04f72778; output-bytes=21; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G2: Production build (vite + SSR + prerender, EN + RO) succeeds
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=06b7a812fa52a9d3484664b37bccf8c9ccd4f4c40dfdc874cc40da681fdb73d1; output-bytes=4100; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G3: Every prerendered page, EN and RO, ships a visible h1 (no inline opacity:0)
  CHECK: node .unlazy/design-fix/check-dist.mjs
  EXPECT: dist-h1-visible-ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=90644a342aa937ce1cb3a37393e646c81d91a4ec63f6ab3ef17475224fc1d360; exit=0; EXPECT=matched; output-sha256=42806e62805b283b2a20d8cf0656e9245ddc19bf4298aa2689c26b3328a912f5; output-bytes=36; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G4: Bilingual source check still passes (all visible strings inside t()/L())
  CHECK: node .unlazy/ro-react/source.mjs
  EXPECT: ro source verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=429e6f9d10a84a7d970c3505f2dd7cf2ae1de7b10c4cd08eb04d5f8d27d1b03a; exit=0; EXPECT=matched; output-sha256=0340b9209774e0bb93c0663910f241301b557a5c2c22f90a235577ca93efaf93; output-bytes=145; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G5: In the browser at 1280 and 375: paired buttons equal height, card radii only from the scale, section padding 96px desktop, home sections alternate dark/light, RO CTA on one line at 375, no horizontal overflow; screenshots reviewed
  EVIDENCE: Dev server localhost:5175, 2026-10-02, computed styles via same-origin iframes. @1280 all 6 EN pages: h1 83.2px opacity 1; paired buttons 61/61px (navbar 38); card radii only 20px and 12px after Panel/process fix; every section 96px (home hero 128 top and full-bleed sections 0 by design); home sequence D L D L D L D D (Team now dark, FinalCta after it). @375 all 12 EN+RO pages: max CTA height 61px (one line; was 81-83px), window.scrollTo(200,0) leaves scrollX 0 on every page. Screenshots: home Team dark, Team page left heading, QuickCheck serif title, RO team CTA band at 375.

- [x] G6: Audit report updated with a per-finding status (fixed / owner decision / not done with reason)
  EVIDENCE: .claude/plans/audit-design-2026-10-01.md section "Stare rezolvare (2026-10-02)": every finding id T1-T16, H1-H3, S1-S3, P1-P2, Y1-Y2, M1-M3, C1-C3 has a status; partial T7 (110 small mono sizes left, measured) and not-done T11 with reasons; owner decisions T16/M3/C3, S1, S3 listed.
