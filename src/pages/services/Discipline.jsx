import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { FramedCard } from "../../components/ui/FramedCard";
import { useT } from "../../i18n";
export function ServicesDiscipline({ id, icon: Icon, name, lede, features, visual, flip, kicker, light }) {
  const t = useT();
  return (
    <section id={id} className={cn("relative scroll-mt-28 py-16 md:py-24", light && "theme-light")}>
      <Container>
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
            flip && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div>
            <Reveal variant="blur-in">
              <p className="font-mono text-[13px] text-neutral-400">{kicker}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-white/10 text-neutral-400">
                  <Icon className="size-5" stroke={1.6} />
                </span>
                <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl">
                  {name}
                </h2>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-neutral-400">{lede}</p>
            </Reveal>
            <ul className="mt-8 space-y-3">
              {features.map((feature, index) => (
                <Reveal
                  key={feature.title.en}
                  as="li"
                  delay={0.08 * index}
                  variant="fade-up"
                  className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-white/15"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-neutral-400">
                    <feature.icon className="size-[18px]" stroke={1.6} />
                  </span>
                  <div>
                    <p className="font-display font-bold tracking-[-0.01em] text-white">{t(feature.title)}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-neutral-400">{t(feature.body)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal variant="zoom-in">
            <FramedCard
              className="theme-dark bg-ink-950"
              innerClassName="p-8 sm:p-10 min-h-[22rem] flex items-center justify-center"
            >
              <div className="w-full max-w-md">{visual}</div>
            </FramedCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
