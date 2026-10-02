# Plan performanță mobil: topofmind.me (2026-10-02)

## Rezumat

Site-ul live (`main`, versiunea veche) are **91** pe mobil. Problema lui principală (textul din hero ascuns ~3,2 s până la JS) e **deja rezolvată în REact**, iar câștigul ajunge la vizitatori abia la deploy.
În REact fac acum **P1 + P2** (alese de tine), cu Lighthouse după fiecare etapă.
- **P1, viteză și bytes:**
  - Fonturile preîncărcate scad de la 213 KB la ~69 KB.
  - Conținutul nu mai e ascuns până la JS (15 blocuri `Reveal` pe home, caruselul de pe Team).
  - Decorul desktop și buclele invizibile nu mai rulează pe telefon.
  - Cache `immutable` + chunk vendor stabil.
  - Imaginile echipei mai mici, iar pozele de hover nu se mai descarcă pe touch.
- **P2, fluiditate pe mobil:**
  - Navbar solid pe mobil, fără spring de layout.
  - Typewriter fără salt de rând.
  - Animații de width/height trecute pe transform.
  - Fără re-randări inutile.

Efort: ~1–1,5 zile. Tu faci schimbarea de domeniu din Vercel și dai OK-ul pentru deploy.

## Stare (2026-10-02, executat în aceeași zi)

P1 și P2 sunt făcute în `REact`, iar toate oracolele sunt verzi. Rămân deschise doar cele două puncte care țin de tine: deploy-ul și domeniul din Vercel.

**Lighthouse mobil local** (`node .unlazy/perf/lh.mjs`, mediana din 3, `vite preview` cu gzip pe HTTP/1.1, deci mai pesimist decât Vercel):

| Pagină | Baseline | După P1 | După P2 |
|---|---|---|---|
| `/` | 85 · LCP 3,76 s · CLS 0,002 · 455 KB | 92 · 2,86 s · 0 · 262 KB | 92 · 2,86 s · 0 · 262 KB · TBT 33 ms |
| `/ro` | 85 · 3,76 s · 0,003 · 456 KB | 92 · 2,86 s · 0 · 263 KB | 92 · 2,86 s · 0 · 263 KB · TBT 33 ms |
| `/services.html` | 83 · 3,61 s · **0,118** · 440 KB | 95 · 2,56 s · 0 · 248 KB | 95 · 2,56 s · 0 · 248 KB · TBT 8 ms |
| `/team.html` | 87 · 3,68 s · 0,031 · 474 KB | 95 · 2,71 s · 0 · 265 KB | 95 · 2,71 s · 0 · 265 KB · TBT 3 ms |

P2 nu mișcă cifrele de încărcare, pentru că ține de ce se întâmplă după (scroll, re-randări, CPU în repaus). Dovada: pe home, la 375 px, **0 mutații de stil în 3 s de repaus**, sus și la mijlocul paginii (MutationObserver). Înainte, cardurile ascunse din hero rulau bucle JS la fiecare frame. Tot după P2, HTML-ul de pe home a scăzut de la 134 KB la 120 KB (panourile sticky de desktop nu mai sunt prerandate).

**Abateri de la plan (motivate):**
- **Reveal:** nu am folosit `animation-timeline: view()`, pentru că lăsa blocurile de la marginea ecranului semi-transparente până la scroll. Am ales: conținut vizibil în HTML; după hidratare, doar blocurile încă sub fold primesc `data-reveal="wait"` și intră cu o animație CSS (`reveal-in`, 0,6 s, aceleași delay-uri).
- **Acoperire mai largă decât în plan:** `SectionHeading`, `CtaBand`, `FinalCta`, lista din `AgencyProblem` și indiciul din `QuickCheck` își ascundeau și ele textul până la JS și au trecut pe același mecanism.
- **Panourile sticky din Process (home):** au intrat tot în `DesktopOnly` (de la `lg`), iar panourile se dau ca elemente stabile, deci nu se mai re-randează la fiecare pas.
- **Footer:** linkurile sunt `inline-block py-1`, cu listă `space-y-1`. Ritmul vizual e identic, iar zona de tap are 30–38 px.
- **Favicon:** `<link rel="icon" href="data:,">`. Fără niciun link, Chrome ar cere `/favicon.ico`, care ar da tot 404.

**Oracole actualizate (schimbări intenționate):**
- `.unlazy/apply/verify.mjs head`: fără cele 2 fonturi șterse.
- `.unlazy/ro-react/verify.mjs head`: acceptă URL-uri `data:`.
- `.unlazy/ro-react/source-ok.txt`: atributul `sizes`.
- `verify.mjs refresh-en`: rulat după P1 și după P2. Diferențele EN erau doar atribute, fără text.

**Unelte noi în `.unlazy/perf/`:** `lh.mjs` (Lighthouse), `subset.py` (fonturi; originalele sunt în `fonts-orig/`), `images.py` (portrete WebP 640 + 336).

## Context

Live (`www.topofmind.me`) servește `main`: site-ul vechi, doar EN (`/ro` dă 404). `REact` (Vite 8.3 + Rolldown 1.2, React 19, bilingv, prerender + `hydrateRoot`) e site-ul nou, nedeployat.
Sesiunea design-fix a terminat la 09:22: `PageHero` e vizibil în HTML pe toate cele 12 pagini (verificat), iar `dist/` e proaspăt.

## Ce am măsurat (dovezi)

**Live (PSI mobil, Lighthouse 13.5, Slow 4G):**
- Scor 91, FCP 2,0 s, LCP 2,8 s (render delay 3.260 ms), TBT 40 ms, CLS 0, SI 4,7 s.
- `topofmind.me` → **307** → `www`, deși canonical/hreflang/og:url arată spre apex. La deploy, RO ar avea 2 hop-uri: apex→www→`/ro`.
- Tot răspunsul are `max-age=0, must-revalidate`, adică default-ul Vercel. Vite nu setează `immutable`.

**REact (build 09:22 + cod):**

| Problemă | Dovadă |
|---|---|
| Fonturi preîncărcate pe 12 pagini: 213 KB | Inter 175 KB (axe opsz + wght 100–900, glife vietnameze), Space Grotesk 38 KB. Primul ecran mai folosește InstrumentSerif italic (h1) și RedHatMono, nepreîncărcate, care fac reflow la swap. |
| Subset posibil (simulat cu fonttools) | Inter → **28 KB** (wght 400–700, opsz fixat), Space Grotesk → **11 KB** (static 700, toate utilizările sunt bold). Caractere: ASCII, Latin-1, Ă ă Ș ș Ț ț, „ ” “, – —, …, €, →. |
| Conținut ascuns până la JS | `opacity:0` în HTML: home 116 (15 wrappere `Reveal`), services 85, team 57, process 32, how-you-sell 23, contact 17. Pe Team, caruselul fondatorilor (probabil LCP la 375 px) e ascuns ([Founders.jsx:24-30,72,84](src/pages/team/Founders.jsx)). `Reveal` lasă și un `perspective(1000px)` permanent, deci un layer GPU per bloc. |
| Decor `hidden` pe telefon, dar montat și animat | `HeroFloatingCards` ([Hero.jsx:58-79](src/pages/home/Hero.jsx), 4 bucle infinite), `ServicesHeroOrbit`, `ContactHeroChat` (timer infinit cu re-randare), `TeamHeroFounderOrbit` |
| Bucle care nu se opresc off-screen | `CompetitorTeardownPanel.jsx:68-69` (de 2 ori pe home), `HowWeWork.jsx:137` (`setInterval` la 2,4 s). `AnimatedBeam.jsx:37` re-randează la fiecare `resize` (bara de adresă de pe mobil). |
| JS | Chunk comun de 111 KB br pe fiecare pagină (react ~69 KB gz, framer-motion ~45 KB gz, tailwind-merge ~8 KB gz). Hash-ul se schimbă la orice edit de componentă. |
| Imagini | Pe home, 4 poze de 640 px afișate la 112 px. Poza color (doar hover) se descarcă și pe touch (85 KB). `iulian*.jpg` sunt 68+41 KB, față de `sebi*.webp` 16,5+13,6 KB. |
| Navbar mobil | [Navbar.jsx:62-81](src/components/layout/Navbar.jsx): spring pe width/padding/borderRadius/boxShadow + `backdrop-blur-md` la scroll > 80 px. Fără `initial`, deci padding 0→4 px la hidratare. |
| Alte costuri de layout | Typewriter: re-randează tot panoul la 18–42 ms și sare pe 2 rânduri la 375 px (`BuyerResearchPanel.jsx:7-30,66-74`). Animații pe width/height: `FirstMonth.jsx:21,55`, `SplitTestVisual.jsx:63`, `CreativeFatigueVisual.jsx:103`, `Modes.jsx:133`, `FinalCta.jsx:12-46` (sub blur mare). Panourile din Process sunt montate de 2 ori (`Process.jsx:75,83`). `DayOnePreview.jsx:12-20` are `isMobile` după hidratare (salt de scale) + listener de resize. Pe How-you-sell, toată pagina se re-randează la schimbarea secțiunii (`HowYouSellPage.jsx:15`). |
| 404 la fiecare pagină | `favicon.svg` și `apple-touch-icon.png` nu există |
| Emulare 375 px (8 pagini) | 0 overflow, 0 erori. Linkurile din footer au 19 px. |

**Deja bine:** hero home și PageHero sunt vizibile din primul frame. ArcGlobe pornește WebGL doar aproape de viewport. Iconițele (56) sunt tree-shaken. Există regula CSS de reduced-motion și `MotionConfig reducedMotion="user"`. Fără scripturi terțe.

## Decizii

- **Hero:** fade CSS scurt. Corecție: REact nu mai are animație pe textul din hero, iar fade-ul o readuce din CSS, fără JS și cu cost LCP ~0.
- **Măsurare:** Lighthouse local (`npx lighthouse`, descărcat o dată din npm, nu intră în `package.json`).
- **Scop:** P1 + P2. **Navbar:** fundal solid doar pe mobil, desktopul neschimbat. **Favicon:** scot link-urile.

## Pași

### 0. Pregătire
- [x] `git status` + `list_sessions`. Dacă altă sesiune editează `src/`, lucrez în copie și fac merge 3-way (memoria `parallel-sessions`; build-urile scriu în `dist/` comun).
- [x] Copiez planul în proiect: `.claude/plans/performanta-mobil-2026-10-02.md`.
- [x] `node .unlazy/apply/verify.mjs snapshot`: baseline-ul de markup e din 1 oct 11:18, înainte de design-fix. Îl regenerez ca diff-urile să arate doar schimbările mele.
- [x] **Baseline Lighthouse:** `npm run build` → `npm run preview` (4173) → `npx lighthouse http://127.0.0.1:4173<path> --only-categories=performance --output=json --chrome-flags="--headless=new"`, 3 rulări pe pagină, mediana. Pagini: `/`, `/ro`, `/services.html`, `/team.html`. JSON-urile în scratchpad, tabelul în planul din proiect.

### P1. Viteză și bytes

**1. Fonturi**
- [x] `.unlazy/perf/subset.py` (fonttools, `PYTHONUTF8=1`): subset cu setul de caractere de mai sus pe 4 fișiere.
  - Inter: + `wght 400–700`, `opsz` fixat la 14.
  - Space Grotesk: static 700.
  - InstrumentSerif italic și RedHatMono 400: doar subset.
  - Păstrez aceleași nume de fișier. Originalele merg în `.unlazy/perf/fonts-orig/`.
- [x] [index.css:103-108](src/index.css): Inter `400 700`, Space Grotesk `700`. Șterg regulile și fișierele fără utilizare (`instrumentserif-400.woff2`, `redhatmono-700.woff2`), după un `grep` de confirmare.
- [x] Shell-urile (12, EN+RO, liniile 24-25): preload pentru 4 fonturi (Inter, Space Grotesk, serif italic, mono).
- Total preîncărcat: 213 KB → ~69 KB, iar fonturile primului ecran sosesc devreme.

**2. Conținut vizibil fără JS**
- [x] [Reveal.jsx](src/components/effects/Reveal.jsx): element simplu + clasă. În [index.css](src/index.css):
  - `@supports (animation-timeline: view())`: keyframes `fade-up`/`fade-left`/`zoom-in`, cu `animation-range` pentru `delay`, sub `prefers-reduced-motion: no-preference`.
  - Fără suport: static și vizibil.
  - Dispar framer-ul și `perspective` din Reveal.
- [x] Team: în [Founders.jsx](src/pages/team/Founders.jsx), cardurile primesc `initial={false}`, iar bio-ul și cuvintele intră în `<AnimatePresence initial={false}>`. Primul render e vizibil, schimbările de carusel rămân animate. Scot `Reveal` de pe carusel ([TeamPage.jsx:37](src/pages/team/TeamPage.jsx)).
- [x] Hero home: fade CSS 0,5 s pe pill, h1, subtitlu și CTA (același keyframe, pornește la primul paint).

**3. Ce nu se vede nu rulează pe telefon**
- [x] `src/components/effects/DesktopOnly.jsx` (nou, ~12 rânduri): `matchMedia(min-width)` în `useEffect`, `null` la SSR. Îl pun în jurul `HeroFloatingCards` (1400), `ServicesHeroOrbit` (1400), `ContactHeroChat` (1400) și `TeamHeroFounderOrbit` (1680). E decor absolut poziționat, deci fără CLS.
- [x] Bucla din `CompetitorTeardownPanel` și timer-ul din `HowWeWork` pornesc doar în viewport, prin gate-ul existent `useInViewCycle` / `useInView`.
- [x] `AnimatedBeam`: scot listenerul `resize` (ResizeObserver-ul ajunge) și nu mai fac `setState` dacă măsurătorile nu s-au schimbat.

**4. Cache, chunk, domeniu**
- [x] `vercel.json` `headers`:
  - `/assets/(.*)-[A-Za-z0-9_-]{8}\.(js|css)` → `public, max-age=31536000, immutable`.
  - `/assets/(fonts|img)/(.*)` → `public, max-age=86400, stale-while-revalidate=604800` (fișiere fără hash, deci nu le îngheț).
- [x] [vite.config.js](vite.config.js): `rollupOptions.output.codeSplitting.groups` cu grupul `vendor` (`react`, `react-dom`, `scheduler`, `framer-motion`, `motion-*`, `tailwind-merge`). Hash-ul vendor rămâne stabil la editări de conținut.
- [ ] **Tu, în Vercel → Settings → Domains:** `topofmind.me` devine principal, `www` face redirect spre apex.

**5. Imagini**
- [x] [home/Team.jsx:62-76](src/pages/home/Team.jsx): poza color de hover primește `hidden [@media(hover:hover)]:block` (un lazy `display:none` nu se descarcă). Plus `width`/`height`/`decoding="async"`.
- [x] Pillow:
  - `iulian.jpg` și `iulian-duo.jpg` → WebP.
  - Variante `*-336.webp` pentru cardurile de pe home.
  - Referințele în [site.js:18-19,36-37](src/data/site.js).
- [x] `width`/`height` pe toate `<img>` din team (6 lipsă).

**6. Favicon:** scot `apple-touch-icon` și înlocuiesc `<link rel="icon">` cu `href="data:,"` în cele 12 shell-uri. Fără asta, Chrome cere `/favicon.ico`, care ar da tot 404.

### P2. Fluiditate pe mobil

- [x] **7. Navbar** ([Navbar.jsx:62-81](src/components/layout/Navbar.jsx)):
  - `initial={false}` pe ambele corpuri.
  - Mobil: `bg-ink-900/95` solid, fără `backdrop-blur`, animez doar `y` + umbra; scot spring-ul de width/padding/borderRadius.
  - Desktopul rămâne neschimbat.
  - Oracolul `interactions.mjs:98-105` detectează starea prin clasa `backdrop-blur-md`, deci îl mut pe un `data-scrolled`.
- [x] **8. Typewriter** (`BuyerResearchPanel.jsx`): textul tastat intră într-o componentă copil (re-randez doar span-ul), cu `whitespace-nowrap truncate`. Păstrez structura de span-uri cerută de `interactions.mjs:108` sau actualizez oracolul.
- [x] **9. Animații de layout → transform:**
  - `FirstMonth.jsx:21,55`: height → `scaleY` (origin-top).
  - `SplitTestVisual.jsx:63`, `CreativeFatigueVisual.jsx:103`, `Modes.jsx:133` și lampa din `FinalCta.jsx:12-46`: width → `scaleX`.
- [x] **10. Re-randări:**
  - Home `Process.jsx:75,83`: un singur set de panouri, sau `memo`.
  - `HowYouSellModeDetail`: `memo`.
  - `DayOnePreview.jsx:12-20`: scot starea `isMobile` și listenerul de resize; scale-ul îl face CSS responsive.
- [x] **11.** `AnimatedBeam` (gradient) și picăturile din `FunnelLeakVisual` respectă `useReducedMotion()`.
- [x] **12.** Linkurile din footer, la ≥ 24 px înălțime.

### După P1+P2
- [ ] Merge `REact` → `main` **doar cu OK-ul tău explicit**. Apoi PSI web pe `/` și `/ro` (mobil) și `curl -I` pe un JS cu hash (`immutable`).
- [x] Callout: `todo_add` pentru fiecare item MUST/SHOULD de mai jos și `save_review_findings` (intrarea din `history.json` e deja creată).
- [ ] Neincluse acum, doar cu măsurătoare: LazyMotion/Suspense la hidratare, `cn` fără tailwind-merge, CSS inline, fallback-uri `size-adjust`.

## Verificare

- **Lighthouse mobil (mediana din 3), după P1 și după P2, pe `/`, `/ro`, `/services.html`, `/team.html`:**
  - Scor ≥ 95, LCP ≤ 2,0 s, TBT ≤ 150 ms, CLS ≤ 0,05, SI ≤ 3,0 s.
  - Bytes pe home cu ≥ 170 KB mai puțin decât la baseline.
- **`dist/*.html`:**
  - 0 `opacity:0` pe wrapperele Reveal și pe caruselul Team.
  - Decorul desktop absent.
  - Toate `<img>` cu `width`.
  - 4 preload-uri de font, 0 link-uri spre favicon/apple-touch-icon.
- **Oracole existente:**
  - `node .unlazy/ro-react/source.mjs`.
  - `node .unlazy/ro-react/verify.mjs build|ro|head|links`.
  - `PYTHONUTF8=1 python .unlazy/ro-react/fontcheck.py` (diacriticele după subset).
  - `node .unlazy/design-fix/check-dist.mjs` (h1 vizibil).
  - `node .unlazy/apply/verify.mjs markup`: diff doar la Reveal, Team, hero și decor, apoi snapshot nou.
  - `node .unlazy/apply/interactions.mjs`: efectele încă merg.
  - `node .unlazy/ro-react/browser.mjs`: 12 pagini × 1280/375, hidratare, switch, header, overflow.
- **Browser integrat, 375 px și 1440 px:**
  - Screenshot hero home/services/team, EN+RO.
  - 0 erori în consolă.
  - Pe mobil, decorul nu e montat; pe desktop apare.
  - Navbar solid pe mobil, cu blur pe desktop.

## Review Callout (focus: performanță mobil; perspective CTO, produs, client)

```
MUST FIX:   3   SHOULD FIX: 6   GOOD: 5
Cel mai important: conținutul ascuns până la JS + 213 KB de fonturi preîncărcate, ambele în P1.
```

**CTO**
- **MUST:** conținut ascuns până la hidratare (116 `opacity:0` pe home, carusel Team). Fix: CSS reveal + `initial={false}`.
- **MUST:** 213 KB de fonturi preîncărcate (Inter cu opsz + vietnameză). Fix: subset la ~69 KB.
- **SHOULD:** decor invizibil + bucle/timere pe mobil. Fix: `DesktopOnly` + gate-uri de vizibilitate.
- **SHOULD:** fără cache headers, iar hash-ul vendor se schimbă la orice edit. Fix: `immutable` + grup vendor.
- **SHOULD:** animații pe proprietăți de layout (navbar spring + blur, bare width/height, lampa FinalCta). Fix: transform.
- **GOOD:** `hydrateRoot` + prerender EN/RO; ArcGlobe lazy; iconițe tree-shaken; reduced-motion respectat; zero scripturi terțe.

**Produs**
- **MUST:** REact nu e live, deci vizitatorii văd site-ul vechi (LCP întârziat 3,2 s, fără `/ro`). Munca de performanță contează abia după deploy; deploy-ul trebuie planificat imediat după P1+P2.
- **SHOULD:** redirect 307 apex→www contrar canonical (2 hop-uri pentru RO). Fix: setarea de domeniu din Vercel (2 minute, tu).
- **GOOD:** viteza e argument de vânzare pentru un studio care face site-uri (clienții pot rula PSI), iar 95+ pe mobil e o dovadă concretă.

**Client** (proprietar de firmă din Cluj, Android mediu, link din WhatsApp/email, citește RO)
- **SHOULD:** pe 4G slab, la scroll vede secțiuni goale până se încarcă JS-ul și pare stricat. Rezolvat în P1.
- **SHOULD:** header-ul sacadat la scroll pe telefoane ieftine (blur + spring). Rezolvat în P2.
- **SHOULD:** textul typewriter sare pe două rânduri la 375 px. Rezolvat în P2.
- **GOOD:** fără scroll lateral, fără erori, RO identic cu EN în layout, iar CTA-ul RO încape pe un rând (fix design-fix).

**Față de review-urile anterioare:** regula geo din `vercel.json` (10-01) și overflow-ul RO (10-01) sunt rezolvate. Secțiunea de dovezi/case study (09-29) e încă deschisă, dar e în afara acestui focus.

## Întrebări deschise

- Când intră REact în producție? Până atunci vizitatorii văd site-ul vechi (91).
- Clarity după deploy (comportament real pe telefon)? Ar adăuga un script async extern, deci decizie separată.
