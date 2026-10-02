import { cn } from "../../lib/cn";
export function FramedCard({ children, className, innerClassName }) {
  return (
    <div
      className={cn(
        "group/card relative h-full rounded-card border border-white/10 p-1.5 transition-colors duration-500 hover:border-accent-400 md:p-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-card-inner border border-white/[0.06] bg-ink-900 shadow-[inset_0_1px_0_rgba(254,250,241,0.03)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
