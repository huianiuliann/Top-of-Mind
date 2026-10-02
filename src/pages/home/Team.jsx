import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { useFounders } from "../../data/site";
import { useT, useLink } from "../../i18n";
import { ArrowTextLink } from "./shared";
// Tilts toward the cursor; the items inside lift through their group-hover/card:[transform:translateZ()] classes.
function TiltCard({ children }) {
  return (
    <div className="flex h-full items-stretch justify-center py-4" style={{ perspective: "1000px" }}>
      <div
        onMouseMove={(event) => {
          const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
          const rotateYDeg = (event.clientX - left - width / 2) / 25;
          const rotateXDeg = (event.clientY - top - height / 2) / 25;
          event.currentTarget.style.transform = `rotateY(${rotateYDeg}deg) rotateX(${-rotateXDeg}deg)`;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
        }}
        className="relative flex h-full w-full items-stretch justify-center transition-all duration-200 ease-linear"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="group/card relative h-full w-full rounded-[1.8rem] border border-white/[0.08] bg-ink-900 p-6 transition-colors [transform-style:preserve-3d] hover:border-white/20 sm:p-7 [&>*]:[transform-style:preserve-3d]">
          {children}
        </div>
      </div>
    </div>
  );
}
const lift = "w-fit transition duration-200 ease-linear";
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
            <TiltCard key={founder.name}>
              <div className="flex items-center gap-5 sm:gap-6">
                <div className={`${lift} shrink-0 group-hover/card:[transform:translateZ(90px)]`}>
                  <div className="relative size-28 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:size-36">
                    <img
                      src={founder.duo}
                      alt={founder.name}
                      style={{ objectPosition: founder.crop.card }}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover/card:opacity-0"
                      loading="lazy"
                    />
                    <img
                      src={founder.src}
                      alt=""
                      aria-hidden="true"
                      style={{ objectPosition: founder.crop.card }}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <div
                    className={`${lift} font-mono text-[13px] text-neutral-500 group-hover/card:[transform:translateZ(40px)]`}
                  >
                    {founder.role}
                  </div>
                  <h3
                    className={`${lift} mt-1 font-display text-2xl font-bold tracking-[-0.02em] text-white xl:text-3xl group-hover/card:[transform:translateZ(60px)]`}
                  >
                    {founder.name}
                  </h3>
                  <div
                    className={`${lift} mt-1 text-sm text-neutral-500 group-hover/card:[transform:translateZ(30px)]`}
                  >
                    {founder.focus}
                  </div>
                </div>
              </div>
              <p
                className={`${lift} mt-6 text-[15px] leading-relaxed text-neutral-400 group-hover/card:[transform:translateZ(30px)]`}
              >
                {founder.line}
              </p>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
