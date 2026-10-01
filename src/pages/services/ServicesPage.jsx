import {
  IconActivityHeartbeat,
  IconArrowsSplit,
  IconBrowser,
  IconChecklist,
  IconClockBolt,
  IconDatabase,
  IconEye,
  IconHash,
  IconMessageCircle,
  IconPencil,
  IconPhotoCheck,
  IconRepeat,
  IconSearch,
  IconShieldCheck,
  IconSpeakerphone,
  IconTargetArrow,
  IconTrendingUp,
} from "@tabler/icons-react";
import { ContentRotationVisual } from "../../components/effects/ContentRotationVisual";
import { EventStreamVisual } from "../../components/effects/EventStreamVisual";
import { LeadFlowVisual } from "../../components/effects/LeadFlowVisual";
import { SplitTestVisual } from "../../components/effects/SplitTestVisual";
import { WebsiteBuildVisual } from "../../components/effects/WebsiteBuildVisual";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { CtaBand } from "../../components/sections/CtaBand";
import { PageHero } from "../../components/sections/PageHero";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { SerifEm } from "../../components/ui/SectionHeading";
import { CALENDLY_URL } from "../../data/site";
import { ServicesAlignedChannels } from "./AlignedChannels";
import { ServicesDiscipline } from "./Discipline";
import { ServicesDisciplineMix } from "./DisciplineMix";
import { ServicesHeroOrbit } from "./Hero";
import { L, useT } from "../../i18n";
export default function ServicesPage() {
  const t = useT();
  return (
    <SiteLayout current="services">
      <div className="relative">
        <div className="pointer-events-none absolute top-44 right-[5%] z-10 hidden min-[1400px]:block">
          <ServicesHeroOrbit />
        </div>
        <PageHero
          eyebrow={t("Services", "Servicii")}
          title={
            <>
              {t("Four disciplines. Run as ", "Patru servicii. Tratate ca ")}
              <SerifEm>{t("one system.", "un singur sistem.")}</SerifEm>
            </>
          }
          subtitle={t(
            "We don't sell these separately, because your customers don't experience your business separately. The ad, the site, the feed and the follow-up all have to agree with each other.",
            "Nu le vindem separat, pentru că nici clienții tăi nu-ți văd afacerea pe bucăți. Reclama, site-ul, feed-ul și follow-up-ul trebuie să se potrivească toate între ele.",
          )}
        >
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href={CALENDLY_URL} external size="lg">
              {t("Book a free 30-min call", "Programează un apel gratuit de 30 de minute")}
            </PrimaryButton>
            <SecondaryButton href="#paid-advertising" size="lg">
              {t("See the disciplines", "Vezi serviciile")}
            </SecondaryButton>
          </div>
          <div className="mt-12 flex flex-wrap gap-2">
            {[
              {
                i: IconSpeakerphone,
                t: L("Paid advertising", "Publicitate plătită"),
                h: "#paid-advertising",
              },
              {
                i: IconBrowser,
                t: L("Websites & SEO", "Site-uri și SEO"),
                h: "#websites",
              },
              {
                i: IconHash,
                t: L("Social media", "Social media"),
                h: "#social",
              },
              {
                i: IconMessageCircle,
                t: L("Lead generation", "Generare de lead-uri"),
                h: "#lead-generation",
              },
              {
                i: IconActivityHeartbeat,
                t: L("Tracking", "Tracking"),
                h: "#tracking",
              },
            ].map((link) => (
              <a
                key={link.t.en}
                href={link.h}
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[13px] text-neutral-300 transition-colors hover:border-white/25 hover:text-white"
              >
                <link.i className="size-4 text-neutral-500" stroke={1.6} />
                {t(link.t)}
              </a>
            ))}
          </div>
        </PageHero>
      </div>
      <ServicesAlignedChannels />
      <ServicesDiscipline
        id="paid-advertising"
        kicker={t("Discipline 1", "Serviciul 1")}
        icon={IconSpeakerphone}
        name={t("Paid advertising", "Publicitate plătită")}
        lede={t(
          "Meta and Google campaigns built around how your customers actually buy — not a standard media brief copy-pasted across every account. We start from the research: what stops someone mid-scroll in your category, and what makes them click through instead of past.",
          "Campanii Meta și Google construite după felul în care cumpără de fapt clienții tăi — nu după un brief standard, copiat la fel în fiecare cont. Pornim de la cercetare: ce îl oprește din scroll pe un om din categoria ta și ce îl face să dea click, în loc să treacă mai departe.",
        )}
        features={[
          {
            icon: IconArrowsSplit,
            title: L("Structure built for how you sell", "Structura campaniilor ține de cum vinzi"),
            body: L(
              "A quote business runs differently from a cart business. We don't force one playbook onto both.",
              "O firmă care vinde prin ofertă are nevoie de alte campanii decât una care vinde prin coș. Nu le tratăm la fel.",
            ),
          },
          {
            icon: IconPencil,
            title: L("Creative that matches the platform", "Reclame gândite pentru platforma pe care rulează"),
            body: L(
              "What works on Meta rarely works unedited on Google. We build for where the ad actually lives.",
              "Ce merge pe Meta rareori merge la fel pe Google. Nu lipim aceeași reclamă peste tot.",
            ),
          },
          {
            icon: IconTrendingUp,
            title: L("Budget moved toward what's working, weekly", "Mutăm bugetul în fiecare săptămână spre ce merge"),
            body: L(
              "Not left on autopilot for a month and explained away in a report.",
              "Nu-l lăsăm să curgă o lună ca să explicăm după, în raport, unde s-a dus.",
            ),
          },
        ]}
        visual={<SplitTestVisual />}
      />
      <ServicesDiscipline
        id="websites"
        kicker={t("Discipline 2", "Serviciul 2")}
        light
        flip
        icon={IconBrowser}
        name={t("Websites & SEO", "Site-uri și SEO")}
        lede={t(
          "A site that speaks your customer's language and is built to convert — not just to look finished in a portfolio. We write for the person deciding whether to trust you, and build the technical SEO underneath so the site can actually be found.",
          "Un site care vorbește limba clientului tău și e construit să vândă — nu doar să arate bine într-un portofoliu. Scriem pentru omul care decide dacă are încredere în tine și rezolvăm pe dedesubt partea tehnică de SEO, ca site-ul să fie și găsit.",
        )}
        features={[
          {
            icon: IconPencil,
            title: L("Copy before design", "Întâi textul, apoi designul"),
            body: L(
              "We write what the page needs to say before we decide how it should look.",
              "Stabilim ce trebuie să spună fiecare pagină înainte să ne gândim cum arată.",
            ),
          },
          {
            icon: IconTargetArrow,
            title: L("Built for the decision, not the scroll", "Gândit pentru decizie, nu pentru scroll"),
            body: L(
              "Every page has one job: move the right visitor to the next step \u2014 a quote request, a checkout, a booking.",
              "Fiecare pagină are o singură treabă: să-l ducă pe vizitatorul potrivit la pasul următor — o cerere de ofertă, o comandă, o rezervare.",
            ),
          },
          {
            icon: IconSearch,
            title: L("Technical SEO from day one", "SEO tehnic din prima zi"),
            body: L(
              "Structure, speed and indexing handled before launch, not patched after.",
              "Structura, viteza și indexarea, rezolvate înainte de lansare, nu cârpite după.",
            ),
          },
        ]}
        visual={
          <div className="pb-6">
            <WebsiteBuildVisual />
          </div>
        }
      />
      <ServicesDiscipline
        id="social"
        kicker={t("Discipline 3", "Serviciul 3")}
        icon={IconHash}
        name={t("Social media", "Social media")}
        lede={t(
          "Content that shows you know your craft — because people check your feed before they ever call or buy. We build a system around a small number of formats that work for your category, rather than chasing every trend.",
          "Conținut care arată că te pricepi la ce faci — pentru că lumea se uită pe profilul tău înainte să sune sau să comande. Construim un sistem în jurul câtorva formate care merg în domeniul tău, în loc să alergăm după fiecare trend.",
        )}
        features={[
          {
            icon: IconRepeat,
            title: L("A content system, not a content calendar", "Un sistem de conținut, nu un calendar de conținut"),
            body: L(
              "Repeatable formats that compound, instead of a fresh idea needed every week.",
              "Formate care se repetă și se strâng în timp, nu o idee nouă de la zero în fiecare săptămână.",
            ),
          },
          {
            icon: IconPhotoCheck,
            title: L("Proof over polish", "Dovezi, nu decor"),
            body: L(
              "Real work, real process, real people. Buyers trust what doesn't look staged.",
              "Muncă reală, proces real, oameni reali. Clienții au încredere în ce nu pare regizat.",
            ),
          },
        ]}
        visual={<ContentRotationVisual />}
      />
      <ServicesDiscipline
        id="lead-generation"
        kicker={t("Discipline 4", "Serviciul 4")}
        light
        flip
        icon={IconMessageCircle}
        name={t("Lead generation", "Generare de lead-uri")}
        lede={t(
          "Your offer, in front of the people who are actually ready to decide — not whoever happens to scroll past. This is where the other disciplines meet: the ad brings them, the page convinces them, and the follow-up closes the loop.",
          "Oferta ta, în fața oamenilor care chiar sunt gata să decidă — nu a oricui trece prin feed. Aici se leagă restul: reclama îi aduce, pagina îi convinge, iar follow-up-ul îi face clienți.",
        )}
        features={[
          {
            icon: IconChecklist,
            title: L("An offer shaped by your buying mode", "O ofertă croită după cum cumpără clienții tăi"),
            body: L(
              "A quote form, a checkout or a booking calendar \u2014 each needs a different next step.",
              "Un formular de ofertă, o pagină de comandă sau un calendar de rezervări — fiecare are nevoie de alt pas următor.",
            ),
          },
          {
            icon: IconClockBolt,
            title: L("Follow-up that doesn't let leads cool off", "Follow-up care nu lasă lead-urile să se răcească"),
            body: L(
              "The person who was ready to talk shouldn't wait days for a reply.",
              "Omul care era gata să vorbească n-ar trebui să aștepte zile întregi un răspuns.",
            ),
          },
          {
            icon: IconTargetArrow,
            title: L("One number we agree on", "Un singur indicator, stabilit împreună"),
            body: L(
              "Qualified requests, profitable orders or direct bookings \u2014 decided before we start.",
              "Cereri calificate, comenzi profitabile sau rezervări directe — hotărâm înainte să începem.",
            ),
          },
        ]}
        visual={<LeadFlowVisual />}
      />
      <ServicesDiscipline
        id="tracking"
        kicker={t("Underneath all four", "Sub toate cele patru")}
        icon={IconActivityHeartbeat}
        name={t("Tracking you can trust", "Tracking pe care te poți baza")}
        lede={t(
          "If a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place. We fix the measurement before we spend, so every decision after that stands on real data.",
          "Dacă cifrele unei campanii sunt corecte, e pentru că analitica a fost configurată de la început să le măsoare cum trebuie. Reparăm măsurarea înainte să cheltuim, așa că orice decizie de după pornește de la cifre reale.",
        )}
        features={[
          {
            icon: IconDatabase,
            title: L("Events that match your business", "Măsurăm ce contează pentru afacerea ta"),
            body: L(
              "Quote requests, purchases, bookings, calls \u2014 tracked as what they are.",
              "Cereri de ofertă, comenzi, rezervări, apeluri — fiecare numărat separat.",
            ),
          },
          {
            icon: IconShieldCheck,
            title: L("Cleaned up before we spend", "Curățenie înainte să cheltuim"),
            body: L(
              "Broken pixels and double-counted conversions get fixed on week one.",
              "Pixelii stricați și conversiile numărate de două ori le reparăm în prima săptămână.",
            ),
          },
          {
            icon: IconEye,
            title: L("Numbers you can check yourself", "Cifre pe care le poți verifica și tu"),
            body: L("No black box. You see what we see.", "Nimic ascuns. Vezi ce vedem și noi."),
          },
        ]}
        visual={<EventStreamVisual />}
      />
      <ServicesDisciplineMix />
      <CtaBand
        title={
          <>
            {t("Not sure which of these ", "Nu știi de care dintre ele ")}
            <SerifEm>{t("you need?", "ai nevoie?")}</SerifEm>
          </>
        }
        subtitle={t(
          "That's what the call is for. We'll tell you where your money is leaking first — and which discipline fixes it.",
          "De-asta există apelul. Îți spunem mai întâi unde se duc banii degeaba — și ce serviciu rezolvă asta.",
        )}
        secondary={{
          href: "how-you-sell.html",
          label: t("Find your buying mode", "Află cum cumpără clienții tăi"),
        }}
      />
    </SiteLayout>
  );
}
