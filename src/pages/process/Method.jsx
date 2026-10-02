import { useRef } from "react";
import { useScroll, motion, useSpring, useTransform } from "framer-motion";
import { L } from "../../i18n";
import { BuyerResearchPanel } from "../../components/effects/BuyerResearchPanel";
import { CompetitorTeardownPanel } from "../../components/effects/CompetitorTeardownPanel";
import { PositioningPanel } from "../../components/effects/PositioningPanel";
import { useElementHeight } from "./FirstMonth";
export const MethodTracingBeam = ({ children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const contentRef = useRef(null);
  const svgHeight = useElementHeight(contentRef);
  const beamPath = `M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`;
  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });
  return (
    <div ref={containerRef} className="relative mx-auto h-full w-full max-w-5xl px-2 md:px-6">
      <div className="absolute top-3 -left-4 hidden md:-left-16 md:block">
        <div className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-accent-400">
          <div className="h-2 w-2 rounded-full bg-accent-400" />
        </div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <path d={beamPath} fill="none" stroke="var(--color-neutral-500)" strokeOpacity="0.16" />
          <path
            d={beamPath}
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
              <stop stopColor="var(--color-accent-200)" stopOpacity="0" />
              <stop stopColor="var(--color-accent-200)" />
              <stop offset="0.325" stopColor="var(--color-accent-400)" />
              <stop offset="1" stopColor="var(--color-accent-500)" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
export const methodSteps = [
  {
    title: L("Research the market", "Cercetăm piața"),
    body: L(
      "We learn your industry from the outside in — what your customers actually care about, where they spend attention, and what makes them trust a brand enough to pay — before a single ad gets written.",
      "Îți învățăm domeniul așa cum îl vede clientul — ce contează cu adevărat pentru el, pe unde se informează și ce îl convinge să aibă încredere într-o firmă cât să plătească — înainte să scriem prima reclamă.",
    ),
    modes: L(
      "For a quote business that might mean spec sheets and lead times. For a cart business, what gets saved versus scrolled past. For a calendar business, when people actually book.",
      "La o firmă care vinde prin ofertă, asta poate însemna fișe tehnice și termene de livrare. La una care vinde prin coș, ce salvează oamenii și peste ce trec când dau scroll. La una care vinde prin calendar, când se fac, de fapt, rezervările.",
    ),
    gets: [
      L(
        "A map of the questions buyers ask first",
        "Întrebările pe care și le pun clienții tăi înainte să cumpere",
      ),
      L(
        "An honest audit of what you already run",
        "O evaluare a campaniilor și a site-ului pe care le ai deja",
      ),
      L(
        "A tracking check before a euro is spent",
        "Verificarea tracking-ului, înainte să pornim orice buget",
      ),
    ],
    visual: <BuyerResearchPanel />,
  },
  {
    title: L("Map the competition", "Analizăm concurența"),
    body: L(
      "We find whoever's already winning attention in your space and take their approach apart: what's working, what's clearly copied from somewhere else, and what they're leaving on the table that you can take instead.",
      "Vedem cine atrage deja atenția în domeniul tău și luăm la bani mărunți tot ce fac: ce le merge, ce e clar copiat din altă parte și ce spațiu lasă liber, ca să-l ocupi tu.",
    ),
    modes: L(
      "Their ads, their sites, their offers and their reviews — read the way your buyer reads them.",
      "Reclamele, site-urile, ofertele și recenziile lor — citite cu ochii clientului tău.",
    ),
    gets: [
      L("A competitor map of your market", "Cine sunt concurenții tăi și cum vând ei"),
      L("Their ads taken apart, one by one", "Reclamele lor, analizate una câte una"),
      L("The open space nobody is claiming", "Ce nu spune nimeni din piața ta și ai putea spune tu"),
    ],
    visual: <CompetitorTeardownPanel />,
  },
  {
    title: L("Build you a sharper position", "Îți construim o poziționare mai clară"),
    body: L(
      "We take what's proven, sharpen it, and add what's missing — the ads, the site, the content — so that when your customer is ready to decide, your name is the one they remember.",
      "Păstrăm ce funcționează deja la tine, îl spunem mai clar și adăugăm ce lipsește — reclamele, site-ul, conținutul — ca atunci când clientul e gata să decidă, numele tău să fie primul care îi vine în minte.",
    ),
    modes: L(
      "Then we launch small and controlled, measure the one number we agreed on, and move budget toward what works.",
      "Apoi pornim cu buget mic și ținut sub control, urmărim indicatorul stabilit împreună și mutăm banii spre ce merge.",
    ),
    gets: [
      L(
        "A positioning draft, validated with you",
        "O schiță de poziționare, pe care o discutăm și o ajustăm cu tine",
      ),
      L("A channel plan built for how you sell", "Un plan de canale gândit pentru felul în care vinzi"),
      L(
        "The one number we'll report every month",
        "Un singur indicator, pe care îl raportăm în fiecare lună",
      ),
    ],
    visual: <PositioningPanel />,
  },
];
