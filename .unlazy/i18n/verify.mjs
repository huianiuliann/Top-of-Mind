// Oracle for .unlazy/i18n/GATES.md. Usage: node verify.mjs <mode>
// Pure Node, no dependencies. Checks the EN/RO pairs, the language switch and the geo redirect.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const mode = process.argv[2];

const ORIGIN = "https://topofmind.me/";
const EN = ["index", "services", "how-you-sell", "research", "process", "team", "contact", "privacy-policy", "customer-policy"].map((n) => n + ".html");
const RO = EN.map((f) => "ro/" + f);
const ALL = [...EN, ...RO, "404.html"];
const enUrl = (f) => (f === "index.html" ? ORIGIN : ORIGIN + f);
const roUrl = (f) => (f === "index.html" ? ORIGIN + "ro" : ORIGIN + "ro/" + f);
const TODAY = "2026-09-30";

// One canonical Romanian wording per fact, mirroring .unlazy/site-trust/verify.mjs.
const OWN_RO = "Conturile de publicitate, tracking-ul, domeniul și codul site-ului sunt ale tale din prima zi.";
const OWN_DETAIL_RO = "Conturile Meta și Google Ads sunt create pe numele tău sau rămân pe numele tău. Pixelul, GA4 și Google Tag Manager sunt pe conturile tale, iar noi primim acces. Domeniul este înregistrat pe numele tău, iar codul site-ului este al tău.";
const PRICE_RO = "Prețul este fix și confirmat în scris înainte să începem.";
const NOCOMMIT_RO = "Nu ai nicio obligație să continui după aceea.";
const DEDUCT_RO = "Dacă mergi mai departe cu noi, costul sprintului se scade din abonamentul primei luni.";
const FEE_RO = ["per lead calificat", "performanța reclamelor", "rezervări directe"];
const QUESTIONS_RO = ["Cum cumpără clienții tăi?", "Unde se pierd banii azi?", "Suntem potriviți pentru tine?"];
const FAQ_RO = ["Putem cumpăra doar cercetarea?", "Ale cui sunt conturile de publicitate și site-ul?", "Aveți studii de caz?"];
const GEO_EN = "On the home page, Vercel also reads the country of your IP address, without storing it, so that visitors from Romania see the Romanian version first (our legitimate interest in showing the site in your language, art. 6(1)(f)).";
const GEO_RO = "Pe pagina principală, Vercel citește și țara adresei tale IP, fără să o stocheze, ca vizitatorii din România să vadă mai întâi versiunea în română (interesul nostru legitim de a-ți arăta site-ul în limba ta, art. 6 alin. (1) lit. f).";

const errors = [];
const fail = (m) => errors.push(m);
const finish = (token) => {
  if (errors.length) {
    for (const e of errors) console.log("FAIL: " + e);
    process.exit(1);
  }
  console.log(token);
};

const read = (f) => readFileSync(join(root, f), "utf8");
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&");
const visible = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/?(?:a|strong|em|span|b|i|code|small)\b[^>]*>/g, "")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ").trim();
const norm = (s) => s.replace(/\s+/g, " ").trim();
const count = (hay, needle) => hay.split(needle).length - 1;
const meta = (html, key) => (html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`)) || [])[1];

function ldBlocks(html, file) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { out.push(JSON.parse(m[1])); } catch (e) { fail(`${file}: invalid JSON-LD (${e.message})`); }
  }
  return out;
}
const ldNodes = (blocks) => blocks.flatMap((b) => (b["@graph"] ? b["@graph"] : [b]));
const ldStringList = (blocks) => {
  const acc = [];
  const walk = (v) => { if (typeof v === "string") acc.push(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
  blocks.forEach(walk);
  return acc;
};
const ldStrings = (blocks) => ldStringList(blocks).join(" ");
const sectionById = (html, id) => (html.match(new RegExp(`<section[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</section>`)) || [])[1] || null;
const listItems = (html, id) => {
  const m = html.match(new RegExp(`<ul[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</ul>`));
  return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => visible(x[1])) : null;
};
const pageNode = (html, file) => ldNodes(ldBlocks(html, file)).find((n) => ["WebPage", "AboutPage", "ContactPage"].includes(n["@type"]));
const urls = (html) => {
  const out = [];
  for (const m of html.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
    if (m[1] === "srcset") for (const part of m[2].split(",")) out.push(part.trim().split(/\s+/)[0]);
    else out.push(m[2]);
  }
  return out;
};
const external = (u) => /^(https?:|mailto:|tel:|\/\/)/.test(u);
const relative = (u) => !/^(https?:|mailto:|tel:|\/\/|\/|#)/.test(u);

const modes = {
  pairs() {
    for (const f of EN) {
      for (const [file, lang, self, locale, alt] of [[f, "en", enUrl(f), "en_GB", "ro_RO"], ["ro/" + f, "ro", roUrl(f), "ro_RO", "en_GB"]]) {
        if (!existsSync(join(root, file))) { fail(`${file} missing`); continue; }
        const html = read(file);
        if (!html.includes(`<html lang="${lang}">`)) fail(`${file}: html lang is not "${lang}"`);
        if (!html.includes(`<link rel="canonical" href="${self}">`)) fail(`${file}: canonical is not ${self}`);
        const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => m[1] + "=" + m[2]);
        const want = [`en=${enUrl(f)}`, `ro=${roUrl(f)}`, `x-default=${enUrl(f)}`];
        if (alts.join("|") !== want.join("|")) fail(`${file}: hreflang set is [${alts.join(", ")}], expected [${want.join(", ")}]`);
        if (meta(html, "og:url") !== self) fail(`${file}: og:url is ${meta(html, "og:url")}`);
        if (meta(html, "og:locale") !== locale) fail(`${file}: og:locale is ${meta(html, "og:locale")}`);
        if (meta(html, "og:locale:alternate") !== alt) fail(`${file}: og:locale:alternate is ${meta(html, "og:locale:alternate")}`);
        const node = pageNode(html, file);
        if (!node) fail(`${file}: no page JSON-LD node`);
        else {
          if (node.url !== self) fail(`${file}: JSON-LD url is ${node.url}`);
          if (node["@id"] !== self + "#webpage") fail(`${file}: JSON-LD @id is ${node["@id"]}`);
          if (node.inLanguage !== lang) fail(`${file}: JSON-LD inLanguage is ${node.inLanguage}`);
        }
      }
    }
    finish("i18n pairs verification passed");
  },

  switch() {
    const expect = (file, href, hreflang, label, text) => {
      if (!existsSync(join(root, file))) return fail(`${file} missing`);
      const html = read(file);
      const header = (html.match(/<header class="site-header">([\s\S]*?)<\/header>/) || [])[1] || "";
      const all = html.match(/<a class="lang-switch"[^>]*>[^<]*<\/a>/g) || [];
      const tag = `<a class="lang-switch" href="${href}" hreflang="${hreflang}" lang="${hreflang}" aria-label="${label}">${text}</a>`;
      if (all.length !== 1) fail(`${file}: ${all.length} lang-switch links, need 1`);
      else if (all[0] !== tag) fail(`${file}: lang-switch is ${all[0]}, expected ${tag}`);
      if (!header.includes(tag)) fail(`${file}: lang-switch not inside the site header`);
    };
    for (const f of EN) {
      expect(f, "/ro/" + f, "ro", "Română", "RO");
      expect("ro/" + f, "/" + f, "en", "English", "EN");
      // A bare "/" from a Romanian page would bounce Romanian visitors straight back to /ro.
      if (existsSync(join(root, "ro/" + f)) && /\shref="\/"/.test(read("ro/" + f))) fail(`ro/${f}: links to bare "/", which the geo redirect sends back to /ro`);
    }
    expect("404.html", "/ro/index.html", "ro", "Română", "RO");
    if (!/<p lang="ro">[^<]*<a href="\/ro\/index\.html">/.test(read("404.html"))) fail("404.html: no Romanian paragraph linking to /ro/index.html");
    finish("i18n switch verification passed");
  },

  links() {
    for (const u of ["services.html", "../assets/css/main.css", "assets/img/x.webp"]) if (!relative(u)) fail(`control: relative detector misses "${u}"`);
    for (const u of ["/ro/services.html", "#main", "https://topofmind.me/", "mailto:a@b.c", "tel:+40"]) if (relative(u)) fail(`control: relative detector flags "${u}"`);
    if (errors.length) return finish("");
    let checked = 0;
    for (const p of ALL) {
      if (!existsSync(join(root, p))) { fail(`${p} missing`); continue; }
      for (const url of urls(read(p))) {
        if (external(url) || url === "#") continue;
        if (p.startsWith("ro/") && relative(url)) fail(`${p}: relative url "${url}" (breaks when /ro is served without a trailing slash)`);
        const [file, frag] = url.split("#");
        let target = file === "" ? p : file.startsWith("/") ? file.slice(1) : posix.join(posix.dirname(p), file);
        if (target === "" || (existsSync(join(root, target)) && statSync(join(root, target)).isDirectory())) target = posix.join(target, "index.html");
        checked++;
        if (!existsSync(join(root, target))) { fail(`${p}: ${url} -> ${target} not found`); continue; }
        if (frag && target.endsWith(".html")) {
          const ids = new Set([...read(target).matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
          if (!ids.has(frag)) fail(`${p}: ${url} -> id "${frag}" not found in ${target}`);
        }
      }
    }
    console.log(`internal references checked: ${checked}`);
    finish("i18n links verification passed");
  },

  parity() {
    const TAGS = ["h1", "h2", "h3", "p", "li", "ul", "ol", "section", "details", "a", "img", "dt", "dd", "tr", "td", "th", "strong", "button"];
    for (const f of EN) {
      if (!existsSync(join(root, "ro/" + f))) { fail(`ro/${f} missing`); continue; }
      const en = read(f);
      const ro = read("ro/" + f);
      const ids = (h) => [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).join("|");
      if (ids(en) !== ids(ro)) fail(`${f}: ids differ between EN and RO`);
      for (const t of TAGS) {
        const c = (h) => (h.match(new RegExp(`<${t}[\\s>]`, "g")) || []).length;
        if (c(en) !== c(ro)) fail(`${f}: <${t}> count EN ${c(en)} vs RO ${c(ro)}`);
      }
      const types = (h, file) => ldNodes(ldBlocks(h, file)).map((n) => JSON.stringify(n["@type"])).join("|");
      if (types(en, f) !== types(ro, "ro/" + f)) fail(`${f}: JSON-LD node types differ`);
      for (const a of ["data-cta", "data-consent-open", "data-consent-mode", 'target="_blank"', "aria-current"]) if (count(en, a) !== count(ro, a)) fail(`${f}: "${a}" count EN ${count(en, a)} vs RO ${count(ro, a)}`);
    }
    finish("i18n parity verification passed");
  },

  untranslated() {
    // Function words catch sentences; UI words catch short labels such as "Book a call". None is a Romanian word.
    // \p{L} boundaries, not \b: \b treats ș/ț/ă as non-letters, so "forțăm" would match "for".
    const STOP = /(?<!\p{L})(the|and|your|you|our|we|with|this|that|what|how|is|of|to|for|book|call|read|more|about|home|page|policy|privacy|settings|skip|menu|team|services|process|research|contact us|opens)(?!\p{L})/iu;
    const CEDILLA = /[şţŞŢ]/;
    const ALLOW = ["Top of Mind", "Research Sprint", "EU-US Data Privacy Framework"];
    const clean = (s) => ALLOW.reduce((acc, a) => acc.split(a).join(" "), s);
    const flagged = (s) => STOP.test(clean(s)) || CEDILLA.test(s);
    for (const s of ["Read the cookie section of our Privacy Policy", "Book a call", "Să şi"]) if (!flagged(s)) fail(`control: misses "${s}"`);
    for (const s of ["Top of Mind este un studio din Cluj-Napoca.", "Conturile Meta Ads și Google Ads sunt ale tale.", "Programează un apel pe Calendly", "nu forțăm aceeași rețetă", "Research Sprint"]) if (flagged(s)) fail(`control: flags "${s}"`);
    if (errors.length) return finish("");
    for (const f of RO) {
      if (!existsSync(join(root, f))) { fail(`${f} missing`); continue; }
      const html = read(f);
      const texts = [visible(html)];
      for (const m of html.matchAll(/\s(?:alt|aria-label|title)="([^"]*)"/g)) texts.push(decode(m[1]));
      for (const k of ["description", "og:title", "og:description", "og:image:alt"]) texts.push(decode(meta(html, k) || ""));
      texts.push(...ldStringList(ldBlocks(html, f)).filter((s) => !/^https?:/.test(s)));
      for (const t of texts) {
        const hit = clean(t).match(STOP);
        if (hit) fail(`${f}: English word "${hit[0]}" in "${t.slice(Math.max(0, hit.index - 30), hit.index + 30)}"`);
        const ced = t.match(CEDILLA);
        if (ced) fail(`${f}: cedilla "${ced[0]}" (use comma-below ș ț)`);
      }
    }
    finish("i18n untranslated verification passed");
  },

  roinv() {
    const all = (f) => { const h = read(f); return visible(h) + " " + ldStrings(ldBlocks(h, f)); };
    for (const f of ["ro/customer-policy.html", "ro/index.html", "ro/services.html"]) if (!visible(read(f)).includes(OWN_RO)) fail(`${f}: canonical ownership sentence missing`);
    if (count(all("ro/contact.html"), OWN_RO) < 2) fail("ro/contact.html: ownership sentence must be in visible FAQ and JSON-LD");
    for (const [f, need] of [["ro/customer-policy.html", 1], ["ro/contact.html", 2]]) if (count(all(f), OWN_DETAIL_RO) < need) fail(`${f}: detailed ownership wording found ${count(all(f), OWN_DETAIL_RO)}x, need ${need}`);
    for (const [f, need] of [["ro/research.html", 1], ["ro/customer-policy.html", 1], ["ro/contact.html", 2]]) {
      for (const c of [PRICE_RO, NOCOMMIT_RO, DEDUCT_RO]) if (count(all(f), c) < need) fail(`${f}: "${c.slice(0, 40)}..." found ${count(all(f), c)}x, need ${need}`);
      if (!all(f).includes("Research Sprint")) fail(`${f}: no "Research Sprint"`);
    }
    const fee = sectionById(read("ro/services.html"), "fee");
    if (!fee) fail('ro/services.html: no <section id="fee">');
    else {
      for (const p of FEE_RO) if (!visible(fee).includes(p)) fail(`ro/services.html#fee lacks "${p}"`);
      if (/\d/.test(visible(fee))) fail("ro/services.html#fee contains a digit");
    }
    for (const p of FEE_RO) {
      if (!visible(read("ro/customer-policy.html")).includes(p)) fail(`ro/customer-policy.html lacks "${p}"`);
      if (count(all("ro/contact.html"), p) < 2) fail(`ro/contact.html: "${p}" must be in visible FAQ and JSON-LD`);
    }
    if (count(read("ro/how-you-sell.html"), 'href="/ro/services.html#fee"') < 3) fail("ro/how-you-sell.html: need 3 links to /ro/services.html#fee");
    if (count(read("ro/index.html"), 'href="/ro/services.html#fee"') < 1) fail("ro/index.html: no link to /ro/services.html#fee");
    const list = listItems(read("ro/research.html"), "sprint-deliverables");
    if (!list || list.length !== 9) fail(`ro/research.html: ${list ? list.length : 0} sprint deliverables, expected 9`);
    else {
      const pl = new Set([...read("ro/process.html").matchAll(/<li>([^<]+)<\/li>/g)].map((x) => visible(x[1])));
      for (const d of list) if (!pl.has(d)) fail(`sprint deliverable not verbatim in ro/process.html: "${d}"`);
    }
    const weeks = [...read("ro/research.html").matchAll(/<li><strong>(Săptămâna [12]:[^<]*)<\/strong>([^<]*)<\/li>/g)].map((m) => visible(m[1]) + " " + visible(m[2]));
    if (weeks.length !== 2) fail(`ro/research.html: ${weeks.length} week rows, expected 2`);
    for (const w of weeks) if (!visible(read("ro/process.html")).includes(w)) fail(`week row not verbatim in ro/process.html: "${w.slice(0, 40)}..."`);
    for (const q of QUESTIONS_RO) for (const f of ["ro/research.html", "ro/contact.html"]) if (!visible(read(f)).includes(q)) fail(`${f} lacks question "${q}"`);
    const html = read("ro/contact.html");
    const faqVisible = [...html.matchAll(/<details class="faq__item"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map((m) => [visible(m[1]), visible(m[2])]);
    const faq = ldNodes(ldBlocks(html, "ro/contact.html")).find((n) => n["@type"] === "FAQPage");
    if (!faq) fail("ro/contact.html: no FAQPage JSON-LD");
    else {
      const ld = faq.mainEntity.map((q) => [norm(q.name), norm(q.acceptedAnswer.text)]);
      if (faqVisible.length !== ld.length || faqVisible.length !== 8) fail(`ro/contact.html: FAQ ${faqVisible.length} visible vs ${ld.length} JSON-LD, expected 8`);
      faqVisible.forEach(([q, a], i) => {
        if (!ld[i]) return;
        if (q !== ld[i][0]) fail(`ro FAQ #${i + 1} question differs: "${q}" vs "${ld[i][0]}"`);
        if (a !== ld[i][1]) fail(`ro FAQ #${i + 1} answer differs (visible vs JSON-LD)`);
      });
      for (const q of FAQ_RO) if (!faqVisible.some(([x]) => x === q)) fail(`ro FAQ lacks "${q}"`);
      const cs = faqVisible.find(([x]) => x === "Aveți studii de caz?");
      if (cs && !cs[1].startsWith("Încă nu avem studii publicate:")) fail("ro case-studies answer does not keep the honest opening");
    }
    finish("i18n roinv verification passed");
  },

  rosafe() {
    const price = /(?:€|£|\$)\s?\d|\d[\d.,]*\s?(?:€|£|\$|lei|ron|eur|euro|euros|usd)(?![a-z])/i;
    for (const s of ["1.500 lei", "€500", "500 EUR", "de la 300 euro"]) if (!price.test(s)) fail(`control: price regex misses "${s}"`);
    for (const s of ["30 de minute", "+40 756 883 206", "înainte să cheltuim un euro", "CUI 54043345"]) if (price.test(s)) fail(`control: price regex flags "${s}"`);
    if (errors.length) return finish("");
    for (const p of [...RO, "404.html"]) {
      if (!existsSync(join(root, p))) { fail(`${p} missing`); continue; }
      const html = read(p);
      const hit = html.match(price);
      if (hit) fail(`${p}: looks like a price: "${hit[0]}"`);
      for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
        if (/\ssrc=/.test(m[1])) { if (!/\ssrc="\/assets\/js\/main\.js"/.test(m[1])) fail(`${p}: unexpected script src`); }
        else if (!/type="application\/ld\+json"/.test(m[1])) fail(`${p}: inline script`);
      }
      if (/<style\b/i.test(html) || /\sstyle\s*=/i.test(html)) fail(`${p}: inline style`);
      if (/\son[a-z]+\s*=\s*["']/i.test(html)) fail(`${p}: inline event handler`);
      for (const m of html.matchAll(/<(img|script|iframe|source)\b[^>]*\ssrc="((?:https?:)?\/\/[^"]*)"/g)) fail(`${p}: external ${m[1]} src ${m[2]}`);
      for (const m of html.matchAll(/<link\b[^>]*>/g)) if (!/rel="(?:canonical|alternate)"/.test(m[0]) && /href="(?:https?:)?\/\//.test(m[0])) fail(`${p}: external link resource ${m[0]}`);
      ldBlocks(html, p);
    }
    finish("i18n rosafe verification passed");
  },

  redirect() {
    const now = JSON.parse(read("vercel.json"));
    const head = JSON.parse(execFileSync("git", ["show", "HEAD:vercel.json"], { cwd: root, encoding: "utf8" }));
    const isGeo = (r) => (r.has || []).some((h) => h.key === "x-vercel-ip-country");
    const geo = (now.redirects || []).filter(isGeo);
    if (geo.length !== 1) fail(`${geo.length} geo redirects, need 1`);
    else {
      const g = geo[0];
      const want = { source: "/", has: [{ type: "header", key: "x-vercel-ip-country", value: "RO" }], destination: "/ro", permanent: false };
      if (JSON.stringify(g) !== JSON.stringify(want)) fail(`geo redirect is ${JSON.stringify(g)}, expected ${JSON.stringify(want)}`);
    }
    if ((now.redirects || []).some((r) => r.source === "/index.html" || r.source === "/:path*")) fail("a redirect touches /index.html, which the EN switch relies on");
    if (JSON.stringify(now.redirects.filter((r) => !isGeo(r))) !== JSON.stringify(head.redirects)) fail("non-geo redirects changed");
    for (const k of new Set([...Object.keys(now), ...Object.keys(head)])) if (k !== "redirects" && JSON.stringify(now[k]) !== JSON.stringify(head[k])) fail(`vercel.json "${k}" changed`);
    finish("i18n redirect verification passed");
  },

  regress() {
    const script = join(root, ".unlazy", "site-trust", "verify.mjs");
    for (const m of ["page", "nav", "links", "noprice", "ownership", "fee", "sprint", "faqld", "csp", "dates", "memory"]) {
      try {
        const out = execFileSync(process.execPath, [script, m], { cwd: root, encoding: "utf8" });
        if (!out.includes(`site-trust ${m} verification passed`)) fail(`site-trust ${m}: no pass token`);
      } catch (e) {
        fail(`site-trust ${m}: ${(e.stdout || e.message).trim().split("\n").slice(0, 3).join(" / ")}`);
      }
    }
    finish("i18n regress verification passed");
  },

  publish() {
    const sitemap = read("sitemap.xml");
    const lastmod = Object.fromEntries([...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]));
    for (const f of EN) {
      if (!lastmod[enUrl(f)]) fail(`sitemap.xml lacks ${enUrl(f)}`);
      if (lastmod[roUrl(f)] !== TODAY) fail(`sitemap.xml: ${roUrl(f)} missing or lastmod not ${TODAY}`);
    }
    if (lastmod[enUrl("privacy-policy.html")] !== TODAY) fail("sitemap.xml: privacy-policy lastmod not updated");
    if (!read("llms.txt").includes(`(${ORIGIN}ro)`)) fail("llms.txt lacks the Romanian home link");
    const en = read("privacy-policy.html");
    const ro = read("ro/privacy-policy.html");
    if (!visible(en).includes(GEO_EN)) fail("privacy-policy.html: geo sentence missing");
    if (!visible(ro).includes(GEO_RO)) fail("ro/privacy-policy.html: geo sentence missing");
    if (!visible(en).includes("Last updated: 30 September 2026")) fail("privacy-policy.html: Last updated not 30 September 2026");
    if (!visible(ro).includes("Ultima actualizare: 30 septembrie 2026")) fail("ro/privacy-policy.html: Ultima actualizare not 30 septembrie 2026");
    for (const f of ["privacy-policy.html", "ro/privacy-policy.html"]) {
      const node = pageNode(read(f), f);
      if (!node || node.dateModified !== TODAY) fail(`${f}: dateModified not ${TODAY}`);
    }
    finish("i18n publish verification passed");
  },
};

if (!modes[mode]) {
  console.log("usage: verify.mjs " + Object.keys(modes).join("|"));
  process.exit(2);
}
try {
  modes[mode]();
} catch (e) {
  console.log("FAIL: exception in mode " + mode + ": " + e.message);
  process.exit(1);
}
