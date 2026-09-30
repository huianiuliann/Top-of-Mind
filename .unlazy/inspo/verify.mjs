// Oracle for .unlazy/inspo/GATES.md. Usage: node verify.mjs structure|live
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];
const data = JSON.parse(readFileSync(join(here, "research.json"), "utf8"));
const sites = Array.isArray(data) ? data : data.sites;
const fail = (msg) => { console.log("FAIL: " + msg); process.exit(1); };
const isUrl = (u) => { try { return /^https?:$/.test(new URL(u).protocol); } catch { return false; } };

if (!Array.isArray(sites)) fail("no sites array");

if (mode === "structure") {
  const REQUIRED_CATS = ["ro-cee", "boutique-intl", "niche-quote", "niche-cart", "niche-calendar"];
  if (sites.length < 12) fail(`only ${sites.length} sites, need >=12`);
  const names = new Set();
  for (const s of sites) {
    const id = s.name || "(unnamed)";
    if (!s.name || !s.url || !s.category) fail(`${id}: missing name/url/category`);
    if (names.has(s.name.toLowerCase())) fail(`${id}: duplicate`);
    names.add(s.name.toLowerCase());
    if (!isUrl(s.url)) fail(`${id}: bad url ${s.url}`);
    if (!REQUIRED_CATS.includes(s.category)) fail(`${id}: unknown category ${s.category}`);
    if (!Array.isArray(s.success) || s.success.length < 1) fail(`${id}: no success claims`);
    for (const c of s.success) {
      if (!c.claim || !c.claim.trim()) fail(`${id}: empty claim`);
      if (!isUrl(c.source_url)) fail(`${id}: claim without valid source_url`);
    }
    if (!Array.isArray(s.borrow) || s.borrow.filter((b) => b && b.trim().length > 15).length < 2)
      fail(`${id}: needs >=2 substantive borrow patterns`);
  }
  for (const c of REQUIRED_CATS)
    if (!sites.some((s) => s.category === c)) fail(`category ${c} not covered`);
  console.log(`sites=${sites.length} categories=${REQUIRED_CATS.map((c) => c + ":" + sites.filter((s) => s.category === c).length).join(",")}`);
  console.log("research-structure verification passed");
} else if (mode === "live") {
  const urls = [...new Set(sites.flatMap((s) => [s.url, ...(s.success || []).map((c) => c.source_url)]))];
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";
  const check = async (u) => {
    for (const method of ["HEAD", "GET"]) {
      try {
        const r = await fetch(u, { method, redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
        if (method === "HEAD" && (r.status === 405 || r.status >= 400)) continue;
        return r.status;
      } catch (e) {
        if (method === "GET") return "ERR " + (e.cause?.code || e.name);
      }
    }
  };
  const results = [];
  for (let i = 0; i < urls.length; i += 8) {
    const batch = urls.slice(i, i + 8);
    results.push(...(await Promise.all(batch.map(async (u) => [u, await check(u)]))));
  }
  // Bot walls (401/403/429) still prove the host exists and serves the path; dead = DNS/network error, 404/410, 5xx.
  const dead = results.filter(([, st]) => typeof st !== "number" || st === 404 || st === 410 || st >= 500);
  for (const [u, st] of results) console.log(`${st}\t${u}`);
  if (dead.length) fail(`${dead.length} dead url(s): ${dead.map(([u, st]) => `${u} -> ${st}`).join("; ")}`);
  console.log(`checked=${results.length}`);
  console.log("url-liveness verification passed");
} else {
  fail("usage: verify.mjs structure|live");
}
