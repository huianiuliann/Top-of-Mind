import { createContext, useContext } from "react";

// Two languages: English is the default and lives at /, Romanian lives at /ro/ (same file names).
// Copy sits next to the markup as an (English, Romanian) pair: t("Services", "Servicii").
// Data defined outside components keeps pairs, L("Services", "Servicii"), and resolves them with t(pair).
const LangContext = createContext("en");

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export const L = (en, ro) => ({ en, ro });

const isPair = (value) => value !== null && typeof value === "object" && "en" in value && "ro" in value;

// t(en, ro) | t(pair) | t(plainString). Both sides may be JSX. A plain string or missing RO side falls back to EN.
export function useT() {
  const lang = useLang();
  return (en, ro) => {
    if (ro === undefined) return isPair(en) ? en[lang] : en;
    return lang === "ro" ? ro : en;
  };
}

// Internal links: English pages sit at the site root, Romanian ones under /ro/.
// RO links are root-absolute because /ro is served without a trailing slash, so a relative link would land on the EN page.
// Anything already absolute, an anchor or with a scheme (https:, mailto:) passes through, so wrapping twice is harmless.
export function useLink() {
  const lang = useLang();
  return (file) => (lang === "ro" && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(file) ? "/ro/" + file : file);
}
