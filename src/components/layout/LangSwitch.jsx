import { cn } from "../../lib/cn";
import { useLang, useT } from "../../i18n";

const OPTIONS = [
  { code: "en", name: "English" },
  { code: "ro", name: "Română" },
];

// EN | RO. The current language is plain text, the other one links to the same page in that language.
// English home is /index.html, never "/": the Romanian geo redirect on "/" would bounce a visitor who chose English.
export function LangSwitch({ page, className }) {
  const lang = useLang();
  const t = useT();
  const file = page === "home" ? "index.html" : `${page}.html`;
  return (
    <div
      data-lang-switch=""
      role="group"
      aria-label={t("Language", "Limbă")}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-white/10 p-0.5 font-mono text-[12px]",
        className,
      )}
    >
      {OPTIONS.map(({ code, name }) =>
        code === lang ? (
          <span key={code} aria-current="true" className="rounded-full bg-white/10 px-2.5 py-1 text-white">
            {code.toUpperCase()}
          </span>
        ) : (
          <a
            key={code}
            href={code === "ro" ? `/ro/${file}` : `/${file}`}
            lang={code}
            hrefLang={code}
            aria-label={name}
            title={name}
            className="rounded-full px-2.5 py-1 text-neutral-400 transition-colors hover:text-white"
          >
            {code.toUpperCase()}
          </a>
        ),
      )}
    </div>
  );
}
