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
import { avatarStyle, founders } from "../../data/site";
import { L, useT } from "../../i18n";
// What each founder owns: Iulian's tasks sit left of "You", Sebastian's on the right.
const tasks = [
  [
    { icon: IconSearch, label: L("Research & positioning", "Cercetare și poziționare") },
    { icon: IconSpeakerphone, label: L("Meta & Google Ads", "Meta și Google Ads") },
    { icon: IconTargetArrow, label: L("Strategy & reporting", "Strategie și raportare") },
  ],
  [
    { icon: IconBrowser, label: L("Websites & landing pages", "Site-uri și landing page-uri") },
    { icon: IconActivityHeartbeat, label: L("Analytics & tracking", "Analitică și tracking") },
    { icon: IconSettings, label: L("Technical SEO", "SEO tehnic") },
  ],
];
function TaskNode({ ref, icon: Icon, label, align }) {
  return (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
      <div
        ref={ref}
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-800 text-neutral-400"
      >
        <Icon className="size-5" stroke={1.6} />
      </div>
      <span className="text-sm text-neutral-300">{label}</span>
    </div>
  );
}
function FounderNode({ ref, founder }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        className="relative size-24 overflow-hidden rounded-full ring-1 ring-white/20 lg:size-28"
      >
        <img
          src={founder.duo}
          alt={founder.name}
          style={avatarStyle(founder)}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="font-display text-sm font-bold text-white">{founder.name.split(" ")[0]}</p>
    </div>
  );
}
export function TeamWorkSplitDiagram() {
  const t = useT();
  const containerRef = useRef(null);
  const youRef = useRef(null);
  const founderRefs = [useRef(null), useRef(null)];
  const taskRefs = [
    [useRef(null), useRef(null), useRef(null)],
    [useRef(null), useRef(null), useRef(null)],
  ];
  const taskColumn = (side, align) => (
    <div className="space-y-8">
      {tasks[side].map((task, index) => (
        <TaskNode
          key={task.label.en}
          ref={taskRefs[side][index]}
          icon={task.icon}
          label={t(task.label)}
          align={align}
        />
      ))}
    </div>
  );
  return (
    <div
      ref={containerRef}
      className="relative mx-auto grid max-w-6xl grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-6 py-6 lg:gap-12"
    >
      {taskColumn(0, "left")}
      <FounderNode ref={founderRefs[0]} founder={founders[0]} />
      <div
        ref={youRef}
        className="relative z-10 grid size-24 place-items-center rounded-full bg-white text-ink-950 lg:size-28"
      >
        <div className="text-center">
          <IconUser className="mx-auto size-6" stroke={1.6} />
          <span className="em-serif text-lg">{t("You", "Tu")}</span>
        </div>
      </div>
      <FounderNode ref={founderRefs[1]} founder={founders[1]} />
      {taskColumn(1, "right")}
      {taskRefs[0].map((taskRef, index) => (
        <AnimatedBeam
          key={"l" + index}
          containerRef={containerRef}
          fromRef={taskRef}
          toRef={founderRefs[0]}
          curvature={(1 - index) * 20}
          duration={4}
          delay={index * 0.3}
          pathOpacity={0.12}
        />
      ))}
      {taskRefs[1].map((taskRef, index) => (
        <AnimatedBeam
          key={"r" + index}
          containerRef={containerRef}
          fromRef={founderRefs[1]}
          toRef={taskRef}
          curvature={(1 - index) * 20}
          duration={4}
          delay={index * 0.3}
          pathOpacity={0.12}
        />
      ))}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={founderRefs[0]}
        toRef={youRef}
        duration={3}
        pathOpacity={0.2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={founderRefs[1]}
        toRef={youRef}
        duration={3}
        delay={0.5}
        reverse
        pathOpacity={0.2}
      />
    </div>
  );
}
