import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { SerifEm } from "../../components/ui/SectionHeading";
import { CALENDLY_URL } from "../../data/site";
import { useT, useLink } from "../../i18n";
const LampContainer = ({ children, className }) => (
  <div
    className={cn(
      "relative z-0 flex min-h-[46rem] w-full flex-col items-center justify-center overflow-hidden bg-ink-950",
      className,
    )}
  >
    <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
      <motion.div
        initial={{
          opacity: 0.5,
          width: "15rem",
        }}
        whileInView={{
          opacity: 1,
          width: "30rem",
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage:
            "conic-gradient(from 70deg at center top, rgba(129,140,248,0.32) 0%, transparent 50%, transparent 100%)",
        }}
        className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible text-white"
      >
        <div className="absolute bottom-0 left-0 z-20 h-40 w-[100%] bg-ink-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute bottom-0 left-0 z-20 h-[100%] w-40 bg-ink-950 [mask-image:linear-gradient(to_right,white,transparent)]" />
      </motion.div>
      <motion.div
        initial={{
          opacity: 0.5,
          width: "15rem",
        }}
        whileInView={{
          opacity: 1,
          width: "30rem",
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage:
            "conic-gradient(from 290deg at center top, transparent 0%, transparent 50%, rgba(129,140,248,0.32) 100%)",
        }}
        className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
      >
        <div className="absolute right-0 bottom-0 z-20 h-[100%] w-40 bg-ink-950 [mask-image:linear-gradient(to_left,white,transparent)]" />
        <div className="absolute right-0 bottom-0 z-20 h-40 w-[100%] bg-ink-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
      </motion.div>
      <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-ink-950 blur-2xl" />
      <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-accent-500 opacity-[0.14] blur-3xl" />
      <motion.div
        initial={{
          width: "8rem",
        }}
        whileInView={{
          width: "16rem",
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-accent-400 opacity-[0.22] blur-2xl"
      />
      <motion.div
        initial={{
          width: "15rem",
        }}
        whileInView={{
          width: "30rem",
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-auto z-50 h-px w-[30rem] -translate-y-[7rem] bg-accent-300"
      />
      <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-ink-950" />
    </div>
    <div className="relative z-50 flex -translate-y-48 flex-col items-center px-5 md:-translate-y-64">
      {children}
    </div>
  </div>
);
export function HomeFinalCta() {
  const t = useT();
  const link = useLink();
  return (
    <section className="relative -mb-32 md:-mb-48">
      <LampContainer className="min-h-[44rem]">
        <motion.h2
          initial={{
            opacity: 0.4,
            y: 90,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 py-3 text-center font-display text-5xl font-bold tracking-[-0.02em] text-white md:text-7xl"
        >
          {t("Tell us what ", "Spune-\u2060ne ce ")}
          <SerifEm>{t("you sell.", "vinzi.")}</SerifEm>
        </motion.h2>
        <motion.p
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.6,
            duration: 0.8,
          }}
          className="mt-4 max-w-xl text-center text-lg leading-relaxed text-neutral-400"
        >
          {t(
            "We'll tell you honestly if we're the right fit — and which of the three ways your customers buy.",
            "Îți spunem deschis dacă ne potrivim — și în care dintre cele trei feluri cumpără clienții tăi.",
          )}
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.8,
            duration: 0.8,
          }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <PrimaryButton href={CALENDLY_URL} external size="lg">
            {t("Book a free 30-minute call", "Programează un apel gratuit de 30 de minute")}
          </PrimaryButton>
          <SecondaryButton href={link("contact.html")} size="lg">
            {t("Other ways to reach us", "Alte moduri de a ne contacta")}
          </SecondaryButton>
        </motion.div>
        <p className="mt-6 font-mono text-[13px] text-neutral-500">
          {t("No pitch deck. No pressure.", "Fără prezentări de vânzare. Fără presiune.")}
        </p>
      </LampContainer>
    </section>
  );
}
