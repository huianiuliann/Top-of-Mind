# Gates: apply the 2026-10-01 audit cuts without breaking the site

OWNS: src/**, public/assets/fonts/**, public/assets/img/research-board.webp, index.html, services.html, process.html, team.html, contact.html, how-you-sell.html, ro/*.html, package.json, package-lock.json, .unlazy/apply/**, .claude/plans/audit-cod-2026-10-01.md

Scope: cut the dead code, dead props, duplicated data and decompiler leftovers listed in .claude/plans/audit-cod-2026-10-01.md while every page (6 EN + 6 RO) renders the same markup and behaves the same in the browser. Baseline = `node .unlazy/apply/verify.mjs snapshot`, taken at 11:18 right before the first cut (after the Romanian-copy session went idle), with a full copy of src/, public/, scripts/, the root HTML pages and package files in the session scratchpad (ro/*.html is tracked in git).

Intended markup change (the only one the markup oracle forgives): the founder tilt cards on the home page get `group-hover/card:[transform:translateZ(Npx)]` classes instead of a JS effect writing the same transform after hover. Semantically neutral differences the oracle normalises: class token order, empty class attributes, React useId values (renumbered by first appearance, with a control proving a swapped url(#id) reference is still caught).

- [x] G1: `npm run build` exits 0 and dist/ holds all twelve prerendered pages (EN + RO) plus industries.html
  CHECK: node .unlazy/apply/verify.mjs build
  EXPECT: apply build verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=d25a1962a51e1fe00ed988329b200e6d8bcf27f8ec56e7046cee3ea7eacf8da5; exit=0; EXPECT=matched; output-sha256=72a2caa8612ef8d25574c6b6e02cbce1837fb4f14af32c849197bc0d580d2513; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G2: the prerendered #root of all twelve pages equals the baseline after the neutral normalisation, with controls proving EN and RO home compare unequal and a swapped url(#id) is caught
  CHECK: node .unlazy/apply/verify.mjs markup
  EXPECT: apply markup verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=08fe4028df4b5cca913749eb856985cbd592f945e1cfe555d572fc1552774c9e; exit=0; EXPECT=matched; output-sha256=322e70d7d2b3492f8ae2af43eaf4a4adec7e80bbe3fe965d548ec4901150950d; output-bytes=97; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G3: every page head preloads spacegrotesk-var and inter-var with a native link tag and no inline preload script; built CSS has no Bricolage/WorkSans/marquee/mask-fade-x but keeps Inter, Space Grotesk, InstrumentSerif, RedHatMono, sweep, grid-lines and em-serif; the six used font files still ship
  CHECK: node .unlazy/apply/verify.mjs head
  EXPECT: apply head verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=11a842493806ea78ad8412bb3098b7fc04e89c8a665afebd9c0c18b011301419; exit=0; EXPECT=matched; output-sha256=16b169f5e05c546003288f08ca627b4f0ae5854c23de24266abcac446729a2ac; output-bytes=31; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G4: the three dead home sections, research-board.webp, the five unused font files and the clsx dependency are gone, and nothing in src/ still refers to them (control: the scan sees the tailwind-merge import)
  CHECK: node .unlazy/apply/verify.mjs dead
  EXPECT: apply dead verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=8de363323aad432c28a7131b0f00b37b805257a50d97066cf05f0e68f8231f26; exit=0; EXPECT=matched; output-sha256=8354100d990c56c8f63da706dca58a16da86f33e8b039d751b8b3378033f3296; output-bytes=31; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G5: the dead props, single-caller wrappers and duplicated maps named by the audit are gone from their files (control: AnimatedBeam still has curvature)
  CHECK: node .unlazy/apply/verify.mjs props
  EXPECT: apply props verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=1733e9cc602bf63163a9bb8797d425a6552dc1139136eeeac01f03eb17cbc780; exit=0; EXPECT=matched; output-sha256=fd9173abc8a260248a02a5bf260fbb53c04af8a62ea8d5fd2074f3d482af5c9d; output-bytes=32; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G6: no decompiler leftovers in src/: no `1 / 0`, no exponent literals, no escapes of visible characters (invisible ones such as the RO word joiner stay escaped), no `key: key` properties, no literal [0.16, 1, 0.3, 1] outside motion.js
  CHECK: node .unlazy/apply/verify.mjs artifacts
  EXPECT: apply artifacts verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=90380ffd298de2eec83c8a47ff39f99b1ca7f3f1f215938437b90e91d5749122; exit=0; EXPECT=matched; output-sha256=9e5e1c09f2282e5c820277ca62ce42bada8eb0523e8de579ae7a6645f2e4d04f; output-bytes=36; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G7: src/ is at least 1,500 lines shorter than the baseline
  CHECK: node .unlazy/apply/verify.mjs lines
  EXPECT: apply lines verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=26dbd38ba648dfd636816f682992628d344ee5a232f39408756fc6494351f3fb; exit=0; EXPECT=matched; output-sha256=d4ee01d45ffc26a6b0ce94a2b97bf5deee82c77da34b08cfc102ed5a11376da1; output-bytes=64; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G8: in headless Chrome with motion on, the effects the markup cannot show still work: nav shrinks on scroll and grows back, the typewriter types on screen and stands still off screen, beams draw, funnel drops animate, the compare slider autoplays and follows the mouse, the fee text rotates, tilt cards lift and turn on hover, the founder carousel goes next/prev, the WebGL globe renders and places its label, the RO mobile menu opens and closes, and home/team/contact log no runtime error
  CHECK: node .unlazy/apply/interactions.mjs
  EXPECT: apply interactions verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=8f2663a834749233f7ed3836d2229fae33a97e67e923d8a330d18b78be42d81f; exit=0; EXPECT=matched; output-sha256=337cb00d05a3e33d005480bb7c84cdfb17a13fc2260f3ca98523e9677679ec1e; output-bytes=1134; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G9: every EN and RO page hydrates without a React error at desktop and phone width, and buttons, menus, language switch and layout hold (the Romanian session's own browser oracle, read in full before running; its control alters a prerendered heading and must see a hydration error)
  CHECK: node .unlazy/ro-react/browser.mjs
  EXPECT: ro browser verification passed (24 page loads
  EVIDENCE: automatic-evidence=v1; definition-sha256=fe2db51e50745d33cd0944ae7f251f62d9af56c2bc0192021a43d156cc8da33a; exit=0; EXPECT=matched; output-sha256=8651b5c8428d0059b4d76e3b8e9f88b82280cb3aa657dbeabcdac2139639598e; output-bytes=169; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G10: nothing outside the audit was changed and nothing from the parallel sessions was overwritten: the diff against the scratchpad copy and git touches only OWNS paths, and the items deliberately skipped are listed with a reason in the plan file
  EVIDENCE: 2026-10-01. `diff -rq <scratchpad>/backup-pre-cuts .` lists only src/** (59 changed, 3 removed: ResearchBoard/MacbookScroll/ServicesMarquee; 2 added: src/data/buyingModes.js, src/data/disciplines.js), the 6 root HTML pages, package.json, package-lock.json, 5 removed fonts and research-board.webp under public/. `git diff --stat ro/` = 6 files, 2 lines each (preload script -> 2 link tags). Files newer than the copy outside those paths: only .unlazy/apply/** (this ledger) and .unlazy/design-audit/** + .claude/plans/audit-design-2026-10-01.md, which belong to the read-only design session (it confirmed by message it never writes src/, index.css, root HTML or package.json). The Romanian session was idle (isRunning=false, last activity 11:16) before the 11:18 baseline and made no change since. Skipped items and why: plan file section "Aplicat ... Sărit, cu motiv" (finding 3 head plugin, 14 steps/weeks, inert linearGradient attrs, Reveal transformPerspective, E2-E5, invisible-character escapes). No literal invisible characters in src/.
