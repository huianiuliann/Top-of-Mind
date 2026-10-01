import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  IconArrowRight,
  IconChartLine,
  IconCheck,
  IconClockHour4,
  IconFileText,
  IconSearch,
  IconTargetArrow,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { CALENDLY_URL } from "../../data/site";
import { useLink, useT } from "../../i18n";
function PointerHighlight({ children, rectangleClassName, pointerClassName, containerClassName, delay = 0 }) {
  return (
    <span className={cn("relative inline-block w-fit", containerClassName)}>
      {children}
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-x-[0.1em] -inset-y-[0.02em] z-0 block rounded-xl border border-accent-400 bg-accent-500/[0.08]",
          rectangleClassName,
        )}
        initial={{
          clipPath: "inset(0 100% 100% 0 round 12px)",
          opacity: 0,
        }}
        animate={{
          clipPath: "inset(0 0% 0% 0 round 12px)",
          opacity: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.65, 0, 0.35, 1],
          delay: delay,
          opacity: {
            duration: 0.15,
            delay: delay,
          },
        }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 z-10 block"
        initial={{
          opacity: 0,
          x: "-120%",
          y: "-120%",
        }}
        animate={{
          opacity: 1,
          x: "70%",
          y: "70%",
        }}
        transition={{
          duration: 0.9,
          ease: [0.65, 0, 0.35, 1],
          delay: delay,
          opacity: {
            duration: 0.15,
            delay: delay,
          },
        }}
      >
        <CursorPointerIcon className={cn("h-5 w-5 -rotate-90 text-accent-400", pointerClassName)} />
      </motion.span>
    </span>
  );
}
const CursorPointerIcon = ({ ...props }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
  </svg>
);
function HeroParallaxCard({ mx, my, depth, className, delay, children }) {
  const offsetX = useTransform(mx, (value) => value * depth);
  const offsetY = useTransform(my, (value) => value * depth);
  return (
    <motion.div
      style={{
        x: offsetX,
        y: offsetY,
      }}
      className={"pointer-events-none absolute hidden min-[1400px]:block " + className}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: {
            delay: delay,
            duration: 0.8,
          },
          y: {
            delay: delay + 0.8,
            duration: 6,
            repeat: 1 / 0,
            ease: "easeInOut",
          },
        }}
        className="rounded-2xl border border-white/[0.08] bg-ink-900 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
function HeroFloatingCards({ mx, my }) {
  const t = useT();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <HeroParallaxCard mx={mx} my={my} depth={-0.02} delay={0.6} className="top-[170px] left-[5%] -rotate-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white/[0.05] text-neutral-400">
            <IconSearch className="size-4" stroke={1.6} />
          </span>
          <div>
            <p className="font-mono text-[11px] text-neutral-500">{t("Week 1", "Săptămâna 1")}</p>
            <p className="text-[13px] text-neutral-200">
              {t("Buyer questions mapped", "Întrebările clienților, identificate")}
            </p>
          </div>
          <span className="ml-1 grid size-5 place-items-center rounded-full bg-white/85 text-ink-950">
            <IconCheck className="size-3" stroke={3} />
          </span>
        </div>
      </HeroParallaxCard>
      <HeroParallaxCard mx={mx} my={my} depth={-0.035} delay={0.8} className="top-[210px] right-[5%] rotate-2">
        <p className="font-mono text-[11px] text-neutral-500">{t("Competitor ads", "Reclamele concurenței")}</p>
        <div className="mt-1.5 flex gap-1.5">
          <span className="rounded-full bg-white/[0.13] px-2 py-0.5 font-mono text-[10px] text-white">
            {t("working", "funcționează")}
          </span>
          <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-neutral-400">
            {t("copied", "copiate")}
          </span>
          <span className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
            {t("missing", "lipsă")}
          </span>
        </div>
      </HeroParallaxCard>
      <HeroParallaxCard mx={mx} my={my} depth={0.03} delay={1} className="top-[500px] left-[4%] rotate-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white/[0.05] text-neutral-400">
            <IconTargetArrow className="size-4" stroke={1.6} />
          </span>
          <div>
            <p className="font-mono text-[11px] text-neutral-500">
              {t("Positioning draft", "Schiță de poziționare")}
            </p>
            <p className="em-serif text-[15px] text-neutral-100">
              {t("“Show the drawing first.”", "„Arată întâi desenul.”")}
            </p>
          </div>
        </div>
      </HeroParallaxCard>
      <HeroParallaxCard
        mx={mx}
        my={my}
        depth={0.025}
        delay={1.2}
        className="top-[530px] right-[4%] -rotate-2"
      >
        <div className="w-44">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] text-neutral-500">
              {t("The number we report", "Cifra pe care o raportăm")}
            </p>
            <IconChartLine className="size-3.5 text-neutral-500" stroke={1.6} />
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-200">{t("Qualified requests", "Cereri calificate")}</p>
          <svg viewBox="0 0 160 36" className="mt-2 h-8 w-full">
            <path
              d="M0 30 L25 27 L50 28 L75 20 L100 22 L125 12 L160 6"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </HeroParallaxCard>
    </div>
  );
}
// Headline, copy and CTA render visible from the first frame (prerendered HTML, LCP); only the decor animates.
export function HomeHero() {
  const t = useT();
  const link = useLink();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  return (
    <section
      className="relative isolate overflow-hidden pt-32"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left - rect.width / 2);
        mouseY.set(event.clientY - rect.top - rect.height / 2);
      }}
    >
      <HeroFloatingCards mx={mouseX} my={mouseY} />
      <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(55%_45%_at_50%_0%,rgba(244,244,246,0.06),transparent_72%)]" />
      <Container className="relative flex flex-col items-center text-center">
        <a
          href={link("how-you-sell.html")}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 font-mono text-[12px] text-neutral-400 transition-colors hover:border-white/25 hover:text-neutral-200 sm:text-[13px]"
        >
          <span>
            {t("Research-first marketing studio", "Marketing care începe cu cercetarea")}
            <span className="hidden sm:inline">{" \xB7 Cluj-Napoca"}</span>
          </span>
          <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" stroke={1.6} />
        </a>
        <h1 className="mt-7 max-w-[19ch] font-display text-[2.85rem] leading-[0.96] font-bold tracking-[-0.03em] text-balance text-white sm:text-6xl md:text-7xl lg:text-[5.2rem] min-[112.5rem]:max-w-[21ch] min-[112.5rem]:text-[6rem]">
          {t("We research your market before we touch", "Îți cercetăm piața înainte să ne atingem de")}{" "}
          <PointerHighlight delay={0.4} containerClassName="mx-[0.12em]">
            <span className="em-serif relative z-10 px-[0.06em]">{t("a euro", "un euro")}</span>
          </PointerHighlight>{" "}
          {t("of your budget.", "din bugetul tău.")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-400 md:text-xl">
          {t(
            "Meta and Google Ads, websites and content — built around how your customer actually buys: by quote, by cart or by calendar. Two founders, no juniors, no templates.",
            "Meta Ads și Google Ads, site-uri și conținut — totul construit după felul în care cumpără, de fapt, clienții tăi: prin ofertă, prin coș sau prin calendar. Doi fondatori, fără juniori, fără șabloane.",
          )}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <PrimaryButton href={CALENDLY_URL} external size="lg">
            {t("Book a free 30-min call", "Apel gratuit de 30 de minute")}
          </PrimaryButton>
          <SecondaryButton href={link("how-you-sell.html")} size="lg">
            {t("How you sell", "Cum vinzi")}
          </SecondaryButton>
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-mono text-[12.5px] text-neutral-500">
          <li className="flex items-center gap-2">
            <IconClockHour4 className="size-4 text-neutral-500" stroke={1.6} />
            {t("30 minutes, free", "30 de minute, gratuit")}
          </li>
          <li className="flex items-center gap-2">
            <IconUsers className="size-4 text-neutral-500" stroke={1.6} />
            {t("You talk to the people doing the work", "Vorbești direct cu cei care fac treaba")}
          </li>
          <li className="flex items-center gap-2">
            <IconFileText className="size-4 text-neutral-500" stroke={1.6} />
            {t("Reporting in plain language", "Rapoarte pe înțelesul tău")}
          </li>
        </ul>
      </Container>
    </section>
  );
}
