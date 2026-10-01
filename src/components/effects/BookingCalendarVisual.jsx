import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { useT } from "../../i18n";
const calendarDays = Array.from(
  {
    length: 28,
  },
  (_, index) => {
    const weekday = index % 7;
    return weekday === 1
      ? "empty"
      : weekday >= 5
        ? index % 3 === 0
          ? "direct"
          : "platform"
        : weekday === 4
          ? index % 2
            ? "platform"
            : "empty"
          : index % 5 === 0
            ? "platform"
            : "empty";
  },
);
const calendarFillOrder = [8, 15, 1, 22, 13, 5, 20, 27, 10, 3, 17, 24];
export function BookingCalendarVisual({ className }) {
  const t = useT();
  const weekdays = t(["M", "T", "W", "T", "F", "S", "S"], ["L", "M", "M", "J", "V", "S", "D"]);
  const { ref: containerRef, step: step } = useInViewCycle(calendarFillOrder.length + 4, 900);
  const filledDays = new Set(calendarFillOrder.slice(0, Math.min(step, calendarFillOrder.length)));
  return (
    <div ref={containerRef} className={cn("relative w-full select-none", className)} aria-hidden="true">
      <div className="grid grid-cols-7 gap-1.5">
        {weekdays.map((dayLabel, index) => (
          <div
            key={index}
            className={cn(
              "pb-1 text-center font-mono text-[10px]",
              index === 1 ? "text-neutral-200" : "text-neutral-500",
            )}
          >
            {dayLabel}
          </div>
        ))}
        {calendarDays.map((dayType, index) => {
          const cellType = filledDays.has(index) ? "direct" : dayType;
          return (
            <motion.div
              key={index}
              layout={false}
              className={cn(
                "relative aspect-square rounded-md border transition-colors duration-500",
                cellType === "direct" && "border-white/10 bg-[#e3e3e8]",
                cellType === "platform" && "border-white/5 bg-[#28282d]",
                cellType === "empty" && "border-dashed border-white/10 bg-transparent",
              )}
              animate={
                filledDays.has(index) && step <= calendarFillOrder.length
                  ? {
                      scale: [1, 1.12, 1],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.4,
              }}
            >
              {cellType === "platform" && (
                <span className="absolute top-1 right-1 size-1 rounded-full bg-neutral-500" />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute top-5 bottom-0 left-[calc((100%-9px)/7+1.5px)] w-[calc((100%-9px)/7)] rounded-lg ring-1 ring-accent-400/60" />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#e3e3e8]" />
          {t("Direct booking", "Rezervare directă")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#28282d]" />
          {t("Via a platform", "Prin platformă")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-dashed border-white/20" />
          {t("Empty", "Liber")}
        </span>
      </div>
    </div>
  );
}
