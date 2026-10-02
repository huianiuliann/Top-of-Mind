import { Reveal } from "../effects/Reveal";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { Container } from "../ui/Container";
import { useLink, useT } from "../../i18n";
import { useCalendly } from "../../data/site";
export function CtaBand({ title, subtitle, secondary }) {
  const t = useT();
  const link = useLink();
  const calendly = useCalendly();
  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <div className="theme-dark relative overflow-hidden rounded-card border border-white/10 bg-ink-950 px-4 py-20 text-center sm:px-6 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,color-mix(in_oklab,var(--color-white)_7%,transparent),transparent_65%)]" />
          <div className="relative">
            <Reveal
              as="h2"
              className="mx-auto max-w-3xl font-display text-4xl leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white md:text-6xl"
            >
              {title}
            </Reveal>
            {subtitle && <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400">{subtitle}</p>}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton href={calendly("band")} external size="lg">
                {t("Book a free 30-min call", "Apel gratuit de 30 de minute")}
              </PrimaryButton>
              {secondary && (
                <SecondaryButton href={link(secondary.href)} size="lg">
                  {secondary.label}
                </SecondaryButton>
              )}
            </div>
            <p className="mt-5 font-mono text-[13px] text-neutral-500">
              {t("No pitch deck. No pressure.", "Fără prezentări de vânzare. Fără presiune.")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
