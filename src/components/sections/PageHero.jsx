import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/SectionHeading";
// Same rule as the home hero: eyebrow, headline, copy and CTAs render visible from the first frame (prerendered HTML, LCP); only `background` decor animates.
export function PageHero({ eyebrow, title, subtitle, children, background }) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      {background}
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(50%_45%_at_50%_0%,color-mix(in_oklab,var(--color-cream)_68%,transparent),transparent_72%)]" />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-5xl font-display text-[2.85rem] leading-[0.98] font-bold tracking-[-0.03em] text-balance text-white sm:text-6xl md:text-7xl lg:text-[5.2rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-400 md:text-xl">{subtitle}</p>
        )}
        {children}
      </Container>
    </section>
  );
}
