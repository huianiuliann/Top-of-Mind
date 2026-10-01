import { useRef, useState, useEffect, createContext, useContext } from "react";
import { cn } from "../../lib/cn";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { useFounders } from "../../data/site";
import { useT, useLink } from "../../i18n";
import { ArrowTextLink } from "./shared";
const MouseEnterContext = createContext(undefined);
const TiltCardContainer = ({ children, className, containerClassName }) => {
  const cardRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const rotateYDeg = (event.clientX - left - width / 2) / 25;
    const rotateXDeg = (event.clientY - top - height / 2) / 25;
    cardRef.current.style.transform = `rotateY(${rotateYDeg}deg) rotateX(${-rotateXDeg}deg)`;
  };
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center py-20", containerClassName)}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={cardRef}
          onMouseEnter={() => setIsMouseEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            cardRef.current &&
              (setIsMouseEntered(false), (cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)"));
          }}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className,
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};
const TiltCardBody = ({ children, className }) => (
  <div
    className={cn("h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}
  >
    {children}
  </div>
);
const TiltCardItem = ({
  as: As = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const elementRef = useRef(null);
  const [isMouseEntered] = useMouseEnter();
  useEffect(() => {
    elementRef.current &&
      (elementRef.current.style.transform = isMouseEntered
        ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
        : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)");
  }, [isMouseEntered]);
  return (
    <As ref={elementRef} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </As>
  );
};
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  return context;
};
export function HomeTeam() {
  const founders = useFounders();
  const t = useT();
  const link = useLink();
  return (
    <section className="theme-light relative border-t border-white/[0.06] py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t("Who you'd work with", "Cu cine ai lucra")}
            title={
              <>
                {t("No account managers. ", "Fără account manageri. ")}
                <SerifEm>{t("Just the two of us.", "Doar noi doi.")}</SerifEm>
              </>
            }
            subtitle={t(
              "Whoever you speak to on the call is whoever does the work.",
              "Cei cu care vorbești la apel sunt aceiași care fac treaba.",
            )}
          />
          <div className="shrink-0 pb-2">
            <ArrowTextLink href={link("team.html")}>{t("Meet the team", "Cunoaște echipa")}</ArrowTextLink>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {founders.map((founder) => (
            <TiltCardContainer key={founder.name} containerClassName="h-full items-stretch py-4" className="h-full w-full items-stretch">
              <TiltCardBody className="group/card relative h-full w-full rounded-[1.8rem] border border-white/[0.08] bg-ink-900 p-6 transition-colors hover:border-white/20 sm:p-7">
                <div className="flex items-center gap-5 sm:gap-6">
                  <TiltCardItem translateZ={90} className="shrink-0">
                    <div className="relative size-28 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:size-36">
                      <img
                        src={founder.duo}
                        alt={founder.name}
                        style={{
                          objectPosition: founder.crop.card,
                        }}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover/card:opacity-0"
                        loading="lazy"
                      />
                      <img
                        src={founder.src}
                        alt=""
                        aria-hidden="true"
                        style={{
                          objectPosition: founder.crop.card,
                        }}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                        loading="lazy"
                      />
                    </div>
                  </TiltCardItem>
                  <div className="min-w-0">
                    <TiltCardItem translateZ={40} className="font-mono text-[13px] text-neutral-500">
                      {founder.role}
                    </TiltCardItem>
                    <TiltCardItem
                      translateZ={60}
                      as="h3"
                      className="mt-1 font-display text-2xl font-bold tracking-[-0.02em] text-white xl:text-3xl"
                    >
                      {founder.name}
                    </TiltCardItem>
                    <TiltCardItem translateZ={30} className="mt-1 text-sm text-neutral-500">
                      {founder.focus}
                    </TiltCardItem>
                  </div>
                </div>
                <TiltCardItem
                  translateZ={30}
                  as="p"
                  className="mt-6 text-[15px] leading-relaxed text-neutral-400"
                >
                  {founder.line}
                </TiltCardItem>
              </TiltCardBody>
            </TiltCardContainer>
          ))}
        </div>
      </Container>
    </section>
  );
}
