import { useRef } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { IconChartBar, IconCheck, IconCoins, IconDropletFilled, IconHammer } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { FramedCard } from "../../components/ui/FramedCard";
import { CALENDLY_URL } from "../../data/site";
import { useT } from "../../i18n";
import { buyingModes } from "./shared";
export function HowYouSellModeRail({ active }) {
  const t = useT();
  return (
    <nav aria-label={t("Buying modes", "Feluri de a cumpăra")} className="sticky top-32 hidden lg:block">
      <p className="mb-4 font-mono text-[12px] text-neutral-500">
        {t("Three ways people buy", "Trei feluri de a cumpăra")}
      </p>
      <ul className="space-y-1">
        {buyingModes.map((mode, index) => (
          <li key={mode.id}>
            <a
              href={`#${mode.id}`}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                active === index ? "bg-white/[0.05] text-white" : "text-neutral-500 hover:text-neutral-200",
              )}
            >
              {active === index && (
                <motion.span
                  layoutId="rail-active"
                  className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-accent-400"
                />
              )}
              <mode.icon className="size-5" stroke={1.6} />
              <span className="font-display text-lg font-bold tracking-[-0.01em]">{t(mode.name)}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl border border-white/[0.07] p-4">
        <p className="text-sm text-neutral-400">{t("Not sure which one you are?", "Nu ești sigur?")}</p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener"
          className="mt-2 inline-block font-mono text-[13px] text-neutral-200 hover:text-white"
        >
          {t(
            "That's the first ten minutes of the call →",
            "Asta lămurim în primele zece minute ale apelului →",
          )}
        </a>
      </div>
    </nav>
  );
}
export function HowYouSellModeDetail({ mode, index, onActive }) {
  const t = useT();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.5", "end 0.5"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progress > 0 && progress < 1 && onActive(index);
  });
  return (
    <div ref={sectionRef}>
      <Reveal variant="blur-in">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl border border-white/15 text-neutral-300">
            <mode.icon className="size-5" stroke={1.6} />
          </span>
          <p className="font-mono text-[13px] text-neutral-400">
            {t("Mode ", "Varianta ")}
            {index + 1}
            {" · "}
            {t(mode.name)}
          </p>
        </div>
        <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white md:text-6xl">
          {t(mode.headline)}
        </h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <FramedCard innerClassName="p-6 md:p-8">
            <p className="font-mono text-[12px] text-neutral-500">{t("What it looks like", "Cum arată")}</p>
            <p className="mt-3 text-lg leading-relaxed text-neutral-300">{t(mode.looks)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {mode.niches.map((niche) => (
                <span
                  key={niche.en}
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-neutral-200"
                >
                  {t(niche)}
                </span>
              ))}
            </div>
          </FramedCard>
        </Reveal>
        <Reveal variant="zoom-in" delay={0.1}>
          <FramedCard
            className="theme-dark bg-ink-950"
            innerClassName="flex min-h-[18rem] items-center justify-center p-6 md:p-8"
          >
            <div className="w-full max-w-sm">
              <mode.Visual />
            </div>
          </FramedCard>
        </Reveal>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Reveal delay={0.05} className="h-full">
          <FramedCard innerClassName="p-6">
            <span className="grid size-10 place-items-center rounded-xl border border-white/10 text-neutral-400">
              <IconDropletFilled className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {t("Where the money actually leaks", "Unde se pierd banii, de fapt")}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{t(mode.leak)}</p>
          </FramedCard>
        </Reveal>
        <Reveal delay={0.12} className="h-full">
          <FramedCard innerClassName="p-6">
            <span className="grid size-10 place-items-center rounded-xl border border-white/10 text-neutral-400">
              <IconHammer className="size-5" stroke={1.6} />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {t("What we build in the first 60 days", "Ce construim în primele 60 de zile")}
            </h3>
            <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-neutral-500">
              <span>{t("Day 1", "Ziua 1")}</span>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
                  className="h-full rounded-full bg-white/55"
                />
              </div>
              <span>{t("Day 60", "Ziua 60")}</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {mode.build.map((item) => (
                <li
                  key={item.en}
                  className="flex items-start gap-2.5 text-[15px] leading-snug text-neutral-300"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/[0.08] text-neutral-200">
                    <IconCheck className="size-3" stroke={2.5} />
                  </span>
                  {t(item)}
                </li>
              ))}
            </ul>
          </FramedCard>
        </Reveal>
        <Reveal delay={0.19} className="h-full">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-accent-400/35 bg-ink-900 p-6">
            <span className="grid size-10 place-items-center rounded-xl border border-accent-400/45 text-accent-300">
              <IconChartBar className="size-5" stroke={1.6} />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {t("What we report", "Ce raportăm")}
            </h3>
            <p className="em-serif mt-3 text-[2rem] leading-tight text-white">{t(mode.report)}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">{t(mode.reportNote)}</p>
            <p className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-neutral-300">
              <IconCoins className="size-4 text-neutral-500" stroke={1.6} />
              {t(mode.fee)}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
