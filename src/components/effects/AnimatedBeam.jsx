import { useRef, useState, useId, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { easeOutExpo } from "./motion";
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathOpacity = 0.08,
  startYOffset = 0,
  endYOffset = 0,
}) {
  const gradientId = "beam-" + useId().replace(/:/g, "");
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, { margin: "120px" });
  const reduceMotion = useReducedMotion();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();
      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
      // Same size keeps the same object, so an unchanged layout does not re-render the beam.
      setSvgDimensions((prev) =>
        prev.w === containerRect.width && prev.h === containerRect.height ? prev : { w: containerRect.width, h: containerRect.height },
      );
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`);
    };
    updatePath();
    // The container observer covers viewport changes too; a window "resize" listener would also fire on every
    // mobile address-bar show/hide while scrolling.
    const resizeObserver = new ResizeObserver(updatePath);
    containerRef.current && resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startYOffset, endYOffset]);
  const running = isInView && !reduceMotion;
  const gradientCoords = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"] };
  return (
    <svg
      ref={svgRef}
      fill="none"
      width={svgDimensions.w}
      height={svgDimensions.h}
      viewBox={`0 0 ${svgDimensions.w} ${svgDimensions.h}`}
      className="pointer-events-none absolute top-0 left-0 transform-gpu text-white"
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={1.5}
        stroke={`url(#${gradientId})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={
            running
              ? { x1: gradientCoords.x1, x2: gradientCoords.x2, y1: ["0%", "0%"], y2: ["0%", "0%"] }
              : { x1: "0%", x2: "0%", y1: "0%", y2: "0%" }
          }
          transition={
            running
              ? { delay, duration, ease: easeOutExpo, repeat: Infinity, repeatDelay: 0 }
              : { duration: 0 }
          }
        >
          <stop style={{ stopColor: "var(--color-accent-200)", stopOpacity: 0 }} />
          <stop style={{ stopColor: "var(--color-accent-200)" }} />
          <stop offset="32.5%" style={{ stopColor: "var(--color-accent-400)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-accent-400)", stopOpacity: 0 }} />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
