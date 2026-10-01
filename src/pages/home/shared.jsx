import { IconArrowRight } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { useLink } from "../../i18n";
// Internal link: wrapped here so every caller gets /ro/<file> on the Romanian page (wrapping twice is harmless).
export function ArrowTextLink({ href, children, className }) {
  const link = useLink();
  return (
    <a
      href={link(href)}
      className={cn(
        "group inline-flex items-center gap-1.5 font-mono text-[13px] text-neutral-300 transition-colors hover:text-accent-300",
        className,
      )}
    >
      <span className="bg-gradient-to-r from-accent-400 to-accent-400 bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <IconArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        stroke={1.8}
      />
    </a>
  );
}
