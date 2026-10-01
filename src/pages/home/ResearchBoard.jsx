import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { Eyebrow, SerifEm } from "../../components/ui/SectionHeading";
import { MacbookScroll } from "./MacbookScroll";
function ResearchBoardHeading() {
  return (
    <div className="flex flex-col items-center px-4">
      <Eyebrow>Week one</Eyebrow>
      <h2 className="mt-5 font-display text-5xl leading-[1.02] font-bold tracking-[-0.02em] text-white">
        {"Isn't ads. "}
        <SerifEm>It's this.</SerifEm>
      </h2>
      <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-neutral-400">
        Before a single ad goes live we map what your buyers ask, what your competitors say — and the space
        nobody is taking.
      </p>
    </div>
  );
}
export function HomeResearchBoard() {
  return (
    <section className="relative">
      <div className="hidden w-full md:block">
        <MacbookScroll
          src="/assets/img/research-board.webp"
          alt="Example research board: what buyers ask first, a competitor map, what's missing, competitor ads taken apart and a positioning draft"
          title={<ResearchBoardHeading />}
          badge={
            <span className="grid size-8 place-items-center rounded-full bg-[#19191d] ring-1 ring-white/10">
              <span className="size-2 rounded-full bg-accent-400" />
            </span>
          }
        />
      </div>
      <Container className="py-16 md:hidden">
        <div className="text-center">
          <ResearchBoardHeading />
        </div>
        <Reveal variant="flip-up" className="mt-10">
          <div className="rounded-[1.4rem] border border-white/10 bg-[#121215] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <img
              src="/assets/img/research-board.webp"
              alt="Example research board"
              className="w-full rounded-2xl"
              loading="lazy"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
