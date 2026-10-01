import { useState } from "react";
import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { CtaBand } from "../../components/sections/CtaBand";
import { PageHero } from "../../components/sections/PageHero";
import { Container } from "../../components/ui/Container";
import { SerifEm } from "../../components/ui/SectionHeading";
import { useT } from "../../i18n";
import { HowYouSellModeDetail, HowYouSellModeRail } from "./Modes";
import { HowYouSellQuickCheck } from "./QuickCheck";
import { buyingModes } from "./shared";
export default function HowYouSellPage() {
  const t = useT();
  const [activeMode, setActiveMode] = useState(0);
  return (
    <SiteLayout current="how-you-sell">
      <PageHero
        eyebrow={t("How you sell", "Cum vinzi")}
        background={
          <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_75%)]" />
        }
        title={t(
          <>
            {"First we find out how your customer decides. "}
            <SerifEm>Then</SerifEm>
            {" we spend your money."}
          </>,
          <>
            {"Întâi aflăm cum decide clientul tău. "}
            <SerifEm>Abia apoi</SerifEm>
            {" îți cheltuim banii."}
          </>,
        )}
        subtitle={t(
          "There's no template industry — there are three ways people buy. Figuring out which one you're in is step one of every account we take on, because it changes the research, the offer, the creative and what we agree to call a win.",
          "Nu ne interesează atât industria, cât felul în care cumpără oamenii de la tine — și sunt trei feluri. Primul lucru pe care îl facem la orice cont nou e să aflăm în care ești, pentru că de asta depind cercetarea, oferta, reclamele și ce numim rezultat.",
        )}
      >
        <div className="mt-10 flex flex-wrap gap-2">
          {buyingModes.map((mode) => (
            <a
              key={mode.id}
              href={`#${mode.id}`}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-mono text-[13px] text-neutral-200 transition-colors hover:border-white/25 hover:text-white"
            >
              <mode.icon className="size-4 text-neutral-500" stroke={1.6} />
              {t(mode.name)}
            </a>
          ))}
        </div>
      </PageHero>
      <section className="theme-light relative py-16 md:py-20">
        <Container>
          <Reveal>
            <HowYouSellQuickCheck />
          </Reveal>
        </Container>
      </section>
      {buyingModes.map((mode, index) => (
        <section
          key={mode.id}
          id={mode.id}
          className={cn("relative scroll-mt-20 py-16 md:py-24", index === 1 && "theme-light")}
        >
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
              <div>
                <HowYouSellModeRail active={activeMode} />
              </div>
              <HowYouSellModeDetail m={mode} i={index} onActive={setActiveMode} />
            </div>
          </Container>
        </section>
      ))}
      <CtaBand
        title={t(
          <>
            {"Tell us "}
            <SerifEm>which one you are.</SerifEm>
          </>,
          <>
            {"Spune-\u2060ne "}
            <SerifEm>în care dintre ele ești.</SerifEm>
          </>,
        )}
        subtitle={t(
          "We don't have a template industry. We have three ways people buy — and a method for each.",
          "Nu ne interesează atât industria, cât felul în care cumpără oamenii. Sunt trei feluri — și avem o metodă pentru fiecare.",
        )}
        secondary={{
          href: "process.html",
          label: t("See the process", "Vezi procesul"),
        }}
      />
    </SiteLayout>
  );
}
