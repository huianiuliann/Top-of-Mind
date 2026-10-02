import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { FramedCard } from "../../components/ui/FramedCard";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { useT, useLink } from "../../i18n";
import { ADS, LEADS, SOCIAL, TRACKING, WEBSITES } from "../../data/disciplines";
import { ArrowTextLink } from "./shared";
function ServiceBentoCard({ name, desc, icon: Icon, Visual, className, kicker }) {
  const t = useT();
  return (
    <Reveal className={cn("h-full", className)}>
      <FramedCard>
        <div className="flex h-full flex-col">
          <div className="relative flex min-h-[13.5rem] flex-1 items-center overflow-hidden px-6 pt-6 pb-4">
            <Visual />
          </div>
          <div className="border-t border-white/[0.05] p-6">
            {kicker && <p className="mb-1 font-mono text-[12px] text-neutral-500">{kicker}</p>}
            <div className="flex items-center gap-2.5">
              <Icon className="size-5 text-neutral-500" stroke={1.6} />
              <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-white">{t(name)}</h3>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{desc}</p>
          </div>
        </div>
      </FramedCard>
    </Reveal>
  );
}
export function HomeServices() {
  const t = useT();
  const link = useLink();
  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t("What we actually do", "Ce facem, de fapt")}
            title={
              <>
                {t("Four disciplines. ", "Patru servicii. ")}
                <SerifEm>{t("One system.", "Un singur sistem.")}</SerifEm>
              </>
            }
            subtitle={t(
              "The ad, the site, the feed and the follow-up have to agree with each other — so we run them together, and we track all of it.",
              "Reclama, site-ul, feed-ul și follow-up-ul trebuie să spună același lucru — așa că le ținem împreună și le măsurăm pe toate.",
            )}
          />
          <div className="shrink-0 pb-2">
            <ArrowTextLink href={link("services.html")}>
              {t("See all services", "Vezi toate serviciile")}
            </ArrowTextLink>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          <ServiceBentoCard
            {...ADS}
            className="md:col-span-4"
            desc={t(
              "Meta and Google campaigns built around how your customers buy — with budget moved toward what's working every week, not left on autopilot.",
              "Campanii Meta și Google construite după felul în care cumpără clienții tăi — cu bugetul mutat în fiecare săptămână spre ce merge, nu lăsat pe pilot automat.",
            )}
          />
          <ServiceBentoCard
            {...WEBSITES}
            className="md:col-span-2"
            desc={t(
              "Copy before design. Every page built for the decision, with technical SEO from day one.",
              "Întâi textul, apoi designul. Fiecare pagină e construită pentru momentul deciziei, cu SEO tehnic din prima zi.",
            )}
          />
          <ServiceBentoCard
            {...SOCIAL}
            className="md:col-span-2"
            desc={t(
              "A content system of formats that compound — not a fresh idea needed every Monday.",
              "Un sistem de conținut din formate care se adună în timp — nu o idee nouă de găsit în fiecare luni.",
            )}
          />
          <ServiceBentoCard
            {...LEADS}
            className="md:col-span-2"
            desc={t(
              "The ad brings them, the page convinces them, the follow-up gets them on a call with you.",
              "Reclama îi aduce, pagina îi convinge, follow-up-ul îi duce până la un apel cu tine.",
            )}
          />
          <ServiceBentoCard
            {...TRACKING}
            className="md:col-span-2"
            kicker={t("Underneath all four", "Sub toate cele patru")}
            desc={t(
              "If the numbers are right, it's because the analytics were set up to measure them properly first.",
              "Dacă cifrele sunt corecte, e pentru că analitica a fost configurată întâi să le măsoare cum trebuie.",
            )}
          />
        </div>
      </Container>
    </section>
  );
}
