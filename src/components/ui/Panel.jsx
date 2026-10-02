import { cn } from "../../lib/cn";
export function Panel({ children, className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-white/10 bg-[linear-gradient(180deg,var(--color-ink-900)_0%,var(--color-ink-950)_100%)] shadow-[inset_0_1px_0_rgba(254,250,241,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
