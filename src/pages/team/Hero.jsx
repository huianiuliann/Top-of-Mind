import { motion } from "framer-motion";
import { avatarStyle, useFounders } from "../../data/site";
import { easeOutExpo } from "../../components/effects/motion";
export function TeamHeroFounderOrbit() {
  const founders = useFounders();
  return (
    <div className="relative size-[27rem]" aria-hidden="true">
      <div className="absolute inset-[22%] rounded-full bg-white/[0.035] blur-3xl" />
      <div
        className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/10"
        style={{ animationDuration: "60s" }}
      />
      <div className="absolute inset-[12%] rounded-full border border-white/[0.06]" />
      {founders.map((founder, index) => (
        <motion.div
          key={founder.name}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.2, duration: 0.9, ease: easeOutExpo }}
          className="absolute"
          style={index === 0 ? { top: "0%", left: "0%" } : { bottom: "0%", right: "0%" }}
        >
          <motion.div
            animate={{ y: [0, index ? 8 : -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative size-36 overflow-hidden rounded-full ring-1 ring-white/15">
              <img
                src={founder.duo}
                alt=""
                style={avatarStyle(founder)}
                className="relative size-full rounded-full object-cover"
              />
            </div>
            <span className="rounded-lg border border-white/10 bg-ink-900 px-3 py-1 font-mono text-xs text-neutral-300">
              {founder.name.split(" ")[0]}
              {" · "}
              {founder.focus}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
