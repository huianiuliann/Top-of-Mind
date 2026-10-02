import { motion } from "framer-motion";
import { easeOutExpo } from "../effects/motion";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { Container } from "../ui/Container";
import { useLink, useT } from "../../i18n";
import { CALENDLY_URL } from "../../data/site";
export function CtaBand({ title, subtitle, secondary }) {
  const t = useT();
  const link = useLink();
  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 px-6 py-20 text-center md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,rgba(244,244,246,0.05),transparent_65%)]" />
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: easeOutExpo }}
              className="mx-auto max-w-3xl font-display text-4xl leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white md:text-6xl"
            >
              {title}
            </motion.h2>
            {subtitle && <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400">{subtitle}</p>}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton href={CALENDLY_URL} external size="lg">
                {t("Book a free 30-minute call", "Programează un apel gratuit de 30 de minute")}
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
