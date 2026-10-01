# Maintaining the Romanian site (read this first)

- English is at `/`, Romanian at `/ro/` (same file names). Both come from the same components. The language is `<html lang>` of the
  shell (`ro/*.html` say `ro`), read in `src/lib/mount.jsx`; the build prerenders both (`scripts/prerender.mjs`).
- Copy is `t("English", "Română")` next to the markup (`src/i18n/index.jsx`). Change an English string => change its Romanian twin in
  the same edit. Data outside components: `L(en, ro)` plus `t(pair)`. Internal links: `link("services.html")`.
- New page: add it to `src/entry-server.jsx`, the `pages` list in `vite.config.js`, an entry `src/entries/<p>.jsx` and
  `src/entries/ro-<p>.jsx`, a shell `<p>.html` and `ro/<p>.html` (RO title, description, canonical, hreflang), `NAV_ITEMS` in
  `src/data/site.js` if it is in the menu; then run the checks below.
- Geo: `vercel.json` sends `/` to `/ro` when Vercel's `x-vercel-ip-country` header is RO. Only `/`, never deep links. The English home
  is linked as `/index.html` (never `/`) so the language switch cannot bounce a Romanian visitor back.
- Checks, after `node .unlazy/ro-react/verify.mjs build`: `verify.mjs ro|head|links|switch|geo|fonts`, `source.mjs`, `browser.mjs`
  (headless Chrome). Fast loop while translating: `verify.mjs page <id>`. `verify.mjs en` and `deps` compare with the render from
  before the Romanian work, so they are point-in-time: regenerate `ref/en` after an intentional English change.

# Brief for the Romanian translation leaves

Project: Vite + React 19 site (copy at `C:\Users\Administrator\AppData\Local\Temp\tom-ro`, work ONLY there). English is the default
and lives at `/`; Romanian lives at `/ro/` (same file names). Both are prerendered from the same components. Your job: make every
visible string in the files you own bilingual, so the Romanian page reads like a native wrote it and the English page stays
**byte-identical** to what it renders today.

## API (already built, in `src/i18n/index.jsx`)

```jsx
import { L, useT, useLink } from "../../i18n";   // adjust the ../ depth
const t = useT();            // inside a component or custom hook
t("English", "Română")       // returns one of the two; either side may be JSX
t(<>We research <b>you</b></>, <>Te cercetăm pe <b>tine</b></>)
L("English", "Română")       // a pair, for data defined OUTSIDE components
t(pair)                      // resolves a pair from L(); t("plain") returns the string unchanged
const link = useLink();      // link("services.html") -> "services.html" on EN, "/ro/services.html" on RO
```

Rules for every file you own:

1. **Same markup.** Do not change `className`, element structure, props, animation values or logic. English output must stay
   byte-identical (the oracle checks it). Only strings change: JSX text, string props (`title`, `subtitle`, `eyebrow`, `label`,
   `alt`, `aria-label`, `placeholder`), strings inside arrays/objects that end up on screen, strings inside SVG `<text>`.
2. **Co-locate.** The RO text sits right next to the EN text. No new files, no new dependencies.
3. **Module-level data** (arrays/objects outside components): use `L(en, ro)` for each visible string and `t(item.field)` where it
   renders; or move the array inside the component after `const t = useT()`. Keys must stay unique and language-neutral:
   `key={item.q.en}`, not the translated string.
4. **Hooks:** `useT()` / `useLink()` are hooks. Call them at the top of a component, never inside loops or callbacks. A tiny helper
   component that renders text needs its own `const t = useT()`.
5. **Internal links** (`href="how-you-sell.html"`, `href: "contact.html"`): wrap with `link(...)`. Exception: `CtaBand`'s
   `secondary.href` is wrapped inside `CtaBand` already (do not wrap it again; wrapping twice is harmless but pointless). External
   links, `mailto:`, `#anchors` and `CALENDLY_URL`/`WHATSAPP_URL` stay untouched.
6. **Images and assets** are root-absolute already (`/assets/img/...`). Never write a relative asset path.
7. **Strings consumed by code** need both sides to work: `ScrollRevealText text=... accentFrom=...` splits on spaces and finds
   `accentFrom` inside `text`: the RO `accentFrom` must be a word-boundary substring of the RO `text`. `FounderCarousel` splits `bio`
   into words. Check the oracle's `words:classes` message if an accent disappears.
8. **Non-visible strings stay as they are**: class names, ids, keys, event names, URLs, CSS values, `data-*`, SVG paths.
9. **Shared data:** `founders` / `NAV_ITEMS` in `src/data/site.js` and the layout (`Navbar`, `Footer`, `SiteLayout`, `CtaBand`,
   `Logo`, `LangSwitch`) are already done by the lead; use `useFounders()` / `useNavItems()` if you need them. Do not edit them.
10. **Do not edit** `.unlazy/ro-react/verify.mjs`, `vite.config.js`, `package.json`, `scripts/`, `ro/*.html`, root `*.html`, or files that
    are not in your list. Do not run `npm run build`, `git`, `npm install`, or start servers (other leaves share this folder).

## Check your work (fast, ~1 s, builds into a private temp dir)

```
node .unlazy/ro-react/verify.mjs page <index|services|process|team|contact|how-you-sell>
```
It renders that page in EN and RO and compares them. Goal: **zero issues that come from your files**. Issues whose `[file]` hint
names a file you do not own belong to another leaf (they finish in parallel): ignore those, and ignore a transient build error in
someone else's file (wait 30 s, retry). Kinds you will see:

- `text:untranslated` / `attr:*:untranslated`: RO equals EN and has real words. Translate it. Brand/tool names are already
  allow-listed (Top of Mind, Meta Ads, Google Ads, Research Sprint, GA4, WhatsApp, Calendly, SEO, lead, tracking, site...).
- `text:english-left`: the RO text still contains English function words (the, and, your, you, with, for, our...). Fix the sentence.
- `text:digits` / `attr:*:digits`: digits differ between EN and RO at that node. Numbers must survive exactly (30, 60, 2026, 4,5 vs
  4.5 are fine because only digits are compared). If the EN spells a number in words, spell it in words in RO too.
- `text:spacing`: leading/trailing space differs (a missing `{" "}` next to an inline element).
- `text:cedilla` (ş ţ forbidden, use comma-below ș ț), `text:no-diacritics` (si, sa, cand, doua, pana, iti...), `text:mojibake`.
- `structure` / `attr-names` / `attr-value` / `href` / `words:classes`: markup differs between EN and RO. Make the RO side use
  the same elements and classes; internal RO links must come from `link()`.
- `en-changed`: you altered the English render. Undo whatever changed it.

Never "fix" the checker; if you believe a string must legitimately stay identical in both languages, keep it and say so in your report.

## Romanian voice (read the reference first)

Reference corpus: `.unlazy/ro-react/ref/static-pairs.txt` has 647 lines `English ||| Română` from the earlier static version of the
site, written by the owner's team. **Before translating a sentence, grep that file for a distinctive part of the English
sentence.** Many React sentences are verbatim or near-verbatim there (the FAQ, the buying modes, the first-month weeks, the fee
structure): reuse the Romanian wording unchanged when the meaning matches, adapting only what the React copy changed. Also see
`.unlazy/ro-react/ref/static-ro/*.txt` for whole pages.

- The studio speaks to the visitor with informal **tu** ("Programează un apel", "primești", "îți spunem", "vezi"), and as **noi**
  ("cercetăm", "construim"). A visitor's questions to the studio use plural "voi" ("Aveți studii de caz?", "Lucrați și cu bugete mici?").
  Never "dumneavoastră/dvs".
- Short, concrete sentences like the English. Same register: calm, direct, a bit dry; no marketing inflation, no new claims,
  no figures, prices, guarantees or promises that the English does not make. Facts about money and ownership must say exactly what
  the English says (monthly retainer = "abonament lunar", part of the fee tied to results, the Research Sprint price is fixed and
  confirmed in writing, ownership of accounts/tracking/domain/code from day 1).
- Sentence case like the English (Romanian headings are not Title Case). Keep the English punctuation style (em dashes, colons).
  Romanian quotes are „…”.
- **Diacritics:** ă â î ș ț (comma-below). Never ş ţ (cedilla), never ASCII-fied.
- UI labels in mock dashboards/panels are copy too: translate them, keep them short (Romanian runs ~20 % longer; these boxes are
  tight, so prefer the shorter natural wording and abbreviate like the English does).
- **Keep in English:** Top of Mind, Research Sprint, Meta Ads, Google Ads, Google Analytics, GA4, GTM, SEO, WhatsApp, Calendly,
  Facebook/Instagram/TikTok/LinkedIn/YouTube, "lead" ("lead-uri", "lead calificat"), "tracking", "dashboard", "site/site-uri",
  "checkout", "account manager", "pitch" when the reference does. Names of people and places (Cluj-Napoca; Romania = România).
- Numbers/dates: digits stay; RO decimal comma and dot thousands (4,5 · 1.200); month abbreviations ian feb mar apr mai iun iul aug
  sep oct nov dec; weekdays Luni Marți Miercuri Joi Vineri Sâmbătă Duminică (initials L M M J V S D); "€" stays.
- Glossary: Services = Servicii · Process = Proces · Team = Echipă · How you sell = Cum vinzi · paid ads = publicitate plătită ·
  websites & SEO = site-uri și SEO · social media = social media · lead generation = generare de lead-uri · by quote/cart/calendar =
  prin ofertă / prin coș / prin calendar (the quote/the cart/the calendar = Oferta / Coșul / Calendarul) · research = cercetare ·
  competitor map/analysis = analiza concurenței · positioning = poziționare · "a sharper position" = o poziționare mai clară ·
  retainer = abonament lunar · fee = tarif · report = raport · "in plain language" = pe înțelesul tău · campaign = campanie ·
  creative / ad (the thing that runs) = reclamă · creative fatigue = reclame obosite · direct booking = rezervare directă ·
  qualified lead = lead calificat · Book a call = Programează un apel · free 30-minute call = apel gratuit de 30 de minute ·
  Week 1 = Săptămâna 1 · first month = prima lună · first 60 days = primele 60 de zile · co-founder = co-fondator.
- Not sure about a term? Grep the reference; if it is not there, choose the plainest natural Romanian and list it in your report.

## What to report when done

Short message: files edited; any string you deliberately left identical (with the reason); any term choice you want the lead to
review (policy-sensitive money/ownership lines especially); anything in your files you could not make bilingual and why. Do not
paste the translations back.
