import { cn } from "../../lib/cn";
export function Chip({ children, tone = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] whitespace-nowrap",
        {
          neutral: "bg-white/[0.06] text-neutral-300",
          strong: "bg-white/[0.13] text-white",
          outline: "border border-white/15 text-neutral-300",
          muted: "text-neutral-500 ring-1 ring-white/[0.08]",
          accent: "text-accent-300 ring-1 ring-accent-400",
        }[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
