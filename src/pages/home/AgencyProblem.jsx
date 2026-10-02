import { useRef } from "react";
import { useScroll, motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { cn } from "../../lib/cn";
import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { L, useT } from "../../i18n";
function ScrollRevealWord({ children, progress, range, className }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block", className)}>
      {children}
    </motion.span>
  );
}
function ScrollRevealText({ text, accentFrom, className }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.92", "center 0.62"] });
  const words = text.split(" ");
  const accentIndex = words.findIndex((_word, index) => words.slice(index).join(" ").startsWith(accentFrom));
  return (
    <p ref={containerRef} className={cn("flex flex-wrap gap-x-[0.28em] gap-y-1", className)}>
      {words.map((word, index) => {
        const start = index / words.length;
        return (
          <ScrollRevealWord
            key={index}
            progress={scrollYProgress}
            range={[start, start + 1 / words.length]}
            className={
              accentIndex >= 0 && index >= accentIndex ? "em-serif pr-[0.04em] text-accent-300" : undefined
            }
          >
            {word}
          </ScrollRevealWord>
        );
      })}
    </p>
  );
}
function StrikethroughPillList({ items }) {
  const t = useT();
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <motion.li
          key={item.en}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-[15px] text-neutral-500"
        >
          {t(item)}
          <motion.svg
            className="pointer-events-none absolute inset-x-2 top-1/2 h-3 w-[calc(100%-1rem)] -translate-y-1/2 overflow-visible"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M1 6 C 20 3, 40 8, 60 4 S 90 6, 99 3"
              className="stroke-accent-400"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.45 + index * 0.18, duration: 0.55, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.li>
      ))}
    </ul>
  );
}
const SpotlightHoverBackground = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;
  return (
    <div
      className="group relative flex w-full items-center justify-center py-24 md:py-36"
      onMouseMove={({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--color-white) 9%, transparent) 1.1px, transparent 1.4px)",
          backgroundSize: "16px 16px",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: "radial-gradient(var(--color-accent-400) 1.2px, transparent 1.5px)",
          backgroundSize: "16px 16px",
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      />
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};
const UnderlineReveal = ({ children }) => (
  <motion.span
    initial={{ backgroundSize: "0% 2px" }}
    whileInView={{ backgroundSize: "100% 2px" }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
    style={{ backgroundRepeat: "no-repeat", backgroundPosition: "left 92%", display: "inline" }}
    className="relative bg-gradient-to-r from-accent-400 to-accent-400 pb-1 text-white [box-decoration-break:clone]"
  >
    {children}
  </motion.span>
);
export function HomeAgencyProblem() {
  const t = useT();
  return (
    <section className="theme-light relative">
      <SpotlightHoverBackground>
        <Container>
          <Reveal variant="blur-in">
            <h2 className="font-display text-[2.6rem] leading-[1] font-bold tracking-[-0.02em] text-white md:text-7xl">
              {t("You've paid an agency before.", "Ai mai plătit o agenție.")}
            </h2>
          </Reveal>
          <ScrollRevealText
            text={t(
              "A kickoff call full of promises. A monthly report full of numbers nobody explains. A strategy that reads like it was written for any business — because it was.",
              "Un prim apel plin de promisiuni. Un raport lunar plin de cifre pe care nu ți le explică nimeni. O strategie care pare scrisă pentru orice afacere — pentru că chiar a fost.",
            )}
            accentFrom={t("because it was.", "pentru că chiar a fost.")}
            className="mt-10 max-w-5xl font-display text-[1.9rem] leading-[1.14] font-bold tracking-[-0.02em] text-neutral-100 md:text-5xl"
          />
          <div className="mt-16 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
            <StrikethroughPillList
              items={[
                L("Year-long lock-in", "Contract pe un an, din care nu poți ieși"),
                L("Vanity metrics", "Cifre de fațadă, care arată bine în raport"),
                L("Copy-paste strategy", "Aceeași strategie pentru toți clienții"),
                L("A junior relaying your notes", "Un junior care transmite ce-i spui tu"),
                L("Reports nobody reads", "Rapoarte pe care nu le citește nimeni"),
              ]}
            />
            <Reveal>
              <p className="text-xl leading-relaxed text-neutral-300 lg:text-right">
                {t(
                  "We built Top of Mind to work the opposite way: ",
                  "Am construit Top of Mind ca să facem exact invers: ",
                )}
                <UnderlineReveal>
                  {t("research first, spend second.", "întâi cercetăm, abia apoi cheltuim.")}
                </UnderlineReveal>
              </p>
            </Reveal>
          </div>
        </Container>
      </SpotlightHoverBackground>
    </section>
  );
}
