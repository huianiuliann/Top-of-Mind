import { useRef, useEffect } from "react";
import { useScroll, motion, useMotionValue, useTransform } from "framer-motion";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretDownFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconCommand,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconSearch,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconWorld,
} from "@tabler/icons-react";
import { cn } from "../../lib/cn";
export const MacbookScroll = ({ src, alt = "", title, badge, className }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const fitScale = useMotionValue(1);
  const maxScale = useMotionValue(1.24);
  useEffect(() => {
    const fitScaleValue = fitScale;
    const maxScaleValue = maxScale;
    const updateScales = () => {
      const viewportHeight = window.innerHeight;
      const nextFitScale = Math.min(1, Math.max(0.72, viewportHeight / 900));
      const nextMaxScale = Math.max(1.02, Math.min(1.28, (viewportHeight - 192) / (576 * nextFitScale)));
      fitScaleValue.set(nextFitScale);
      maxScaleValue.set(nextMaxScale);
    };
    updateScales();
    window.addEventListener("resize", updateScales);
    return () => window.removeEventListener("resize", updateScales);
  }, []);
  const lidScaleX = useTransform(scrollYProgress, [0, 0.34], [1.2, 1.5]);
  const lidScaleY = useTransform(scrollYProgress, [0, 0.34], [0.6, 1.5]);
  const lidRotate = useTransform(scrollYProgress, [0, 0.06, 0.34], [-28, -28, 0]);
  const laptopY = useTransform(scrollYProgress, [0, 0.3], [150, -16]);
  const laptopScale = useTransform(
    [scrollYProgress, fitScale, maxScale],
    ([progress, currentFitScale, currentMaxScale]) => {
      const linear = Math.min(1, Math.max(0, (progress - 0.34) / 0.37999999999999995));
      const eased = linear * linear * (3 - 2 * linear);
      return currentFitScale * (1 + (currentMaxScale - 1) * eased);
    },
  );
  const titleOpacity = useTransform(scrollYProgress, [0, 0.16, 1], [1, 0, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.16, 1], [0, -48, -48]);
  return (
    <div ref={sectionRef} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {title && (
          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className="absolute inset-x-0 top-[9vh] z-30 text-center"
          >
            {title}
          </motion.div>
        )}
        <div className="absolute inset-0 flex items-center justify-center [perspective:800px]">
          <motion.div
            style={{
              y: laptopY,
              scale: laptopScale,
              transformOrigin: "50% 288px",
            }}
            className="relative flex flex-col items-center"
          >
            <MacbookLid src={src} alt={alt} scaleX={lidScaleX} scaleY={lidScaleY} rotate={lidRotate} />
            <div aria-hidden="true" className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#202024]">
              <div className="relative h-10 w-full">
                <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#0b0b0e]" />
              </div>
              <div className="relative flex">
                <div className="mx-auto h-full w-[10%] overflow-hidden">
                  <MacbookSpeakerGrid />
                </div>
                <div className="mx-auto h-full w-[80%]">
                  <MacbookKeypad />
                </div>
                <div className="mx-auto h-full w-[10%] overflow-hidden">
                  <MacbookSpeakerGrid />
                </div>
              </div>
              <MacbookTrackpad />
              <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#202024] to-[#0b0b0e]" />
              {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
const MacbookLid = ({ scaleX, scaleY, rotate, src, alt }) => (
  <div className="relative [perspective:800px]">
    <div
      style={{
        transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
        transformOrigin: "bottom",
        transformStyle: "preserve-3d",
      }}
      className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
    >
      <div
        style={{
          boxShadow: "0px 2px 0px 2px #171717 inset",
        }}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
      >
        <span className="block size-2.5 rounded-full bg-accent-400" />
      </div>
    </div>
    <motion.div
      style={{
        scaleX: scaleX,
        scaleY: scaleY,
        rotateX: rotate,
        transformStyle: "preserve-3d",
        transformOrigin: "top",
      }}
      className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
    >
      <div className="absolute inset-0 rounded-lg bg-[#202024]" />
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
      />
    </motion.div>
  </div>
);
const MacbookTrackpad = () => (
  <div
    className="mx-auto my-1 h-32 w-[40%] rounded-xl"
    style={{
      boxShadow: "0px 0px 1px 1px #00000020 inset",
    }}
  />
);
const MacbookKeypad = () => (
  <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#0b0b0e] p-1 [will-change:transform]">
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <MacbookKey className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
        esc
      </MacbookKey>
      <MacbookKey>
        <IconBrightnessDown className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F1</span>
      </MacbookKey>
      <MacbookKey>
        <IconBrightnessUp className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F2</span>
      </MacbookKey>
      <MacbookKey>
        <IconTable className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F3</span>
      </MacbookKey>
      <MacbookKey>
        <IconSearch className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F4</span>
      </MacbookKey>
      <MacbookKey>
        <IconMicrophone className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F5</span>
      </MacbookKey>
      <MacbookKey>
        <IconMoon className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F6</span>
      </MacbookKey>
      <MacbookKey>
        <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F7</span>
      </MacbookKey>
      <MacbookKey>
        <IconPlayerSkipForward className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F8</span>
      </MacbookKey>
      <MacbookKey>
        <IconPlayerTrackNext className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F9</span>
      </MacbookKey>
      <MacbookKey>
        <IconVolume3 className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F10</span>
      </MacbookKey>
      <MacbookKey>
        <IconVolume2 className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F11</span>
      </MacbookKey>
      <MacbookKey>
        <IconVolume className="h-[6px] w-[6px]" />
        <span className="mt-1 inline-block">F12</span>
      </MacbookKey>
      <MacbookKey>
        <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
          <div className="h-full w-full rounded-full bg-black" />
        </div>
      </MacbookKey>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      {[
        ["~", "`"],
        ["!", "1"],
        ["@", "2"],
        ["#", "3"],
        ["$", "4"],
        ["%", "5"],
        ["^", "6"],
        ["&", "7"],
        ["*", "8"],
        ["(", "9"],
        [")", "0"],
        ["\u2014", "_"],
        ["+", "="],
      ].map(([symbol, digit]) => (
        <MacbookKey key={symbol}>
          <span className="block">{symbol}</span>
          <span className="block">{digit}</span>
        </MacbookKey>
      ))}
      <MacbookKey className="w-10 items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">
        delete
      </MacbookKey>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <MacbookKey className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
        tab
      </MacbookKey>
      {"QWERTYUIOP".split("").map((letter) => (
        <MacbookKey key={letter}>
          <span className="block">{letter}</span>
        </MacbookKey>
      ))}
      <MacbookKey>
        <span className="block">{"{"}</span>
        <span className="block">[</span>
      </MacbookKey>
      <MacbookKey>
        <span className="block">{"}"}</span>
        <span className="block">]</span>
      </MacbookKey>
      <MacbookKey>
        <span className="block">|</span>
        <span className="block">\</span>
      </MacbookKey>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <MacbookKey
        className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
        childrenClassName="items-start"
      >
        caps lock
      </MacbookKey>
      {"ASDFGHJKL".split("").map((letter) => (
        <MacbookKey key={letter}>
          <span className="block">{letter}</span>
        </MacbookKey>
      ))}
      <MacbookKey>
        <span className="block">:</span>
        <span className="block">;</span>
      </MacbookKey>
      <MacbookKey>
        <span className="block">"</span>
        <span className="block">'</span>
      </MacbookKey>
      <MacbookKey
        className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
        childrenClassName="items-end"
      >
        return
      </MacbookKey>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <MacbookKey
        className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
        childrenClassName="items-start"
      >
        shift
      </MacbookKey>
      {"ZXCVBNM".split("").map((letter) => (
        <MacbookKey key={letter}>
          <span className="block">{letter}</span>
        </MacbookKey>
      ))}
      <MacbookKey>
        <span className="block">{"<"}</span>
        <span className="block">,</span>
      </MacbookKey>
      <MacbookKey>
        <span className="block">{">"}</span>
        <span className="block">.</span>
      </MacbookKey>
      <MacbookKey>
        <span className="block">?</span>
        <span className="block">/</span>
      </MacbookKey>
      <MacbookKey
        className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
        childrenClassName="items-end"
      >
        shift
      </MacbookKey>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <MacbookKey childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1">
          <span className="block">fn</span>
        </div>
        <div className="flex w-full justify-start pl-1">
          <IconWorld className="h-[6px] w-[6px]" />
        </div>
      </MacbookKey>
      <MacbookKey childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1">
          <IconChevronUp className="h-[6px] w-[6px]" />
        </div>
        <div className="flex w-full justify-start pl-1">
          <span className="block">control</span>
        </div>
      </MacbookKey>
      <MacbookKey childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1">
          <MacOptionKeyIcon className="h-[6px] w-[6px]" />
        </div>
        <div className="flex w-full justify-start pl-1">
          <span className="block">option</span>
        </div>
      </MacbookKey>
      <MacbookKey className="w-8" childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1">
          <IconCommand className="h-[6px] w-[6px]" />
        </div>
        <div className="flex w-full justify-start pl-1">
          <span className="block">command</span>
        </div>
      </MacbookKey>
      <MacbookKey className="w-[8.2rem]" />
      <MacbookKey className="w-8" childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-start pl-1">
          <IconCommand className="h-[6px] w-[6px]" />
        </div>
        <div className="flex w-full justify-start pl-1">
          <span className="block">command</span>
        </div>
      </MacbookKey>
      <MacbookKey childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-start pl-1">
          <MacOptionKeyIcon className="h-[6px] w-[6px]" />
        </div>
        <div className="flex w-full justify-start pl-1">
          <span className="block">option</span>
        </div>
      </MacbookKey>
      <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
        <MacbookKey className="h-3 w-6">
          <IconCaretUpFilled className="h-[6px] w-[6px]" />
        </MacbookKey>
        <div className="flex">
          <MacbookKey className="h-3 w-6">
            <IconCaretLeftFilled className="h-[6px] w-[6px]" />
          </MacbookKey>
          <MacbookKey className="h-3 w-6">
            <IconCaretDownFilled className="h-[6px] w-[6px]" />
          </MacbookKey>
          <MacbookKey className="h-3 w-6">
            <IconCaretRightFilled className="h-[6px] w-[6px]" />
          </MacbookKey>
        </div>
      </div>
    </div>
  </div>
);
const MacbookKey = ({ className, children, childrenClassName, backlit = true }) => (
  <div className={cn("rounded-[4px] p-[0.5px]", backlit && "bg-white/[0.08]")}>
    <div
      className={cn("flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]", className)}
      style={{
        boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
      }}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center text-[5px] text-neutral-300",
          childrenClassName,
        )}
      >
        {children}
      </div>
    </div>
  </div>
);
const MacbookSpeakerGrid = () => (
  <div
    className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
    style={{
      backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
      backgroundSize: "3px 3px",
    }}
  />
);
const MacOptionKeyIcon = ({ className }) => (
  <svg fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
    <polygon
      stroke="currentColor"
      strokeWidth={2}
      points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
    />
    <rect width="32" height="32" stroke="none" />
  </svg>
);
