import React, { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { IconCheck, IconFileText, IconRocket, IconSearch, IconTarget } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { L, useT } from "../../i18n";
export const DayOneScrollContainer = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);
  return (
    <div
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            translateY: translate,
          }}
          className="mx-auto max-w-5xl text-center"
        >
          {titleComponent}
        </motion.div>
        <DayOneScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </DayOneScrollCard>
      </div>
    </div>
  );
};
const DayOneScrollCard = ({ rotate, scale, children }) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale: scale,
      boxShadow:
        "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
    }}
    className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-[#212125] bg-[#121215] p-2 shadow-2xl ring-1 ring-white/5 md:h-[40rem] md:p-6"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-ink-900 md:rounded-2xl">{children}</div>
  </motion.div>
);
const firstMonthPlanRows = [
  {
    w: L("Week 1", "Săptămâna 1"),
    t: L("Research & audit", "Cercetare și audit"),
    d: [
      L("Buyer questions", "Întrebările clienților"),
      L("Competitor map", "Analiza concurenței"),
      L("Tracking check", "Verificarea tracking-ului"),
    ],
    icon: IconSearch,
    start: 0,
    span: 1,
    status: "done",
  },
  {
    w: L("Week 2", "Săptămâna 2"),
    t: L("Position & plan", "Poziționare și plan"),
    d: [
      L("Positioning draft", "Schiță de poziționare"),
      L("Channel plan", "Plan de canale"),
      L("The number we'll report", "Ce indicator raportăm"),
    ],
    icon: IconTarget,
    start: 1,
    span: 1,
    status: "done",
  },
  {
    w: L("Week 3", "Săptămâna 3"),
    t: L("First campaigns live", "Primele campanii live"),
    d: [
      L("Small, controlled launch", "Lansare mică, controlată"),
      L("Creative variants", "Variante de reclamă"),
      L("Follow-up flow", "Flux de follow-up"),
    ],
    icon: IconRocket,
    start: 2,
    span: 1,
    status: "now",
  },
  {
    w: L("Week 4", "Săptămâna 4"),
    t: L("First real report", "Primul raport real"),
    d: [L("What happened", "Ce s-a întâmplat"), L("Why", "De ce"), L("What changes next", "Ce schimbăm apoi")],
    icon: IconFileText,
    start: 3,
    span: 1,
    status: "next",
  },
];
export function FirstMonthPlanMockup({ className }) {
  const t = useT();
  return (
    <div className={cn("flex h-full w-full flex-col bg-[#111114] p-4 font-sans md:p-8", className)}>
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-[#1a1a1e] ring-1 ring-white/10">
            <span className="size-2 rounded-full bg-accent-400" />
          </span>
          <div>
            <p className="font-display text-base font-bold tracking-[-0.01em] text-white md:text-xl">
              {t("Your first month", "Prima ta lună")}
            </p>
            <p className="font-mono text-[11px] text-neutral-500 md:text-xs">
              {t("Example plan · shared with you on day one", "Exemplu de plan · îl primești în prima zi")}
            </p>
          </div>
        </div>
        <span className="hidden rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-neutral-300 sm:inline">
          {t("Week 3 of 4", "Săptămâna 3 din 4")}
        </span>
      </div>
      <div className="mt-4 hidden grid-cols-[170px_repeat(4,1fr)] gap-2 font-mono text-[11px] text-neutral-500 md:grid">
        <span />
        {firstMonthPlanRows.map((row) => (
          <span key={row.w.en} className="text-center">
            {t(row.w)}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-between gap-3">
        {firstMonthPlanRows.map((row, rowIndex) => (
          <div key={row.t.en} className="grid grid-cols-1 items-center gap-2 md:grid-cols-[170px_repeat(4,1fr)]">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-lg",
                  row.status === "now"
                    ? "bg-white text-ink-950"
                    : row.status === "done"
                      ? "bg-white/[0.08] text-neutral-300"
                      : "bg-white/[0.04] text-neutral-500",
                )}
              >
                <row.icon className="size-4" stroke={1.6} />
              </span>
              <span
                className={cn(
                  "font-display text-sm font-bold",
                  row.status === "next" ? "text-neutral-400" : "text-white",
                )}
              >
                {t(row.t)}
              </span>
            </div>
            <div className="relative col-span-4 hidden h-full min-h-14 grid-cols-4 gap-2 md:grid">
              {[0, 1, 2, 3].map((column) => (
                <div key={column} className="rounded-lg border border-dashed border-white/[0.05]" />
              ))}
              <motion.div
                initial={{
                  opacity: 0,
                  scaleX: 0.3,
                }}
                whileInView={{
                  opacity: 1,
                  scaleX: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.2 + rowIndex * 0.15,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  gridColumn: `${row.start + 1} / span ${row.span}`,
                  gridRow: 1,
                  transformOrigin: "left",
                }}
                className={cn(
                  "absolute inset-y-0 flex flex-col justify-center gap-1 rounded-lg border px-3 py-2",
                  row.status === "now"
                    ? "border-white/35 bg-white/[0.07]"
                    : row.status === "done"
                      ? "border-white/12 bg-white/[0.03]"
                      : "border-white/[0.08] bg-transparent",
                )}
              >
                {row.d.map((task) => (
                  <span
                    key={task.en}
                    className="flex items-center gap-1.5 truncate text-[11px] text-neutral-300"
                  >
                    {row.status === "done" ? (
                      <IconCheck className="size-3 shrink-0 text-neutral-400" stroke={2.5} />
                    ) : (
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          row.status === "now" ? "bg-white/80" : "bg-neutral-600",
                        )}
                      />
                    )}
                    {t(task)}
                  </span>
                ))}
              </motion.div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:hidden">
              {row.d.map((task) => (
                <span
                  key={task.en}
                  className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-neutral-400"
                >
                  {t(task)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
