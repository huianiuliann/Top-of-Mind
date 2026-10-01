import { useRef, useState, useEffect } from "react";
import { useScroll, motion, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { L } from "../../i18n";
import { BuyerResearchPanel } from "../../components/effects/BuyerResearchPanel";
import { CompetitorTeardownPanel } from "../../components/effects/CompetitorTeardownPanel";
import { PositioningPanel } from "../../components/effects/PositioningPanel";
export const MethodTracingBeam = ({ children, className }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);
  useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () => contentRef.current && setSvgHeight(contentRef.current.offsetHeight);
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });
  return (
    <motion.div ref={containerRef} className={cn("relative mx-auto h-full w-full max-w-5xl", className)}>
      <div className="absolute top-3 -left-4 hidden md:-left-16 md:block">
        <div className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-accent-400/50">
          <div className="h-2 w-2 rounded-full bg-accent-400" />
        </div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#tb-gradient)"
            strokeWidth="1.5"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="tb-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#c7cdfe" stopOpacity="0" />
              <stop stopColor="#c7cdfe" />
              <stop offset="0.325" stopColor="#818cf8" />
              <stop offset="1" stopColor="#5b54f5" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
export const methodSteps = [
  {
    n: "01",
    title: L("Research the market", "Cercetăm piața"),
    body: L(
      "We learn your industry from the outside in \u2014 what your customers actually care about, where they spend attention, and what makes them trust a brand enough to pay \u2014 before a single ad gets written.",
      "Îți învățăm domeniul așa cum îl vede clientul \u2014 ce contează cu adevărat pentru el, pe unde se informează și ce îl convinge să aibă încredere într-o firmă cât să plătească \u2014 înainte să scriem prima reclamă.",
    ),
    modes: L(
      "For a quote business that might mean spec sheets and lead times. For a cart business, what gets saved versus scrolled past. For a calendar business, when people actually book.",
      "La o firmă care vinde prin ofertă, asta poate însemna fișe tehnice și termene de livrare. La una care vinde prin coș, ce salvează oamenii și peste ce trec când dau scroll. La una care vinde prin calendar, când se fac, de fapt, rezervările.",
    ),
    gets: [
      L("A map of the questions buyers ask first", "Întrebările pe care și le pun clienții tăi înainte să cumpere"),
      L("An honest audit of what you already run", "O evaluare a campaniilor și a site-ului pe care le ai deja"),
      L("A tracking check before a euro is spent", "Verificarea tracking-ului, înainte să pornim orice buget"),
    ],
    visual: <BuyerResearchPanel />,
  },
  {
    n: "02",
    title: L("Map the competition", "Analizăm concurența"),
    body: L(
      "We find whoever's already winning attention in your space and take their approach apart: what's working, what's clearly copied from somewhere else, and what they're leaving on the table that you can take instead.",
      "Vedem cine atrage deja atenția în domeniul tău și luăm la bani mărunți tot ce fac: ce le merge, ce e clar copiat din altă parte și ce spațiu lasă liber, ca să-l ocupi tu.",
    ),
    modes: L(
      "Their ads, their sites, their offers and their reviews \u2014 read the way your buyer reads them.",
      "Reclamele, site-urile, ofertele și recenziile lor \u2014 citite cu ochii clientului tău.",
    ),
    gets: [
      L("A competitor map of your market", "Cine sunt concurenții tăi și cum vând ei"),
      L("Their ads taken apart, one by one", "Reclamele lor, analizate una câte una"),
      L("The open space nobody is claiming", "Ce nu spune nimeni din piața ta și ai putea spune tu"),
    ],
    visual: <CompetitorTeardownPanel />,
  },
  {
    n: "03",
    title: L("Build you a sharper position", "Îți construim o poziționare mai clară"),
    body: L(
      "We take what's proven, sharpen it, and add what's missing \u2014 the ads, the site, the content \u2014 so that when your customer is ready to decide, your name is the one they remember.",
      "Păstrăm ce funcționează deja la tine, îl spunem mai clar și adăugăm ce lipsește \u2014 reclamele, site-ul, conținutul \u2014 ca atunci când clientul e gata să decidă, numele tău să fie primul care îi vine în minte.",
    ),
    modes: L(
      "Then we launch small and controlled, measure the one number we agreed on, and move budget toward what works.",
      "Apoi pornim cu buget mic și ținut sub control, urmărim indicatorul stabilit împreună și mutăm banii spre ce merge.",
    ),
    gets: [
      L("A positioning draft, validated with you", "O schiță de poziționare, pe care o discutăm și o ajustăm cu tine"),
      L("A channel plan built for how you sell", "Un plan de canale gândit pentru felul în care vinzi"),
      L("The one number we'll report every month", "Un singur indicator, pe care îl raportăm în fiecare lună"),
    ],
    visual: <PositioningPanel />,
  },
];
