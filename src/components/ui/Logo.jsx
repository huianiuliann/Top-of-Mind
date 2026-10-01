import { useLink, useT } from "../../i18n";
export function Logo({ className = "" }) {
  const t = useT();
  const link = useLink();
  return (
    <a
      href={link("index.html")}
      className={"relative z-20 flex items-center gap-2 px-2 py-1 " + className}
      aria-label={t("Top of Mind — home", "Top of Mind — acasă")}
    >
      <span className="size-[7px] rounded-full bg-accent-400" />
      <span className="font-display text-[17px] font-bold tracking-[-0.01em] text-white">Top of Mind</span>
    </a>
  );
}
