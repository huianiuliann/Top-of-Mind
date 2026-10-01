import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { BuyerResearchPanel } from "../../components/effects/BuyerResearchPanel";
import { CompetitorTeardownPanel } from "../../components/effects/CompetitorTeardownPanel";
import { PositioningPanel } from "../../components/effects/PositioningPanel";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { L, useT, useLink } from "../../i18n";
import { ArrowTextLink } from "./shared";
function StickyScrollSteps({ steps, className }) {
  const t = useT();
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.6", "end 0.6"],
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextStep = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    nextStep !== activeStep && setActiveStep(nextStep);
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={containerRef} className={cn("relative grid gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      <div className="relative">
        <div className="absolute top-2 bottom-2 left-[15px] hidden w-px bg-white/10 lg:block">
          <motion.div
            style={{
              height: progressHeight,
            }}
            className="w-px bg-gradient-to-b from-accent-300 to-accent-500"
          />
        </div>
        {steps.map((step, index) => (
          <div
            key={step.title.en}
            className={cn(
              "relative flex min-h-[auto] flex-col justify-center py-8 lg:pl-14",
              index === steps.length - 1 ? "lg:min-h-[56vh]" : "lg:min-h-[66vh]",
            )}
          >
            <div
              className={cn(
                "absolute top-1/2 left-0 hidden size-[31px] -translate-y-1/2 place-items-center rounded-full border font-mono text-[13px] transition-colors duration-500 lg:grid",
                activeStep === index
                  ? "border-accent-400 bg-accent-500 text-[#ffffff]"
                  : "border-white/15 bg-ink-950 text-neutral-500",
              )}
            >
              {index + 1}
            </div>
            {step.kicker && (
              <p
                className={cn(
                  "font-mono text-[13px] transition-colors duration-500",
                  activeStep === index ? "text-neutral-400" : "text-neutral-400 lg:text-neutral-700",
                )}
              >
                {t(step.kicker)}
              </p>
            )}
            <h3
              className={cn(
                "mt-2 font-display text-3xl font-bold tracking-[-0.02em] transition-colors duration-500 md:text-5xl",
                activeStep === index ? "text-white" : "text-white lg:text-neutral-600",
              )}
            >
              {t(step.title)}
            </h3>
            <div
              className={cn(
                "mt-4 max-w-md text-lg leading-relaxed transition-colors duration-500",
                activeStep === index ? "text-neutral-300" : "text-neutral-300 lg:text-neutral-600",
              )}
            >
              {t(step.body)}
            </div>
            <div className="mt-8 h-[25rem] lg:hidden">{step.visual}</div>
          </div>
        ))}
      </div>
      <div className="relative hidden lg:block">
        <div className="sticky top-[calc(50vh-15rem)] h-[30rem]">
          {steps.map((step, index) => (
            <motion.div
              key={step.title.en}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: activeStep === index ? 1 : 0,
                scale: activeStep === index ? 1 : 0.97,
                y: activeStep === index ? 0 : 14,
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                pointerEvents: activeStep === index ? "auto" : "none",
              }}
            >
              {step.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function HomeProcess() {
  const t = useT();
  const link = useLink();
  return (
    <section className="theme-light relative py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("Process", "Proces")}
          title={
            <>
              {t("Three steps. ", "Trei pași. ")}
              <SerifEm>{t("No shortcuts.", "Fără scurtături.")}</SerifEm>
            </>
          }
          subtitle={t(
            "The same method, whatever you sell. It's slower on week one and faster on every week after.",
            "Aceeași metodă, orice ai vinde. Prima săptămână e cea mai lentă, după aia lucrurile se mișcă mai repede.",
          )}
        />
        <StickyScrollSteps
          className="mt-8"
          steps={[
            {
              kicker: L("Step 1", "Pasul 1"),
              title: L("Research the market", "Cercetăm piața"),
              body: L(
                "What your customers actually care about, where they spend attention, and what makes them trust a brand enough to pay \u2014 before a single ad gets written.",
                "Ce contează cu adevărat pentru clienții tăi, unde își petrec atenția și ce îi face să aibă destulă încredere într-un brand ca să plătească \u2014 înainte să scriem prima reclamă.",
              ),
              visual: (
                <div className="theme-dark h-full">
                  <BuyerResearchPanel />
                </div>
              ),
            },
            {
              kicker: L("Step 2", "Pasul 2"),
              title: L("Map the competition", "Analizăm concurența"),
              body: L(
                "Whoever's already winning attention in your space, taken apart: what's working, what's copied from somewhere else, and what they're leaving on the table for you.",
                "Îi luăm la bani mărunți pe cei care câștigă deja atenția în domeniul tău: ce le merge, ce au copiat de altundeva și ce lasă liber pentru tine.",
              ),
              visual: (
                <div className="theme-dark h-full">
                  <CompetitorTeardownPanel />
                </div>
              ),
            },
            {
              kicker: L("Step 3", "Pasul 3"),
              title: L("Build a sharper position", "Construim o poziționare mai clară"),
              body: L(
                "What's proven, sharpened, plus what's missing \u2014 the ads, the site, the content \u2014 so that when your customer is ready to decide, yours is the name they remember.",
                "Ce funcționează deja, spus mai clar, plus ce lipsește \u2014 reclamele, site-ul, conținutul \u2014 ca atunci când clientul tău e gata să decidă, numele tău să fie primul care îi vine în minte.",
              ),
              visual: (
                <div className="theme-dark h-full">
                  <PositioningPanel />
                </div>
              ),
            },
          ]}
        />
        <div className="mt-6">
          <ArrowTextLink href={link("process.html")}>
            {t("See what the first month looks like", "Vezi cum arată prima lună")}
          </ArrowTextLink>
        </div>
      </Container>
    </section>
  );
}
