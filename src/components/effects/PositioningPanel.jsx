import { motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { Chip } from "../ui/Chip";
import { Panel } from "../ui/Panel";
import { L, useT } from "../../i18n";
const positioningLines = [
  L("What buyers care about", "Ce contează pentru clienți"),
  L("What competitors miss", "Ce le scapă concurenților"),
  L("What only you can prove", "Ce poți dovedi doar tu"),
];
export function PositioningPanel() {
  const t = useT();
  return (
    <Panel className="relative flex h-full w-full flex-col justify-center gap-3 p-5 sm:p-6">
      <div className="space-y-2">
        {positioningLines.map((line, index) => (
          <motion.div
            key={line.en}
            initial={{
              opacity: 0,
              x: index % 2 ? 40 : -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1 + index * 0.18,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <span className="grid size-5 place-items-center rounded-full bg-white/[0.08] text-neutral-200">
              <IconCheck className="size-3" stroke={2.5} />
            </span>
            <span className="text-[13px] text-neutral-300">{t(line)}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.75,
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(160deg,#1d1d21,#141417)] p-5"
      >
        <p className="font-mono text-[11px] text-neutral-500">{t("Your position", "Poziționarea ta")}</p>
        <p className="mt-2 font-display text-2xl leading-tight font-bold tracking-[-0.01em] text-white">
          {t("The name they remember ", "Numele pe care îl țin minte ")}
          <em className="em-serif">{t("when they're ready.", "când sunt gata să decidă.")}</em>
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Chip>{t("ads", "reclame")}</Chip>
          <Chip>site</Chip>
          <Chip>{t("content", "conținut")}</Chip>
          <Chip tone="accent">{t("one message", "un singur mesaj")}</Chip>
        </div>
      </motion.div>
    </Panel>
  );
}
