import { motion } from "framer-motion";
import { easeOutExpo } from "./motion";
const revealVariants = {
  "fade-up": { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } },
  "fade-left": { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 } },
  "zoom-in": { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } },
  "blur-in": { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } },
};
export function Reveal({ children, className, variant = "fade-up", delay = 0, as = "div" }) {
  const { initial, animate } = revealVariants[variant];
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      className={className}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </MotionTag>
  );
}
