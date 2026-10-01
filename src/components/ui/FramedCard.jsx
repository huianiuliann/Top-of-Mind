import { cn } from "../../lib/cn";
export function FramedCard({ children, className, innerClassName }) {
  return (
    <div
      className={cn(
        "group/card relative h-full rounded-[1.6rem] border border-white/[0.07] p-1.5 transition-colors duration-500 hover:border-accent-400/40 md:p-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-white/[0.05] bg-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
