import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowsHorizontal, IconCoins, IconFileText, IconLockOpen, IconUsers } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { MonthlyReportPanel } from "../../components/effects/MonthlyReportPanel";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { L, useT } from "../../i18n";
const CompareSlider = ({
  first,
  second,
  className,
  initialSliderPercentage = 50,
  autoplay = false,
  autoplayDuration = 5e3,
  firstLabel,
  secondLabel,
}) => {
  const containerRef = useRef(null);
  const clipRef = useRef(null);
  const clipInnerRef = useRef(null);
  const handleRef = useRef(null);
  const firstLabelRef = useRef(null);
  const secondLabelRef = useRef(null);
  const rafIdRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isInViewRef = useRef(false);
  const startTimeRef = useRef(0);
  const setSliderPosition = useCallback((percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    clipRef.current && (clipRef.current.style.transform = `translate3d(${clamped - 100}%,0,0)`);
    clipInnerRef.current && (clipInnerRef.current.style.transform = `translate3d(${100 - clamped}%,0,0)`);
    handleRef.current && (handleRef.current.style.transform = `translate3d(${clamped - 50}%,0,0)`);
    firstLabelRef.current && (firstLabelRef.current.style.opacity = clamped > 18 ? "1" : "0");
    secondLabelRef.current && (secondLabelRef.current.style.opacity = clamped < 82 ? "1" : "0");
  }, []);
  const animateFrame = useCallback(
    (timestamp) => {
      startTimeRef.current || (startTimeRef.current = timestamp);
      const progress = ((timestamp - startTimeRef.current) % (autoplayDuration * 2)) / autoplayDuration;
      const pingPong = progress <= 1 ? progress : 2 - progress;
      setSliderPosition(50 + Math.sin((pingPong - 0.5) * Math.PI) * 38);
      rafIdRef.current = requestAnimationFrame(animateFrame);
    },
    [autoplayDuration, setSliderPosition],
  );
  const startAutoplay = useCallback(() => {
    !autoplay ||
      isHoveringRef.current ||
      !isInViewRef.current ||
      rafIdRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (rafIdRef.current = requestAnimationFrame(animateFrame));
  }, [autoplay, animateFrame]);
  const stopAutoplay = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = 0;
  }, []);
  useEffect(() => {
    setSliderPosition(initialSliderPercentage);
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting;
      entry.isIntersecting ? startAutoplay() : stopAutoplay();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      stopAutoplay();
    };
  }, [initialSliderPercentage, setSliderPosition, startAutoplay, stopAutoplay]);
  const moveToClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    rect && setSliderPosition(((clientX - rect.left) / rect.width) * 100);
  };
  return (
    <div
      ref={containerRef}
      className={cn("relative h-[420px] w-full touch-pan-y overflow-hidden select-none", className)}
      style={{
        cursor: "col-resize",
      }}
      onMouseMove={(event) => moveToClientX(event.clientX)}
      onMouseEnter={() => {
        isHoveringRef.current = true;
        stopAutoplay();
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
        startAutoplay();
      }}
      onTouchStart={(event) => {
        isHoveringRef.current = true;
        stopAutoplay();
        moveToClientX(event.touches[0].clientX);
      }}
      onTouchMove={(event) => moveToClientX(event.touches[0].clientX)}
      onTouchEnd={() => {
        isHoveringRef.current = false;
      }}
    >
      <div className="absolute inset-0 z-10">{second}</div>
      <div
        ref={clipRef}
        className="absolute inset-0 z-20 overflow-hidden will-change-transform"
        style={{
          transform: `translate3d(${initialSliderPercentage - 100}%,0,0)`,
        }}
      >
        <div
          ref={clipInnerRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(${100 - initialSliderPercentage}%,0,0)`,
          }}
        >
          {first}
        </div>
      </div>
      {firstLabel && (
        <span
          ref={firstLabelRef}
          className="pointer-events-none absolute bottom-4 left-4 z-30 rounded-full border border-white/10 bg-ink-950/90 px-3 py-1 font-mono text-[12px] text-neutral-400 transition-opacity"
        >
          {firstLabel}
        </span>
      )}
      {secondLabel && (
        <span
          ref={secondLabelRef}
          className="pointer-events-none absolute right-4 bottom-4 z-30 rounded-full border border-white/15 bg-ink-950/90 px-3 py-1 font-mono text-[12px] text-neutral-200 transition-opacity"
        >
          {secondLabel}
        </span>
      )}
      <div
        ref={handleRef}
        className="pointer-events-none absolute inset-0 z-40 will-change-transform"
        style={{
          transform: `translate3d(${initialSliderPercentage - 50}%,0,0)`,
        }}
      >
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent from-[5%] via-accent-400 to-transparent to-[95%]" />
        <div className="absolute top-1/2 left-1/2 -ml-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-accent-400/70 bg-ink-950">
          <IconArrowsHorizontal className="size-4 text-accent-300" stroke={1.6} />
        </div>
      </div>
    </div>
  );
};
function RotatingText({ children, className, interval = 2.4 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = React.Children.toArray(children);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const intervalId = setInterval(
      () => setActiveIndex((current) => (current + 1) % items.length),
      interval * 1e3,
    );
    return () => clearInterval(intervalId);
  }, [items.length, interval]);
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={activeIndex}
          initial={{
            y: 16,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -16,
            opacity: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {items[activeIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
function TypicalAgencyReportMockup() {
  const t = useT();
  return (
    <div className="h-full w-full bg-[#141414] p-5 font-sans text-neutral-400 sm:p-7">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <p className="font-display text-[13px] font-bold text-neutral-300">
            {t("Monthly Performance Report", "Raport lunar de performanță")}
          </p>
          <p className="text-[11px] text-neutral-500">
            {t(
              "Account overview · all campaigns · all placements",
              "Sumar cont · toate campaniile · toate plasamentele",
            )}
          </p>
        </div>
        <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-neutral-500">
          {t("Export PDF", "Exportă PDF")}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          L("Impressions", "Impresii"),
          L("Reach", "Acoperire"),
          L("CPM", "CPM"),
          L("CTR (link)", "CTR (clic pe link)"),
          L("Frequency", "Frecvență"),
          L("Engagement rate", "Rată de interacțiune"),
          L("Video ThruPlays", "ThruPlay-uri video"),
          L("Cost / result", "Cost / rezultat"),
        ].map((metric) => (
          <div key={metric.en} className="rounded-md border border-white/5 bg-white/[0.02] p-2">
            <p className="truncate text-[10px] text-neutral-500">{t(metric)}</p>
            <p className="mt-1 font-display text-[15px] font-bold text-neutral-300 blur-[3.5px]">
              {t("88.8k", "88,8k")}
            </p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 400 110" className="mt-4 h-28 w-full" aria-hidden="true">
        {[
          "M0 80 C40 20, 80 90, 120 50 S200 10, 240 70 S330 30, 400 60",
          "M0 40 C50 90, 90 20, 140 60 S220 90, 260 30 S340 80, 400 20",
          "M0 95 C40 60, 100 70, 150 30 S220 60, 270 90 S350 40, 400 85",
          "M0 60 C60 60, 80 10, 130 85 S210 20, 250 50 S320 100, 400 45",
        ].map((pathData, index) => (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke={["#666", "#555", "#777", "#4a4a4a"][index]}
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-5 gap-2 text-[10px]">
            <span className="col-span-2 truncate text-neutral-500">
              {t("Campaign_", "Campanie_")}
              {t(
                [
                  L("Awareness_Broad", "Notorietate_Larg"),
                  "LAL_3pct_v2",
                  L("Retarget_30d", "Retargeting_30z"),
                  L("Prospecting_ASC", "Prospectare_ASC"),
                ][row],
              )}
            </span>
            <span className="blur-[3px]">{t("1.24%", "1,24%")}</span>
            <span className="blur-[3px]">{t("€0.38", "0,38 €")}</span>
            <span className="blur-[3px]">{t("3.1", "3,1")}</span>
          </div>
        ))}
      </div>
      <p className="em-serif mt-4 text-[13px] text-neutral-500">
        {t(
          "“Overall, performance remained stable with positive engagement trends.”",
          "„Per ansamblu, performanța a rămas stabilă, cu tendințe pozitive la interacțiuni.”",
        )}
      </p>
    </div>
  );
}
export function HomeHowWeWork() {
  const t = useT();
  return (
    <section className="theme-light relative py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t("How we work", "Cum lucrăm")}
              title={
                <>
                  {t("Built to be ", "Riști ")}
                  <SerifEm className="whitespace-nowrap">{t("low-risk", "puțin")}</SerifEm>
                  {t(" to try.", " dacă ne încerci.")}
                </>
              }
              subtitle={t(
                "We're a young studio, so we made the arrangement easy to say yes to — and easy to judge.",
                "Suntem la început de drum, așa că am gândit colaborarea ca să-ți fie ușor să zici da — și la fel de ușor să-ți dai seama dacă merită.",
              )}
            />
            <ul className="mt-10 space-y-3">
              {[
                {
                  i: IconLockOpen,
                  t: L("No long lock-in contracts", "Fără contracte lungi care te țin legat"),
                  d: L(
                    "If it isn't working, you're not stuck paying for it.",
                    "Dacă nu merge, nu rămâi blocat să plătești pentru ceva ce nu funcționează.",
                  ),
                },
                {
                  i: IconFileText,
                  t: L("Reports in plain language", "Rapoarte pe înțelesul tău"),
                  d: L(
                    "What happened, why, and what we're changing next.",
                    "Ce s-a întâmplat, de ce și ce schimbăm mai departe.",
                  ),
                },
                {
                  i: IconUsers,
                  t: L("Direct access to the two of us", "Vorbești direct cu noi doi"),
                  d: L("Never a junior relaying your notes.", "Fără niciun junior la mijloc."),
                },
              ].map((item, index) => (
                <Reveal
                  key={item.t.en}
                  as="li"
                  delay={index * 0.08}
                  variant="fade-left"
                  className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-neutral-400">
                    <item.i className="size-5" stroke={1.6} />
                  </span>
                  <div>
                    <p className="font-display font-bold tracking-[-0.01em] text-white">{t(item.t)}</p>
                    <p className="mt-0.5 text-[15px] text-neutral-400">{t(item.d)}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal
                as="li"
                delay={0.24}
                variant="fade-left"
                className="flex gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.02] p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent-400/45 text-accent-300">
                  <IconCoins className="size-5" stroke={1.6} />
                </span>
                <div>
                  <p className="font-display font-bold tracking-[-0.01em] text-white">
                    {t("Part of our fee moves with your results", "O parte din tarif depinde de rezultatele tale")}
                  </p>
                  <p className="mt-0.5 text-[15px] text-neutral-400">
                    <RotatingText className="text-neutral-200">
                      <span>{t("per qualified lead on quote work", "Oferta: per lead calificat")}</span>
                      <span>{t("tied to ad performance on cart", "Coșul: performanța reclamelor")}</span>
                      <span>{t("tied to direct bookings on calendar", "Calendarul: rezervări directe")}</span>
                    </RotatingText>
                  </p>
                </div>
              </Reveal>
            </ul>
          </div>
          <Reveal variant="zoom-in">
            <div className="theme-dark relative rounded-[1.8rem] border border-white/[0.08] bg-ink-900 p-2 shadow-[0_30px_60px_-24px_rgba(19,19,22,0.45)]">
              <CompareSlider
                first={<TypicalAgencyReportMockup />}
                second={<MonthlyReportPanel />}
                firstLabel={t("The report you're used to", "Raportul cu care te-ai obișnuit")}
                secondLabel={t("The report you get from us", "Raportul primit de la noi")}
                autoplay
                autoplayDuration={4200}
                className="h-[34rem] rounded-[1.4rem] sm:h-[30rem]"
              />
            </div>
            <p className="mt-4 text-center font-mono text-[12.5px] text-neutral-500">
              {t(
                "Move across the report — left is what most agencies send, right is ours. Example content.",
                "Plimbă glisorul peste raport — în stânga e ce trimit cele mai multe agenții, în dreapta e al nostru. Conținut de exemplu.",
              )}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
