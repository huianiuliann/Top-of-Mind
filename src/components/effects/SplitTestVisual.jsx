import { motion } from "framer-motion";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { useT } from "../../i18n";
import { easeOutExpo } from "./motion";
const splitTestShares = [
  [34, 33, 33],
  [26, 48, 26],
  [16, 68, 16],
  [12, 76, 12],
];
export function SplitTestVisual({ className }) {
  const t = useT();
  const { ref: containerRef, step } = useInViewCycle(splitTestShares.length, 1600);
  const shares = splitTestShares[step];
  const variants = [
    {
      k: "A",
      label: t("Before / after", "Înainte / după"),
      bg: "bg-[linear-gradient(135deg,#2c2c31,#19191d)]",
    },
    {
      k: "B",
      label: t("Founder on camera", "Fondator pe video"),
      bg: "bg-[linear-gradient(135deg,#45454c,#1b1b1f)]",
    },
    { k: "C", label: t("Price-led", "Pe preț"), bg: "bg-[linear-gradient(135deg,#222226,#17171b)]" },
  ];
  return (
    <div ref={containerRef} className={cn("w-full select-none", className)} aria-hidden="true">
      <div className="grid grid-cols-3 gap-2.5">
        {variants.map((variant, index) => (
          <div
            key={variant.k}
            className={cn(
              "rounded-xl border p-2 transition-colors duration-500",
              index === 1 && step > 0
                ? "border-white/30 bg-white/[0.04]"
                : "border-white/[0.06] bg-white/[0.02]",
            )}
          >
            <div className={cn("relative h-16 rounded-lg sm:h-20", variant.bg)}>
              <span className="absolute top-1.5 left-1.5 grid size-5 place-items-center rounded-md bg-black/60 font-mono text-[10px] text-white">
                {variant.k}
              </span>
              {index === 1 && (
                <IconPlayerPlayFilled className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-white/80" />
              )}
            </div>
            <p className="mt-1.5 truncate font-mono text-[10px] text-neutral-400">{variant.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between font-mono text-[10.5px] text-neutral-500">
        <span>{t("Budget this week", "Bugetul săptămânii")}</span>
        <span className="text-neutral-300">{t("moves to what works", "se mută spre ce merge")}</span>
      </div>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
        {shares.map((share, index) => (
          <motion.div
            key={index}
            animate={{ width: `${share}%` }}
            initial={false}
            style={{ width: `${share}%` }}
            transition={{ duration: 1, ease: easeOutExpo }}
            className={cn(
              "h-full border-r border-black/60",
              index === 1 ? "bg-accent-500" : index === 0 ? "bg-[#36363c]" : "bg-[#28282d]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
