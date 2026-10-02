# Audit de coerență vizuală — Top of Mind (2026-10-01)

Scop: ce nu se potrivește cu restul site-ului, pentru a fi modificat ulterior. Doar constatări, nicio modificare în cod.

Metodă: cadrul `design-critique` (impresie, ierarhie, consecvență, accesibilitate), aplicat pe cele 6 pagini EN și pe variantele RO. Am folosit trei surse:

1. **Browser.** Am parcurs fiecare pagină pe desktop (1280px) și pe mobil (375px), cu capturi la fiecare ecran. Am măsurat stilurile calculate (dimensiuni de titluri, butoane, radius-uri, padding-uri) și am verificat overflow-ul și țintele de atingere.
2. **Inventar de token-uri.** Scriptul `.unlazy/design-audit/inventory.mjs` numără clasele din 79 de fișiere din `src/`, după refactorul „code-cut” (fișierele moarte au fost șterse).
3. **HTML prerandat.** Am citit `dist/` pentru starea paginii înainte de JavaScript.

Codul e indicat prin fișier și un fragment exact de clasă (→), nu prin număr de linie, pentru că refactorul Prettier în curs mută liniile.

Severitate: **Critic** = se vede imediat sau afectează încărcarea. **Mediu** = inconsecvență vizibilă între pagini. **Minor** = detaliu sau datorie de întreținere.

## Impresie generală

Site-ul are o identitate clară și în mare parte respectată:

- **Titluri:** Space Grotesk bold, urmat de un accent serif italic (Instrument Serif).
- **Etichete:** monospace mov deasupra titlurilor.
- **Culori:** fundal închis, cu alternanță de secțiuni deschise (`theme-light`), și un singur accent mov.

Cea mai mare oportunitate nu e stilul, ci **sistemul**. Radius-urile, mărimile de text, padding-urile secțiunilor și opacitățile bordurilor sunt alese local, componentă cu componentă, în loc să vină dintr-o scală comună. De aceea paginile seamănă, dar nu sunt identice, iar diferențele se văd mai ales la trecerea de la Home la paginile interioare.

## Inventar

Valori măsurate de `inventory.mjs`, recalculate de gate-ul G2:

| Familie | Valori distincte | Comentariu |
|---|---|---|
| `files` | 79 | fișiere `src/**/*.{js,jsx}` analizate |
| `radius` | 19 | clase `rounded-*` distincte |
| `radius-arbitrar` | 11 | dintre care valori arbitrare (`rounded-[1.6rem]`, `rounded-[30px]`…) |
| `rounded-full` | 60 | apariții rămase: cercuri, puncte, bare (pastilele au fost convertite) |
| `textSize` | 32 | mărimi de text distincte |
| `textSize-arbitrar` | 21 | dintre care arbitrare (`text-[12.5px]`, `text-[2.6rem]`…) |
| `hexColor` | 50 | culori hex scrise direct, în afara token-urilor |
| `border` | 16 | nuanțe de bordură (`border-white/[0.07]`, `/10`, `/15`…) |
| `shadow` | 14 | umbre distincte, toate custom |

Măsurători din browser la 1280px:

| Ce | Home | Pagini interioare |
|---|---|---|
| Titlu principal (h1) | 83,2px, centrat | 86,4px, aliniat stânga |
| Padding vertical secțiuni | 112px | 96px (How you sell: și 80px) |
| Buton principal / secundar (lg) | 59px / 61px | 59px / 61px |
| Radius card-uri întâlnite | 12 · 16 · 19,2 · 25,6 · 28,8px | 12 · 16 · 19,2 · 24 · 25,6 · 30 · 32px |
| Navbar | 20px | 20px |

## Transversal (toate paginile)

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| T1 | Pe paginile interioare, H1-ul e în HTML-ul prerandat cu `opacity:0` și apare doar după hidratarea React. Pe Home, titlul e vizibil din primul cadru, intenționat (LCP). Paginile interioare „clipesc” la încărcare, iar fără JS, sau pentru crawlere cu capturi, hero-ul e gol. | `src/components/sections/PageHero.jsx` → `initial={{ opacity: 0, y: 22 }}`; regula opusă pe Home: `src/pages/home/Hero.jsx` → `Headline, copy and CTA render visible from the first frame` | Critic | Același tratament ca Home: H1 și subtitlu vizibile din primul cadru, animând doar decorul. |
| T2 | Hero-ul de pe Home e mai mic (83,2px) decât al paginilor interioare (86,4px), deci ierarhia e inversată. Mai e și centrat, pe când celelalte sunt aliniate la stânga. | `src/pages/home/Hero.jsx` → `lg:text-[5.2rem]`; `src/components/sections/PageHero.jsx` → `lg:text-[5.4rem]` | Mediu | O singură mărime de H1 (Home egal sau mai mare). Alinierea diferită pe Home poate rămâne, ca excepție asumată. |
| T3 | Ritmul vertical diferă: secțiunile de pe Home au 112px sus/jos, cele interioare 96px, iar „Ten-second check” are 80px. | `src/pages/home/Team.jsx` → `py-20 md:py-28`; `src/components/sections/CtaBand.jsx` → `py-16 md:py-24`; `src/pages/how-you-sell/HowYouSellPage.jsx` → `theme-light relative py-16 md:py-20` | Mediu | O singură scală de padding de secțiune (de ex. `py-16 md:py-24` peste tot), definită o dată ca utilitar. |
| T4 | Card-urile au 8 radius-uri diferite (12, 16, 19,2, 24, 25,6, 28,8, 30, 32px), iar navbar-ul are 20px. Card-urile vecine din pagini diferite au colțuri vizibil diferite. | `src/components/ui/FramedCard.jsx` → `rounded-[1.6rem]` și `rounded-[1.2rem]`; `src/pages/home/Team.jsx` → `rounded-[1.8rem]`; `src/pages/home/HowWeWork.jsx` → `rounded-[1.4rem]`; `src/components/sections/CtaBand.jsx` → `rounded-[2rem]`; `src/pages/process/DayOnePreview.jsx` → `rounded-[30px]`; `src/pages/team/Founders.jsx` → `rounded-3xl`; `src/components/layout/Navbar.jsx` → `rounded-[20px]` | Mediu | Scală aliniată la navbar: card mare 20px, interior de card 12px, butoane 12px, chip-uri 8px. Ca token-uri `--radius-*` în `@theme`. |
| T5 | Butoanele puse în pereche au înălțimi diferite: principalul 59px, secundarul 61px, pentru că doar secundarul are bordură de 1px. Se vede în hero și în fiecare bandă CTA. | `src/components/ui/Button.jsx` → `rounded-xl border border-white/15 font-sans` | Mediu | `border border-transparent` pe butonul principal: aceeași înălțime, fără alte schimbări. |
| T6 | Culoarea de hover a accentului e scrisă direct ca hex. Butonul „Open Calendly” de pe Contact reimplementează de mână butonul principal, fără săgeată, efect magnetic și sweep. | `src/components/ui/Button.jsx` → `hover:bg-[#6660f6]`; `src/pages/contact/ContactPage.jsx` → `group-hover:bg-[#6660f6]` | Minor | Token `--color-accent-450` (sau `accent-500/90`) și refolosirea stilului `PrimaryButton` pe Contact. |
| T7 | Tipografia nu are o scală: 32 de mărimi distincte, dintre care 21 arbitrare. Etichetele mici sar între 10, 10,5, 11, 12, 12,5 și 13px, iar titlurile de secțiune între 2,4rem, 2,6rem și 1,9rem. | `src/pages/home/Hero.jsx` → `text-[12.5px]`; `src/components/ui/Chip.jsx` → `text-[10.5px]`; `src/pages/home/AgencyProblem.jsx` → `text-[2.6rem]` și `text-[1.9rem]`; `src/components/ui/SectionHeading.jsx` → `text-[2.4rem]` | Mediu | Scală fixă: 11 · 13 · 15 · 18 · 24 · 36 · 48 · 60 · 72px. Fiecare valoare arbitrară se mută pe treapta cea mai apropiată. |
| T8 | Etichetele de deasupra titlurilor nu sunt toate la fel: componenta `Eyebrow` are 13px și `accent-400`, dar pe Home apar și variante de 12,5px cu `accent-300`. | `src/components/ui/SectionHeading.jsx` → `text-[13px] tracking-[0.01em] text-accent-400`; `src/pages/home/HowYouSell.jsx` → `text-[12.5px] text-accent-300` | Minor | Toate etichetele prin componenta `Eyebrow`. |
| T9 | Titlurile benzilor CTA au mărimi diferite: Home ajunge la 72px, CTA-urile paginilor interioare la 60px. | `src/pages/home/FinalCta.jsx` → `font-display text-5xl font-bold tracking-[-0.02em] text-white md:text-7xl`; `src/components/sections/CtaBand.jsx` → `md:text-6xl` | Minor | O singură mărime pentru titlul CTA final. |
| T10 | Bordurile folosesc 16 opacități (0,04 până la 0,40), cu diferențe greu de văzut, de exemplu 0,07 față de 0,08. | `src/components/ui/FramedCard.jsx` → `border-white/[0.07]`; `src/pages/home/Team.jsx` → `border-white/[0.08]` | Minor | Trei niveluri: discret (0,06), normal (0,10), accentuat (0,20). |
| T11 | Umbrele sunt 14 valori custom, scrise direct în componente. | `src/components/ui/Panel.jsx` → `shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`; `src/pages/process/DayOnePreview.jsx` → `shadow-2xl` | Minor | Două sau trei umbre ca token: card, element ridicat, mockup. |
| T12 | Sunt 50 de culori hex în afara token-urilor, mai ales gri-uri în mockup-urile închise la culoare. Acolo arată corect, dar nu urmează tema și sunt greu de întreținut. | `src/pages/home/HowWeWork.jsx` → `["#666", "#555", "#777", "#4a4a4a"]`; `src/components/ui/Panel.jsx` → `#17171b_0%,#121215_100%` | Minor | Gri-urile se mapează pe `ink-*` / `neutral-*` existente. |
| T13 | Un singur titlu folosește `tracking-tight`; restul site-ului folosește `tracking-[-0.02em]`. | `src/pages/team/Founders.jsx` → `tracking-tight` | Minor | `tracking-[-0.02em]`. |
| T14 | RO pe mobil: butonul „Programează un apel gratuit de 30 de minute” se rupe pe 2 rânduri (81px față de 59px) pe toate cele 6 pagini RO, iar butonul de lângă el are 83px. | `src/components/sections/CtaBand.jsx` → `Programează un apel gratuit de 30 de minute` | Mediu | Etichetă RO mai scurtă („Apel gratuit de 30 de minute”, deja folosită în hero-ul RO), stabilită cu sesiunea de copy RO. |
| T15 | Ținte de atingere sub 24px: linkurile-săgeată au 22px înălțime, iar butoanele EN/RO 26px. Sunt sub recomandarea de 44px, iar linkurile-săgeată și sub minimul WCAG 2.2 de 24px. | `src/pages/home/shared.jsx` → `export function ArrowTextLink`; `src/components/layout/LangSwitch.jsx` → `rounded-md px-2.5 py-1 text-neutral-400` | Minor | Padding vertical, de exemplu `py-2`, pe linkurile-săgeată și pe butoanele de limbă. |
| T16 | Aceleași titluri apar pe mai multe pagini: hero-ul Team repetă titlul secțiunii Team de pe Home, iar hero-ul Contact repetă CTA-ul final de pe Home („Tell us what you sell.”). Pentru cine navighează, paginile par copiate una din alta. | `src/pages/team/TeamPage.jsx` → `No account managers. `; `src/pages/contact/ContactPage.jsx` → `Tell us ` | Minor | Titlu propriu pentru fiecare hero; pe Home, varianta scurtă rămâne teaser. |

## Home

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| H1 | Două secțiuni deschise la rând („How we work” și „Team”), despărțite doar de o linie. Peste tot în rest, secțiunile alternează închis/deschis. | `src/pages/home/HowWeWork.jsx` → `<section className="theme-light relative py-20 md:py-28">`; `src/pages/home/Team.jsx` → `theme-light relative border-t border-white/[0.06]` | Mediu | Una dintre ele trece pe închis, sau între ele intră o secțiune închisă. |
| H2 | Hero-ul de pe Home e singurul centrat. Celelalte pagini au hero aliniat la stânga (vezi T2). | `src/pages/home/Hero.jsx` → `flex flex-col items-center text-center` | Minor | Rămâne așa dacă e excepție asumată pentru Home; altfel se aliniază. |
| H3 | Card-urile echipei au radius 28,8px, unic pe site. | `src/pages/home/Team.jsx` → `rounded-[1.8rem]` | Minor | Radius-ul de card din scala comună (T4). |

## Services

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| S1 | Pagina are două hero-uri unul după altul: hero-ul standard, aliniat la stânga, apoi o secțiune animată la scroll, centrată, cu titlu de 72px, care ocupă 1,7 ecrane pe mobil și 2,3 pe desktop. Nicio altă pagină nu are o asemenea introducere dublă. | `src/pages/services/AlignedChannels.jsx` → `relative h-[170vh] w-full overflow-clip pt-28 md:h-[230vh] md:pt-40` | Mediu | Secțiunea animată devine hero-ul paginii, sau scade la cel mult un ecran. |
| S2 | Titlurile fiecărei discipline au 48px, cu iconiță în casetă. Sunt singurele H2 cu iconiță și sub mărimea standard de 60px a titlurilor de secțiune. | `src/pages/services/Discipline.jsx` → `font-display text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl` | Minor | Rămân ca subtitluri, cu o treaptă dedicată în scala tipografică (T7). |
| S3 | Pe mobil pagina are 11.780px, cea mai lungă de pe site (Home are 9.049px pe desktop): fiecare disciplină repetă text, 3 card-uri și o vizualizare. | `src/pages/services/Discipline.jsx` → `font-display text-4xl` | Minor | Pe mobil, card-urile disciplinei pot trece într-un carusel orizontal sau într-o listă compactă. |

## Process

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| P1 | Previzualizarea „Your first month” are cadru de dispozitiv: radius 30px, bordură de 4px și `shadow-2xl` (singura umbră Tailwind standard de pe site). Celelalte mockup-uri folosesc `FramedCard` sau `Panel`. | `src/pages/process/DayOnePreview.jsx` → `rounded-[30px] border-4 border-[#212125]` | Minor | Cadrul `FramedCard` sau token-ul de umbră pentru mockup (T11). |
| P2 | Hero-ul (H1) e invizibil până se încarcă JavaScript-ul (vezi T1). | `src/components/sections/PageHero.jsx` → `initial={{ opacity: 0, y: 22 }}` | Critic | Vezi T1. |

## How you sell

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| Y1 | Secțiunea „Ten-second check” are padding de 80px, unic pe site. Titlul ei nu are accentul serif italic, deși toate celelalte titluri de secțiune îl au. | `src/pages/how-you-sell/HowYouSellPage.jsx` → `theme-light relative py-16 md:py-20`; `src/pages/how-you-sell/QuickCheck.jsx` → `font-display text-2xl font-bold tracking-[-0.01em] text-white` | Mediu | Padding standard (T3) și un cuvânt în serif italic în titlu. |
| Y2 | Eticheta raportului din fiecare mod are 2rem, mărime arbitrară unică. | `src/pages/how-you-sell/Modes.jsx` → `em-serif mt-3 text-[2rem]` | Minor | Treapta de 36px din scală (T7). |

## Team

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| M1 | Titlurile de secțiune de aici sunt centrate („Two specialists. One point of contact: you.”), pe Home sunt aliniate la stânga. | `src/pages/team/TeamPage.jsx` → `align="center"` | Minor | O regulă: titluri de secțiune la stânga, centrate doar în benzile CTA. |
| M2 | Card-ul din caruselul fondatorilor are radius 24px și `tracking-tight`, ambele unice (T4, T13). | `src/pages/team/Founders.jsx` → `rounded-3xl` | Minor | Valorile din scala comună. |
| M3 | Hero-ul repetă titlul de pe Home (T16). | `src/pages/team/TeamPage.jsx` → `No account managers. ` | Minor | Vezi T16. |

## Contact

| ID | Ce nu se potrivește | Unde (cod) | Severitate | Recomandare |
|---|---|---|---|---|
| C1 | Butonul „Open Calendly” e scris de mână: e mai mic decât CTA-urile `lg` de pe celelalte pagini și nu are săgeată, efect magnetic și sweep. | `src/pages/contact/ContactPage.jsx` → `relative mt-8 inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-xl bg-accent-500` | Mediu | Același aspect ca `PrimaryButton`, prin clase sau stil comune. |
| C2 | Bula WhatsApp folosește verde (`emerald`), singura culoare din afara paletei de pe site. | `src/pages/contact/Hero.jsx` → `bg-[#1f3b2c] text-emerald-300` | Minor | Decizie de brand: verdele WhatsApp poate rămâne, intenționat, sau trece pe accent mov. |
| C3 | Hero-ul repetă CTA-ul final de pe Home (T16). | `src/pages/contact/ContactPage.jsx` → `Tell us ` | Minor | Vezi T16. |

## Ce funcționează bine

- **Titluri:** combinația Space Grotesk bold + Instrument Serif italic e aplicată consecvent în aproape toate titlurile și dă site-ului o voce recognoscibilă.
- **Alternanța de teme:** `theme-light` / închis, făcută prin variabile CSS, păstrează aceleași componente în ambele teme, iar mockup-urile închise din secțiunile deschise arată intenționat, ca niște dispozitive.
- **Butoane și chip-uri:** după alinierea la navbar, butoanele, chip-urile și selectorul de limbă au aceeași familie de colțuri rotunjite.
- **Mobil:** niciun overflow orizontal pe nicio pagină EN sau RO la 375px.

## Priorități (ordinea recomandată)

1. **T1 / P2:** H1 vizibil din primul cadru pe paginile interioare. Afectează încărcarea percepută și SEO, iar schimbarea e mică (doar `PageHero`).
2. **T4 + T3 + T7:** scale comune pentru radius, padding de secțiune și mărimi de text, ca token-uri în `src/index.css`, aplicate apoi componentă cu componentă. Asta rezolvă cele mai multe constatări Minor deodată.
3. **T5, C1, T14:** butoane identice peste tot: aceeași înălțime în pereche, același buton pe Contact, etichetă RO care nu se rupe pe mobil.
4. **H1, S1, Y1:** ritmul paginilor: alternanța închis/deschis pe Home, introducerea dublă de pe Services, secțiunea atipică de pe How you sell.

## Întrebări deschise

- Hero-ul centrat de pe Home rămâne excepție, sau toate paginile trec pe același aliniament?
- Card-urile mari iau radius-ul navbar-ului (20px), sau navbar-ul se aliniază la card-uri (24px)?
- Verdele WhatsApp de pe Contact rămâne (recunoaștere de brand), sau trece pe accentul mov?
- Titlurile repetate (Team, Contact) se rescriu acum, sau după studiul de caz?

## Coordonare

Sesiunea „code-cut” a terminat refactorul pe `src/` (Prettier, ștergerea fișierelor moarte, eliminarea fonturilor Bricolage/WorkSans, `src/data/buyingModes.js` și `src/data/disciplines.js` noi). Detalii în `.claude/plans/audit-cod-2026-10-01.md`. Raportul a fost reverificat după refactor: toate fragmentele de clasă există încă, iar inventarul a fost recalculat. `src/` e liber pentru modificările de mai sus. Gate-ul G1 (`.unlazy/design-audit/check-report.mjs`) verifică din nou că fiecare fragment există în fișierul indicat.
