import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
export function Eyebrow({ children, className }) {
  return (
    <span className={cn("inline-block font-mono text-[13px] tracking-[0.01em] text-accent-400", className)}>
      {children}
    </span>
  );
}
export function SectionHeading({ eyebrow, title, subtitle, align = "left", className, titleClassName }) {
  const isCentered = align === "center";
  return (
    <div className={cn("flex flex-col gap-5", isCentered && "items-center text-center", className)}>
      {eyebrow && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.5,
        }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "max-w-4xl font-display text-[2.4rem] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white sm:text-5xl md:text-6xl",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{
            opacity: 0,
            y: 14,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: 0.8,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-pretty text-neutral-400",
            isCentered && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
export function SerifEm({ children, className }) {
  return <em className={cn("em-serif", className)}>{children}</em>;
}
