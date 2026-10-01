# Gates: homepage trim (plan B)

OWNS: src/pages/home/HomePage.jsx, .unlazy/home-trim/**

Scope: Homepage reduced to 8 sections in order Hero, AgencyProblem, HowYouSell, Process, Services, HowWeWork, Team, FinalCta; MacbookScroll research board and services marquee removed.

- [x] G1: production build and prerender succeed
  CHECK: npm run build
  EXPECT: prerendered index.html
  EVIDENCE: automatic-evidence=v1; definition-sha256=673eec4ac90b779025ea36cc92a45019b59e179d165fb5403aeafb167485d04e; exit=0; EXPECT=matched; output-sha256=5545000f91592b3062e56f2623cfad46d445504e17ff34797cefb3222b83148a; output-bytes=2704; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G2: prerendered homepage shows the 8 sections in the new order
  CHECK: node .unlazy/home-trim/verify.mjs order
  EXPECT: ORDER OK 8
  EVIDENCE: automatic-evidence=v1; definition-sha256=a8c6fb118a648115c384c663bf4b7ba852c8f952d57b560a63112d902921f144; exit=0; EXPECT=matched; output-sha256=516c3b8d96304d9bb380b4363683ec9d671fd95497f9340b54b42a1a72df0e3a; output-bytes=11; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G3: MacBook board and marquee are gone from the prerendered homepage (with positive control)
  CHECK: node .unlazy/home-trim/verify.mjs removed
  EXPECT: REMOVED OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=aad97397c91e2d8aa5a7ce30b4be13b7a082c3ab8c0cbbb09fe63c046b83602c; exit=0; EXPECT=matched; output-sha256=a8dd96cc72ba8c8bf1e8db2a9757479376fcdb4223748afa57cf383ea7c35269; output-bytes=11; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [x] G4: main contains exactly 8 top-level sections
  CHECK: node .unlazy/home-trim/verify.mjs sections
  EXPECT: SECTIONS OK 8
  EVIDENCE: automatic-evidence=v1; definition-sha256=47aefe6c7540e10178677e68bfd05a385cc06ee7e3aef0e7f5731507f23e6178; exit=0; EXPECT=matched; output-sha256=811589505168ad4ea784aa95c4446736a7f5887c568f152298f77ead2785a710; output-bytes=14; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=75b5ce36d636/50 entries

- [ ] G5: in the dev preview, desktop and mobile, scrolling top to bottom shows no empty screen and no console errors
  EVIDENCE: pending
