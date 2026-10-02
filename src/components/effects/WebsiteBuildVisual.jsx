import { motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { useInViewCycle } from "./useInViewCycle";
import { L, useT } from "../../i18n";
const websitePrinciples = [
  L("Copy before design", "Text înainte de design"),
  L("Built for the decision", "Gândit pentru decizie"),
  L("Technical SEO from day one", "SEO tehnic din prima zi"),
];
export function WebsiteBuildVisual({ className }) {
  const t = useT();
  const { ref: containerRef, step } = useInViewCycle(6, 900);
  return (
    <div ref={containerRef} className={cn("relative w-full select-none", className)} aria-hidden="true">
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#121215]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <span className="size-2 rounded-full bg-[#36363c]" />
          <span className="size-2 rounded-full bg-[#36363c]" />
          <span className="size-2 rounded-full bg-[#36363c]" />
          <span className="ml-2 flex-1 truncate rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-neutral-500">
            {t("yourcompany.com", "firma-ta.ro")}
          </span>
        </div>
        <div className="space-y-2 p-3">
          <motion.div animate={{ opacity: step >= 1 ? 1 : 0.15 }} className="space-y-1.5">
            <div className="h-2.5 w-3/4 rounded bg-white/70" />
            <div className="h-2.5 w-1/2 rounded bg-white/40" />
          </motion.div>
          <motion.div
            animate={{ opacity: step >= 2 ? 1 : 0.1, scale: step >= 2 ? 1 : 0.95 }}
            className="h-5 w-24 rounded-full bg-white/80"
          />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[0, 1, 2].map((card) => (
              <motion.div
                key={card}
                animate={{ opacity: step >= 3 + (card > 0 ? 1 : 0) ? 1 : 0.1, y: step >= 3 ? 0 : 6 }}
                className="h-10 rounded-md border border-white/[0.06] bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -right-1 -bottom-4 w-[62%] rounded-xl border border-white/12 bg-ink-900 p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.6)] sm:-right-3">
        {websitePrinciples.map((principle, index) => (
          <div key={principle.en} className="flex items-center gap-2 py-0.5">
            <motion.span
              animate={{
                backgroundColor: step > index + 1 ? "rgba(232,232,236,0.92)" : "rgba(255,255,255,0.06)",
              }}
              className="grid size-4 shrink-0 place-items-center rounded-full"
            >
              <IconCheck
                className={cn(
                  "size-2.5 transition-colors",
                  step > index + 1 ? "text-black" : "text-transparent",
                )}
                stroke={3.5}
              />
            </motion.span>
            <span
              className={cn(
                "truncate text-[10px] transition-colors",
                step > index + 1 ? "text-neutral-200" : "text-neutral-500",
              )}
            >
              {t(principle)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
