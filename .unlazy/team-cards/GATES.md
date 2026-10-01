# Gates: homepage founder cards — smaller frames, photos fit

OWNS: src/pages/home/Team.jsx, src/data/site.js

Scope: Homepage "Who you'd work with" founder cards get a smaller photo frame whose aspect matches the 640x640 photos, so each photo shows whole (no crop) in both duo and hover states, at desktop and mobile widths.

- [x] G1: Photo frame in Team.jsx is square (matches 1:1 source photos) and no longer the full-width 4:3 box
  CHECK: node .unlazy/team-cards/check-source.mjs
  EXPECT: team-source-ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=8cb31489021fa547a0211d97d3b0a2e97e89d1b5640817fe912b488f023f89db; exit=0; EXPECT=matched; output-sha256=afd93cfc218be015992b95183ddf359e58f142108362f62cf8dbd5e082e58b66; output-bytes=15; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G2: Production build (vite + SSR + prerender) succeeds after the change
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=ad5be9998c9f376503616b50340f079de6e3aeb13a752eada9515f6901e87aee; output-bytes=2644; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=93cbfdfdc7c2/41 entries

- [x] G3: In browser at 1280px and 375px, every founder photo frame is <= 200px wide, frame aspect == image natural aspect (no crop), both images loaded; card height smaller than before (before: ~530px desktop)
  EVIDENCE: getBoundingClientRect in dev server 2026-10-01. Before @1024: frame 403x302, cards 565/589px. After @1024: frame 144x144, cards 324/324, name 1 line. @1280: frame 144x144, cards 299/299, name 1 line. @375: frame 112x112, cards 284/352, scrollWidth 375 (no h-scroll). All 4 images (iulian-duo.jpg, iulian.jpg, sebi-duo.webp, sebi.webp) complete, natural 640x640 => aspect 1 == frame aspect 1.

- [x] G4: Visual check by screenshot: faces fully visible, both founders at same scale, text not overflowing card
  EVIDENCE: Screenshots @1280 and @375: whole heads + shoulders visible in both frames, no crop of chin/hair; text inside cards. On mobile "Sebastian Răzeșu" wraps to 2 lines (accepted: stacked single column, no overflow).
