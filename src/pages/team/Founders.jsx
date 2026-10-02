import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useT } from "../../i18n";
import { useFounders } from "../../data/site";
const founderCardTilts = [-6, 5, -3, 7, -8, 4];
const designation = (founder) => `${founder.role} — ${founder.focus}`;
export const FounderCarousel = () => {
  const t = useT();
  const people = useFounders();
  const [activeIndex, setActiveIndex] = useState(0);
  // The first founder renders settled (prerendered HTML, the page's LCP image); entrance motion starts with the first click.
  const [touched, setTouched] = useState(false);
  const active = people[activeIndex];
  const showNext = () => {
    setTouched(true);
    setActiveIndex((index) => (index + 1) % people.length);
  };
  const showPrev = () => {
    setTouched(true);
    setActiveIndex((index) => (index - 1 + people.length) % people.length);
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-10 antialiased md:max-w-5xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-14 md:grid-cols-[1fr_1.15fr] md:gap-20">
        <div className="relative h-80 w-full md:h-[26rem]">
          <AnimatePresence>
            {people.map((p, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={p.duo}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.55,
                    scale: isActive ? 1 : 0.94,
                    z: isActive ? 0 : -100,
                    rotate: isActive ? 0 : founderCardTilts[index % founderCardTilts.length],
                    zIndex: isActive ? 40 : people.length + 2 - index,
                    y: isActive ? [0, -60, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: founderCardTilts[(index + 1) % founderCardTilts.length],
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-card border border-white/10 bg-ink-800">
                    <img
                      src={p.duo}
                      alt={p.name}
                      width={640}
                      height={640}
                      draggable={false}
                      style={{ objectPosition: p.crop.portrait }}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="theme-dark absolute inset-x-0 bottom-0 p-5">
                      <p className="font-display text-xl font-bold tracking-[-0.01em] text-white">{p.name}</p>
                      <p className="font-mono text-[13px] text-neutral-300">{designation(p)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-between py-2">
          <motion.div
            key={activeIndex}
            initial={touched ? { y: 20, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <h3 className="font-display text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
              {active.name}
            </h3>
            <p className="mt-1 font-mono text-[13px] text-neutral-500">{designation(active)}</p>
            <p className="mt-8 text-lg leading-relaxed text-neutral-300">
              {active.line.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={activeIndex + "-" + wordIndex}
                  initial={touched ? { opacity: 0, y: 5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut", delay: 0.018 * wordIndex }}
                  className="inline-block"
                >
                  {word}
                  {"\xA0"}
                </motion.span>
              ))}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="flex items-center gap-4 pt-10 md:pt-0">
            <button
              type="button"
              aria-label={t("Previous", "Anterior")}
              onClick={showPrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-white/30"
            >
              <IconArrowLeft className="h-5 w-5 text-neutral-300 transition-transform duration-300 group-hover/button:rotate-12" />
            </button>
            <button
              type="button"
              aria-label={t("Next", "Următor")}
              onClick={showNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-white/30"
            >
              <IconArrowRight className="h-5 w-5 text-neutral-300 transition-transform duration-300 group-hover/button:-rotate-12" />
            </button>
            <span className="ml-2 font-mono text-[13px] text-neutral-500">
              {activeIndex + 1}
              {" / "}
              {people.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
