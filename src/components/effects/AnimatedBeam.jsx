import { useRef, useState, useId, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/cn";
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "currentColor",
  pathWidth = 1.5,
  pathOpacity = 0.08,
  gradientStartColor = "var(--color-accent-200)",
  gradientStopColor = "var(--color-accent-400)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) {
  const gradientId = "beam-" + useId().replace(/:/g, "");
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    margin: "120px",
  });
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({
    w: 0,
    h: 0,
  });
  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();
      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
      setSvgDimensions({
        w: containerRect.width,
        h: containerRect.height,
      });
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`);
    };
    updatePath();
    const resizeObserver = new ResizeObserver(updatePath);
    containerRef.current && resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updatePath);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);
  const gradientCoords = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
      };
  return (
    <svg
      ref={svgRef}
      fill="none"
      width={svgDimensions.w}
      height={svgDimensions.h}
      viewBox={`0 0 ${svgDimensions.w} ${svgDimensions.h}`}
      className={cn("pointer-events-none absolute top-0 left-0 transform-gpu text-white", className)}
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${gradientId})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={
            isInView
              ? {
                  x1: gradientCoords.x1,
                  x2: gradientCoords.x2,
                  y1: ["0%", "0%"],
                  y2: ["0%", "0%"],
                }
              : {
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }
          }
          transition={
            isInView
              ? {
                  delay: delay,
                  duration: duration,
                  ease: [0.16, 1, 0.3, 1],
                  repeat: 1 / 0,
                  repeatDelay: 0,
                }
              : {
                  duration: 0,
                }
          }
        >
          <stop
            style={{
              stopColor: gradientStartColor,
              stopOpacity: 0,
            }}
          />
          <stop
            style={{
              stopColor: gradientStartColor,
            }}
          />
          <stop
            offset="32.5%"
            style={{
              stopColor: gradientStopColor,
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: gradientStopColor,
              stopOpacity: 0,
            }}
          />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
