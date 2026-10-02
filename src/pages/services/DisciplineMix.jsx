import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { L, useT } from "../../i18n";
import { BUYING_MODES as buyingModes } from "../../data/buyingModes";
const disciplineWeightsByBuyingMode = [
  [L("Paid advertising", "Publicitate plătită"), [2, 3, 2]],
  [L("Websites & SEO", "Site-uri și SEO"), [3, 2, 3]],
  [L("Social media", "Social media"), [1, 3, 2]],
  [L("Lead generation & follow-up", "Generare de lead-uri și follow-up"), [3, 1, 2]],
  [L("Tracking", "Tracking"), [3, 3, 3]],
];
const LEVELS = ["", L("supporting", "secundar"), L("important", "major"), L("critical", "critic")];
const levelColor = (level, weight) =>
  level > weight ? "bg-white/[0.07]" : weight === 3 ? "bg-accent-500" : "bg-white/70";
export function ServicesDisciplineMix() {
  const t = useT();
  return (
    <section className="theme-light relative py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("Same disciplines, different weight", "Aceleași servicii, altă pondere")}
          title={
            <>
              {t("What we lean on depends on ", "Pe ce apăsăm mai tare depinde de ")}
              <SerifEm>{t("how you sell.", "cum vinzi.")}</SerifEm>
            </>
          }
          subtitle={t(
            "A quote business lives or dies on the conversation. A cart business on creative volume. A calendar business on direct bookings. The mix follows.",
            "La o firmă care vinde prin ofertă, totul se decide în discuție. La una care vinde prin coș, în volumul de reclame. La una care vinde prin calendar, în rezervările directe. Mixul decurge de aici.",
          )}
        />
        <Reveal className="mt-12">
          <div className="hidden overflow-x-auto rounded-3xl border border-white/[0.07] bg-ink-900/60 md:block">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="p-5 font-mono text-[12px] font-normal text-neutral-500">
                    {t("Discipline", "Serviciu")}
                  </th>
                  {buyingModes.map((mode) => (
                    <th key={mode.name.en} className="p-5">
                      <span className="flex items-center gap-2 font-display text-lg font-bold text-white">
                        <mode.icon className="size-5 text-neutral-500" stroke={1.6} />
                        {t(mode.name)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplineWeightsByBuyingMode.map(([discipline, weights], rowIndex) => (
                  <tr key={discipline.en} className="border-b border-white/[0.04] last:border-0">
                    <td className="p-5 text-neutral-200">{t(discipline)}</td>
                    {weights.map((weight, modeIndex) => (
                      <td key={modeIndex} className="p-5">
                        <div className="flex items-center gap-1.5" aria-label={t(LEVELS[weight])}>
                          {[1, 2, 3].map((level) => (
                            <motion.span
                              key={level}
                              initial={{ scale: 0.4, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: 0.15 + rowIndex * 0.08 + modeIndex * 0.05 + level * 0.06,
                                type: "spring",
                                stiffness: 300,
                                damping: 18,
                              }}
                              className={cn("h-2.5 w-7 rounded-full", levelColor(level, weight))}
                            />
                          ))}
                          <span className="ml-2 hidden font-mono text-[11px] text-neutral-500 sm:inline">
                            {t(LEVELS[weight])}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {disciplineWeightsByBuyingMode.map(([discipline, weights]) => (
              <div key={discipline.en} className="rounded-2xl border border-white/[0.07] bg-ink-900/60 p-4">
                <p className="font-display font-bold text-white">{t(discipline)}</p>
                <div className="mt-3 space-y-2">
                  {buyingModes.map((mode, modeIndex) => (
                    <div key={mode.name.en} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-neutral-400">
                        <mode.icon className="size-4 text-neutral-500" stroke={1.6} />
                        {t(mode.name)}
                      </span>
                      <span className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <span
                            key={level}
                            className={cn("h-2 w-5 rounded-full", levelColor(level, weights[modeIndex]))}
                          />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
