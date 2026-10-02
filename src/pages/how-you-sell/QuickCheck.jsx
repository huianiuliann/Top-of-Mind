import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { L, useT } from "../../i18n";
import { CALENDAR, CART, QUOTE } from "../../data/buyingModes";
import { easeOutExpo } from "../../components/effects/motion";
// `name` is shown lowercased after "You sell by"; its RO side is the form that follows "Vinzi prin".
const quickCheckModes = [
  {
    ...QUOTE,
    q: L("They ask me for a price first", "Mă întreabă întâi de preț"),
    name: L("The quote", "ofertă"),
    a: L(
      "Nobody buys until they talk to you. We work on the gap between interested and in a conversation — and report qualified quote requests.",
      "Nimeni nu cumpără până nu vorbește cu tine. Lucrăm la drumul dintre „mă interesează” și o discuție adevărată — și raportăm cereri de ofertă calificate.",
    ),
  },
  {
    ...CART,
    q: L("They buy online without talking to me", "Cumpără online fără să vorbească cu mine"),
    name: L("The cart", "coș"),
    a: L(
      "They decide in seconds, on a phone. We work on creative volume and a checkout that doesn't leak — and report profitable orders.",
      "Clientul decide în câteva secunde, de pe telefon. Lucrăm la ritmul în care scoatem reclame noi și la un checkout care nu pierde comenzi — și raportăm comenzi profitabile.",
    ),
  },
  {
    ...CALENDAR,
    q: L("They book a date, a slot or a stay", "Își rezervă o zi, o oră sau o cazare"),
    name: L("The calendar", "calendar"),
    a: L(
      "An empty slot is gone for good. We work on filling dead days and winning bookings back from platforms — and report direct bookings.",
      "Un loc rămas liber azi nu se mai vinde mâine. Lucrăm să umplem zilele goale și să aducem rezervările de pe platforme direct la tine — și raportăm rezervări directe.",
    ),
  },
];
export function HowYouSellQuickCheck() {
  const t = useT();
  const [selected, setSelected] = useState(null);
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-ink-900 p-6 md:p-10">
      <p className="font-mono text-[13px] text-neutral-400">
        {t("Ten-second check", "Test de zece secunde")}
      </p>
      <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
        {t(
          "When a new customer finds you, what happens next?",
          "Când te găsește un client nou, ce face mai departe?",
        )}
      </h3>
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {quickCheckModes.map((mode, index) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300",
              selected === index
                ? "border-accent-400/70 bg-accent-500/[0.1]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-accent-400/40 hover:bg-white/[0.04]",
            )}
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                selected === index ? "bg-accent-500 text-[#ffffff]" : "bg-white/[0.05] text-neutral-400",
              )}
            >
              <mode.icon className="size-5" stroke={1.6} />
            </span>
            <span className="text-[15px] text-neutral-200">{t(mode.q)}</span>
          </button>
        ))}
      </div>
      <div className="relative mt-6 min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          {selected === null ? (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4 font-mono text-[13px] text-neutral-500"
            >
              {t(
                "Pick the closest one — most businesses are clearly one of the three.",
                "Alege varianta care ți se potrivește cel mai bine — aproape orice afacere intră clar într-una din cele trei.",
              )}
            </motion.p>
          ) : (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/12 bg-white/[0.03] p-5 md:flex-row md:items-center"
            >
              <div>
                <p className="font-display text-2xl font-bold tracking-[-0.01em] text-white">
                  {t("You sell by ", "Vinzi prin ")}
                  <em className="em-serif">{t(quickCheckModes[selected].name).toLowerCase()}.</em>
                </p>
                <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
                  {t(quickCheckModes[selected].a)}
                </p>
              </div>
              <a
                href={`#${quickCheckModes[selected].id}`}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[13px] text-neutral-200 hover:text-white"
              >
                {t("Read your mode ", "Vezi detaliile ")}
                <IconArrowRight className="size-4" stroke={1.8} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
