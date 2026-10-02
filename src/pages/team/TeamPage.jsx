import { IconBolt, IconBrain, IconMessageCircle } from "@tabler/icons-react";
import { DesktopOnly } from "../../components/effects/DesktopOnly";
import { Reveal } from "../../components/effects/Reveal";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { CtaBand } from "../../components/sections/CtaBand";
import { PageHero } from "../../components/sections/PageHero";
import { Container } from "../../components/ui/Container";
import { FramedCard } from "../../components/ui/FramedCard";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { avatarStyle, useFounders } from "../../data/site";
import { L, useT } from "../../i18n";
import { FounderCarousel } from "./Founders";
import { TeamHeroFounderOrbit } from "./Hero";
import { TeamWorkSplitDiagram } from "./WorkSplit";
export default function TeamPage() {
  const t = useT();
  const founders = useFounders();
  return (
    <SiteLayout current="team">
      <DesktopOnly minWidth={1680}>
        <div className="pointer-events-none absolute top-28 right-[3%] z-10 hidden min-[1680px]:block">
          <TeamHeroFounderOrbit />
        </div>
      </DesktopOnly>
      <PageHero
        eyebrow={t("Team", "Echipă")}
        title={
          <>
            {t("No account managers. ", "Fără account manageri. ")}
            <SerifEm>{t("Just the two of us.", "Doar noi doi.")}</SerifEm>
          </>
        }
        subtitle={t(
          "Every account gets the same two people, start to finish. Whoever you speak to on the call is whoever does the work.",
          "Pe fiecare cont lucrăm amândoi, de la prima discuție până la ultimul raport. Cei cu care vorbești la apel sunt aceiași care fac treaba.",
        )}
      />
      <section className="relative pb-10">
        <Container>
          <Reveal>
            <FramedCard>
              <FounderCarousel />
            </FramedCard>
          </Reveal>
        </Container>
      </section>
      <section className="theme-light relative py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("How we split the work", "Cum ne împărțim treaba")}
            title={
              <>
                {t("Two specialists. ", "Doi specialiști. ")}
                <SerifEm>{t("One point of contact: you.", "Un singur punct de contact: tu.")}</SerifEm>
              </>
            }
            subtitle={t(
              "Strategy and media on one side, the site and the measurement on the other — both reporting to the same person.",
              "Strategia și reclamele de o parte, site-ul și măsurarea de cealaltă — amândoi raportăm aceluiași om.",
            )}
          />
          <div className="mt-14 hidden md:block">
            <TeamWorkSplitDiagram />
          </div>
          <div className="mt-10 grid gap-4 md:hidden">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="flex items-center gap-4 rounded-2xl border border-white/10 p-4"
              >
                <span className="block size-14 overflow-hidden rounded-full">
                  <img
                    src={founder.duo}
                    alt={founder.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    style={avatarStyle(founder)}
                    className="size-full object-cover"
                  />
                </span>
                <div>
                  <p className="font-display font-bold text-white">{founder.name}</p>
                  <p className="font-mono text-[13px] text-neutral-500">{founder.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="theme-light relative pb-16 md:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                i: IconMessageCircle,
                t: L("The person on the call does the work", "Cu cine vorbești, cu acela lucrezi"),
                d: L(
                  "No hand-off to a team you've never met after the contract is signed.",
                  "După semnare nu te pasăm unei echipe pe care n-ai văzut-o niciodată.",
                ),
              },
              {
                i: IconBolt,
                t: L("Decisions without an approval chain", "Decizii fără lanț de aprobări"),
                d: L(
                  "If something needs to change, the people who can change it are already on the thread.",
                  "Dacă trebuie schimbat ceva, cei care pot schimba sunt deja la telefon cu tine.",
                ),
              },
              {
                i: IconBrain,
                t: L("Nobody learns your business twice", "Nu explici afacerea de două ori"),
                d: L(
                  "The research from week one stays with the two people running your account.",
                  "Tot ce aflăm despre ea în prima săptămână rămâne în capul celor doi care îți lucrează contul.",
                ),
              },
            ].map((reason, index) => (
              <Reveal key={reason.t.en} delay={index * 0.1} className="h-full">
                <FramedCard innerClassName="p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/10 text-neutral-400">
                    <reason.i className="size-5" stroke={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.01em] text-white">
                    {t(reason.t)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{t(reason.d)}</p>
                </FramedCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand
        title={
          <>
            {t("Talk to us ", "Vorbește cu noi ")}
            <SerifEm>{t("directly.", "direct.")}</SerifEm>
          </>
        }
        subtitle={t(
          "Thirty minutes, the two people who'd do the work, and an honest answer on fit.",
          "Treizeci de minute cu cei doi care ți-ar lucra contul și un răspuns clar dacă te putem ajuta.",
        )}
        secondary={{
          href: "contact.html",
          label: t("Other ways to reach us", "Alte moduri de a ne contacta"),
        }}
      />
    </SiteLayout>
  );
}
