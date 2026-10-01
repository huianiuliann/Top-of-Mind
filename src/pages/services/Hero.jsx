import { motion } from "framer-motion";
import {
  IconActivityHeartbeat,
  IconBrowser,
  IconHash,
  IconMessageCircle,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { L, useT } from "../../i18n";
const heroOrbitChannels = [
  {
    icon: IconSpeakerphone,
    label: L("Ads", "Reclame"),
    ring: 0,
    angle: 0,
  },
  {
    icon: IconBrowser,
    label: L("Website", "Site"),
    ring: 0,
    angle: 180,
  },
  {
    icon: IconHash,
    label: L("Social", "Social media"),
    ring: 1,
    angle: 60,
  },
  {
    icon: IconMessageCircle,
    label: L("Follow-up", "Follow-up"),
    ring: 1,
    angle: 240,
  },
  {
    icon: IconActivityHeartbeat,
    label: L("Tracking", "Tracking"),
    ring: 2,
    angle: 130,
  },
];
const heroOrbitRings = [
  {
    inset: "18%",
    dur: 38,
  },
  {
    inset: "6%",
    dur: 54,
    reverse: true,
  },
  {
    inset: "-6%",
    dur: 70,
  },
];
export function ServicesHeroOrbit() {
  const t = useT();
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative size-[26rem]"
      aria-hidden="true"
    >
      <div className="absolute inset-[30%] rounded-full bg-white/[0.04] blur-3xl" />
      {heroOrbitRings.map((ring, index) => (
        <div
          key={index}
          className="absolute rounded-full border border-white/[0.07]"
          style={{
            inset: ring.inset,
          }}
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.05]" />
        </div>
      ))}
      {heroOrbitChannels.map((item) => {
        const ring = heroOrbitRings[item.ring];
        return (
          <div
            key={item.label.en}
            className="absolute"
            style={{
              inset: ring.inset,
              transform: `rotate(${item.angle}deg)`,
            }}
          >
            <div
              className="absolute inset-0 animate-spin-slow"
              style={{
                animationDuration: `${ring.dur}s`,
                animationDirection: ring.reverse ? "reverse" : "normal",
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${-item.angle}deg)`,
                }}
              >
                <div
                  className="animate-spin-slow"
                  style={{
                    animationDuration: `${ring.dur}s`,
                    animationDirection: ring.reverse ? "normal" : "reverse",
                  }}
                >
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-900 py-1.5 pr-3 pl-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                    <span className="grid size-7 place-items-center rounded-full bg-white/[0.06] text-neutral-300">
                      <item.icon className="size-4" stroke={1.6} />
                    </span>
                    <span className="font-mono text-xs whitespace-nowrap text-neutral-300">{t(item.label)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute inset-[36%] grid place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,#1c1c20,#121215_70%)]">
        <div className="text-center">
          <span className="mx-auto mb-2 block size-1.5 rounded-full bg-accent-400" />
          <p className="em-serif text-2xl leading-none text-white">{t("One system", "Un singur sistem")}</p>
        </div>
      </div>
    </motion.div>
  );
}
