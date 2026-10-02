import { motion } from "framer-motion";
import { Chip } from "../ui/Chip";
import { Panel } from "../ui/Panel";
import { L, useT } from "../../i18n";
const competitorTeardowns = [
  {
    name: L("Competitor A", "Concurent A"),
    tags: [
      { t: L("Working · real photos", "Merge · poze reale"), tone: "strong" },
      { t: L("Copied · “best price”", "Copiat · „cel mai bun preț”"), tone: "neutral" },
    ],
  },
  {
    name: L("Competitor B", "Concurent B"),
    tags: [
      { t: L("Copied · stock images", "Copiat · poze stock"), tone: "neutral" },
      { t: L("Missing · lead time", "Lipsă · termen de livrare"), tone: "outline" },
    ],
  },
  {
    name: L("Competitor C", "Concurent C"),
    tags: [
      { t: L("Working · fast reply", "Merge · răspuns rapid"), tone: "strong" },
      { t: L("Missing · proof", "Lipsă · dovezi"), tone: "outline" },
    ],
  },
];
export function CompetitorTeardownPanel() {
  const t = useT();
  return (
    <Panel className="relative flex h-full w-full flex-col gap-3 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-neutral-500">{t("Taken apart", "Analizați pe rând")}</p>
        <Chip tone="outline">{t("your top competitors", "principalii concurenți")}</Chip>
      </div>
      <div className="relative flex-1 space-y-3">
        {competitorTeardowns.map((competitor, competitorIndex) => (
          <div key={competitor.name.en} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-lg bg-[linear-gradient(135deg,#2c2c31,#19191d)]" />
              <div className="flex-1 space-y-1.5">
                <p className="font-display text-[13px] font-bold text-neutral-300">{t(competitor.name)}</p>
                <div className="h-1.5 w-4/5 rounded bg-white/10" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {competitor.tags.map((tag, tagIndex) => (
                <motion.span
                  key={tag.t.en}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.5 + competitorIndex * 0.25 + tagIndex * 0.12,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                >
                  <Chip tone={tag.tone}>{t(tag.t)}</Chip>
                </motion.span>
              ))}
            </div>
          </div>
        ))}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
          animate={{ y: ["-60%", "640%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        </motion.div>
      </div>
    </Panel>
  );
}
