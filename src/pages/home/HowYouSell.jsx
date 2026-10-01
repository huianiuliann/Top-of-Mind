import { IconCalendarEvent, IconFileInvoice, IconShoppingCart } from "@tabler/icons-react";
import { BookingCalendarVisual } from "../../components/effects/BookingCalendarVisual";
import { CreativeFatigueVisual } from "../../components/effects/CreativeFatigueVisual";
import { FunnelLeakVisual } from "../../components/effects/FunnelLeakVisual";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { FramedCard } from "../../components/ui/FramedCard";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { L, useT, useLink } from "../../i18n";
import { ArrowTextLink } from "./shared";
const homeBuyingModes = [
  {
    id: "quote",
    name: L("The quote", "Oferta"),
    lead: L("Nobody buys until they talk to you.", "Nimeni nu cumpără până nu vorbește cu tine."),
    body: L(
      "Custom price, weeks of deciding, usually more than one person in the room.",
      "Prețul se stabilește de la caz la caz, decizia durează săptămâni, iar la discuție stau de obicei mai mulți oameni.",
    ),
    niches: [
      L("Manufacturers", "Producători"),
      L("Fabricators", "Confecții metalice"),
      L("Clinics", "Clinici"),
      L("Professional services", "Servicii profesionale"),
    ],
    bottleneck: L(
      "It's almost never traffic. It's the gap between interested and in a conversation.",
      "Aproape niciodată nu e traficul. E golul dintre \u201emă interesează\u201d și o discuție adevărată.",
    ),
    report: L("Qualified quote requests", "Cereri de ofertă calificate"),
    fee: "per qualified lead",
  },
  {
    id: "cart",
    name: L("The cart", "Coșul"),
    lead: L("They buy without ever speaking to you.", "Clienții cumpără fără să vorbească vreodată cu tine."),
    body: L(
      "Seconds, on a phone, off a fifteen-second video.",
      "În câteva secunde, de pe telefon, după un clip de cincisprezece secunde.",
    ),
    niches: [
      L("Sleep & home", "Somn și casă"),
      L("Baby & kids", "Bebeluși și copii"),
      L("Pet", "Animale de companie"),
      L("Supplements", "Suplimente"),
    ],
    bottleneck: L(
      "It's almost never targeting. It's how many new creatives you get into the market before the ones you have burn out.",
      "Aproape niciodată nu e targetarea. E câte reclame noi apuci să scoți înainte să se uzeze cele de acum.",
    ),
    report: L("Profitable orders", "Comenzi profitabile"),
    fee: "tied to ad performance",
  },
  {
    id: "calendar",
    name: L("The calendar", "Calendarul"),
    lead: L(
      "You sell time, and tonight's empty slot is gone for good.",
      "Vinzi timp, iar locul liber din seara asta nu-l mai poți vinde niciodată.",
    ),
    body: L(
      "Packed weekends, dead Tuesdays \u2014 while a platform takes its cut and keeps the customer.",
      "Weekenduri pline, marți goale \u2014 în timp ce o platformă își ia comisionul și rămâne cu clientul.",
    ),
    niches: [L("Stays", "Cazări"), L("Clinics", "Clinici"), L("Schools", "Școli"), L("Studios", "Studiouri")],
    bottleneck: L(
      "Demand that doesn't match your calendar, and platforms that own the customer.",
      "Cererea nu se potrivește cu calendarul tău, iar clientul rămâne al platformei.",
    ),
    report: L("Direct bookings, dead days filled", "Rezervări directe și zile goale umplute"),
    fee: "tied to direct bookings",
  },
];
const buyingModeIcons = {
  quote: IconFileInvoice,
  cart: IconShoppingCart,
  calendar: IconCalendarEvent,
};
const buyingModeVisuals = {
  quote: FunnelLeakVisual,
  cart: CreativeFatigueVisual,
  calendar: BookingCalendarVisual,
};
export function HomeHowYouSell() {
  const t = useT();
  const link = useLink();
  return (
    <section id="how-you-sell" className="relative py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("How you sell", "Cum vinzi")}
          title={
            <>
              {t("There's no template industry. ", "Nu există șablon pe industrie. ")}
              <SerifEm>{t("There are three ways people buy.", "Există trei feluri de a cumpăra.")}</SerifEm>
            </>
          }
          subtitle={t(
            "Before we write a single ad, we work out which one you're in. It changes the research, the offer, the creative — and what we agree to call a win.",
            "Înainte să scriem prima reclamă, stabilim în care dintre ele te afli. De asta depinde tot restul: cercetarea, oferta, reclamele — și ce socotim, împreună cu tine, un rezultat bun.",
          )}
        />
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {homeBuyingModes.map((way, index) => {
            const WayIcon = buyingModeIcons[way.id];
            const WayVisual = buyingModeVisuals[way.id];
            return (
              <Reveal key={way.id} delay={index * 0.12} className="h-full">
                <FramedCard>
                  <div className="relative flex h-[16.5rem] items-center border-b border-white/[0.05] px-6 pt-4">
                    <WayVisual />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-lg border border-white/10 text-neutral-400">
                        <WayIcon className="size-4" stroke={1.6} />
                      </span>
                      <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-white">
                        {t(way.name)}
                      </h3>
                    </div>
                    <p className="em-serif mt-4 text-[1.5rem] leading-snug text-neutral-100">{t(way.lead)}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{t(way.body)}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {way.niches.map((niche) => (
                        <span
                          key={niche.en}
                          className="rounded-full border border-white/[0.08] px-2.5 py-1 text-xs text-neutral-300"
                        >
                          {t(niche)}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-[15px] leading-relaxed text-neutral-300">
                      <span className="text-neutral-500">{t("The bottleneck: ", "Blocajul: ")}</span>
                      {t(way.bottleneck)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
                      <span className="font-mono text-[12px] text-neutral-500">{t("We report", "Raportăm")}</span>
                      <span className="text-right font-mono text-[12.5px] text-accent-300">{t(way.report)}</span>
                    </div>
                  </div>
                </FramedCard>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-lg text-neutral-400">
            {t("Not sure which one you're in? ", "Nu știi sigur în care te afli? ")}
            <span className="text-neutral-200">
              {t("That's the first ten minutes of the call.", "Asta lămurim în primele zece minute ale apelului.")}
            </span>
          </p>
          <ArrowTextLink href={link("how-you-sell.html")}>{t("Which one are you?", "Care dintre ele ești?")}</ArrowTextLink>
        </div>
      </Container>
    </section>
  );
}
