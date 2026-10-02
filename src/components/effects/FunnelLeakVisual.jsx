import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/cn";
import { L, useT } from "../../i18n";
import { easeOutExpo } from "./motion";
const funnelStages = [
  L("Visit", "Vizită"),
  L("Interested", "Interesat"),
  L("Conversation", "Discuție"),
  L("Quote", "Ofertă"),
  L("Signed", "Semnat"),
];
const funnelBarHeights = [118, 100, 30, 22, 14];
const funnelLeakDrops = Array.from({ length: 14 }, (_, index) => ({
  i: index,
  leak: index % 4 !== 0,
  delay: index * 0.42,
}));
// Leaking drops fall through "the gap" between interested and conversation; the rest run the whole pipe.
const dropPaths = {
  leak: {
    fill: "#818cf8",
    animate: { cx: [14, 138, 146], cy: [182, 182, 212], opacity: [0, 1, 1, 0] },
    transition: { duration: 3.4, times: [0, 0.62, 1], repeatDelay: 1.2 },
  },
  through: {
    fill: "#e8e8ec",
    animate: { cx: [14, 346], cy: [182, 182], opacity: [0, 1, 1, 0] },
    transition: { duration: 4.6, repeatDelay: 0.6 },
  },
};
export function FunnelLeakVisual({ className }) {
  const t = useT();
  const barCenters = [36, 108, 180, 252, 324];
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "80px" });
  return (
    <div ref={containerRef} className={cn("relative w-full select-none", className)} aria-hidden="true">
      <svg viewBox="0 0 360 214" className="w-full">
        <defs>
          <linearGradient id="ql-lit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#eeeef2" />
            <stop offset="100%" stopColor="#76767e" />
          </linearGradient>
          <linearGradient id="ql-dim" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2e2e34" />
            <stop offset="100%" stopColor="#181816" />
          </linearGradient>
          <radialGradient id="ql-puddle">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {barCenters.map((centerX, index) => (
          <motion.rect
            key={index}
            x={centerX - 17}
            width={34}
            rx={7}
            fill={index < 2 ? "url(#ql-lit)" : "url(#ql-dim)"}
            initial={{ height: 0, y: 160 }}
            whileInView={{ height: funnelBarHeights[index], y: 160 - funnelBarHeights[index] }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 + index * 0.12, ease: easeOutExpo }}
            opacity={index < 2 ? 0.95 : 1}
          />
        ))}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <path
            d="M 128 44 L 122 44 L 122 158 L 128 158"
            stroke="#818cf8"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 3"
          />
          <path
            d="M 160 44 L 166 44 L 166 158 L 160 158"
            stroke="#818cf8"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 3"
          />
          <rect
            x="108.5"
            y="18.5"
            width="71"
            height="20"
            rx="10"
            fill="#121215"
            stroke="#818cf8"
            strokeWidth="1"
          />
          <text
            x="144"
            y="32"
            textAnchor="middle"
            fontSize="10.5"
            fill="#a5b4fc"
            fontFamily="RedHatMono, ui-monospace, monospace"
          >
            {t("the gap", "golul")}
          </text>
        </motion.g>
        <line x1="14" y1="182" x2="134" y2="182" stroke="#28282d" strokeWidth="8" strokeLinecap="round" />
        <line x1="154" y1="182" x2="346" y2="182" stroke="#28282d" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="144" cy="208" rx="30" ry="6" fill="url(#ql-puddle)" />
        {isInView &&
          funnelLeakDrops.map((drop) => {
            const path = drop.leak ? dropPaths.leak : dropPaths.through;
            return (
              <motion.circle
                key={drop.i}
                r="2.6"
                fill={path.fill}
                initial={{ cx: 14, cy: 182, opacity: 0 }}
                animate={path.animate}
                transition={{ ...path.transition, delay: drop.delay, repeat: Infinity, ease: "linear" }}
              />
            );
          })}
      </svg>
      <div className="mt-1 grid grid-cols-5 text-center text-[10px] text-neutral-500 sm:text-[11px]">
        {funnelStages.map((stage, index) => (
          <span key={stage.en} className={cn(index < 2 && "text-neutral-200")}>
            {t(stage)}
          </span>
        ))}
      </div>
    </div>
  );
}
