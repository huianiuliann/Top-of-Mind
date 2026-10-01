import { cn } from "../../lib/cn";
function InfiniteMarquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  speed = 40,
  gap = 16,
}) {
  return (
    <div
      className={cn("group flex flex-row overflow-hidden", className)}
      style={{
        "--duration": `${speed}s`,
        "--gap": `${gap}px`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({
        length: repeat,
      }).map((_, index) => (
        <div
          key={index}
          aria-hidden={index > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 flex-row justify-around [gap:var(--gap)]",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
const marqueeServices = [
  "Meta Ads",
  "Google Ads",
  "Landing pages",
  "Websites",
  "Web analytics",
  "Conversion tracking",
  "Creative testing",
  "Social content",
  "Lead generation",
  "Plain-language reports",
];
export function HomeServicesMarquee() {
  return (
    <section aria-label="What we do" className="relative border-y border-white/[0.07] py-7">
      <InfiniteMarquee speed={38} gap={0} pauseOnHover className="mask-fade-x">
        {marqueeServices.map((service) => (
          <span
            key={service}
            className="flex items-center font-display text-2xl font-bold tracking-[-0.01em] whitespace-nowrap text-neutral-500 md:text-[1.9rem]"
          >
            {service}
            <span className="em-serif px-[0.7em] text-accent-400/60">/</span>
          </span>
        ))}
      </InfiniteMarquee>
    </section>
  );
}
