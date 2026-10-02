import {
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconCalendarEvent,
  IconClockHour4,
  IconMail,
} from "@tabler/icons-react";
import { Reveal } from "../../components/effects/Reveal";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { PageHero } from "../../components/sections/PageHero";
import { PrimaryButton } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { FramedCard } from "../../components/ui/FramedCard";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { CALENDLY_URL, CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_URL } from "../../data/site";
import { L, useT } from "../../i18n";
import { ArcGlobe } from "./ArcGlobe";
import { ContactFaq } from "./Faq";
import { ContactHeroChat } from "./Hero";
export default function ContactPage() {
  const t = useT();
  return (
    <SiteLayout current="contact">
      <div className="pointer-events-none absolute top-36 right-[6%] z-10 hidden min-[1400px]:block">
        <ContactHeroChat />
      </div>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            {t("Tell us ", "Spune-\u2060ne ")}
            <SerifEm>{t("what you sell.", "ce vinzi.")}</SerifEm>
          </>
        }
        subtitle={t(
          "Book a free 30-minute call, or reach us directly. No pitch deck, no pressure — and an honest answer on fit.",
          "Programează un apel gratuit de 30 de minute sau scrie-ne direct. Fără prezentări de vânzare, fără presiune — și un răspuns sincer dacă ne potrivim.",
        )}
      />
      <section className="relative pb-16 md:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
            <Reveal className="h-full">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.8rem] border border-accent-400/35 bg-ink-900 p-7 transition-colors hover:border-accent-400/60 md:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-accent-400/45 text-accent-300">
                    <IconCalendarEvent className="size-6" stroke={1.6} />
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1 font-mono text-[12px] text-neutral-300">
                    <IconClockHour4 className="size-3.5" stroke={1.6} />
                    {t("30 minutes · free", "30 de minute · gratuit")}
                  </span>
                </div>
                <div className="mt-14">
                  <p className="font-mono text-[13px] text-neutral-400">
                    {t("Fastest way in", "Cea mai rapidă cale")}
                  </p>
                  <p className="mt-2 font-display text-4xl leading-[1.04] font-bold tracking-[-0.02em] text-white md:text-5xl">
                    {t("Book a call ", "Programează un apel ")}
                    <SerifEm>{t("on Calendly", "pe Calendly")}</SerifEm>
                  </p>
                  <p className="mt-4 max-w-md text-neutral-400">
                    {t(
                      "Pick a slot that suits you. You'll talk to the two people who'd actually do the work.",
                      "Alege ora care îți convine. Vorbești cu cei doi oameni care chiar ar face treaba.",
                    )}
                  </p>
                </div>
                <span className="relative mt-8 inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-xl bg-accent-500 px-6 py-3.5 font-sans font-semibold text-[14px] text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors group-hover:bg-[#6660f6]">
                  {t("Open Calendly ", "Deschide Calendly ")}
                  <IconArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    stroke={1.8}
                  />
                </span>
              </a>
            </Reveal>
            <div className="grid gap-4">
              {[
                { href: WHATSAPP_URL, icon: IconBrandWhatsapp, k: "WhatsApp", v: PHONE_DISPLAY, ext: true },
                { href: `mailto:${CONTACT_EMAIL}`, icon: IconMail, k: "Email", v: CONTACT_EMAIL, ext: false },
              ].map((channel, index) => (
                <Reveal key={channel.k} delay={0.08 * (index + 1)} className="h-full">
                  <a
                    href={channel.href}
                    target={channel.ext ? "_blank" : undefined}
                    rel={channel.ext ? "noopener" : undefined}
                    className="group block h-full"
                  >
                    <FramedCard innerClassName="p-7 justify-between transition-colors group-hover:bg-ink-800">
                      <div className="flex items-center justify-between">
                        <span className="grid size-11 place-items-center rounded-xl border border-white/10 text-neutral-400">
                          <channel.icon className="size-5" stroke={1.6} />
                        </span>
                        <IconArrowUpRight
                          className="size-5 text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                          stroke={1.6}
                        />
                      </div>
                      <div className="mt-8">
                        <p className="font-mono text-[13px] text-neutral-500">{channel.k}</p>
                        <p className="mt-1 font-display text-2xl font-bold tracking-[-0.01em] break-all text-white">
                          {channel.v}
                        </p>
                      </div>
                    </FramedCard>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="theme-light relative py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("What happens on the call", "Ce se întâmplă la apel")}
            title={
              <>
                {t("Thirty minutes, ", "Treizeci de minute, ")}
                <SerifEm>{t("three questions.", "trei întrebări.")}</SerifEm>
              </>
            }
          />
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                m: L("Minutes 0–10", "Minutele 0–10"),
                t: L("How do your customers buy?", "Cum cumpără clienții tăi?"),
                d: L(
                  "By quote, by cart or by calendar. It decides everything after.",
                  "Prin ofertă, prin coș sau prin calendar. De aici pornește tot restul.",
                ),
              },
              {
                m: L("Minutes 10–20", "Minutele 10–20"),
                t: L("Where is the money leaking today?", "Unde se pierd banii azi?"),
                d: L(
                  "What's working, what's burning budget, what's not being measured.",
                  "Ce merge, ce arde bani degeaba, ce nu măsoară nimeni.",
                ),
              },
              {
                m: L("Minutes 20–30", "Minutele 20–30"),
                t: L("Are we the right fit?", "Suntem potriviți pentru tine?"),
                d: L(
                  "An honest answer — including when the answer is no.",
                  "Un răspuns cinstit — chiar și când răspunsul e nu.",
                ),
              },
            ].map((step, index) => (
              <Reveal key={step.m.en} delay={index * 0.1} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-white/[0.07] bg-ink-900 p-7">
                  <p className="font-mono text-[13px] text-neutral-400">{t(step.m)}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.01em] text-white">
                    {t(step.t)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{t(step.d)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section className="theme-light relative pb-16 md:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow={t("Before you book", "Înainte să programezi")}
              title={
                <>
                  {t("The questions ", "Întrebări ")}
                  <SerifEm>{t("people ask first.", "pe care le primim des.")}</SerifEm>
                </>
              }
              subtitle={t(
                "If yours isn't here, ask it on the call — or send it on WhatsApp.",
                "Dacă a ta nu e aici, pune-o la apel — sau trimite-o pe WhatsApp.",
              )}
            />
            <Reveal>
              <ContactFaq />
            </Reveal>
          </div>
        </Container>
      </section>
      <section className="relative overflow-hidden py-16 md:py-24">
        <Container>
          <div className="text-center">
            <SectionHeading
              align="center"
              eyebrow={t("Where we are", "Unde suntem")}
              title={
                <>
                  {t("Based in Cluj-Napoca. ", "Suntem în Cluj-Napoca. ")}
                  <SerifEm>
                    {t("Working in English, remotely.", "Lucrăm în română și în engleză, de la distanță.")}
                  </SerifEm>
                </>
              }
              subtitle={t(
                "Calls, reports and campaigns work the same way wherever your customers are.",
                "Apelurile, rapoartele și campaniile funcționează la fel, oriunde ar fi clienții tăi.",
              )}
            />
          </div>
          <Reveal className="-mt-2 -mb-16 md:-mt-6 md:-mb-24">
            <ArcGlobe
              className="max-w-[640px]"
              origin={{ lat: 46.77, lng: 23.6, label: "Cluj-Napoca" }}
              centerLng={6}
              targets={[
                { lat: 51.5, lng: -0.12 },
                { lat: 40.71, lng: -74 },
                { lat: 59.33, lng: 18.07 },
                { lat: 25.2, lng: 55.27 },
                { lat: 40.42, lng: -3.7 },
                { lat: 37.98, lng: 23.73 },
                { lat: 43.65, lng: -79.38 },
                { lat: -33.92, lng: 18.42 },
                { lat: 19.08, lng: 72.88 },
              ]}
              ariaLabel={t(
                "Illustration: a globe with lines reaching out from Cluj-Napoca, where we're based",
                "Ilustrație: un glob cu linii care pornesc din Cluj-Napoca, unde ne aflăm",
              )}
            />
          </Reveal>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href={CALENDLY_URL} external size="lg">
              {t("Book a free 30-minute call", "Programează un apel gratuit de 30 de minute")}
            </PrimaryButton>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
