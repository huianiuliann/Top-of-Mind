import { cn } from "../../lib/cn";
import { Reveal } from "../effects/Reveal";
export function Eyebrow({ children }) {
  return (
    <span className="inline-block font-mono text-[13px] tracking-[0.01em] text-accent-400">{children}</span>
  );
}
export function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  const isCentered = align === "center";
  return (
    <div className={cn("flex flex-col gap-5", isCentered && "items-center text-center")}>
      {eyebrow && (
        <Reveal variant="blur-in">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal
        as="h2"
        className="max-w-4xl font-display text-4xl leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white sm:text-5xl md:text-6xl"
      >
        {title}
      </Reveal>
      {subtitle && (
        <Reveal
          as="p"
          variant="blur-in"
          delay={0.08}
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-pretty text-neutral-400",
            isCentered && "mx-auto",
          )}
        >
          {subtitle}
        </Reveal>
      )}
    </div>
  );
}
export function SerifEm({ children, className }) {
  return <em className={cn("em-serif", className)}>{children}</em>;
}
