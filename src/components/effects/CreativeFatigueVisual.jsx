import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { Chip } from "../ui/Chip";
import { L, useT } from "../../i18n";
const adCreatives = [
  {
    hook: L("Hook \xB7 sore back", "Idee \xB7 dureri de spate"),
    art: "sleep",
  },
  {
    hook: L("Hook \xB7 unboxing", "Idee \xB7 unboxing"),
    art: "box",
  },
  {
    hook: L("Hook \xB7 new parents", "Idee \xB7 proaspeți părinți"),
    art: "stroller",
  },
  {
    hook: L("Hook \xB7 side sleeper", "Idee \xB7 somn pe o parte"),
    art: "pillow",
  },
];
function CreativeArt({ art }) {
  return art === "sleep" ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#37373d,#17171b_70%)]">
      <div className="absolute inset-x-3 bottom-16 h-8 rounded-lg bg-gradient-to-b from-[#eaeaee] to-[#9c9ca4]" />
      <div className="absolute inset-x-5 bottom-[6.2rem] h-4 rounded-md bg-gradient-to-b from-[#f6f6f8] to-[#c5c5cc]" />
      <div className="absolute top-5 right-4 size-5 rounded-full bg-white/60" />
    </div>
  ) : art === "box" ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#333338,#17171b_70%)]">
      <div className="absolute bottom-16 left-1/2 h-14 w-16 -translate-x-1/2 rounded-md bg-gradient-to-b from-[#d4d4da] to-[#7b7b83]" />
      <div className="absolute bottom-[7.4rem] left-1/2 h-3 w-[4.5rem] -translate-x-1/2 rounded-sm bg-[#ebebef]" />
    </div>
  ) : art === "stroller" ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#35353b,#131316_70%)]">
      <div className="absolute bottom-[6.5rem] left-5 h-12 w-16 rounded-t-full bg-gradient-to-b from-[#e8e8ec] to-[#94949c]" />
      <div className="absolute bottom-[4.4rem] left-6 size-5 rounded-full border-2 border-[#cdcdd3]" />
      <div className="absolute bottom-[4.4rem] left-[4.3rem] size-5 rounded-full border-2 border-[#cdcdd3]" />
    </div>
  ) : (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_25%,#38383e,#17171b_70%)]">
      <div className="absolute bottom-[4.6rem] left-1/2 h-12 w-20 -translate-x-1/2 rounded-[40%] bg-gradient-to-b from-[#f4f4f6] to-[#b0b0b8]" />
    </div>
  );
}
export function CreativeFatigueVisual({ className }) {
  const t = useT();
  const { ref: containerRef, step: step } = useInViewCycle(adCreatives.length, 2600);
  const getCreativeState = (creativeIndex) => {
    const offset = (creativeIndex - step + adCreatives.length) % adCreatives.length;
    return offset === 0
      ? {
          label: t("live", "activă"),
          energy: 78,
          tone: "strong",
        }
      : offset === adCreatives.length - 1
        ? {
            label: t("burning out", "obosită"),
            energy: 18,
            tone: "muted",
          }
        : offset === 1
          ? {
              label: t("next up", "urmează"),
              energy: 100,
              tone: "outline",
            }
          : {
              label: t("in the queue", "în așteptare"),
              energy: 100,
              tone: "neutral",
            };
  };
  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full items-center gap-4 select-none", className)}
      aria-hidden="true"
    >
      <div className="relative h-[196px] w-[112px] shrink-0 rounded-[22px] border border-white/10 bg-[#111114] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-2 left-1/2 z-20 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative h-full w-full overflow-hidden rounded-[17px] bg-black">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={step}
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "-35%",
                opacity: 0.4,
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0"
            >
              <CreativeArt art={adCreatives[step].art} />
              <div className="absolute top-3 left-2.5 rounded bg-black/50 px-1 py-px font-mono text-[8px] text-white">
                15s
              </div>
              <div className="absolute inset-x-2.5 bottom-3 space-y-1">
                <div className="h-1.5 w-4/5 rounded bg-white/70" />
                <div className="h-1.5 w-3/5 rounded bg-white/35" />
                <div className="mt-2 inline-flex rounded-full bg-white px-2 py-0.5 font-display text-[8px] font-bold text-black">
                  {t("Shop now", "Cumpără acum")}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-2.5">
        {adCreatives.map((creative, index) => {
          const state = getCreativeState(index);
          return (
            <div
              key={creative.hook.en}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[11px] text-neutral-300">{t(creative.hook)}</span>
                <Chip tone={state.tone} className="px-2 py-0.5 text-[10px]">
                  {state.label}
                </Chip>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    state.tone === "muted" ? "bg-white/15" : "bg-white/55",
                  )}
                  animate={{
                    width: `${state.energy}%`,
                  }}
                  initial={false}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: `${state.energy}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
