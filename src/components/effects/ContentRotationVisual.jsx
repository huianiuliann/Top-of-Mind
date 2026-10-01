import { motion } from "framer-motion";
import { IconMovie, IconPhoto, IconPlayerPlayFilled, IconUsers } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { L, useT } from "../../i18n";
const contentFormats = [
  {
    icon: IconPhoto,
    label: L("Proof post", "Dovadă"),
  },
  {
    icon: IconMovie,
    label: L("Process reel", "Proces"),
  },
  {
    icon: IconUsers,
    label: L("The people", "Oamenii"),
  },
];
export function ContentRotationVisual({ className }) {
  const t = useT();
  const { ref: containerRef, step: step } = useInViewCycle(8, 700);
  return (
    <div ref={containerRef} className={cn("w-full select-none", className)} aria-hidden="true">
      <div className="mb-3 flex gap-1.5">
        {contentFormats.map((format, index) => (
          <span
            key={format.label.en}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] transition-colors duration-300",
              step % 3 === index ? "bg-white/[0.13] text-white" : "bg-white/[0.04] text-neutral-500",
            )}
          >
            <format.icon className="size-3" />
            {t(format.label)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({
          length: 8,
        }).map((_, index) => {
          const tileFormat = contentFormats[index % 3];
          const isActive = index === step;
          return (
            <motion.div
              key={index}
              animate={{
                scale: isActive ? 1.04 : 1,
              }}
              transition={{
                duration: 0.3,
              }}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border transition-colors duration-300",
                isActive ? "border-white/40" : "border-white/[0.05]",
                index % 3 === 0
                  ? "bg-[linear-gradient(135deg,#2c2c31,#17171b)]"
                  : index % 3 === 1
                    ? "bg-[linear-gradient(135deg,#343439,#17171b)]"
                    : "bg-[linear-gradient(135deg,#1d1d21,#141417)]",
              )}
            >
              <tileFormat.icon
                className={cn("absolute top-1.5 right-1.5 size-3", isActive ? "text-white" : "text-white/25")}
              />
              {index % 3 === 1 && (
                <IconPlayerPlayFilled className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-white/40" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
