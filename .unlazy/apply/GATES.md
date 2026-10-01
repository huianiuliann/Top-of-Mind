# Gates: apply the 2026-10-01 audit cuts without breaking the site

OWNS: src/**, public/assets/fonts/**, public/assets/img/research-board.webp, index.html, services.html, process.html, team.html, contact.html, how-you-sell.html, package.json, package-lock.json, .unlazy/apply/**, .claude/plans/audit-cod-2026-10-01.md

Scope: cut the dead code, dead props, duplicated data and decompiler leftovers listed in .claude/plans/audit-cod-2026-10-01.md while every page renders the same markup and behaves the same in the browser. Baseline = `node .unlazy/apply/verify.mjs snapshot`, taken right before the first cut (after the Romanian-copy session finished) with a full copy of src/, public/, the HTML pages and package files in the session scratchpad.

Intended markup change (the only one the markup oracle forgives): the founder tilt cards on the home page get `group-hover/card:[transform:translateZ(Npx)]` classes instead of a JS effect writing the same transform after hover.

- [ ] G1: `npm run build` exits 0 and dist/ holds all six prerendered pages plus industries.html
  CHECK: node .unlazy/apply/verify.mjs build
  EXPECT: apply build verification passed
  EVIDENCE: pending

- [ ] G2: the prerendered #root of all six pages equals the baseline (class order and empty class attributes ignored; tilt-depth classes forgiven), with a control proving two different pages compare unequal
  CHECK: node .unlazy/apply/verify.mjs markup
  EXPECT: apply markup verification passed
  EVIDENCE: pending

- [ ] G3: every page head preloads spacegrotesk-var and inter-var with a native link tag and no inline preload script; built CSS has no Bricolage/WorkSans/marquee/mask-fade-x but keeps Inter, Space Grotesk, InstrumentSerif, RedHatMono, sweep, grid-lines and em-serif; the six used font files still ship
  CHECK: node .unlazy/apply/verify.mjs head
  EXPECT: apply head verification passed
  EVIDENCE: pending

- [ ] G4: the three dead home sections, research-board.webp, the five unused font files and the clsx dependency are gone, and nothing in src/ still refers to them (control: the scan sees the tailwind-merge import)
  CHECK: node .unlazy/apply/verify.mjs dead
  EXPECT: apply dead verification passed
  EVIDENCE: pending

- [ ] G5: the dead props, single-caller wrappers and duplicated maps named by the audit are gone from their files (control: AnimatedBeam still has curvature)
  CHECK: node .unlazy/apply/verify.mjs props
  EXPECT: apply props verification passed
  EVIDENCE: pending

- [ ] G6: no decompiler leftovers in src/: no `1 / 0`, no exponent literals, no \u/\x escapes, no `key: key` properties, no literal [0.16, 1, 0.3, 1] outside motion.js
  CHECK: node .unlazy/apply/verify.mjs artifacts
  EXPECT: apply artifacts verification passed
  EVIDENCE: pending

- [ ] G7: src/ is at least 1,500 lines shorter than the baseline
  CHECK: node .unlazy/apply/verify.mjs lines
  EXPECT: apply lines verification passed
  EVIDENCE: pending

- [ ] G8: in a browser (vite preview of dist), all six pages hydrate with no console error at 1280 and 375 px, and the interactive parts still work: mobile menu opens/closes, nav shrinks on scroll, FAQ toggles, quick check selects, founder carousel next/prev, compare slider moves, tilt cards lift on hover, typewriter types while visible, globe canvas renders
  EVIDENCE: pending

- [ ] G9: nothing outside the audit was changed and nothing from the parallel session was overwritten: the baseline copy exists, the diff against it touches only OWNS paths, and the items deliberately skipped are listed with a reason in the plan file
  EVIDENCE: pending
