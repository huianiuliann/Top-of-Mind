# Content inventory (old site, commit 7c5a005)

Internal working file, not published. It preserves all text and behaviour of the old pre-rendered React + Tailwind site before the old files are deleted. Sources were read from git commit 7c5a005 (`git show 7c5a005:<path>`); the working tree is identical apart from one stray character inside an SVG path of index.html.

How to read this file:

- Order follows the DOM order of each page (for HTML) or the JSX order of the page component (for bundles).
- Copy is verbatim: punctuation, em dashes (—), en dashes (–), middle dots (·), curly quotes (“ ” ’) and straight apostrophes are kept exactly as on the site. HTML entities are decoded and `\uXXXX` escapes are resolved.
- Line labels (not part of the copy): `H1:`…`H4:` headings, `P:` paragraph, `LI:` list item, `Text:` text inside a non-paragraph element (eyebrows, chips, labels, captions), `Link: "label" → href`, `Link card → href` (a link that wraps a whole card; its contents follow indented), `Button:`, `Img: src — alt "…"`, `ARIA:` an aria-label on a non-link element, `SVG text:` text drawn inside an SVG, `TH:`/`TD:` table cells.
- ` | ` separates adjacent but separate elements inside one container (chips, pills, label + value). It is not part of the copy.
- `[shown only at ≥md]`, `[hidden at ≥lg]` etc. mark responsive variants (Tailwind breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, plus explicit `min-[1400px]`/`min-[1680px]`). `[decorative, aria-hidden]` marks mock UI that is hidden from assistive technology.
- Where the pre-rendered HTML contains the same text twice (mobile variant + desktop variant) it is listed once and marked "(duplicated in HTML: mobile + desktop)".
- Emphasis: the old design rendered one phrase of most headings in an italic serif (`em-serif`). Where it matters this is noted as "(italic: …)"; headings are otherwise given as plain text.
- The header and footer are identical on all five pre-rendered pages. They are listed in full under index.html and referenced from the other pages.

## Source: index.html

### Head / meta

- `<html lang="en" class="dark">`
- charset: utf-8
- meta name="viewport": width=device-width, initial-scale=1, viewport-fit=cover
- Title: Top of Mind — Research-first marketing studio
- meta name="description": A two-person marketing studio in Cluj-Napoca. We research your market and your competitors before we spend a euro of your budget — paid ads, websites and content built around how your customer actually buys.
- meta name="theme-color": #131316
- link rel="canonical": https://topofmind.me/
- meta property="og:type": website
- meta property="og:site_name": Top of Mind
- meta property="og:title": Top of Mind — Research-first marketing studio
- meta property="og:description": A two-person marketing studio in Cluj-Napoca. We research your market and your competitors before we spend a euro of your budget — paid ads, websites and content built around how your customer actually buys.
- meta property="og:url": https://topofmind.me/
- meta property="og:image": https://topofmind.me/assets/img/og.png
- meta name="twitter:card": summary_large_image
- link rel="icon": favicon.svg (type image/svg+xml)
- link rel="apple-touch-icon": apple-touch-icon.png
- Inline script: preloads the fonts assets/fonts/bricolage-700.woff2 and assets/fonts/instrumentserif-400-italic.woff2 as `<link rel="preload" as="font" crossorigin>` (comment: "preload the two headline faces — skipped on file://, where a CORS font preload can't work")
- link rel="stylesheet": assets/css/site.css
- `<noscript>`: `<style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}</style>` (makes the animation start-states visible without JS)
- Body: `<div id="root">` with the pre-rendered React markup; image preload links inside #root: assets/img/research-board.webp; script assets/js/home.js (defer)

### Header (shared; identical on all five HTML pages)
- Link: "Skip to content" → #main
- [shown only at ≥lg]
  - Link: "Top of Mind" → index.html, aria-label "Top of Mind — home" (duplicated in HTML: mobile + desktop)
  - Nav (aria-label "Main") [shown only at ≥lg]:
    - Link: "Services" → services.html
    - Link: "Process" → process.html
    - Link: "How you sell" → how-you-sell.html
    - Link: "Team" → team.html
    - Link: "Contact" → contact.html
  - Link: "Book a call" → https://calendly.com/huianiuliann/30min, target=_blank
- [hidden at ≥lg]
  - Button: "" aria-label "Open menu" aria-expanded=false

### Main (`<main id="main">`)
#### Section 1: Hero
- [decorative, aria-hidden]
  - [shown only at ≥min-[1400px]]
    - P: Week 1
    - P: Buyer questions mapped
  - [shown only at ≥min-[1400px]]
    - P: Competitor ads
    - Text: working | copied | missing
  - [shown only at ≥min-[1400px]]
    - P: Positioning draft
    - P: “Show the drawing first.”
  - [shown only at ≥min-[1400px]]
    - P: The number we report
    - P: Qualified requests
- Link: "Research-first marketing studio · Cluj-Napoca" → how-you-sell.html
  - (" · Cluj-Napoca" is hidden below sm.)
- H1: We research your market before we touch a euro of your budget.
- P: Meta and Google Ads, websites and content — built around how your customer actually buys: by quote, by cart or by calendar. Two founders, no juniors, no templates.
- Link: "Book a free 30-min call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "How you sell" → how-you-sell.html
- LI: 30 minutes, free
- LI: You talk to the people doing the work
- LI: Reporting in plain language

#### Section 2: Week one: research board (laptop scroll)
- [shown only at ≥md]
  - Text: Week one (duplicated in HTML: mobile + desktop)
  - H2: Isn't ads. It's this. (duplicated in HTML: mobile + desktop)
  - P: Before a single ad goes live we map what your buyers ask, what your competitors say — and the space nobody is taking. (duplicated in HTML: mobile + desktop)
  - Img: assets/img/research-board.webp — alt "Example research board: what buyers ask first, a competitor map, what's missing, competitor ads taken apart and a positioning draft"
  - Text (run of short labels): esc · F1 · F2 · F3 · F4 · F5 · F6 · F7 · F8 · F9 · F10 · F11 · F12 · ~ | ` · ! | 1 · @ | 2 · # | 3 · $ | 4 · % | 5 · ^ | 6 · & | 7 · * | 8 · ( | 9 · ) | 0 · — | _ · + | = · delete · tab · Q · W · E · R · T · Y · U · I · O · P · { | [ · } | ] · | | \ · caps lock · A · S · D · F · G · H · J · K · L · : | ; · " | ' · return · shift · Z · X · C · V · B · N · M · < | , · > | . · ? | / · shift · fn · control · option · command · command · option
- [hidden at ≥md]
  - Img: assets/img/research-board.webp — alt "Example research board", loading=lazy

#### Section 3: Services marquee (aria-label="What we do")
- Text: Meta Ads | / | Google Ads | / | Landing pages | / | Websites | / | Web analytics | / | Conversion tracking | / | Creative testing | / | Social content | / | Lead generation | / | Plain-language reports | / (the same run is repeated 3× more in aria-hidden copies for the marquee loop)

#### Section 4: You've paid an agency before (class theme-light)
- H2: You've paid an agency before.
- P: A kickoff call full of promises. A monthly report full of numbers nobody explains. A strategy that reads like it was written for any business — because it was.
- LI: Year-long lock-in
- LI: Vanity metrics
- LI: Copy-paste strategy
- LI: A junior relaying your notes
- LI: Reports nobody reads
- P: We built Top of Mind to work the opposite way: research first, spend second.

#### Section 5: How you sell: three ways people buy (id="how-you-sell")
- Text: How you sell
- H2: There's no template industry. There are three ways people buy.
- P: Before we write a single ad, we work out which one you're in. It changes the research, the offer, the creative — and what we agree to call a win.
- [decorative, aria-hidden]
  - SVG text (decorative): "the gap"
  - Text: Visit | Interested | Conversation | Quote | Signed
- H3: The quote
- P: Nobody buys until they talk to you.
- P: Custom price, weeks of deciding, usually more than one person in the room.
- Text: Manufacturers | Fabricators | Clinics | Professional services
- P: The bottleneck: It's almost never traffic. It's the gap between interested and in a conversation.
- Text: We report | Qualified quote requests
- [decorative, aria-hidden]
  - Text: 15s
  - Text: Shop now
  - Text: Hook · sore back | live
  - Text: Hook · unboxing | next up
  - Text: Hook · new parents | in the queue
  - Text: Hook · side sleeper | burning out
- H3: The cart
- P: They buy without ever speaking to you.
- P: Seconds, on a phone, off a fifteen-second video.
- Text: Sleep & home | Baby & kids | Pet | Supplements
- P: The bottleneck: It's almost never targeting. It's how many new creatives you get into the market before the ones you have burn out.
- Text: We report | Profitable orders
- [decorative, aria-hidden]
  - Text (run of short labels): M · T · W · T · F · S · S
  - Text: Direct booking | Via a platform | Empty
- H3: The calendar
- P: You sell time, and tonight's empty slot is gone for good.
- P: Packed weekends, dead Tuesdays — while a platform takes its cut and keeps the customer.
- Text: Stays | Clinics | Schools | Studios
- P: The bottleneck: Demand that doesn't match your calendar, and platforms that own the customer.
- Text: We report | Direct bookings, dead days filled
- P: Not sure which one you're in? That's the first ten minutes of the call.
- Link: "Which one are you?" → how-you-sell.html

#### Section 6: Process: three steps (class theme-light)
- Text: Process
- H2: Three steps. No shortcuts.
- P: The same method, whatever you sell. It's slower on week one and faster on every week after.
- [shown only at ≥lg]
  - Text: 1
- P: Step 1
- H3: Research the market
- Text: What your customers actually care about, where they spend attention, and what makes them trust a brand enough to pay — before a single ad gets written.
- [hidden at ≥lg]
  - Text: how long does a custom quote take (duplicated in HTML: mobile + desktop)
  - P: What buyers actually say (duplicated in HTML: mobile + desktop)
  - P: Search (duplicated in HTML: mobile + desktop)
  - P: “price range before I call anyone” (duplicated in HTML: mobile + desktop)
  - P: Reviews (duplicated in HTML: mobile + desktop)
  - P: “took three weeks to get a reply” (duplicated in HTML: mobile + desktop)
  - P: Sales calls (duplicated in HTML: mobile + desktop)
  - P: “we just want to see it first” (duplicated in HTML: mobile + desktop)
  - Text: Google Search | Reviews | Forums & groups | Competitor ads | Your own sales calls (duplicated in HTML: mobile + desktop)
  - P: Insight: they want proof and a timeline before they want a price. (duplicated in HTML: mobile + desktop)
- [shown only at ≥lg]
  - Text: 2
- P: Step 2
- H3: Map the competition
- Text: Whoever's already winning attention in your space, taken apart: what's working, what's copied from somewhere else, and what they're leaving on the table for you.
- [hidden at ≥lg]
  - P: Taken apart (duplicated in HTML: mobile + desktop)
  - Text: your top competitors (duplicated in HTML: mobile + desktop)
  - P: Competitor A (duplicated in HTML: mobile + desktop)
  - Text: Working · real photos | Copied · “best price” (duplicated in HTML: mobile + desktop)
  - P: Competitor B (duplicated in HTML: mobile + desktop)
  - Text: Copied · stock images | Missing · lead time (duplicated in HTML: mobile + desktop)
  - P: Competitor C (duplicated in HTML: mobile + desktop)
  - Text: Working · fast reply | Missing · proof (duplicated in HTML: mobile + desktop)
- [shown only at ≥lg]
  - Text: 3
- P: Step 3
- H3: Build a sharper position
- Text: What's proven, sharpened, plus what's missing — the ads, the site, the content — so that when your customer is ready to decide, yours is the name they remember.
- [hidden at ≥lg]
  - Text: What buyers care about (duplicated in HTML: mobile + desktop)
  - Text: What competitors miss (duplicated in HTML: mobile + desktop)
  - Text: What only you can prove (duplicated in HTML: mobile + desktop)
  - P: Your position (duplicated in HTML: mobile + desktop)
  - P: The name they remember when they're ready. (duplicated in HTML: mobile + desktop)
  - Text: ads | site | content | one message (duplicated in HTML: mobile + desktop)
- [shown only at ≥lg] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- Link: "See what the first month looks like" → process.html

#### Section 7: What we actually do: four disciplines
- Text: What we actually do
- H2: Four disciplines. One system.
- P: The ad, the site, the feed and the follow-up have to agree with each other — so we run them together, and we track all of it.
- Link: "See all services" → services.html
- [decorative, aria-hidden]
  - Text: A
  - P: Before / after
  - Text: B
  - P: Founder on camera
  - Text: C
  - P: Price-led
  - Text: Budget this week | moves to what works
- H3: Paid advertising
- P: Meta and Google campaigns built around how your customers buy — with budget moved toward what's working every week, not left on autopilot.
- [decorative, aria-hidden]
  - Text: yourcompany.com
  - Text: Copy before design
  - Text: Built for the decision
  - Text: Technical SEO from day one
- H3: Websites & SEO
- P: Copy before design. Every page built for the decision, with technical SEO from day one.
- [decorative, aria-hidden]
  - Text: Proof post | Process reel | The people
- H3: Social media
- P: A content system of formats that compound — not a fresh idea needed every Monday.
- [decorative, aria-hidden]
  - Text: The ad
  - Text: The page
  - Text: Follow-up
  - Text: Your call
  - Text: via quote form · just now | New request
  - P: “Custom railing for two floors — can someone call me Thursday?”
- H3: Lead generation
- P: The ad brings them, the page convinces them, the follow-up gets them on a call with you.
- [decorative, aria-hidden]
  - Text: live events
  - Text: page_view · /services | tracked
  - Text: generate_lead · quote form | tracked
  - Text: click_call · mobile header | tracked
  - Text: add_to_cart · topper · queen | tracked
- P: Underneath all four
- H3: Tracking you can trust
- P: If the numbers are right, it's because the analytics were set up to measure them properly first.

#### Section 8: How we work: low-risk terms + report comparison (class theme-light)
- Text: How we work
- H2: Built to be low-risk to try.
- P: We're a young studio, so we made the arrangement easy to say yes to — and easy to judge.
- LI:
  - P: No long lock-in contracts
  - P: If it isn't working, you're not stuck paying for it.
- LI:
  - P: Reports in plain language
  - P: What happened, why, and what we're changing next.
- LI:
  - P: Direct access to the two of us
  - P: Never a junior relaying your notes.
- LI:
  - P: Part of our fee moves with your results
  - P: per qualified lead on quote work
    - (This line rotates every 2.4 s; the other two variants are only in assets/js/home.js.)
- (Report comparison slider. Layer 1 in DOM order = right-hand side, "The report you get from us": the Top of Mind report.)
- P: Your month, in plain language
- P: Written by the two of us, not a dashboard
- Text: Example
- P: What happened
- P: Fewer calls from search in the second half of the month.
- P: Why
- P: Two competitors started bidding on your name. We caught it the same week.
- P: What we change next
- P: Budget moves to the searches they ignore, and your lead time goes into every ad.
- P: The number we agreed on
- P: Qualified quote requests
- P: Same number, every month. No new metrics when it's a bad one.
- (Layer 2 = left-hand side, "The report you're used to": the typical agency report mock; every metric shows the placeholder 88.8k and the campaign-row numbers are blurred.)
- P: Monthly Performance Report
- P: Account overview · all campaigns · all placements
- Text: Export PDF
- P: Impressions
- P: 88.8k
- P: Reach
- P: 88.8k
- P: CPM
- P: 88.8k
- P: CTR (link)
- P: 88.8k
- P: Frequency
- P: 88.8k
- P: Engagement rate
- P: 88.8k
- P: Video ThruPlays
- P: 88.8k
- P: Cost / result
- P: 88.8k
- Text: Campaign_Awareness_Broad | 1.24% | €0.38 | 3.1
- Text: Campaign_LAL_3pct_v2 | 1.24% | €0.38 | 3.1
- Text: Campaign_Retarget_30d | 1.24% | €0.38 | 3.1
- Text: Campaign_Prospecting_ASC | 1.24% | €0.38 | 3.1
- P: “Overall, performance remained stable with positive engagement trends.”
- (Slider edge labels:)
- Text: The report you're used to
- Text: The report you get from us
- P: Move across the report — left is what most agencies send, right is ours. Example content.

#### Section 9: Who you'd work with: the team (class theme-light)
- Text: Who you'd work with
- H2: No account managers. Just the two of us.
- P: Whoever you speak to on the call is whoever does the work.
- Link: "Meet the team" → team.html
- Text: Co-founder & CEO
- H3: Iulian Huian
- Text: Strategy & paid media
- Img: assets/img/iulian-duo.jpg — alt "Iulian Huian", loading=lazy
- Img: assets/img/iulian.jpg — alt "" (decorative), loading=lazy
- P: Runs every account's Meta and Google Ads, and sets the research process behind each campaign. If you book the call, you'll most likely talk to him first.
- Text: Co-founder & CTO
- H3: Sebastian Răzeșu
- Text: Websites & web analytics
- Img: assets/img/sebi-duo.jpg — alt "Sebastian Răzeșu", loading=lazy
- Img: assets/img/sebi.jpg — alt "" (decorative), loading=lazy
- P: Builds and maintains every client website, and owns the tracking behind it — if a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place.

#### Section 10: Final CTA
- H2: Tell us what you sell.
- P: We'll tell you honestly if we're the right fit — and which of the three ways your customers buy.
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "Other ways to reach us" → contact.html
- P: No pitch deck. No pressure.

### Footer (shared; identical on all five HTML pages)
- Link: "Top of Mind" → index.html, aria-label "Top of Mind — home"
- P: A research-first marketing studio in Cluj-Napoca. Two founders, one method, and reporting in plain language.
- Link: "Book a free 30-min call" → https://calendly.com/huianiuliann/30min, target=_blank
- P: Site
- LI → Link: "Home" → index.html
- LI → Link: "Services" → services.html
- LI → Link: "Process" → process.html
- LI → Link: "How you sell" → how-you-sell.html
- LI → Link: "Team" → team.html
- LI → Link: "Contact" → contact.html
- P: Talk to us
- LI → Link: "30-minute call on Calendly" → https://calendly.com/huianiuliann/30min, target=_blank
- LI → Link: "iulian@topofmind.me" → mailto:iulian@topofmind.me
- LI → Link: "WhatsApp · 0756 883 206" → https://wa.me/40756883206, target=_blank
- LI: Cluj-Napoca, Romania
- SVG text (decorative): "TOP OF MIND" (×3 stacked copies)
- Text: TOM BUREAU SRL · CUI 54043345 · Cluj-Napoca | © 2026 Top of Mind

### Text baked into images (transcribed by eye from the rasters at commit 7c5a005; not selectable text on the site)

#### assets/img/research-board.webp (2560×1920; used in index.html section 2)
- Window bar: "Research board" / "week 1"; tabs "Market" (active), "Competitors", "Buyers", "Gaps"; dashed badge "Example board"; avatars "IH", "SR".
- Card "What buyers ask first" (right-hand note "search · forums · calls"), each question with a bar:
  - how long does a custom railing take
  - price range before I call anyone
  - can I see similar finished projects
  - stainless or powder-coated steel
  - who handles installation
  - do they send drawings first
  - Callout: "Nobody in the top results answers the first two. That's the opening."
- Card "Competitor map" (note "local competitors reviewed"): axes "shows proof" (top), "talks price" (bottom), "generic" (left), "specialist" (right); competitor dots A–H; an empty quadrant marked "open space"; chips "most lead with price", "almost none show real projects".
- Card "What's missing": ✕ "Lead times, anywhere"; ✕ "A drawing before the invoice"; ✕ "Photos that aren't stock"; ✕ "A name to talk to"; ✓ "Everyone says "quality""; sticky note (handwritten style) "Say the lead time out loud. Nobody else does." signed "— IH, call notes".
- Card "Their ads, taken apart" (note "Meta Ad Library · Google"): ad 1 tagged "Working · before / after"; ad 2 showing "BEST PRICE!" tagged "Copied · by most of them"; ad 3 (dashed, empty) "nobody runs this" tagged "Missing · a reason to call today".
- Card "Positioning draft": headline "The fabricator that shows you the drawing before the invoice." (italic: "before the invoice."); chips "lead time on the page", "real projects", "a name, not a form"; footnote "Draft · validated with you on the week 2 call".
- Bottom bar "First month": "Week 1 · Research" (marked "now"), "Week 2 · Position & plan", "Week 3 · First campaigns", "Week 4 · First real report".

#### assets/img/og.png (1200×630; og:image of every page; the version at commit 7c5a005)
- Wordmark with dot: "Top of Mind"
- Headline: "We research your market before we touch a euro of your budget." (italic serif: "a euro")
- Bottom left: "Research-first marketing studio · Cluj-Napoca"; bottom right pill: "topofmind.me"

#### Other images
- assets/img/iulian.jpg, iulian-duo.jpg, sebi.jpg, sebi-duo.jpg are head-and-shoulders portraits on a plain background (colour and greyscale), no text. assets/img/world-dots.webp is not referenced by any page.

## Source: services.html

### Head / meta

- `<html lang="en" class="dark">`
- charset: utf-8
- meta name="viewport": width=device-width, initial-scale=1, viewport-fit=cover
- Title: Services — Top of Mind
- meta name="description": Paid advertising, websites & SEO, social media and lead generation — run as one system, researched before a single euro is spent.
- meta name="theme-color": #131316
- link rel="canonical": https://topofmind.me/services.html
- meta property="og:type": website
- meta property="og:site_name": Top of Mind
- meta property="og:title": Services — Top of Mind
- meta property="og:description": Paid advertising, websites & SEO, social media and lead generation — run as one system, researched before a single euro is spent.
- meta property="og:url": https://topofmind.me/services.html
- meta property="og:image": https://topofmind.me/assets/img/og.png
- meta name="twitter:card": summary_large_image
- link rel="icon": favicon.svg (type image/svg+xml)
- link rel="apple-touch-icon": apple-touch-icon.png
- Inline script: preloads the fonts assets/fonts/bricolage-700.woff2 and assets/fonts/instrumentserif-400-italic.woff2 as `<link rel="preload" as="font" crossorigin>` (comment: "preload the two headline faces — skipped on file://, where a CORS font preload can't work")
- link rel="stylesheet": assets/css/site.css
- `<noscript>`: `<style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}</style>` (makes the animation start-states visible without JS)
- Body: `<div id="root">` with the pre-rendered React markup; script assets/js/services.js (defer)

### Header
- Identical to the index.html header (same links, labels and aria-labels). Current page highlighted in the desktop nav: Services.

### Main (`<main id="main">`)

#### Decorative element beside the hero (absolutely positioned; first in DOM order)
- [shown only at ≥min-[1400px]]
  - [decorative, aria-hidden]
    - Text (run of short labels): Ads · Website · Social · Follow-up · Tracking
    - P: One system

#### Section 1: Hero
- Text: Services
- H1: Four disciplines. Run as one system.
- P: We don't sell these separately, because your customers don't experience your business separately. The ad, the site, the feed and the follow-up all have to agree with each other.
- Link: "Book a free 30-min call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "See the disciplines" → #paid-advertising
- Link: "Paid advertising" → #paid-advertising
- Link: "Websites & SEO" → #websites
- Link: "Social media" → #social
- Link: "Lead generation" → #lead-generation
- Link: "Tracking" → #tracking

#### Section 2: Every channel pulls the same way
- H2: Every channel pulls the same way.
- P: When the ad, the page, the feed and the follow-up tell the same story, your buyer only has to decide once.
- Text: One message they remember
- [shown only at ≥md]
  - Text: Tracking | Follow-up | Social | Website | Ads

#### Section 3: Discipline 1: Paid advertising (id="paid-advertising")
- P: Discipline 1
- H2: Paid advertising
- P: Meta and Google campaigns built around how your customers actually buy — not a standard media brief copy-pasted across every account. We start from the research: what stops someone mid-scroll in your category, and what makes them click through instead of past.
- LI:
  - P: Structure built for how you sell
  - P: A quote business runs differently from a cart business. We don't force one playbook onto both.
- LI:
  - P: Creative that matches the platform
  - P: What works on Meta rarely works unedited on Google. We build for where the ad actually lives.
- LI:
  - P: Budget moved toward what's working, weekly
  - P: Not left on autopilot for a month and explained away in a report.
- [decorative, aria-hidden]
  - Text: A
  - P: Before / after
  - Text: B
  - P: Founder on camera
  - Text: C
  - P: Price-led
  - Text: Budget this week | moves to what works

#### Section 4: Discipline 2: Websites & SEO (id="websites", class theme-light)
- P: Discipline 2
- H2: Websites & SEO
- P: A site that speaks your customer's language and is built to convert — not just to look finished in a portfolio. We write for the person deciding whether to trust you, and build the technical SEO underneath so the site can actually be found.
- LI:
  - P: Copy before design
  - P: We write what the page needs to say before we decide how it should look.
- LI:
  - P: Built for the decision, not the scroll
  - P: Every page has one job: move the right visitor to the next step — a quote request, a checkout, a booking.
- LI:
  - P: Technical SEO from day one
  - P: Structure, speed and indexing handled before launch, not patched after.
- [decorative, aria-hidden]
  - Text: yourcompany.com
  - Text: Copy before design
  - Text: Built for the decision
  - Text: Technical SEO from day one

#### Section 5: Discipline 3: Social media (id="social")
- P: Discipline 3
- H2: Social media
- P: Content that shows you know your craft — because people check your feed before they ever call or buy. We build a system around a small number of formats that work for your category, rather than chasing every trend.
- LI:
  - P: A content system, not a content calendar
  - P: Repeatable formats that compound, instead of a fresh idea needed every week.
- LI:
  - P: Proof over polish
  - P: Real work, real process, real people. Buyers trust what doesn't look staged.
- [decorative, aria-hidden]
  - Text: Proof post | Process reel | The people

#### Section 6: Discipline 4: Lead generation (id="lead-generation", class theme-light)
- P: Discipline 4
- H2: Lead generation
- P: Your offer, in front of the people who are actually ready to decide — not whoever happens to scroll past. This is where the other disciplines meet: the ad brings them, the page convinces them, and the follow-up closes the loop.
- LI:
  - P: An offer shaped by your buying mode
  - P: A quote form, a checkout or a booking calendar — each needs a different next step.
- LI:
  - P: Follow-up that doesn't let leads cool off
  - P: The person who was ready to talk shouldn't wait days for a reply.
- LI:
  - P: One number we agree on
  - P: Qualified requests, profitable orders or direct bookings — decided before we start.
- [decorative, aria-hidden]
  - Text: The ad
  - Text: The page
  - Text: Follow-up
  - Text: Your call
  - Text: via quote form · just now | New request
  - P: “Custom railing for two floors — can someone call me Thursday?”

#### Section 7: Underneath all four: Tracking (id="tracking")
- P: Underneath all four
- H2: Tracking you can trust
- P: If a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place. We fix the measurement before we spend, so every decision after that stands on real data.
- LI:
  - P: Events that match your business
  - P: Quote requests, purchases, bookings, calls — tracked as what they are.
- LI:
  - P: Cleaned up before we spend
  - P: Broken pixels and double-counted conversions get fixed on week one.
- LI:
  - P: Numbers you can check yourself
  - P: No black box. You see what we see.
- [decorative, aria-hidden]
  - Text: live events
  - Text: page_view · /services | tracked
  - Text: generate_lead · quote form | tracked
  - Text: click_call · mobile header | tracked
  - Text: add_to_cart · topper · queen | tracked

#### Section 8: Same disciplines, different weight (buying-mode table) (class theme-light)
- Text: Same disciplines, different weight
- H2: What we lean on depends on how you sell.
- P: A quote business lives or dies on the conversation. A cart business on creative volume. A calendar business on direct bookings. The mix follows.
- [shown only at ≥md] Table. Each rating cell shows 1–3 bars with the rating word as its aria-label; the word is also visible as text at ≥sm.

  | TH: Discipline | TH: The quote | TH: The cart | TH: The calendar |
  |---|---|---|---|
  | TD: Paid advertising | important | critical | important |
  | TD: Websites & SEO | critical | important | critical |
  | TD: Social media | supporting | critical | important |
  | TD: Lead generation & follow-up | critical | supporting | important |
  | TD: Tracking | critical | critical | critical |

- [hidden at ≥md] Mobile variant: one card per discipline — P: Paid advertising, P: Websites & SEO, P: Social media, P: Lead generation & follow-up, P: Tracking — each listing Text: The quote / The cart / The calendar with 1–3 bars (no rating words).

#### Section 9: Final CTA
- H2: Not sure which of these you need?
- P: That's what the call is for. We'll tell you where your money is leaking first — and which discipline fixes it.
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "Find your buying mode" → how-you-sell.html
- P: No pitch deck. No pressure.

### Footer
- Identical to the index.html footer.

## Source: process.html

### Head / meta

- `<html lang="en" class="dark">`
- charset: utf-8
- meta name="viewport": width=device-width, initial-scale=1, viewport-fit=cover
- Title: Process — Top of Mind
- meta name="description": The same three-step method, every time: research the market, map the competition, build you a sharper position. Here's what the first month looks like.
- meta name="theme-color": #131316
- link rel="canonical": https://topofmind.me/process.html
- meta property="og:type": website
- meta property="og:site_name": Top of Mind
- meta property="og:title": Process — Top of Mind
- meta property="og:description": The same three-step method, every time: research the market, map the competition, build you a sharper position. Here's what the first month looks like.
- meta property="og:url": https://topofmind.me/process.html
- meta property="og:image": https://topofmind.me/assets/img/og.png
- meta name="twitter:card": summary_large_image
- link rel="icon": favicon.svg (type image/svg+xml)
- link rel="apple-touch-icon": apple-touch-icon.png
- Inline script: preloads the fonts assets/fonts/bricolage-700.woff2 and assets/fonts/instrumentserif-400-italic.woff2 as `<link rel="preload" as="font" crossorigin>` (comment: "preload the two headline faces — skipped on file://, where a CORS font preload can't work")
- link rel="stylesheet": assets/css/site.css
- `<noscript>`: `<style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}</style>` (makes the animation start-states visible without JS)
- Body: `<div id="root">` with the pre-rendered React markup; script assets/js/process.js (defer)

### Header
- Identical to the index.html header (same links, labels and aria-labels). Current page highlighted in the desktop nav: Process.

### Main (`<main id="main">`)
#### Section 1: Hero
- Text: Process
- H1: Three steps. No shortcuts.
- P: The same method, every time, whatever you sell. It's slower on week one and faster on every week after.

#### Section 2: What you see on day one: first-month plan card
- P: What you see on day one
- P: Your first month
- P: Example plan · shared with you on day one
- [shown only at ≥sm]
  - Text: Week 3 of 4
- [shown only at ≥md]
  - Text: Week 1 | Week 2 | Week 3 | Week 4
- Text: Research & audit
- [shown only at ≥md]
  - Text: Buyer questions | Competitor map | Tracking check (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- Text: Position & plan
- [shown only at ≥md]
  - Text: Positioning draft | Channel plan | The number we'll report (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- Text: First campaigns live
- [shown only at ≥md]
  - Text: Small, controlled launch | Creative variants | Follow-up flow (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- Text: First real report
- [shown only at ≥md]
  - Text: What happened | Why | What changes next (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above

#### Section 3: The method: three steps
- Text: The method
- H2: What happens in each step — and what you get.
- P: Step 1
- H3: Research the market
- P: We learn your industry from the outside in — what your customers actually care about, where they spend attention, and what makes them trust a brand enough to pay — before a single ad gets written.
- P: For a quote business that might mean spec sheets and lead times. For a cart business, what gets saved versus scrolled past. For a calendar business, when people actually book.
- P: What you get
- LI: A map of the questions buyers ask first
- LI: An honest audit of what you already run
- LI: A tracking check before a euro is spent
- Text: how long does a custom quote take
- P: What buyers actually say
- P: Search
- P: “price range before I call anyone”
- P: Reviews
- P: “took three weeks to get a reply”
- P: Sales calls
- P: “we just want to see it first”
- Text: Google Search | Reviews | Forums & groups | Competitor ads | Your own sales calls
- P: Insight: they want proof and a timeline before they want a price.
- P: Step 2
- H3: Map the competition
- P: We find whoever's already winning attention in your space and take their approach apart: what's working, what's clearly copied from somewhere else, and what they're leaving on the table that you can take instead.
- P: Their ads, their sites, their offers and their reviews — read the way your buyer reads them.
- P: What you get
- LI: A competitor map of your market
- LI: Their ads taken apart, one by one
- LI: The open space nobody is claiming
- P: Taken apart
- Text: your top competitors
- P: Competitor A
- Text: Working · real photos | Copied · “best price”
- P: Competitor B
- Text: Copied · stock images | Missing · lead time
- P: Competitor C
- Text: Working · fast reply | Missing · proof
- P: Step 3
- H3: Build you a sharper position
- P: We take what's proven, sharpen it, and add what's missing — the ads, the site, the content — so that when your customer is ready to decide, your name is the one they remember.
- P: Then we launch small and controlled, measure the one number we agreed on, and move budget toward what works.
- P: What you get
- LI: A positioning draft, validated with you
- LI: A channel plan built for how you sell
- LI: The one number we'll report every month
- Text: What buyers care about
- Text: What competitors miss
- Text: What only you can prove
- P: Your position
- P: The name they remember when they're ready.
- Text: ads | site | content | one message

#### Section 4: The first month: week-by-week timeline (class theme-light)
- Text: The first month
- H2: Week by week, in the open.
- P: You see the plan on day one and the first real report on week four. Nothing big-bang, nothing hidden.
- [shown only at ≥md]
  - P: Week 1 (duplicated in HTML: mobile + desktop)
  - H3: Research (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- H4: Research & audit
- P: Your market, your competitors, and whatever you already have running — including whether your tracking is telling the truth.
- Text: Buyer questions | Competitor map | Ad library teardown | Tracking check
- [shown only at ≥md]
  - P: Week 2 (duplicated in HTML: mobile + desktop)
  - H3: Plan (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- H4: Position & plan
- P: A concrete plan for the specific channels that fit your business and your buying mode — not a generic bundle.
- Text: Positioning draft
- Text: Channel plan
- Text: The number we'll report
- [shown only at ≥md]
  - P: Week 3 (duplicated in HTML: mobile + desktop)
  - H3: Launch (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- H4: First campaigns live
- P: Ads, content or site work goes live — small and controlled, not a big-bang launch. Budget starts following what works.
- [decorative, aria-hidden]
  - Text: A
  - P: Before / after
  - Text: B
  - P: Founder on camera
  - Text: C
  - P: Price-led
  - Text: Budget this week | moves to what works
- [shown only at ≥md]
  - P: Week 4 (duplicated in HTML: mobile + desktop)
  - H3: Report (duplicated in HTML: mobile + desktop)
- [hidden at ≥md] — same content as the other responsive variant (duplicated in HTML: mobile + desktop), listed once above
- H4: First real report
- P: What happened, why, and what we're changing next — in plain language, written by the two of us.
- P: Your month, in plain language
- P: Written by the two of us, not a dashboard
- Text: Example
- P: What happened
- P: Fewer calls from search in the second half of the month.
- P: Why
- P: Two competitors started bidding on your name. We caught it the same week.
- P: What we change next
- P: Budget moves to the searches they ignore, and your lead time goes into every ad.
- P: The number we agreed on
- P: Qualified quote requests
- P: Same number, every month. No new metrics when it's a bad one.

#### Section 5: Final CTA
- H2: Ready to start the research?
- P: Thirty minutes on a call. Week one starts when you say so.
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "First, how do you sell?" → how-you-sell.html
- P: No pitch deck. No pressure.

### Footer
- Identical to the index.html footer.

## Source: team.html

### Head / meta

- `<html lang="en" class="dark">`
- charset: utf-8
- meta name="viewport": width=device-width, initial-scale=1, viewport-fit=cover
- Title: Team — Top of Mind
- meta name="description": No account managers between you and the work. Meet the two people who run Top of Mind.
- meta name="theme-color": #131316
- link rel="canonical": https://topofmind.me/team.html
- meta property="og:type": website
- meta property="og:site_name": Top of Mind
- meta property="og:title": Team — Top of Mind
- meta property="og:description": No account managers between you and the work. Meet the two people who run Top of Mind.
- meta property="og:url": https://topofmind.me/team.html
- meta property="og:image": https://topofmind.me/assets/img/og.png
- meta name="twitter:card": summary_large_image
- link rel="icon": favicon.svg (type image/svg+xml)
- link rel="apple-touch-icon": apple-touch-icon.png
- Inline script: preloads the fonts assets/fonts/bricolage-700.woff2 and assets/fonts/instrumentserif-400-italic.woff2 as `<link rel="preload" as="font" crossorigin>` (comment: "preload the two headline faces — skipped on file://, where a CORS font preload can't work")
- link rel="stylesheet": assets/css/site.css
- `<noscript>`: `<style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}</style>` (makes the animation start-states visible without JS)
- Body: `<div id="root">` with the pre-rendered React markup; image preload links inside #root: assets/img/iulian-duo.jpg, assets/img/sebi-duo.jpg; script assets/js/team.js (defer)

### Header
- Identical to the index.html header (same links, labels and aria-labels). Current page highlighted in the desktop nav: Team.

### Main (`<main id="main">`)

#### Decorative element beside the hero (absolutely positioned; first in DOM order)
- [shown only at ≥min-[1680px]]
  - [decorative, aria-hidden]
    - Img: assets/img/iulian-duo.jpg — alt "" (decorative)
    - Text: Iulian · Strategy & paid media
    - Img: assets/img/sebi-duo.jpg — alt "" (decorative)
    - Text: Sebastian · Websites & web analytics

#### Section 1: Hero
- Text: Team
- H1: No account managers. Just the two of us.
- P: Every account gets the same two people, start to finish. Whoever you speak to on the call is whoever does the work.

#### Section 2: Founder carousel
- (Photo stack: both photos are pre-rendered, each with an overlay caption of name and title.)
- Img: assets/img/iulian-duo.jpg — alt "Iulian Huian"
- P: Iulian Huian
- P: Co-founder & CEO — Strategy & paid media
- Img: assets/img/sebi-duo.jpg — alt "Sebastian Răzeșu"
- P: Sebastian Răzeșu
- P: Co-founder & CTO — Websites & web analytics
- (Text panel of the active slide, slide 1 of 2. Slide 2 (Sebastian Răzeșu) is only in assets/js/team.js.)
- H3: Iulian Huian
- P: Co-founder & CEO — Strategy & paid media
- P: Runs every account's Meta and Google Ads, and sets the research process behind each campaign. If you book the call, you'll most likely talk to him first.
- Text: Meta Ads | Google Ads | Research & positioning | Studying marketing at Babeș-Bolyai University
- Button: "" aria-label "Previous"
- Button: "" aria-label "Next"
- Text: 1 / 2

#### Section 3: How we split the work (class theme-light)
- Text: How we split the work
- H2: Two specialists. One point of contact: you.
- P: Strategy and media on one side, the site and the measurement on the other — both reporting to the same person.
- [shown only at ≥md]
  - Text: Research & positioning
  - Text: Meta & Google Ads
  - Text: Strategy & reporting
  - Img: assets/img/iulian-duo.jpg — alt "Iulian Huian" (duplicated in HTML: mobile + desktop)
  - P: Iulian
  - Text: You
  - Img: assets/img/sebi-duo.jpg — alt "Sebastian Răzeșu" (duplicated in HTML: mobile + desktop)
  - P: Sebastian
  - Text: Websites & landing pages
  - Text: Analytics & tracking
  - Text: Technical SEO
- [hidden at ≥md]
  - P: Iulian Huian
  - P: Strategy & paid media
  - P: Sebastian Răzeșu
  - P: Websites & web analytics

#### Section 4: Why two people (three cards) (class theme-light)
- H3: The person on the call does the work
- P: No hand-off to a team you've never met after the contract is signed.
- H3: Decisions without an approval chain
- P: If something needs to change, the people who can change it are already on the thread.
- H3: Nobody learns your business twice
- P: The research from week one stays with the two people running your account.

#### Section 5: Final CTA
- H2: Talk to us directly.
- P: Thirty minutes, the two people who'd do the work, and an honest answer on fit.
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank
- Link: "Other ways to reach us" → contact.html
- P: No pitch deck. No pressure.

### Footer
- Identical to the index.html footer.

## Source: contact.html

### Head / meta

- `<html lang="en" class="dark">`
- charset: utf-8
- meta name="viewport": width=device-width, initial-scale=1, viewport-fit=cover
- Title: Contact — Top of Mind
- meta name="description": Book a free 30-minute call, or reach us directly on WhatsApp or email. No pitch deck, no pressure.
- meta name="theme-color": #131316
- link rel="canonical": https://topofmind.me/contact.html
- meta property="og:type": website
- meta property="og:site_name": Top of Mind
- meta property="og:title": Contact — Top of Mind
- meta property="og:description": Book a free 30-minute call, or reach us directly on WhatsApp or email. No pitch deck, no pressure.
- meta property="og:url": https://topofmind.me/contact.html
- meta property="og:image": https://topofmind.me/assets/img/og.png
- meta name="twitter:card": summary_large_image
- link rel="icon": favicon.svg (type image/svg+xml)
- link rel="apple-touch-icon": apple-touch-icon.png
- Inline script: preloads the fonts assets/fonts/bricolage-700.woff2 and assets/fonts/instrumentserif-400-italic.woff2 as `<link rel="preload" as="font" crossorigin>` (comment: "preload the two headline faces — skipped on file://, where a CORS font preload can't work")
- link rel="stylesheet": assets/css/site.css
- `<noscript>`: `<style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}</style>` (makes the animation start-states visible without JS)
- Body: `<div id="root">` with the pre-rendered React markup; script assets/js/contact.js (defer)

### Header
- Identical to the index.html header (same links, labels and aria-labels). Current page highlighted in the desktop nav: Contact.

### Main (`<main id="main">`)

#### Decorative element beside the hero (absolutely positioned; first in DOM order)
- [shown only at ≥min-[1400px]]
  - [decorative, aria-hidden]
    - P: Top of Mind
    - P: online
    - Text: example
    - Text: Hi! We make custom railings and stairs. Can we talk this week?
    - Text: Sure — pick any 30-minute slot on Calendly and we'll look at your market before the call.
    - Text: Booked for Thursday 👍

#### Section 1: Hero
- Text: Contact
- H1: Tell us what you sell.
- P: Book a free 30-minute call, or reach us directly. No pitch deck, no pressure — and an honest answer on fit.

#### Section 2: Contact options: Calendly, WhatsApp, Email
- Link card → https://calendly.com/huianiuliann/30min, target=_blank; contains:
  - Text: 30 minutes · free
  - P: Fastest way in
  - P: Book a call on Calendly
  - P: Pick a slot that suits you. You'll talk to the two people who'd actually do the work.
  - Text: Open Calendly
- Link card → https://wa.me/40756883206, target=_blank; contains:
  - P: WhatsApp
  - P: 0756 883 206
- Link card → mailto:iulian@topofmind.me; contains:
  - P: Email
  - P: iulian@topofmind.me

#### Section 3: What happens on the call (class theme-light)
- Text: What happens on the call
- H2: Thirty minutes, three questions.
- P: Minutes 0–10
- H3: How do your customers buy?
- P: By quote, by cart or by calendar. It decides everything after.
- P: Minutes 10–20
- H3: Where is the money leaking today?
- P: What's working, what's burning budget, what's not being measured.
- P: Minutes 20–30
- H3: Are we the right fit?
- P: An honest answer — including when the answer is no.

#### Section 4: Before you book: FAQ (class theme-light)
- Text: Before you book
- H2: The questions people ask first.
- P: If yours isn't here, ask it on the call — or send it on WhatsApp.
- Button: "Do you have case studies?" aria-expanded=true
- P: Not published ones yet — we're a young studio and we'd rather say that plainly than dress up numbers that aren't there. What you get instead is full visibility into our process from day one, and a pricing model where part of what we earn depends on your results.
- Button: "How does pricing work?" aria-expanded=false
- Button: "How fast will I see results?" aria-expanded=false
- Button: "Do you work with small budgets?" aria-expanded=false
- Button: "What happens if it isn't working?" aria-expanded=false
- Button: "What do you need from me to start?" aria-expanded=false
- (Only the first answer is pre-rendered; answers 2–6 are only in assets/js/contact.js, see ### FAQ below.)

#### Section 5: Where we are: globe
- Text: Where we are
- H2: Based in Cluj-Napoca. Working in English, remotely.
- P: Calls, reports and campaigns work the same way wherever your customers are.
- ARIA: (aria-label "Illustration: a globe with lines reaching out from Cluj-Napoca, where we're based", role=img)
- [decorative, aria-hidden]
  - Text: Cluj-Napoca
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank

### Footer
- Identical to the index.html footer.

## Source: industries.html

A redirect stub (no React, no bundle). The former "Industries" page was replaced by "How you sell".

### Head / meta
- `<html lang="en">`, `<meta charset="utf-8" />`
- `<meta http-equiv="refresh" content="0; url=how-you-sell.html" />`
- `<link rel="canonical" href="https://topofmind.me/how-you-sell.html" />`
- `<meta name="robots" content="noindex,follow" />`
- Title: Moved — Top of Mind
- Inline body style: `background:#131316;color:#ddd;font-family:system-ui,sans-serif`

### Body
- P: This page has moved to How you sell.
  - (contains link "How you sell" → how-you-sell.html, inline style `color:#f4f4f6`)
- Inline script: `location.replace("how-you-sell.html");` (JS redirect in addition to the meta refresh)

## Source: assets/js/home.js

esbuild bundle (507,628 bytes) that hydrates index.html (`hydrateRoot` on `#root`). Bytes 0–~406,000 are library code (React, ReactDOM, framer-motion, tailwind-merge, Tabler-style icons) and are ignored here. The page component renders, in order: Hero, Week one (laptop scroll), marquee, agency pain points, How you sell, Process, What we actually do, How we work, Who you'd work with, final CTA. All static copy of these components is already in index.html (listed above). Below is only the text and state that exists in the bundle and not in the pre-rendered HTML.

### Shared layout text only in the bundles (same in all six bundles)
- Mobile menu (below lg). It is rendered only after tapping the menu button, so it is absent from all pre-rendered HTML. The button's aria-label switches from "Open menu" to "Close menu" (icon: hamburger → ×) and `aria-expanded` becomes true. Panel contents, in order:
  - Link: "Home" → index.html
  - Link: "Services" → services.html (with a chevron icon; the current page's item is white, the others grey)
  - Link: "Process" → process.html (with a chevron icon; the current page's item is white, the others grey)
  - Link: "How you sell" → how-you-sell.html (with a chevron icon; the current page's item is white, the others grey)
  - Link: "Team" → team.html (with a chevron icon; the current page's item is white, the others grey)
  - Link: "Contact" → contact.html (with a chevron icon; the current page's item is white, the others grey)
  - Link: "Book a free 30-min call" → https://calendly.com/huianiuliann/30min, target=_blank (full-width accent button, not magnetic)
  - Tapping any of the five page links closes the panel; the panel fades/slides in and out (0.25 s).
- Desktop header on scroll: after 80px of scroll the pill-shaped bar shrinks (desktop to 62% width, mobile to 92%), gets a dark translucent background (`bg-ink-900/80`, `backdrop-blur-md`) and a shadow. Hovering a desktop nav link shows a sliding highlight pill.
- The current page's nav link is white with a thin accent underline (no `aria-current` attribute is set). The home page has no nav item of its own.

### Hero (index.html section 1)
- H1 words animate in one by one (stagger 75 ms); the words "a euro" get an accent outline box that draws itself, with a cursor-arrow icon sliding into its corner (after 1.5 s).
- The four floating cards (visible only at ≥1400px) fade in, bob up and down, and move with the mouse (parallax) while the pointer is over the hero. Their text is in index.html.

### Week one (index.html section 2)
- At ≥md the research board image sits on the lid of a laptop mock (Aceternity "MacBook scroll"): section is 300vh tall; while scrolling the lid rotates open and the screen scales up; the title block ("Week one" / "Isn't ads. It's this." / paragraph) fades out and moves up. The keyboard key labels are decorative. Below md the image is shown statically with a flip-up reveal.

### Agency pain points (index.html section 4)
- The paragraph "A kickoff call full of promises. …" is split into words whose opacity goes from 0.16 to 1 as the paragraph scrolls through the viewport; the words from "because it was." onward are rendered in the italic serif accent colour.
- Each pain-point pill gets a hand-drawn squiggle stroke drawn across it (like crossing it out) when it scrolls into view. "research first, spend second." gets an accent underline that draws in.
- The whole section has a dotted background; a radial spotlight of accent-coloured dots follows the mouse.

### How you sell cards (index.html section 5, `#how-you-sell`)
- Quote card visual: five bars (labels in HTML: Visit, Interested, Conversation, Quote, Signed) grow on view; a dashed bracket labelled "the gap" appears; 14 dots travel along a line, most of them dropping into a "puddle" under the gap (animated SVG).
- Cart card visual: a phone showing a 15-second ad ("15s", "Shop now"); every 2.6 s the next creative slides in and the hook statuses rotate:
  - Hooks, in order: "Hook · sore back", "Hook · unboxing", "Hook · new parents", "Hook · side sleeper"
  - Status labels relative to the creative currently playing: playing = "live" (energy bar 78%), next = "next up" (100%), the one after = "in the queue" (100%), previous = "burning out" (18%, dimmed). The HTML shows the first state (sore back = live, unboxing = next up, new parents = in the queue, side sleeper = burning out).
- Calendar card visual: a 4-week grid under the weekday letters M T W T F S S; every 0.9 s one empty or platform day turns into a direct booking (12 cells: indexes 8, 15, 1, 22, 13, 5, 20, 27, 10, 3, 17, 24), then the loop restarts. Legend (in HTML): Direct booking / Via a platform / Empty.
- Data present in the bundle for these cards but NOT rendered anywhere on the home page (field `fee`):
  - The quote (id quote): fee "per qualified lead"
  - The cart (id cart): fee "tied to ad performance"
  - The calendar (id calendar): fee "tied to direct bookings"

### Process (index.html section 6)
- Scroll-linked steps: the step whose block is in the middle of the viewport becomes active (number bubble turns accent, other steps dim at ≥lg); a vertical progress line fills; at ≥lg the matching visual cross-fades in a sticky panel on the right (below lg each visual is shown inline under its step — the mobile/desktop duplication in the HTML).
- Step 1 visual: the search box is a typewriter that types, holds 1.7 s, deletes and types the next query, cycling through:
  - "how long does a custom quote take" (initial state, in the HTML)
  - "best mattress for a sore back" (bundle only)
  - "cabin near Cluj with a hot tub" (bundle only)
  - "which car seat is actually safest" (bundle only)
- Step 2 visual: competitor tags spring in one by one; a highlight scan line sweeps up and down over the list.
- Step 3 visual: the three check rows slide in from alternating sides, then the "Your position" card rises in.

### What we actually do (index.html section 7, bento grid)
- Paid advertising visual: every 1.6 s the budget bar re-splits toward creative B ("Founder on camera"): 34/33/33 → 26/48/26 → 16/68/16 → 12/76/12 (%), and B's tile gets a highlighted border.
- Websites & SEO visual: a browser mock ("yourcompany.com") builds itself in six steps (0.9 s each): heading lines, button, three cards; the checklist items tick one by one (Copy before design / Built for the decision / Technical SEO from day one).
- Social media visual: the three format chips (Proof post / Process reel / The people) highlight in turn and one of eight tiles pops every 0.7 s.
- Lead generation visual: four nodes (The ad → The page → Follow-up → Your call) joined by animated gradient "beams"; the status chip on the request card cycles every 1.9 s:
  - "New request" (initial state, in the HTML)
  - "Qualified"
  - "Call booked" (with a check icon, accent style; the "Your call" node lights up)
- Tracking visual: a "live events" feed that shows four rows at a time and pushes a new event every 1.3 s, cycling through six events (the last two never appear in the HTML):
  - page_view · /services — tracked (in the HTML)
  - generate_lead · quote form — tracked (in the HTML)
  - click_call · mobile header — tracked (in the HTML)
  - add_to_cart · topper · queen — tracked (in the HTML)
  - purchase · order confirmed — tracked (bundle only)
  - book_slot · tuesday · evening — tracked (bundle only)

### How we work (index.html section 8)
- The fourth item's second line rotates every 2.4 s (vertical flip) through:
  - "per qualified lead on quote work" (initial state, in the HTML)
  - "tied to ad performance on cart" (bundle only)
  - "tied to direct bookings on calendar" (bundle only)
- Report comparison slider ("what most agencies send" vs "Your month, in plain language"): the left layer is the agency report ("Monthly Performance Report" mock with blurred numbers), the right layer is the Top of Mind report. Moving the mouse or dragging a finger across the 34rem/30rem-tall frame moves the divider (cursor `col-resize`); while in view and not hovered it auto-sweeps between about 12% and 88% (period 4.2 s); labels "The report you're used to" (bottom left) and "The report you get from us" (bottom right) fade out near the edges (≤18% / ≥82%). Autoplay is skipped for prefers-reduced-motion.

### Who you'd work with (index.html section 9)
- Each founder card is a 3D tilt card: the card rotates toward the cursor and its layers (role, name, focus, photo, bio) lift at different depths on hover.
- Hover image swap: the greyscale photo (`iulian-duo.jpg` / `sebi-duo.jpg`) cross-fades to the colour photo (`iulian.jpg` / `sebi.jpg`) on card hover.
- The founder data object also carries `tags` that are not rendered on the home page (they are rendered on team.html; see Bios).

### Final CTA (index.html section 10)
- "Lamp" effect: two conic-gradient light cones widen from 15rem to 30rem when the section scrolls into view; the H2 rises from below.

### Footer
- The giant "TOP OF MIND" outline text is an SVG: its stroke draws itself once in view (4 s); on hover a gradient-coloured outline follows the cursor (radial mask).

### Everything else
- Buttons: the primary accent CTA buttons are "magnetic" (follow the cursor slightly) on devices with hover.
- Scroll-reveal animations (fade-up, blur-in, zoom-in, flip-up, fade-left) on most blocks; elements start with inline `opacity:0` in the HTML and a `<noscript>` style forces them visible without JS.
- `MotionConfig reducedMotion="user"` plus explicit `prefers-reduced-motion` checks stop the interval-driven loops.
- `onRecoverableError` logs hydration errors to the console only when `window.__TOM_DEBUG__` is set.

## Source: assets/js/services.js

esbuild bundle (449,295 bytes) that hydrates services.html; app code starts at about byte 400,900, the rest is library code. All static copy is in services.html (listed above). Text and state that exist only in the bundle:

- Shared layout: the same mobile menu, header scroll behaviour, magnetic buttons, footer SVG animation and reveal animations as described under assets/js/home.js ("Close menu" label and the opened mobile menu exist only in the bundle).
- Hero orbit (visible only at ≥1400px, decorative): five channel chips (Ads, Website, Social, Follow-up, Tracking) orbit a centre label "One system" on three rings (38 s, 54 s reversed, 70 s per turn; chips counter-rotate to stay upright); the whole orbit fades and scales in.
- "Every channel pulls the same way." (section 2): the section is 170vh tall and sticky; five curved SVG lines draw themselves (path length 0 → 1) as the page scrolls; the left-edge line labels (≥md) are Tracking / Follow-up / Social / Website / Ads; the centre pill reads "One message they remember".
- Discipline sections (#paid-advertising, #websites, #social, #lead-generation, #tracking): the feature list items fade up one after another, the visual zooms in; the Websites & SEO and Lead generation sections swap columns at ≥lg (visual on the left) and use the light theme.
- Discipline visuals: identical mock components to the home page (budget bar re-split every 1.6 s; browser mock build + checklist; social formats; lead-generation beams; live events feed). Bundle-only states:
  - Lead-generation status chip cycle:
    - "New request" (initial state, in the HTML)
    - "Qualified"
    - "Call booked" (with a check icon, accent style; the "Your call" node lights up)
  - Tracking feed events (last two only in the bundle):
    - page_view · /services — tracked (in the HTML)
    - generate_lead · quote form — tracked (in the HTML)
    - click_call · mobile header — tracked (in the HTML)
    - add_to_cart · topper · queen — tracked (in the HTML)
    - purchase · order confirmed — tracked (bundle only)
    - book_slot · tuesday · evening — tracked (bundle only)
- Buying-mode weight table (section 8): each cell shows 1–3 filled bars that spring in on view; filled bars are accent-coloured when the level is 3. Each cell has an aria-label and (≥sm) a visible word: 1 = "supporting", 2 = "important", 3 = "critical". Below md the table becomes one card per discipline with the three modes listed. Data (discipline → quote / cart / calendar):
  - Paid advertising: 2 (important) / 3 (critical) / 2 (important)
  - Websites & SEO: 3 (critical) / 2 (important) / 3 (critical)
  - Social media: 1 (supporting) / 3 (critical) / 2 (important)
  - Lead generation & follow-up: 3 (critical) / 1 (supporting) / 2 (important)
  - Tracking: 3 (critical) / 3 (critical) / 3 (critical)
- No other bundle-only copy.

## Source: assets/js/process.js

esbuild bundle (442,879 bytes) that hydrates process.html; app code starts at about byte 397,600. All static copy is in process.html (listed above). Text and state that exist only in the bundle:

- Shared layout: same mobile menu ("Close menu" + opened menu), header scroll behaviour, magnetic buttons, footer SVG animation and reveal animations as described under assets/js/home.js.
- "What you see on day one" (section 2): Aceternity "container scroll" — the plan card starts tilted back (rotateX 20°) and straightens to 0° while scrolling; it scales 1.05 → 1 on desktop and 0.7 → 0.9 at ≤768px (JS resize listener); the eyebrow moves up.
- Plan card data (bars grow in one after another; weeks 1–2 are "done" with check icons, week 3 is "now" and highlighted, week 4 is "next"; the "Week 3 of 4" badge shows at ≥sm):
  - Week 1 · Research & audit (status "done"): Buyer questions | Competitor map | Tracking check
  - Week 2 · Position & plan (status "done"): Positioning draft | Channel plan | The number we'll report
  - Week 3 · First campaigns live (status "now"): Small, controlled launch | Creative variants | Follow-up flow
  - Week 4 · First real report (status "next"): What happened | Why | What changes next
- The method (section 3): a "tracing beam" runs down the left edge (≥md) and its gradient follows the scroll position; each step's text blurs in and its visual zooms in and is sticky at ≥lg.
- Step 1 visual: typewriter search box cycling through (only the first is in the HTML):
  - "how long does a custom quote take" (initial state, in the HTML)
  - "best mattress for a sore back" (bundle only)
  - "cabin near Cluj with a hot tub" (bundle only)
  - "which car seat is actually safest" (bundle only)
- Step 2 visual: competitor tags spring in; a scan line sweeps over the list. Step 3 visual: the three checks slide in, then "Your position" rises.
- The first month (section 4): a vertical timeline whose accent line fills as you scroll; week labels are sticky (≥md) while their card scrolls past. The week-3 card embeds the budget-bar mock (every 1.6 s the split moves toward creative B "Founder on camera"); the week-4 card embeds the "Your month, in plain language" report.
- No other bundle-only copy.

## Source: assets/js/team.js

esbuild bundle (429,099 bytes) that hydrates team.html; app code starts at about byte 397,500. Text and state that exist only in the bundle:

- Shared layout: same mobile menu ("Close menu" + opened menu), header scroll behaviour, magnetic buttons, footer SVG animation and reveal animations as described under assets/js/home.js.
- Hero bubbles (visible only at ≥1680px, decorative): the two round greyscale portraits float up and down beside the hero inside a slowly spinning dashed ring (60 s per turn); their labels are in team.html.
- Founder carousel (Aceternity "animated testimonials", section 2): the HTML is pre-rendered on slide 1 (Iulian Huian). Buttons "Previous" / "Next" (aria-labels, arrow icons) move between slides and wrap around; the counter reads "1 / 2" or "2 / 2". The active photo pops to the front (small jump), the other photo stays behind, rotated a few degrees and at 55% opacity. The bio is split into words that fade in one by one (18 ms apart). An autoplay option (7 s) exists in the component but is not enabled. Slide 2, which exists only in the bundle:
  - H3: Sebastian Răzeșu
  - P: Co-founder & CTO — Websites & web analytics
  - P (bio, word-by-word animation): Builds and maintains every client website, and owns the tracking behind it — if a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place.
  - Tags: Websites | Technical SEO | Analytics & tracking | Keeps this site running
  - Counter: 2 / 2
  - (The photo stack with both photos and their overlay captions "Iulian Huian" / "Co-founder & CEO — Strategy & paid media" and "Sebastian Răzeșu" / "Co-founder & CTO — Websites & web analytics" is already in team.html.)
- "How we split the work" (section 3, ≥md): an animated-beam diagram. Left column Research & positioning / Meta & Google Ads / Strategy & reporting beam into Iulian's photo; Sebastian's photo beams out to Websites & landing pages / Analytics & tracking / Technical SEO; both photos beam into the centre node "You". Below md it is replaced by two simple cards (name + focus).
- No other bundle-only copy.

## Source: assets/js/contact.js

esbuild bundle (439,192 bytes) that hydrates contact.html; app code starts at about byte 395,000 (it also embeds a base64 dot-mask of the world map and WebGL shaders for the globe). Text and state that exist only in the bundle:

- Shared layout: same mobile menu ("Close menu" + opened menu), header scroll behaviour, magnetic buttons, footer SVG animation and reveal animations as described under assets/js/home.js.

### Chat mock (beside the hero, visible only at ≥1400px, aria-hidden)
- Header: "Top of Mind" with the WhatsApp icon; status line "online", which switches to "typing…" while a message is being "typed"; a dashed badge "example".
- Messages (bubbles on the right are "me" = Top of Mind and end with a small check icon):
  - Visitor (left bubble): Hi! We make custom railings and stairs. Can we talk this week?
  - Top of Mind (right bubble): Sure — pick any 30-minute slot on Calendly and we'll look at your market before the call.
  - Visitor (left bubble): Booked for Thursday 👍
- Loop: messages appear one at a time (typing indicator with three pulsing dots for 1.1 s before each), the full conversation stays for about 6 s (2.6 s + 3.6 s), then it clears and restarts. With prefers-reduced-motion all three messages are shown statically (that is also the pre-rendered HTML state).

### What happens on the call (section 3, in contact.html)
- Minutes 0–10
  - H3: How do your customers buy?
  - P: By quote, by cart or by calendar. It decides everything after.
- Minutes 10–20
  - H3: Where is the money leaking today?
  - P: What's working, what's burning budget, what's not being measured.
- Minutes 20–30
  - H3: Are we the right fit?
  - P: An honest answer — including when the answer is no.

### FAQ
Accordion in section 4 ("Before you book" / "The questions people ask first."). One `<button aria-expanded>` per question; the first question is open by default (its answer is the only one in contact.html); opening one closes the other; clicking the open one closes it; the plus icon rotates 45° when open and the answer's height animates. All 6 questions and answers:

#### Q1. Do you have case studies?
- Q: Do you have case studies?
- A: Not published ones yet — we're a young studio and we'd rather say that plainly than dress up numbers that aren't there. What you get instead is full visibility into our process from day one, and a pricing model where part of what we earn depends on your results.
- (Open by default; this answer is the only one pre-rendered in contact.html.)

#### Q2. How does pricing work?
- Q: How does pricing work?
- A: A monthly retainer, with part of our fee tied to results: per qualified lead if you sell by quote, tied to ad performance if you sell by cart, tied to direct bookings if you sell by calendar. We put exact numbers on the table after the call, once we know which one you are.
- (Answer exists only in the bundle.)

#### Q3. How fast will I see results?
- Q: How fast will I see results?
- A: Paid ads can produce first signals within two to three weeks. SEO and organic social take longer — usually two to three months before it's meaningful. We'll tell you which to expect for your specific case before you commit to anything.
- (Answer exists only in the bundle.)

#### Q4. Do you work with small budgets?
- Q: Do you work with small budgets?
- A: Yes. We'd rather start small and prove the approach than ask you to bet big on us before we've earned it.
- (Answer exists only in the bundle.)

#### Q5. What happens if it isn't working?
- Q: What happens if it isn't working?
- A: We tell you. Every report is built to surface what isn't performing, not just what is — and because there's no long contract, you're never stuck paying for something that clearly isn't right.
- (Answer exists only in the bundle.)

#### Q6. What do you need from me to start?
- Q: What do you need from me to start?
- A: A 30-minute call. Bring whatever you already have — a website, a page, an idea of who buys from you — and we'll tell you honestly whether we're the right fit.
- (Answer exists only in the bundle.)

### Globe (section 5, "Where we are")
- `role="img"` with aria-label "Illustration: a globe with lines reaching out from Cluj-Napoca, where we're based" (also in contact.html).
- WebGL canvas (initialised lazily by an IntersectionObserver 240px before it scrolls into view): a dotted Earth (dots decoded from an embedded base64 bitmap), a slow side-to-side sway (±0.6 rad over 34 s), and animated arcs from the origin to nine unlabelled target points; two rings pulsing outward from the origin. Drag with mouse/touch rotates it (`pointerdown`/`pointermove`, cursor grab/grabbing) and it eases back. The origin label "Cluj-Napoca" follows the origin point and hides when it turns to the back side. Reduced motion: static frame. If WebGL is unavailable or the context is lost, `data-fallback="1"` is set on the wrapper.
- Origin: lat 46.77, lng 23.6, label "Cluj-Napoca"; initial view centred on longitude 6.
- Target points (lat, lng), not labelled on the site: (51.5, -0.12), (40.71, -74), (59.33, 18.07), (25.2, 55.27), (40.42, -3.7), (37.98, 23.73), (43.65, -79.38), (-33.92, 18.42), (19.08, 72.88) — roughly London, New York, Stockholm, Dubai, Madrid, Athens, Toronto, Cape Town and Mumbai (our reading of the coordinates, not site copy).
- No other bundle-only copy.

## Source: assets/js/how-you-sell.js

esbuild bundle (437,951 bytes) for the page "How you sell". There is no how-you-sell.html in commit 7c5a005 (and none in the git history), so this page existed only as a bundle and was never pre-rendered: the nav, footer and CTA links to how-you-sell.html from every page point to a file that does not exist in the repo. The bundle has no `<head>` data, so the page's title/description are unknown. App code starts at about byte 397,100. Everything below is rendered by the component `Eh` inside the shared layout (header with "How you sell" as the current nav item, `<main id="main">`, footer — same text as listed under index.html).

### Page hero
- Text (eyebrow): How you sell
- H1: First we find out how your customer decides. Then we spend your money. (italic: "Then")
- P: There's no template industry — there are three ways people buy. Figuring out which one you're in is step one of every account we take on, because it changes the research, the offer, the creative and what we agree to call a win.
- Mode chips under the intro (anchor links with icons):
  - Link: "The quote" → #quote
  - Link: "The cart" → #cart
  - Link: "The calendar" → #calendar
- Background: faint grid lines (decorative).

### Selector (section with class theme-light)
- Text (eyebrow): Ten-second check
- H3: When a new customer finds you, what happens next?
- Three answer buttons (`aria-pressed`, one can be selected; the selected one turns accent):
  - Button: "They ask me for a price first" → mode `quote` (The quote); result text: Nobody buys until they talk to you. We work on the gap between interested and in a conversation — and report qualified quote requests.
  - Button: "They buy online without talking to me" → mode `cart` (The cart); result text: They decide in seconds, on a phone. We work on creative volume and a checkout that doesn't leak — and report profitable orders.
  - Button: "They book a date, a slot or a stay" → mode `calendar` (The calendar); result text: An empty slot is gone for good. We work on filling dead days and winning bookings back from platforms — and report direct bookings.
- Helper text shown before any answer is picked: P: Pick the closest one — most businesses are clearly one of the three.
- After picking an answer the helper text is replaced (animated) by a result panel:
  - P: You sell by the quote. / You sell by the cart. / You sell by the calendar. (the mode name is lower-cased and italic)
  - P: the answer's explanation (the `a` texts above)
  - Link: "Read your mode" → #quote / #cart / #calendar (arrow icon)

### Mode sections
Each mode is a `<section id="quote|cart|calendar">` (the cart section has class theme-light), laid out as a sticky left rail plus the mode body.

Left rail (visible only at ≥lg, `<nav aria-label="Buying modes">`, sticky, identical in all three sections; the item of the mode currently in the middle of the viewport is highlighted with a sliding accent bar):
- Text: Three ways people buy
- LI → Link: "The quote" → #quote
- LI → Link: "The cart" → #cart
- LI → Link: "The calendar" → #calendar
- P: Not sure which one you are?
- Link: "That's the first ten minutes of the call →" → https://calendly.com/huianiuliann/30min, target=_blank

Mode body layout (labels in the same order as rendered):
- Text: Mode {n as number} · {name} (e.g. "Mode 1 · The quote")
- H2: {headline}
- Card: Text "What it looks like" + P {looks} + niche chips {niches}
- Visual card (dark theme): the animated mock for the mode (quote: funnel bars Visit / Interested / Conversation / Quote / Signed with the dashed "the gap" bracket and leaking dots; cart: phone ad "15s" / "Shop now" with rotating hooks "Hook · sore back", "Hook · unboxing", "Hook · new parents", "Hook · side sleeper" and statuses "live", "next up", "in the queue", "burning out"; calendar: weekday letters M T W T F S S, 4-week grid filling with direct bookings, legend "Direct booking" / "Via a platform" / "Empty")
- Card: H3 "Where the money actually leaks" + P {leak}
- Card: H3 "What we build in the first 60 days" + progress bar labelled "Day 1" … "Day 60" (fills on view) + checklist {build}
- Card: H3 "What we report" + {report} (large italic serif) + P {reportNote} + {fee} (with an icon, at the bottom)

### Mode: quote
- id: quote (section `<section id="quote">`)
- n: 01 (rendered as the label "Mode 1 · The quote")
- name: The quote
- headline (H2): Nobody buys until they talk to you. (italic: “talk to you.”)
- looks ("What it looks like"): Custom price, weeks of deciding, usually more than one person in the room. The buyer is technical, cautious, and used to being sold to badly. This is where Top of Mind started — metal fabrication, laser and waterjet cutting, construction and materials supply.
- niches:
  - Manufacturing
  - Custom metal fabrication
  - Construction & industrial suppliers
  - Pergolas & outdoor structures
  - Custom furniture & joinery
  - Automated gates & fences
  - Private clinics
  - Professional services
- leak ("Where the money actually leaks"): Not in the ad spend — in the gap between someone showing interest and someone actually getting on a call. Most sites in this category make the technical buyer do the work: dig through a PDF catalog, guess at pricing, fill out a generic form that goes nowhere fast. The lead who was ready to talk cools off waiting for a human to reply.
- build ("What we build in the first 60 days", Day 1 → Day 60):
  - A site built to start a qualified conversation fast
  - Scope questions instead of a blank contact box
  - Direct scheduling instead of “we'll get back to you”
  - Ads aimed at the triggers that move a technical buyer — not broad awareness
- report ("What we report"): Qualified quote requests
- reportNote: Not raw form fills, not clicks. We agree upfront on what “qualified” means for your business before a single euro moves.
- fee: Part of our fee is per qualified lead.
- visual (decorative, aria-hidden): funnel bars (Visit / Interested / Conversation / Quote / Signed) with the dashed "the gap" bracket and leaking dots — same component as the home quote card

### Mode: cart
- id: cart (section `<section id="cart">`, class theme-light)
- n: 02 (rendered as the label "Mode 2 · The cart")
- name: The cart
- headline (H2): They buy without ever speaking to you. (italic: “ever speaking to you.”)
- looks ("What it looks like"): Seconds, on a phone, off a fifteen-second video. Nobody here is reading a spec sheet first — they're deciding whether this is the thing that fixes the problem they felt this morning.
- niches:
  - Mattresses & toppers
  - Ergonomic pillows
  - Premium bedding
  - Car seats & strollers
  - Cribs & baby monitors
  - Kids' furniture & textiles
  - Pet
  - Supplements
- leak ("Where the money actually leaks"): Almost never in targeting — Meta and Google are good enough at finding the right eyes. It leaks in creative fatigue: the same two or three ad angles run until the audience stops responding, and spend keeps flowing to a dead creative because nobody's watching closely enough to catch it in time.
- build ("What we build in the first 60 days", Day 1 → Day 60):
  - A steady pipeline of new creative variations
  - Tested fast, killed fast — winners get the budget
  - A pass on the store and checkout where carts leak
  - Tracking that separates profitable orders from busy ones
- report ("What we report"): Profitable orders
- reportNote: Cost per acquisition measured against a real margin number you give us — not clicks, not reach.
- fee: Part of our fee is tied to ad performance.
- visual (decorative, aria-hidden): phone ad "15s" / "Shop now" rotating through the four hooks with live / next up / in the queue / burning out statuses — same component as the home cart card

### Mode: calendar
- id: calendar (section `<section id="calendar">`)
- n: 03 (rendered as the label "Mode 3 · The calendar")
- name: The calendar
- headline (H2): You sell time, and tonight's slot is gone for good. (italic: “tonight's slot is gone for good.”)
- looks ("What it looks like"): Nothing here sits in inventory waiting to be sold tomorrow — an empty Tuesday is a Tuesday you never get to sell again. Packed weekends, dead weekdays, and a platform in the middle taking its cut.
- niches:
  - Boutique stays
  - Cabins & glamping
  - Aesthetic clinics
  - Private schools
  - Paid courses
  - Studios
- leak ("Where the money actually leaks"): In the mismatch between when people want to book and when you actually have room — and in a booking platform sitting between you and the customer, taking a cut and keeping their contact details for itself instead of for you.
- build ("What we build in the first 60 days", Day 1 → Day 60):
  - Demand aimed at your dead periods, not just “more traffic”
  - A direct-booking path on your own site and calendar
  - Reasons for past guests to book direct next time
  - Tracking that shows direct vs platform bookings
- report ("What we report"): Direct bookings, dead days filled
- reportNote: The number that actually shows whether the platform dependency is shrinking.
- fee: Part of our fee is tied to direct bookings.
- visual (decorative, aria-hidden): weekday letters M T W T F S S, 4-week grid filling with direct bookings, legend Direct booking / Via a platform / Empty — same component as the home calendar card

### Final CTA
- H2: Tell us which one you are. (italic: "which one you are.")
- P: We don't have a template industry. We have three ways people buy — and a method for each.
- Link: "Book a free 30-minute call" → https://calendly.com/huianiuliann/30min, target=_blank (magnetic primary button)
- Link: "See the process" → process.html
- P: No pitch deck. No pressure.

### Behaviour on this page
- Selector: `useState(null)`; buttons set the selected index; result panel animates in (AnimatePresence, mode "wait").
- Scroll spy: each mode body reports scroll progress (`useScroll` offset "start 0.5"–"end 0.5"); the active index drives the rail highlight (`layoutId="rail-active"`).
- Anchor links #quote / #cart / #calendar; sections have `scroll-mt-20`.
- Blur-in / zoom-in / fade-up reveal animations; the mode visuals loop (intervals 2.6 s for the cart phone, 0.9 s for the calendar) and stop under prefers-reduced-motion.

### Bios

The same founder data object is used by home.js and team.js (`name`, `role`, `focus`, `src`, `duo`, `crop`, `line`, `tags`). Photos: `assets/img/iulian.jpg`, `assets/img/iulian-duo.jpg`, `assets/img/sebi.jpg`, `assets/img/sebi-duo.jpg` (the `-duo` files are greyscale versions of the colour portraits; no text in any of them).

#### Iulian Huian
- Name: Iulian Huian (short form on team.html: "Iulian")
- Role: Co-founder & CEO
- Focus: Strategy & paid media
- Title as shown on team.html carousel: Co-founder & CEO — Strategy & paid media
- Bio (index.html team card and team.html carousel, identical): Runs every account's Meta and Google Ads, and sets the research process behind each campaign. If you book the call, you'll most likely talk to him first.
- Tags (rendered on team.html carousel only; present but unused in home.js): Meta Ads | Google Ads | Research & positioning | Studying marketing at Babeș-Bolyai University
- index.html card: role "Co-founder & CEO" above the H3 "Iulian Huian", focus "Strategy & paid media" below; photo `assets/img/iulian-duo.jpg` alt "Iulian Huian" (object-position 50% 58%), hover swap to `assets/img/iulian.jpg` (alt "", aria-hidden).
- team.html: carousel photo `assets/img/iulian-duo.jpg` alt "Iulian Huian" (640×640, object-position 50% 60%); hero bubble `assets/img/iulian-duo.jpg` alt "" with label "Iulian · Strategy & paid media"; split-work diagram photo alt "Iulian Huian" with caption "Iulian"; mobile card "Iulian Huian" / "Strategy & paid media" (circle crops use transform-origin 50% 57%).

#### Sebastian Răzeșu
- Name: Sebastian Răzeșu (short form on team.html: "Sebastian")
- Role: Co-founder & CTO
- Focus: Websites & web analytics
- Title as shown on team.html carousel (slide 2, bundle only): Co-founder & CTO — Websites & web analytics
- Bio (index.html team card; team.html carousel slide 2 in the bundle only): Builds and maintains every client website, and owns the tracking behind it — if a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place.
- Tags (team.html carousel slide 2, bundle only; unused in home.js): Websites | Technical SEO | Analytics & tracking | Keeps this site running
- index.html card: role "Co-founder & CTO" above the H3 "Sebastian Răzeșu", focus "Websites & web analytics" below; photo `assets/img/sebi-duo.jpg` alt "Sebastian Răzeșu" (object-position 50% 10%), hover swap to `assets/img/sebi.jpg` (alt "", aria-hidden).
- team.html: carousel photo `assets/img/sebi-duo.jpg` alt "Sebastian Răzeșu" (640×640, object-position 50% 4%); hero bubble `assets/img/sebi-duo.jpg` alt "" with label "Sebastian · Websites & web analytics"; split-work diagram photo alt "Sebastian Răzeșu" with caption "Sebastian"; mobile card "Sebastian Răzeșu" / "Websites & web analytics" (circle crops use transform-origin 50% 40%).

#### Team page copy about the two founders (team.html, verbatim)
- H1: No account managers. Just the two of us.
- P: Every account gets the same two people, start to finish. Whoever you speak to on the call is whoever does the work.
- H2: Two specialists. One point of contact: you.
- P: Strategy and media on one side, the site and the measurement on the other — both reporting to the same person.
- Iulian's side of the split-work diagram: Research & positioning / Meta & Google Ads / Strategy & reporting
- Sebastian's side: Websites & landing pages / Analytics & tracking / Technical SEO
- Email shown on the site belongs to Iulian: iulian@topofmind.me (no email for Sebastian anywhere).

## Links and contact data

### External links (every distinct one on the site)
- https://calendly.com/huianiuliann/30min — Calendly booking (30 min). Always `target="_blank" rel="noopener"`. Labels used: "Book a call" (desktop header), "Book a free 30-min call" (hero, services hero, footer, mobile menu), "Book a free 30-minute call" (CTA blocks, contact page), "30-minute call on Calendly" (footer), Calendly card "Book a call on Calendly" / "Open Calendly" (contact), "That's the first ten minutes of the call →" (how-you-sell rail). 23 occurrences in the five HTML pages.
- https://wa.me/40756883206 — WhatsApp, `target="_blank" rel="noopener"`. Labels: "WhatsApp · 0756 883 206" (footer), card "WhatsApp" / "0756 883 206" (contact).
- mailto:iulian@topofmind.me — Email. Labels: "iulian@topofmind.me" (footer), card "Email" / "iulian@topofmind.me" (contact).
- No `tel:` link exists anywhere; the phone number is only displayed as the WhatsApp label.
- No social-media profile links (no LinkedIn, Instagram, Facebook, etc.) exist anywhere.

### Internal pages
- index.html (logo "Top of Mind" with aria-label "Top of Mind — home"; footer "Home"; mobile menu "Home")
- services.html, process.html, how-you-sell.html, team.html, contact.html (nav, footer, mobile menu and in-page CTAs)
- how-you-sell.html is linked from every page but does not exist in commit 7c5a005 (see how-you-sell.js section); industries.html redirects to it.

### In-page anchors
- #main — skip link "Skip to content" on every page (target `<main id="main">`).
- services.html: #paid-advertising ("See the disciplines" and the "Paid advertising" chip), #websites, #social, #lead-generation, #tracking (hero chips); matching section ids.
- how-you-sell (bundle): #quote, #cart, #calendar (hero chips, left rail, selector "Read your mode").
- index.html has `<section id="how-you-sell">` but nothing links to `#how-you-sell`.

### Head / asset URLs
- Canonicals: https://topofmind.me/, https://topofmind.me/services.html, https://topofmind.me/process.html, https://topofmind.me/team.html, https://topofmind.me/contact.html; industries.html → https://topofmind.me/how-you-sell.html.
- og:image https://topofmind.me/assets/img/og.png (file present in the repo).
- favicon.svg and apple-touch-icon.png are referenced by every page but are not in the commit.
- Stylesheet assets/css/site.css; fonts preloaded by inline script: assets/fonts/bricolage-700.woff2, assets/fonts/instrumentserif-400-italic.woff2.
- Preloaded images: index.html assets/img/research-board.webp; team.html assets/img/iulian-duo.jpg and assets/img/sebi-duo.jpg.
- assets/img/world-dots.webp, assets/main.js, assets/style.css, assets/js/gsap.min.js and assets/js/ScrollTrigger.min.js are in the commit but not referenced by any page.

### Phone, email, company data (as displayed)
- Phone: 0756 883 206 (displayed only as "WhatsApp · 0756 883 206" and on the contact WhatsApp card; international form in the link: 40756883206)
- Email: iulian@topofmind.me
- Company line (footer, every page): TOM BUREAU SRL · CUI 54043345 · Cluj-Napoca
- Copyright (footer): © 2026 Top of Mind
- Brand name: Top of Mind (wordmark "Top of Mind"; footer SVG wordmark "TOP OF MIND")
- Address text: "Cluj-Napoca, Romania" (footer); "Based in Cluj-Napoca. Working in English, remotely." (contact); "Research-first marketing studio · Cluj-Napoca" (home hero eyebrow); "A research-first marketing studio in Cluj-Napoca. Two founders, one method, and reporting in plain language." (footer); meta description "A two-person marketing studio in Cluj-Napoca. …". No street address, postcode, registration number (J…) or VAT line appears anywhere.
- Globe origin coordinates (contact.js): lat 46.77, lng 23.6, label "Cluj-Napoca".

## Functionality found in bundles

One line per behaviour, with the page(s). Items marked **[known]** are on the rewrite's keep/drop list; items marked **[NOT IN KNOWN LIST]** are not on it and need an explicit keep/drop decision.

Findings that are absences: no `<form>` anywhere (nothing submits data; contact is Calendly/WhatsApp/email links only); no analytics or tracking scripts (no GA/GTM/Meta pixel/Plausible); no cookies, `localStorage`, `sessionStorage` or `fetch` calls in any app code; no cookie banner.

- **[known]** Navigation + mobile menu (all pages): desktop bar (≥lg) with logo, Services / Process / How you sell / Team / Contact and a "Book a call" Calendly button; below lg a logo plus a menu button (aria-label "Open menu" ↔ "Close menu", `aria-expanded`) that opens an animated panel with Home + the five links + "Book a free 30-min call"; tapping a link closes it. The panel exists only in JS (not in the pre-rendered HTML), so without JS there is no mobile navigation.
- **[known]** Skip link "Skip to content" → #main (all pages; `sr-only`, visible on focus).
- **[known]** Calendly booking (all pages): plain external links to https://calendly.com/huianiuliann/30min in a new tab; no embedded Calendly widget.
- **[known]** WhatsApp (footer on all pages, contact card): https://wa.me/40756883206, new tab.
- **[known]** Email (footer on all pages, contact card): mailto:iulian@topofmind.me.
- **[known]** Phone (footer, contact): shown only as "0756 883 206" inside WhatsApp labels; no `tel:` link.
- **[known]** How-you-sell selector (how-you-sell.js): three `aria-pressed` buttons, result panel with "You sell by …" and "Read your mode" anchor.
- **[known]** #how-you-sell section on the home page (index.html section 5): three buying-mode cards + "Which one are you?" link.
- **[known]** Services sub-navigation (services.html hero): anchor chips #paid-advertising #websites #social #lead-generation #tracking (+ "See the disciplines" → #paid-advertising); sections use `scroll-mt-28`.
- **[known]** FAQ accordion (contact.js): six questions, first open by default, one open at a time, `aria-expanded`, animated height, rotating plus icon.
- **[known]** Example report "Your month, in plain language" (home how-we-work slider right side; process week 4 card).
- **[known]** "What most agencies send" comparison slider (home section 8): mouse/touch-driven divider, auto-sweep while in view (4.2 s), pauses on hover/touch, edge-fading labels, reduced-motion aware.
- **[known]** industries.html redirect: meta refresh 0 s + JS `location.replace` + canonical to how-you-sell.html + `noindex,follow`.
- **[known]** Dark theme + `.theme-light` sections (all pages): `<html class="dark">`, `theme-color #131316`; alternating sections carry `theme-light`; mock visuals inside light sections force `theme-dark`.
- **[known]** Company data (footer on all pages): "TOM BUREAU SRL · CUI 54043345 · Cluj-Napoca", "© 2026 Top of Mind".
- **[known]** OG/canonical meta (all five HTML pages): canonical, og:type/site_name/title/description/url/image, twitter:card summary_large_image, favicon + apple-touch-icon links (both files missing from the repo).
- **[NOT IN KNOWN LIST]** Header scroll state (all pages): after 80px the header pill shrinks (62%/92% width), gets blurred dark background and shadow; animated hover pill behind desktop nav links; current page link white with accent underline (no `aria-current`).
- **[NOT IN KNOWN LIST]** Magnetic primary buttons (all pages): accent CTA buttons follow the cursor slightly on hover-capable devices.
- **[NOT IN KNOWN LIST]** Scroll-reveal entrance animations (all pages): fade-up / blur-in / zoom-in / flip-up / fade-left once per element; inline `opacity:0` in the HTML with a `<noscript>` style override.
- **[NOT IN KNOWN LIST]** Reduced-motion handling (all pages): framer-motion `MotionConfig reducedMotion="user"` and `prefers-reduced-motion` checks that stop loops (typewriter, carousels of states, slider autoplay, globe animation, chat loop).
- **[NOT IN KNOWN LIST]** Footer wordmark animation (all pages): SVG "TOP OF MIND" outline draws itself on view; gradient outline follows the cursor on hover.
- **[NOT IN KNOWN LIST]** Hero H1 word-by-word reveal and animated highlight box with cursor icon around "a euro" (home).
- **[NOT IN KNOWN LIST]** Hero floating proof cards with mouse parallax and bobbing, only at ≥1400px (home).
- **[NOT IN KNOWN LIST]** Laptop ("MacBook scroll") reveal of the research board image, 300vh sticky scroll, only at ≥md (home section 2).
- **[NOT IN KNOWN LIST]** Services marquee "What we do" (home section 3): infinite horizontal scroll (38 s), 1 visible + 3 aria-hidden copies, pauses on hover.
- **[NOT IN KNOWN LIST]** Scroll-linked word-opacity paragraph with accent on "because it was." (home section 4).
- **[NOT IN KNOWN LIST]** Hand-drawn squiggle strike over pain-point chips and underline-draw on "research first, spend second." (home section 4).
- **[NOT IN KNOWN LIST]** Cursor spotlight on a dotted background (home section 4).
- **[NOT IN KNOWN LIST]** Buying-mode mock animations: quote funnel with leaking dots and "the gap", cart phone ad rotation with hook statuses, calendar grid filling with direct bookings (home section 5 cards; how-you-sell mode visuals).
- **[NOT IN KNOWN LIST]** Scroll-linked process steps with active-step highlight, progress line and sticky cross-fading visual at ≥lg (home section 6).
- **[NOT IN KNOWN LIST]** Typewriter search queries in the research mock (home section 6, process step 1).
- **[NOT IN KNOWN LIST]** Competitor "taken apart" mock with spring-in tags and a sweeping scan line; "Your position" builder mock (home section 6, process steps 2–3).
- **[NOT IN KNOWN LIST]** Bento mini-animations: budget bar re-split toward creative B, self-building browser mock + checklist, social format highlight, lead-gen animated beams + status chip cycle (New request → Qualified → Call booked), live tracking-events feed (home section 7, services discipline sections; budget bar also process week 3).
- **[NOT IN KNOWN LIST]** Rotating fee line "per qualified lead on quote work" / "tied to ad performance on cart" / "tied to direct bookings on calendar" (home section 8).
- **[NOT IN KNOWN LIST]** 3D tilt founder cards with layered depth on hover (home section 9).
- **[NOT IN KNOWN LIST]** Hover image swap greyscale → colour photo on founder cards (home section 9).
- **[NOT IN KNOWN LIST]** "Lamp" light-cone animation behind the final CTA (home section 10).
- **[NOT IN KNOWN LIST]** Orbiting channel chips around "One system", only at ≥1400px (services hero).
- **[NOT IN KNOWN LIST]** Scroll-drawn SVG lines section "Every channel pulls the same way." (170vh sticky, services section 2).
- **[NOT IN KNOWN LIST]** Buying-mode weight table with spring-in rating bars, aria-labels supporting/important/critical, and a mobile card variant (services section 8).
- **[NOT IN KNOWN LIST]** Container-scroll 3D tilt of the "Your first month" plan card (process section 2).
- **[NOT IN KNOWN LIST]** Tracing beam down the method steps (process section 3).
- **[NOT IN KNOWN LIST]** Scroll-progress timeline with sticky week labels (process section 4).
- **[NOT IN KNOWN LIST]** Floating founder bubbles in a spinning ring, only at ≥1680px (team hero).
- **[NOT IN KNOWN LIST]** Founder carousel with Previous/Next buttons, counter "1 / 2", stacked rotated photos, word-by-word bio animation (team section 2); slide 2 (Sebastian) exists only in JS.
- **[NOT IN KNOWN LIST]** Animated-beam "How we split the work" diagram, only at ≥md (team section 3).
- **[NOT IN KNOWN LIST]** WhatsApp-style chat mock with typing indicator loop, only at ≥1400px (contact hero).
- **[NOT IN KNOWN LIST]** Interactive WebGL globe with arcs from Cluj-Napoca, drag to rotate, lazy init, WebGL fallback flag (contact section 5).
- **[NOT IN KNOWN LIST]** How-you-sell hero mode chips (#quote/#cart/#calendar), sticky left rail "Three ways people buy" with scroll-spy highlight (≥lg), "Day 1 → Day 60" progress bar (how-you-sell).
- **[NOT IN KNOWN LIST]** Inline font-preload script in every `<head>` (skipped on file://) and image preload links inside `#root` (index, team).
- **[NOT IN KNOWN LIST]** React hydration of the pre-rendered HTML (`hydrateRoot` on `#root`, all pages), debug logging only when `window.__TOM_DEBUG__` is set.
- **[NOT IN KNOWN LIST]** Legacy vanilla script assets/main.js (not loaded by any page): nav scrolled state, mobile menu, page-transition veil, GSAP enhancements, FAQ accordion, industry grid cell → contact jump, smooth in-page anchor scroll. assets/js/gsap.min.js and ScrollTrigger.min.js are likewise unused.

## Word counts

Counting rule (as in the rewrite plan): text inside `<main>` with scripts/styles removed, tags replaced by spaces, entities decoded, split on whitespace, counting tokens that contain a letter or digit. The first number includes decorative aria-hidden mocks and both mobile/desktop duplicates; the second excludes aria-hidden subtrees (duplicated responsive variants are still counted).

- index.html: ≈1542 words in `<main>` (≈1345 without aria-hidden decorative mocks)
- services.html: ≈802 words in `<main>` (≈719 without aria-hidden decorative mocks)
- process.html: ≈776 words in `<main>` (≈760 without aria-hidden decorative mocks)
- team.html: ≈253 words in `<main>` (≈245 without aria-hidden decorative mocks)
- contact.html: ≈291 words in `<main>` (≈254 without aria-hidden decorative mocks)
- industries.html: 8 words (redirect notice only; no `<main>`)
- how-you-sell (bundle only, never pre-rendered): ≈779 words of visible main copy, counting the left rail once, the selector before any answer is chosen, and excluding the decorative mode visuals
