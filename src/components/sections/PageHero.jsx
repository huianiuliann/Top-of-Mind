import { motion } from "framer-motion";
import { easeOutExpo } from "../effects/motion";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/SectionHeading";
export function PageHero({ eyebrow, title, subtitle, children, background }) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      {background}
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(50%_45%_at_50%_0%,rgba(244,244,246,0.045),transparent_72%)]" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08, ease: easeOutExpo }}
          className="mt-6 max-w-5xl font-display text-[2.8rem] leading-[0.98] font-bold tracking-[-0.03em] text-balance text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: easeOutExpo }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-400 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: easeOutExpo }}
          >
            {children}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
