import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
const revealVariants = {
  "fade-up": {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  "fade-down": {
    initial: {
      opacity: 0,
      y: -24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  "fade-left": {
    initial: {
      opacity: 0,
      x: -24,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
  },
  "fade-right": {
    initial: {
      opacity: 0,
      x: 24,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
  },
  "zoom-in": {
    initial: {
      opacity: 0,
      scale: 0.92,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
  },
  "blur-in": {
    initial: {
      opacity: 0,
      y: 16,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  "flip-up": {
    initial: {
      opacity: 0,
      rotateX: 35,
      y: 30,
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: 0,
    },
  },
};
export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  amount = 0.1,
  as = "div",
}) {
  const variantConfig = revealVariants[variant];
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={variantConfig.initial}
      whileInView={variantConfig.animate}
      viewport={{
        once: true,
        amount: amount,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      style={{
        transformPerspective: 1e3,
      }}
    >
      {children}
    </MotionTag>
  );
}
