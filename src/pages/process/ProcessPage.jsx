import {
  IconChartArrowsVertical,
  IconCheck,
  IconClipboardList,
  IconFileText,
  IconMapPin,
  IconRocket,
  IconSearch,
  IconTarget,
} from "@tabler/icons-react";
import { MonthlyReportPanel } from "../../components/effects/MonthlyReportPanel";
import { Reveal } from "../../components/effects/Reveal";
import { SplitTestVisual } from "../../components/effects/SplitTestVisual";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { CtaBand } from "../../components/sections/CtaBand";
import { PageHero } from "../../components/sections/PageHero";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { L, useT } from "../../i18n";
import { DayOnePreview } from "./DayOnePreview";
import { FirstMonthTimeline, FirstMonthWeekCard } from "./FirstMonth";
import { MethodTracingBeam, methodSteps } from "./Method";
export default function ProcessPage() {
  const t = useT();
  return (
    <SiteLayout current="process">
      <PageHero
        eyebrow={t("Process", "Proces")}
        title={
          <>
            {t("Three steps. ", "Trei pași. ")}
            <SerifEm>{t("No shortcuts.", "Fără scurtături.")}</SerifEm>
          </>
        }
        subtitle={t(
          "The same method, every time, whatever you sell. It's slower on week one and faster on every week after.",
          "Aceeași metodă, de fiecare dată, orice ai vinde. Prima săptămână e cea mai lentă, după aia lucrurile se mișcă mai repede.",
        )}
      />
      <section className="relative -mt-40 md:-mt-64">
        <DayOnePreview />
      </section>
      <section className="relative -mt-20 py-16 md:-mt-40 md:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("The method", "Metoda")}
            title={
              <>
                {t("What happens in each step — ", "Ce se întâmplă la fiecare pas — ")}
                <SerifEm>{t("and what you get.", "și ce primești.")}</SerifEm>
              </>
            }
          />
          <div className="mt-16">
            <MethodTracingBeam>
              <div className="space-y-24 md:space-y-32">
                {methodSteps.map((step, index) => (
                  <div key={index} className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
                    <Reveal variant="blur-in">
                      <p className="font-mono text-[13px] text-neutral-400">
                        {t("Step ", "Pasul ")}
                        {index + 1}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
                        {t(step.title)}
                      </h3>
                      <p className="mt-6 text-lg leading-relaxed text-neutral-300">{t(step.body)}</p>
                      <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">{t(step.modes)}</p>
                      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="font-mono text-[12px] text-neutral-400">
                          {t("What you get", "Ce primești")}
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {step.gets.map((deliverable) => (
                            <li
                              key={deliverable.en}
                              className="flex items-start gap-2.5 text-[15px] text-neutral-200"
                            >
                              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/[0.08] text-neutral-200">
                                <IconCheck className="size-3" stroke={2.5} />
                              </span>
                              {t(deliverable)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                    <Reveal variant="zoom-in" className="h-[28rem] lg:sticky lg:top-32">
                      {step.visual}
                    </Reveal>
                  </div>
                ))}
              </div>
            </MethodTracingBeam>
          </div>
        </Container>
      </section>
      <section className="theme-light relative py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("The first month", "Prima lună")}
            title={
              <>
                {t("Week by week, ", "Săptămână cu săptămână, ")}
                <SerifEm>{t("in the open.", "la vedere.")}</SerifEm>
              </>
            }
            subtitle={t(
              "You see the plan on day one and the first real report on week four. Nothing big-bang, nothing hidden.",
              "Planul îl vezi din prima zi. Primul raport adevărat îl primești în săptămâna a patra. Totul treptat, nimic ascuns.",
            )}
          />
        </Container>
        <Container>
          <FirstMonthTimeline
            data={[
              {
                kicker: t("Week 1", "Săptămâna 1"),
                title: t("Research", "Cercetare"),
                content: (
                  <FirstMonthWeekCard
                    icon={IconSearch}
                    title={t("Research & audit", "Cercetare și audit")}
                    body={t(
                      "Your market, your competitors, and whatever you already have running — including whether your tracking is telling the truth.",
                      "Piața ta, concurenții tăi și tot ce ai deja pornit — inclusiv dacă tracking-ul îți spune adevărul.",
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {[
                        L("Buyer questions", "Întrebările clienților"),
                        L("Competitor map", "Analiza concurenței"),
                        L("Ad library teardown", "Reclamele lor, disecate"),
                        L("Tracking check", "Verificarea tracking-ului"),
                      ].map((label) => (
                        <span
                          key={label.en}
                          className="rounded-lg border border-white/10 px-3 py-1 font-mono text-[12px] text-neutral-300"
                        >
                          {t(label)}
                        </span>
                      ))}
                    </div>
                  </FirstMonthWeekCard>
                ),
              },
              {
                kicker: t("Week 2", "Săptămâna 2"),
                title: t("Plan", "Planificare"),
                content: (
                  <FirstMonthWeekCard
                    icon={IconClipboardList}
                    title={t("Position & plan", "Poziționare și plan")}
                    body={t(
                      "A concrete plan for the specific channels that fit your business and your buying mode — not a generic bundle.",
                      "Un plan concret, cu exact canalele care au rost pentru afacerea ta și pentru felul în care vinzi — nu un pachet luat de-a gata.",
                    )}
                  >
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {[
                        { i: IconTarget, t: L("Positioning draft", "Schiță de poziționare") },
                        { i: IconMapPin, t: L("Channel plan", "Plan de canale") },
                        {
                          i: IconChartArrowsVertical,
                          t: L("The number we'll report", "Ce indicator raportăm"),
                        },
                      ].map((item) => (
                        <div
                          key={item.t.en}
                          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-neutral-200"
                        >
                          <item.i className="size-4 text-neutral-500" stroke={1.6} />
                          {t(item.t)}
                        </div>
                      ))}
                    </div>
                  </FirstMonthWeekCard>
                ),
              },
              {
                kicker: t("Week 3", "Săptămâna 3"),
                title: t("Launch", "Lansare"),
                content: (
                  <FirstMonthWeekCard
                    icon={IconRocket}
                    title={t("First campaigns live", "Primele campanii live")}
                    body={t(
                      "Ads, content or site work goes live — small and controlled, not a big-bang launch. Budget starts following what works.",
                      "Pornesc reclamele, conținutul sau lucrul la site — la scară mică și sub control, nu o lansare cu surle și trâmbițe. Banii încep să se mute acolo unde apar rezultate.",
                    )}
                  >
                    <div className="theme-dark rounded-2xl border border-white/[0.06] bg-ink-950 p-5">
                      <SplitTestVisual />
                    </div>
                  </FirstMonthWeekCard>
                ),
              },
              {
                kicker: t("Week 4", "Săptămâna 4"),
                title: t("Report", "Raport"),
                content: (
                  <FirstMonthWeekCard
                    icon={IconFileText}
                    title={t("First real report", "Primul raport real")}
                    body={t(
                      "What happened, why, and what we're changing next — in plain language, written by the two of us.",
                      "Ce s-a întâmplat, de ce și ce schimbăm mai departe — pe înțelesul tău, scris de noi doi.",
                    )}
                  >
                    <div className="theme-dark overflow-hidden rounded-2xl border border-white/10 sm:h-[22rem]">
                      <MonthlyReportPanel />
                    </div>
                  </FirstMonthWeekCard>
                ),
              },
            ]}
          />
        </Container>
      </section>
      <CtaBand
        title={
          <>
            {t("Ready to start ", "Începem ")}
            <SerifEm>{t("the research?", "cercetarea?")}</SerifEm>
          </>
        }
        subtitle={t(
          "Thirty minutes on a call. Week one starts when you say so.",
          "Un apel de treizeci de minute. Prima săptămână începe când spui tu.",
        )}
        secondary={{
          href: "how-you-sell.html",
          label: t("First, how do you sell?", "Mai întâi: cum vinzi?"),
        }}
      />
    </SiteLayout>
  );
}
