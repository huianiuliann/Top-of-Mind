import { useRef, useState, useEffect } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { FramedCard } from "../../components/ui/FramedCard";
export const FirstMonthTimeline = ({ data }) => {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () =>
      contentRef.current && setHeight(contentRef.current.getBoundingClientRect().height);
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  return (
    <div className="w-full" ref={containerRef}>
      <div ref={contentRef} className="relative mx-auto max-w-7xl pb-10">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-32">
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 md:left-3">
                <div className="h-4 w-4 rounded-full border border-accent-400/60 bg-accent-500/20 p-2" />
              </div>
              <div className="hidden md:block md:pl-20">
                {item.kicker && <p className="mb-2 font-mono text-[13px] text-neutral-500">{item.kicker}</p>}
                <h3 className="font-display text-4xl font-bold tracking-[-0.02em] text-neutral-200 md:text-5xl">
                  {item.title}
                </h3>
              </div>
            </div>
            <div className="relative w-full pr-4 pl-20 md:pl-4">
              {item.kicker && (
                <p className="mb-1 font-mono text-[13px] text-neutral-500 md:hidden">{item.kicker}</p>
              )}
              <h3 className="mb-4 block text-left font-display text-2xl font-bold text-neutral-200 md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.12)_10%,rgba(255,255,255,0.12)_90%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-accent-400 from-[0%] via-accent-500/40 via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
export function FirstMonthWeekCard({ icon: Icon, title, body, children }) {
  return (
    <FramedCard innerClassName="p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-white/10 text-neutral-400">
          <Icon className="size-5" stroke={1.6} />
        </span>
        <h4 className="font-display text-2xl font-bold tracking-[-0.01em] text-white">{title}</h4>
      </div>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-400">{body}</p>
      {children && <div className="mt-6">{children}</div>}
    </FramedCard>
  );
}
