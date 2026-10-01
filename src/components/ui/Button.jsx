import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
function Magnetic({ children, className, strength = 0.3, mass = 0.5 }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = {
    stiffness: 150 * (1 / mass),
    damping: 15 * mass,
    mass: mass,
  };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const innerX = useTransform(springX, (value) => value * -0.25);
  const innerY = useTransform(springY, (value) => value * -0.25);
  return (
    <motion.div
      ref={containerRef}
      className={cn("inline-block", className)}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={(event) => {
        if (!containerRef.current || !window.matchMedia("(hover: hover)").matches) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        mouseY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        style={{
          x: innerX,
          y: innerY,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
const buttonSizes = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3.5 text-[14px]",
  lg: "px-8 py-4.5 text-[15px]",
};
export function PrimaryButton({
  href,
  children,
  className,
  external,
  size = "md",
  magnetic = true,
  icon = "arrow",
}) {
  const ArrowIcon = icon === "up" ? IconArrowUpRight : IconArrowRight;
  const link = (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent-500 font-sans font-semibold text-[#ffffff]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_-12px_rgba(91,84,245,0.9)]",
        "transition-[background-color,transform] duration-300 hover:bg-[#6660f6] active:scale-[0.98]",
        buttonSizes[size],
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.3)] to-transparent group-hover:animate-sweep-once" />
      <span className="relative">{children}</span>
      {icon !== "none" && (
        <ArrowIcon
          className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          stroke={1.8}
        />
      )}
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
export function SecondaryButton({ href, children, className, external, size = "md", icon = "arrow" }) {
  const ArrowIcon = icon === "up" ? IconArrowUpRight : IconArrowRight;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 font-sans font-semibold text-neutral-200 transition-colors duration-300 hover:border-accent-400/70 hover:bg-accent-500/[0.08] hover:text-white",
        buttonSizes[size],
        className,
      )}
    >
      <span>{children}</span>
      {icon !== "none" && (
        <ArrowIcon
          className="size-4 text-neutral-400 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-accent-300"
          stroke={1.8}
        />
      )}
    </a>
  );
}
