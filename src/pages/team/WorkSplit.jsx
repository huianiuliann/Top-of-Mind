import { useRef } from "react";
import {
  IconActivityHeartbeat,
  IconBrowser,
  IconSearch,
  IconSettings,
  IconSpeakerphone,
  IconTargetArrow,
  IconUser,
} from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { AnimatedBeam } from "../../components/effects/AnimatedBeam";
import { founders } from "../../data/site";
import { L, useT } from "../../i18n";
export function TeamWorkSplitDiagram() {
  const t = useT();
  const containerRef = useRef(null);
  const youRef = useRef(null);
  const iulianRef = useRef(null);
  const sebastianRef = useRef(null);
  const researchRef = useRef(null);
  const adsRef = useRef(null);
  const strategyRef = useRef(null);
  const websitesRef = useRef(null);
  const analyticsRef = useRef(null);
  const seoRef = useRef(null);
  const iulianTasks = [
    {
      ref: researchRef,
      icon: IconSearch,
      t: L("Research & positioning", "Cercetare și poziționare"),
    },
    {
      ref: adsRef,
      icon: IconSpeakerphone,
      t: L("Meta & Google Ads", "Meta și Google Ads"),
    },
    {
      ref: strategyRef,
      icon: IconTargetArrow,
      t: L("Strategy & reporting", "Strategie și raportare"),
    },
  ];
  const sebastianTasks = [
    {
      ref: websitesRef,
      icon: IconBrowser,
      t: L("Websites & landing pages", "Site-uri și landing page-uri"),
    },
    {
      ref: analyticsRef,
      icon: IconActivityHeartbeat,
      t: L("Analytics & tracking", "Analitică și tracking"),
    },
    {
      ref: seoRef,
      icon: IconSettings,
      t: L("Technical SEO", "SEO tehnic"),
    },
  ];
  const TaskNode = ({ r: nodeRef, icon: Icon, t: label, align }) => (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
      <div
        ref={nodeRef}
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-800 text-neutral-400"
      >
        <Icon className="size-5" stroke={1.6} />
      </div>
      <span className="text-sm text-neutral-300">{label}</span>
    </div>
  );
  return (
    <div
      ref={containerRef}
      className="relative mx-auto grid max-w-6xl grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-6 py-6 lg:gap-12"
    >
      <div className="space-y-8">
        {iulianTasks.map((task) => (
          <TaskNode key={task.t.en} r={task.ref} icon={task.icon} t={t(task.t)} align="left" />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        <div
          ref={iulianRef}
          className="relative size-24 overflow-hidden rounded-full ring-1 ring-white/20 lg:size-28"
        >
          <img
            src={founders[0].duo}
            alt="Iulian Huian"
            style={{
              transform: "scale(1.5)",
              transformOrigin: founders[0].crop.circleOrigin,
            }}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="font-display text-sm font-bold text-white">Iulian</p>
      </div>
      <div
        ref={youRef}
        className="relative z-10 grid size-24 place-items-center rounded-full bg-white text-ink-950 lg:size-28"
      >
        <div className="text-center">
          <IconUser className="mx-auto size-6" stroke={1.6} />
          <span className="em-serif text-lg">{t("You", "Tu")}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div
          ref={sebastianRef}
          className="relative size-24 overflow-hidden rounded-full ring-1 ring-white/20 lg:size-28"
        >
          <img
            src={founders[1].duo}
            alt="Sebastian Răzeșu"
            style={{
              transform: "scale(1.5)",
              transformOrigin: founders[1].crop.circleOrigin,
            }}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="font-display text-sm font-bold text-white">Sebastian</p>
      </div>
      <div className="space-y-8">
        {sebastianTasks.map((task) => (
          <TaskNode key={task.t.en} r={task.ref} icon={task.icon} t={t(task.t)} align="right" />
        ))}
      </div>
      {iulianTasks.map((task, index) => (
        <AnimatedBeam
          key={"l" + index}
          containerRef={containerRef}
          fromRef={task.ref}
          toRef={iulianRef}
          curvature={(1 - index) * 20}
          duration={4}
          delay={index * 0.3}
          pathOpacity={0.12}
        />
      ))}
      {sebastianTasks.map((task, index) => (
        <AnimatedBeam
          key={"r" + index}
          containerRef={containerRef}
          fromRef={sebastianRef}
          toRef={task.ref}
          curvature={(1 - index) * 20}
          duration={4}
          delay={index * 0.3}
          pathOpacity={0.12}
        />
      ))}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={iulianRef}
        toRef={youRef}
        duration={3}
        pathOpacity={0.2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sebastianRef}
        toRef={youRef}
        duration={3}
        delay={0.5}
        reverse
        pathOpacity={0.2}
      />
    </div>
  );
}
