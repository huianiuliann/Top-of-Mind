import { cn } from "../../lib/cn";
export function Panel({ children, className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,#17171b_0%,#121215_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
