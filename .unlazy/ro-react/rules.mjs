// Text rules shared by verify.mjs, source.mjs and browser.mjs: what may stay identical in both languages, what counts as
// English left in Romanian text, and the Romanian diacritics rules.

// Phrases and tokens that are identical in both languages on purpose (brands, tools, loanwords the RO copy keeps).
export const SAME_OK_PHRASES = [/Research Sprint/gi, /Top of Mind/gi, /Social media/gi, /Meta Ad Library/gi, /Meta Ads?/gi, /Google (?:Ads|Analytics|Tag Manager|Search Console|Business Profile|Maps)/gi, /Meta Business (?:Suite|Manager)/gi];
export const SAME_OK_TOKENS = new Set(
  ("top mind meta ads google ga4 gtm seo whatsapp calendly cluj-napoca tom bureau srl cui iulian huian sebastian răzeșu research sprint lead leads utm roas cpl cpc cpm ctr crm cta kpi kpis api url faq pdf " +
    "ceo cto email online offline pixel tracking site web blog marketing contact studio facebook instagram tiktok linkedin youtube pinterest chrome safari zapier hubspot notion slack shopify wordpress wix webflow figma canva gdpr eur ron " +
    "bolyai babeș follow-up")
    .split(" "),
);
// English function words that must not survive in Romanian text.
export const EN_STOP = new Set("the and your you with for our that this from will can how what when not but we it is to of if all any free more one two day week month first in".split(" "));

export const stripKnown = (text) => {
  // e-mail addresses, URLs, domains and snake_case identifiers (GA4 event names such as add_to_cart) are never translated
  let s = text.replace(/\S+@\S+|https?:\/\/\S+|\b[\w-]+\.(?:me|com|ro|io)\b|\b[a-z0-9]+(?:_[a-z0-9]+)+\b/gi, " ");
  for (const re of SAME_OK_PHRASES) s = s.replace(re, " ");
  return s;
};
// Words of 3+ letters that would need translating (used on text that is identical in EN and RO).
// GA4 event names (page_view, generate_lead, purchase ...) are identifiers shown raw in any language.
const GA4_EVENT = /^(?:[a-z0-9]+(?:_[a-z0-9]+)+|purchase)$/;
export const foreignWords = (text) => (GA4_EVENT.test(text.trim()) ? [] : (stripKnown(text).match(/[\p{L}][\p{L}\p{M}'’-]{2,}/gu) || []).filter((w) => !SAME_OK_TOKENS.has(w.toLowerCase())));
// English function words found in Romanian text.
export const englishLeft = (ro) => (stripKnown(ro).match(/\p{L}+/gu) || []).filter((w) => EN_STOP.has(w.toLowerCase()));

export const CEDILLA = /[şţŞŢ]/;
// Romanian words that must carry diacritics: their ASCII spelling means a letter was dropped.
// ("a doua" = second and "pana" = the feather are correct without diacritics, so they are not listed.)
export const ASCII_RO = /(?<![\p{L}-])(si|sa|cand|iti|imi|inca|fara|tara)(?![\p{L}-])/iu;
export const MOJIBAKE = /Ã.|Ä.|Å.|Ð|â€|�/;
