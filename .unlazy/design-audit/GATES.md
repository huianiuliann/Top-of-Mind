# Gates: design coherence audit (report only)

OWNS: .claude/plans/audit-design-2026-10-01.md, .unlazy/design-audit/**

Scope: Audit visual coherence across all 6 pages (home, services, process, how-you-sell, team, contact; EN + RO) using the design-critique framework, and deliver a Romanian report listing every element that does not match the rest of the site, with file:line, severity and a suggested fix. No source changes.

- [x] G1: Report exists, has a section for each of the 6 pages plus a cross-site section, every `src/...` reference points to an existing file containing the quoted class snippet, and every numbered finding has a severity
  CHECK: node .unlazy/design-audit/check-report.mjs
  EXPECT: report-ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=2584fc7bd3878c1a0007b92642e9ed3034dfd8214705c16757c6aa0741247c5d; exit=0; EXPECT=matched; output-sha256=0cc04aba8fa1b1bed546d2198bbb8c73bcc17554d58d3073fd9f7e7a7b8f909a; output-bytes=45; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G2: Token inventory regenerates and every count quoted in the report's "Inventar" table matches the current source
  CHECK: node .unlazy/design-audit/check-counts.mjs
  EXPECT: counts-ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=709f3dd722f52351031e62a58386553fbf5a224de552377f2bcaae0325c2f6fa; exit=0; EXPECT=matched; output-sha256=b6bafde5dadfc4885e0bb990fb68179408c78931923735ac748b53f3b3a11bcf; output-bytes=25; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G3: Each of the 6 pages inspected in the browser at desktop (1280) and mobile (375) widths; findings derived from what was seen, not only from source
  EVIDENCE: Dev server 127.0.0.1:5173, 2026-10-01. Desktop 1280: scrolled screenshots of /, services, process, how-you-sell, team, contact; computed-style collector over all 6 via same-origin iframes (h1 83.2 vs 86.4px, buttons 59/61px, card radii set, section paddings 112/96/80). Mobile 375: iframe pass on 6 EN + 6 RO pages (no h-overflow; tap targets; RO CTA wraps 81px), screenshots of services mobile. Blank-hero screenshots verified as hidden-pane rAF artifact (h1 present, opacity 1 after render) — not reported; prerendered opacity:0 confirmed from dist/process.html and reported as T1.

- [x] G4: Audit made no source changes: no file under src/ was edited by this session (other sessions may edit concurrently; diff attributed manually)
  EVIDENCE: This audit's writes were only .claude/plans/audit-design-2026-10-01.md and .unlazy/design-audit/*. The src/ modifications in git status (e.g. src/components/effects/*) belong to the concurrent code-cut session (announced refactor); no Edit/Write tool call targeted src/ during this audit.
