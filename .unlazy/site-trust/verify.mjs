// Oracle for .unlazy/site-trust/GATES.md. Usage: node verify.mjs <mode>
// Pure Node, no dependencies. One canonical wording per fact, defined here once.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const mode = process.argv[2];

const PAGES = ["index", "services", "how-you-sell", "process", "research", "team", "contact", "privacy-policy", "customer-policy", "404"].map((n) => n + ".html");
const DATED = ["index", "services", "how-you-sell", "process", "research", "contact", "customer-policy"].map((n) => n + ".html");
const TODAY = "2026-09-30";
const ORIGIN = "https://topofmind.me/";

const CANON_OWNERSHIP = "Your ad accounts, tracking, domain and website code are yours from day one.";
const DETAIL_OWNERSHIP = "The Meta and Google Ads accounts are created in your name or stay in it. The pixel, GA4 and Google Tag Manager sit on your accounts, and we get access. Your domain is registered in your name and the website code is yours.";
const CANON_PRICE = "The price is fixed and confirmed in writing before we start.";
const CANON_NOCOMMIT = "There is no commitment to continue afterwards.";
const CANON_DEDUCT = "If you continue with us, the sprint fee is deducted from your first month's retainer.";
const OLD_OWNERSHIP = "and when access to them passes to you, is set out in your proposal or contract";
const QUESTIONS = ["How do your customers buy?", "Where is the money leaking today?", "Are we the right fit?"];

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

function ldBlocks(html, file) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { out.push(JSON.parse(m[1])); } catch (e) { fail(`${file}: invalid JSON-LD (${e.message})`); }
  }
  return out;
}
const ldNodes = (blocks) => blocks.flatMap((b) => (b["@graph"] ? b["@graph"] : [b]));
const ldStrings = (blocks) => {
  const acc = [];
  const walk = (v) => { if (typeof v === "string") acc.push(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
  blocks.forEach(walk);
  return acc.join(" ");
};
const count = (hay, needle) => hay.split(needle).length - 1;
const sectionById = (html, id) => {
  const m = html.match(new RegExp(`<section[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</section>`));
  return m ? m[1] : null;
};
const navList = (html) => {
  const m = html.match(/<ul class="site-nav__list">([\s\S]*?)<\/ul>/);
  return m ? norm(m[1].replace(/\saria-current="page"/g, "").replace(/href="\//g, 'href="')) : null;
};

const modes = {
  page() {
    const f = "research.html";
    if (!existsSync(join(root, f))) return (fail(`${f} does not exist`), finish(""));
    const html = read(f);
    const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
    if (!title || !title.endsWith("| Top of Mind")) fail(`${f}: title missing or not "... | Top of Mind"`);
    const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    if (!desc || desc.length < 50 || desc.length > 200) fail(`${f}: meta description missing or outside 50-200 chars`);
    if (!html.includes(`<link rel="canonical" href="${ORIGIN}research.html">`)) fail(`${f}: canonical wrong`);
    for (const p of ["og:title", "og:description", "og:url", "og:image"]) if (!html.includes(`property="${p}"`)) fail(`${f}: missing ${p}`);
    if (!html.includes(`<meta property="og:url" content="${ORIGIN}research.html">`)) fail(`${f}: og:url wrong`);
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(`${f}: ${h1} h1 elements, need 1`);
    const blocks = ldBlocks(html, f);
    const nodes = ldNodes(blocks);
    if (!nodes.some((n) => n["@type"] === "WebPage")) fail(`${f}: no WebPage JSON-LD`);
    if (!nodes.some((n) => n["@type"] === "Service" && n.name === "Research Sprint")) fail(`${f}: no Service "Research Sprint" JSON-LD`);
    const raw = JSON.stringify(blocks);
    if (/"Offer"|"price|"priceRange"/.test(raw)) fail(`${f}: JSON-LD carries offer/price data`);
    if (!read("sitemap.xml").includes(`<loc>${ORIGIN}research.html</loc>`)) fail("sitemap.xml lacks research.html");
    if (!read("llms.txt").includes("research.html")) fail("llms.txt lacks research.html");
    finish("site-trust page verification passed");
  },

  nav() {
    const missing = PAGES.filter((p) => !existsSync(join(root, p)));
    if (missing.length) return fail(`missing pages: ${missing.join(", ")}`), finish("");
    const navs = PAGES.map((p) => [p, navList(read(p))]);
    for (const [p, n] of navs) if (!n) fail(`${p}: no site-nav__list`);
    const ref = navs[0][1];
    for (const [p, n] of navs) if (n && n !== ref) fail(`${p}: nav differs from ${navs[0][0]}`);
    if (ref) {
      const order = ["services.html", "how-you-sell.html", "research.html", "process.html", "team.html", "contact.html"];
      const found = [...ref.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      if (found.join("|") !== order.join("|")) fail(`nav order is ${found.join(", ")}; expected ${order.join(", ")}`);
    }
    if (existsSync(join(root, "research.html")) && !/<a href="research\.html" aria-current="page">/.test(read("research.html"))) fail("research.html: own nav link lacks aria-current");
    finish("site-trust nav verification passed");
  },

  links() {
    let checked = 0;
    for (const p of PAGES) {
      if (!existsSync(join(root, p))) { fail(`${p} missing`); continue; }
      const html = read(p);
      for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        const url = m[1];
        if (/^(https?:|mailto:|tel:|\/\/)/.test(url) || url === "#") continue;
        const [file, frag] = url.split("#");
        const target = file === "" ? p : file;
        checked++;
        if (!existsSync(join(root, target))) { fail(`${p}: ${url} -> file ${target} not found`); continue; }
        if (frag && target.endsWith(".html")) {
          const ids = new Set([...read(target).matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
          if (!ids.has(frag)) fail(`${p}: ${url} -> id "${frag}" not found in ${target}`);
        }
      }
    }
    console.log(`internal references checked: ${checked}`);
    finish("site-trust links verification passed");
  },

  noprice() {
    const price = /(?:€|£|\$)\s?\d|\d[\d.,]*\s?(?:€|£|\$|lei|ron|eur|euro|euros|usd)(?![a-z])/i;
    const positives = ["1.500 lei", "€500", "500 EUR", "$1,200", "2000 RON", "de la 300 euro"];
    const negatives = ["30 minutes", "+40 756 883 206", "a euro is spent", "CUI 54043345", "before a euro of your budget", "46.7712"];
    for (const s of positives) if (!price.test(s)) fail(`control: price regex misses "${s}"`);
    for (const s of negatives) if (price.test(s)) fail(`control: price regex flags "${s}"`);
    if (errors.length) return finish("");
    for (const f of [...PAGES, "llms.txt", "sitemap.xml"]) {
      if (!existsSync(join(root, f))) continue;
      const hit = read(f).match(price);
      if (hit) fail(`${f}: looks like a price: "${hit[0]}"`);
    }
    finish("site-trust noprice verification passed");
  },

  ownership() {
    for (const f of ["customer-policy.html", "index.html", "services.html", "contact.html"]) {
      if (!visible(read(f)).includes(CANON_OWNERSHIP)) fail(`${f}: canonical ownership sentence missing`);
    }
    for (const f of ["customer-policy.html", "contact.html"]) {
      const all = visible(read(f)) + " " + ldStrings(ldBlocks(read(f), f));
      const need = f === "contact.html" ? 2 : 1;
      if (count(all, DETAIL_OWNERSHIP) < need) fail(`${f}: detailed ownership wording found ${count(all, DETAIL_OWNERSHIP)}x, need ${need}`);
    }
    const c = visible(read("contact.html")) + " " + ldStrings(ldBlocks(read("contact.html"), "contact.html"));
    if (count(c, CANON_OWNERSHIP) < 2) fail("contact.html: canonical ownership sentence must appear in visible FAQ and JSON-LD");
    if (visible(read("customer-policy.html")).includes(OLD_OWNERSHIP)) fail("customer-policy.html: old ownership wording still present");
    const idx = read("index.html");
    const cols = [...idx.matchAll(/<div class="compare__col">([\s\S]*?)<\/div>/g)].map((m) => (m[1].match(/<li>/g) || []).length);
    if (cols.length !== 2 || cols[0] !== cols[1]) fail(`index.html: compare columns have ${cols.join(" vs ")} items, need equal`);
    finish("site-trust ownership verification passed");
  },

  fee() {
    const services = read("services.html");
    const sec = sectionById(services, "fee");
    if (!sec) return fail('services.html: no <section id="fee">'), finish("");
    const t = visible(sec);
    for (const p of ["per qualified lead", "ad performance", "direct bookings"]) if (!t.toLowerCase().includes(p)) fail(`services.html#fee lacks "${p}"`);
    if (/\d/.test(t)) fail(`services.html#fee contains a digit: "${(t.match(/.{0,15}\d.{0,15}/) || [""])[0]}"`);
    if (!/href="#fee"/.test(services)) fail("services.html hero list does not link to #fee");
    const cp = visible(read("customer-policy.html"));
    for (const p of ["per qualified lead", "ad performance", "direct bookings"]) if (!cp.includes(p)) fail(`customer-policy.html lacks "${p}"`);
    const ct = visible(read("contact.html")) + " " + ldStrings(ldBlocks(read("contact.html"), "contact.html"));
    for (const p of ["per qualified lead", "ad performance", "direct bookings"]) if (count(ct, p) < 2) fail(`contact.html: "${p}" must be in visible FAQ and JSON-LD`);
    if (count(read("how-you-sell.html"), 'href="services.html#fee"') < 3) fail("how-you-sell.html: need 3 links to services.html#fee");
    if (count(read("index.html"), 'href="services.html#fee"') < 1) fail("index.html: no link to services.html#fee");
    finish("site-trust fee verification passed");
  },

  sprint() {
    const research = read("research.html");
    const process_ = read("process.html");
    const items = (html, id) => {
      const m = html.match(new RegExp(`<ul[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</ul>`));
      return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => visible(x[1])) : null;
    };
    const list = items(research, "sprint-deliverables");
    if (!list) fail('research.html: no <ul id="sprint-deliverables">');
    else {
      if (list.length !== 9) fail(`research.html: ${list.length} sprint deliverables, expected 9`);
      const pl = new Set([...process_.matchAll(/<li>([^<]+)<\/li>/g)].map((x) => visible(x[1])));
      for (const d of list) if (!pl.has(d)) fail(`sprint deliverable not verbatim in process.html: "${d}"`);
    }
    const weeks = [...research.matchAll(/<li><strong>(Week [12]:[^<]*)<\/strong>([^<]*)<\/li>/g)].map((m) => visible(m[1]) + " " + visible(m[2]));
    if (weeks.length !== 2) fail(`research.html: ${weeks.length} week rows, expected 2`);
    const pv = visible(process_);
    for (const w of weeks) if (!pv.includes(w)) fail(`week row not verbatim in process.html: "${w.slice(0, 40)}..."`);
    const rv = visible(research);
    for (const q of QUESTIONS) {
      if (!rv.includes(q)) fail(`research.html lacks preview question "${q}"`);
      if (!visible(read("contact.html")).includes(q)) fail(`contact.html lacks call question "${q}"`);
    }
    for (const [f, need] of [["research.html", 1], ["customer-policy.html", 1], ["contact.html", 2]]) {
      const html = read(f);
      const all = visible(html) + " " + ldStrings(ldBlocks(html, f));
      for (const c of [CANON_PRICE, CANON_NOCOMMIT, CANON_DEDUCT]) if (count(all, c) < need) fail(`${f}: "${c.slice(0, 40)}..." found ${count(all, c)}x, need ${need}`);
      if (!all.includes("Research Sprint")) fail(`${f}: no "Research Sprint"`);
    }
    if (!read("llms.txt").includes("Research Sprint")) fail("llms.txt lacks Research Sprint");
    if (!/href="research\.html"/.test(read("index.html"))) fail("index.html: no link to research.html besides nav");
    if (count(read("index.html"), 'href="research.html"') < 2) fail("index.html: need nav link plus a next-link to research.html");
    if (count(read("process.html"), 'href="research.html"') < 2) fail("process.html: need nav link plus a next-link to research.html");
    finish("site-trust sprint verification passed");
  },

  faqld() {
    const html = read("contact.html");
    const visibleFaq = [...html.matchAll(/<details class="faq__item"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map((m) => [visible(m[1]), visible(m[2])]);
    const faq = ldNodes(ldBlocks(html, "contact.html")).find((n) => n["@type"] === "FAQPage");
    if (!faq) return fail("contact.html: no FAQPage JSON-LD"), finish("");
    const ld = faq.mainEntity.map((q) => [norm(q.name), norm(q.acceptedAnswer.text)]);
    if (visibleFaq.length !== ld.length) fail(`FAQ has ${visibleFaq.length} visible items but ${ld.length} in JSON-LD`);
    visibleFaq.forEach(([q, a], i) => {
      if (!ld[i]) return;
      if (q !== ld[i][0]) fail(`FAQ #${i + 1} question differs: "${q}" vs "${ld[i][0]}"`);
      if (a !== ld[i][1]) fail(`FAQ #${i + 1} answer differs (visible vs JSON-LD)`);
    });
    for (const q of ["Can we buy just the research?", "Who owns the ad accounts and the website?", "Do you have case studies?"]) if (!visibleFaq.some(([x]) => x === q)) fail(`FAQ lacks "${q}"`);
    const cs = visibleFaq.find(([x]) => x === "Do you have case studies?");
    if (cs && !cs[1].startsWith("Not published ones yet:")) fail("case-studies FAQ answer was changed");
    finish("site-trust faqld verification passed");
  },

  csp() {
    for (const p of PAGES) {
      const html = read(p);
      for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
        const a = m[1];
        if (/\ssrc=/.test(a)) { if (!/\ssrc="\/?assets\/js\/main\.js"/.test(a)) fail(`${p}: unexpected script src`); }
        else if (!/type="application\/ld\+json"/.test(a)) fail(`${p}: inline script`);
      }
      if (/<style\b/i.test(html)) fail(`${p}: <style> element`);
      if (/\sstyle\s*=/i.test(html)) fail(`${p}: style attribute`);
      if (/\son[a-z]+\s*=\s*["']/i.test(html)) fail(`${p}: inline event handler`);
      for (const m of html.matchAll(/<(img|script|iframe|source)\b[^>]*\ssrc="((?:https?:)?\/\/[^"]*)"/g)) fail(`${p}: external ${m[1]} src ${m[2]}`);
      for (const m of html.matchAll(/<link\b[^>]*>/g)) {
        const l = m[0];
        if (/rel="(?:canonical|alternate)"/.test(l)) continue;
        if (/href="(?:https?:)?\/\//.test(l)) fail(`${p}: external link resource ${l}`);
      }
      ldBlocks(html, p);
    }
    finish("site-trust csp verification passed");
  },

  dates() {
    const sitemap = read("sitemap.xml");
    const lastmod = Object.fromEntries([...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]));
    for (const f of DATED) {
      const html = read(f);
      const node = ldNodes(ldBlocks(html, f)).find((n) => n.dateModified);
      if (!node || node.dateModified !== TODAY) fail(`${f}: dateModified is ${node ? node.dateModified : "missing"}, expected ${TODAY}`);
      const loc = f === "index.html" ? ORIGIN : ORIGIN + f;
      if (lastmod[loc] !== TODAY) fail(`sitemap.xml: ${loc} lastmod is ${lastmod[loc]}, expected ${TODAY}`);
    }
    if (!visible(read("customer-policy.html")).includes("Last updated: 30 September 2026")) fail("customer-policy.html: Last updated line not 30 September 2026");
    finish("site-trust dates verification passed");
  },

  memory() {
    const dir = join(homedir(), ".claude", "projects", "C--Users-Administrator-Desktop-Top-of-Mind", "memory");
    const files = ["redesign-klientboost-style", "pending-case-study", "public-pricing-policy"];
    const index = existsSync(join(dir, "MEMORY.md")) ? readFileSync(join(dir, "MEMORY.md"), "utf8") : "";
    if (!index) fail("MEMORY.md missing");
    for (const n of files) {
      const p = join(dir, n + ".md");
      if (!existsSync(p)) { fail(`${n}.md missing`); continue; }
      const t = readFileSync(p, "utf8");
      const fm = t.match(/^---\r?\nname: (.+)\r?\ndescription: (.+)\r?\nmetadata:\r?\n(?: {2}.+\r?\n)*? {2}type: (user|feedback|project|reference)\r?\n(?: {2}.+\r?\n)*---\r?\n/);
      if (!fm) fail(`${n}.md: frontmatter invalid`);
      else if (fm[1].trim() !== n) fail(`${n}.md: name is "${fm[1]}"`);
      if (!index.includes(`(${n}.md)`)) fail(`MEMORY.md has no pointer to ${n}.md`);
    }
    finish("site-trust memory verification passed");
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
