import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { IconPhoneCall, IconSearch, IconSparkles, IconStar } from "@tabler/icons-react";
import { Chip } from "../ui/Chip";
import { Panel } from "../ui/Panel";
import { L, useLang, useT } from "../../i18n";
function useTypewriterCycle(phrases, running) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(phrases[0].length);
  const [phase, setPhase] = useState("hold");
  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer;
    if (phase === "hold") timer = setTimeout(() => setPhase("del"), 1700);
    else if (phase === "del")
      timer =
        charCount > 0
          ? setTimeout(() => setCharCount(charCount - 1), 18)
          : setTimeout(() => {
              setPhraseIndex((phraseIndex + 1) % phrases.length);
              setPhase("type");
            }, 200);
    else
      timer =
        charCount < phrases[phraseIndex].length
          ? setTimeout(() => setCharCount(charCount + 1), 42)
          : setTimeout(() => setPhase("hold"), 100);
    return () => clearTimeout(timer);
  }, [phase, charCount, phraseIndex, running, phrases]);
  return phrases[phraseIndex].slice(0, charCount);
}
const buyerSearchQueries = [
  L("how long does a custom quote take", "cât durează o ofertă personalizată"),
  L("best mattress for a sore back", "cea mai bună saltea pentru dureri de spate"),
  L("cabin near Cluj with a hot tub", "cabană lângă Cluj cu ciubăr"),
  L("which car seat is actually safest", "care scaun auto e de fapt cel mai sigur"),
];
const buyerSignals = [
  {
    icon: IconSearch,
    src: L("Search", "Căutări"),
    text: L("price range before I call anyone", "preț orientativ înainte să sun"),
  },
  {
    icon: IconStar,
    src: L("Reviews", "Recenzii"),
    text: L("took three weeks to get a reply", "răspuns abia după trei săptămâni"),
  },
  {
    icon: IconPhoneCall,
    src: L("Sales calls", "Apeluri de vânzări"),
    text: L("we just want to see it first", "vrem doar să-l vedem mai întâi"),
  },
];
export function BuyerResearchPanel() {
  const t = useT();
  // types only while visible: the panel is mounted twice on the home page (mobile list + desktop sticky column)
  const searchRef = useRef(null);
  const inView = useInView(searchRef);
  const lang = useLang();
  // one stable array per language: the typewriter effect depends on `phrases`, a new array each render would restart its timers
  const phrases = useMemo(() => buyerSearchQueries.map((query) => t(query)), [lang]);
  const typedText = useTypewriterCycle(phrases, inView);
  return (
    <Panel className="flex h-full w-full flex-col gap-4 p-5 sm:p-6">
      <div
        ref={searchRef}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3"
      >
        <IconSearch className="size-4 text-neutral-500" stroke={1.6} />
        <span className="font-mono text-[13px] text-neutral-200">
          {typedText}
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-white/70" />
        </span>
      </div>
      <p className="font-mono text-[11px] text-neutral-500">
        {t("What buyers actually say", "Ce spun clienții, de fapt")}
      </p>
      <div className="space-y-2.5">
        {buyerSignals.map((signal, index) => (
          <motion.div
            key={signal.src.en}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + index * 0.15, duration: 0.6 }}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-neutral-300">
              <signal.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-neutral-500">{t(signal.src)}</p>
              <p className="text-[13px] text-neutral-200">
                {t("“", "„")}
                {t(signal.text)}”
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[
          L("Google Search", "Căutări Google"),
          L("Reviews", "Recenzii"),
          L("Forums & groups", "Forumuri & grupuri"),
          L("Competitor ads", "Reclamele concurenței"),
          L("Your own sales calls", "Apelurile tale de vânzări"),
        ].map((source) => (
          <Chip key={source.en}>{t(source)}</Chip>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-auto flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.04] p-3.5"
      >
        <IconSparkles className="mt-0.5 size-4 shrink-0 text-neutral-300" stroke={1.6} />
        <p className="text-[13px] leading-snug text-neutral-100">
          <span className="em-serif text-[15px]">{t("Insight:", "Concluzie:")}</span>
          {t(
            " they want proof and a timeline before they want a price.",
            " vor dovezi și un termen înainte să ceară prețul.",
          )}
        </p>
      </motion.div>
    </Panel>
  );
}
