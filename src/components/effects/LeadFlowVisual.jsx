import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBrowser,
  IconCheck,
  IconMessageCircle,
  IconSpeakerphone,
  IconUserCheck,
} from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { AnimatedBeam } from "./AnimatedBeam";
import { useInViewCycle } from "./useInViewCycle";
import { Chip } from "../ui/Chip";
import { L, useT } from "../../i18n";
const leadStages = [
  { chip: L("New request", "Cerere nouă"), tone: "neutral" },
  { chip: L("Qualified", "Calificată"), tone: "outline" },
  { chip: L("Call booked", "Apel programat"), tone: "accent" },
];
export function LeadFlowVisual({ className }) {
  const t = useT();
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const pageRef = useRef(null);
  const followUpRef = useRef(null);
  const callRef = useRef(null);
  const { ref: cycleRef, step } = useInViewCycle(leadStages.length, 1900);
  const nodes = [
    { ref: adRef, icon: IconSpeakerphone, label: L("The ad", "Reclama") },
    { ref: pageRef, icon: IconBrowser, label: L("The page", "Pagina") },
    { ref: followUpRef, icon: IconMessageCircle, label: L("Follow-up", "Follow-up-ul") },
    { ref: callRef, icon: IconUserCheck, label: L("Your call", "Apelul tău"), accent: true },
  ];
  const stage = leadStages[step];
  return (
    <div ref={cycleRef} className={cn("w-full select-none", className)} aria-hidden="true">
      <div ref={containerRef} className="relative py-2">
        <div className="relative z-10 flex items-center justify-between">
          {nodes.map((node, index) => (
            <div key={node.label.en} className="flex flex-col items-center gap-2">
              <div
                ref={node.ref}
                className={cn(
                  "grid size-11 place-items-center rounded-2xl border shadow-[0_0_24px_-8px_rgba(3,33,19,0.24)] transition-all duration-500",
                  node.accent
                    ? step === 2
                      ? "border-accent-400 bg-ink-800 text-accent-300"
                      : "border-white/15 bg-ink-800 text-neutral-300"
                    : "border-white/10 bg-ink-800 text-neutral-400",
                )}
              >
                <node.icon className="size-5" stroke={1.6} />
              </div>
              <span
                className={cn("font-mono text-[10px]", node.accent ? "text-neutral-200" : "text-neutral-500")}
              >
                {t(node.label)}
              </span>
            </div>
          ))}
        </div>
        {nodes.slice(1).map((node, index) => (
          <AnimatedBeam
            key={node.label.en}
            containerRef={containerRef}
            fromRef={nodes[index].ref}
            toRef={node.ref}
            startYOffset={-10}
            endYOffset={-10}
            curvature={index === 1 ? 22 : -22}
            duration={3}
            delay={index * 0.4}
            pathOpacity={0.14}
          />
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500">
            <span className="size-1.5 rounded-full bg-white/50" />
            {t("via quote form · just now", "formular de ofertă · acum")}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={stage.chip.en}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Chip tone={stage.tone} className="px-2 py-0.5 text-[10px]">
                {step === 2 && <IconCheck className="size-3" stroke={3} />}
                {t(stage.chip)}
              </Chip>
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-neutral-300">
          {t(
            "“Custom railing for two floors — can someone call me Thursday?”",
            "„Balustradă pe comandă pentru două etaje — mă poate suna cineva joi?”",
          )}
        </p>
      </div>
    </div>
  );
}
