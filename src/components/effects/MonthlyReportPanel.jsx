import { L, useT } from "../../i18n";
export function MonthlyReportPanel() {
  const t = useT();
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,var(--color-ink-900),var(--color-ink-950)_60%)] p-5 font-sans sm:p-7">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="font-display text-[15px] font-bold tracking-[-0.01em] text-white">
            {t("Your month, ", "Luna ta, ")}
            <em className="em-serif text-[16px]">{t("in plain language", "în trei paragrafe")}</em>
          </p>
          <p className="text-[11px] text-neutral-500">
            {t("Written by the two of us, not a dashboard", "Scris de noi doi, nu de un dashboard")}
          </p>
        </div>
        <span className="rounded-md border border-white/15 px-2.5 py-0.5 font-mono text-[10px] text-neutral-400">
          {t("Example", "Exemplu")}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1.25fr_1fr]">
        <div className="space-y-3">
          {[
            {
              h: L("What happened", "Ce s-a întâmplat"),
              p: L(
                "Fewer calls from search in the second half of the month.",
                "Au scăzut apelurile venite din Google după jumătatea lunii.",
              ),
            },
            {
              h: L("Why", "De ce"),
              p: L(
                "Two competitors started bidding on your name. We caught it the same week.",
                "Doi concurenți au început să liciteze pe numele firmei tale. Am prins asta în aceeași săptămână.",
              ),
            },
            {
              h: L("What we change next", "Ce schimbăm mai departe"),
              p: L(
                "Budget moves to the searches they ignore, and your lead time goes into every ad.",
                "Mutăm bugetul pe căutările pe care ei le ignoră și punem termenul tău de livrare în fiecare reclamă.",
              ),
            },
          ].map((item) => (
            <div key={item.h.en} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="font-mono text-[11px] text-neutral-500">{t(item.h)}</p>
              <p className="mt-1 text-[13px] leading-snug text-neutral-200">{t(item.p)}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-xl border border-accent-400 p-3.5">
          <p className="font-mono text-[11px] text-accent-300">
            {t("The number we agreed on", "Indicatorul stabilit împreună")}
          </p>
          <p className="mt-1 font-display text-lg leading-tight font-bold text-white">
            {t("Qualified quote requests", "Cereri de ofertă calificate")}
          </p>
          <svg viewBox="0 0 200 70" className="mt-auto h-20 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="tr-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-accent-400)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 58 L30 54 L60 56 L90 44 L120 46 L150 30 L180 26 L200 18 L200 70 L0 70 Z"
              fill="url(#tr-area)"
            />
            <path
              d="M0 58 L30 54 L60 56 L90 44 L120 46 L150 30 L180 26 L200 18"
              fill="none"
              stroke="var(--color-accent-400)"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="18" r="3" fill="var(--color-accent-200)" />
          </svg>
          <p className="text-[10px] text-neutral-500">
            {t(
              "Same number, every month. No new metrics when it's a bad one.",
              "Același indicator, în fiecare lună. Nu scoatem alte cifre din pălărie când luna e slabă.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
