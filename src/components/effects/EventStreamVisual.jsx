import { motion, AnimatePresence } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { L, useT } from "../../i18n";
// e = GA4-style event names: identifiers, identical in both languages. d = what the fake UI shows next to it.
const trackingEvents = [
  { e: "page_view", d: L("/services", "/servicii") },
  { e: "generate_lead", d: L("quote form", "formular") },
  { e: "click_call", d: L("mobile header", "antet mobil") },
  { e: "add_to_cart", d: L("topper · queen", "topper · matrimonial") },
  { e: "purchase", d: L("order confirmed", "comandă confirmată") },
  { e: "book_slot", d: L("tuesday · evening", "marți · seara") },
];
export function EventStreamVisual({ className }) {
  const t = useT();
  const { ref: containerRef, step } = useInViewCycle(trackingEvents.length, 1300);
  const visibleEvents = [0, 1, 2, 3].map((offset) => trackingEvents[(step + offset) % trackingEvents.length]);
  return (
    <div ref={containerRef} className={cn("w-full font-mono select-none", className)} aria-hidden="true">
      <div className="mb-2 flex items-center gap-2 text-[10px] text-neutral-500">
        <span className="inline-flex size-1.5 rounded-full bg-accent-400" />
        {t("live events", "evenimente live")}
      </div>
      <div className="relative h-[124px] overflow-hidden">
        <AnimatePresence initial={false}>
          {visibleEvents.map((event, index) => (
            <motion.div
              key={event.e + step + "-" + index}
              layout
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1 - index * 0.2, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-1.5 flex items-center justify-between gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5"
            >
              <span className="truncate text-[11px] text-neutral-200">
                {event.e}
                <span className="text-neutral-500">
                  {" · "}
                  {t(event.d)}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[10px] text-neutral-500">
                <IconCheck className="size-3" stroke={2.5} />
                {t("tracked", "măsurat")}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
