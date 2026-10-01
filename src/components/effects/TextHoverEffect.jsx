import { useRef, useState, useId, useEffect } from "react";
import { motion } from "framer-motion";
export const TextHoverEffect = ({ text, duration, viewBox = "0 0 300 100", className }) => {
  const svgRef = useRef(null);
  const uniqueId = useId().replace(/:/g, "");
  const [cursor, setCursor] = useState({
    x: null,
    y: null,
  });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({
    cx: "50%",
    cy: "50%",
  });
  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const rect = svgRef.current.getBoundingClientRect();
      setMaskPosition({
        cx: `${((cursor.x - rect.left) / rect.width) * 100}%`,
        cy: `${((cursor.y - rect.top) / rect.height) * 100}%`,
      });
    }
  }, [cursor]);
  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(event) =>
        setCursor({
          x: event.clientX,
          y: event.clientY,
        })
      }
      className={"select-none " + (className || "")}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`tg-${uniqueId}`} gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#c7cdfe" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#5b54f5" />
            </>
          )}
        </linearGradient>
        <motion.radialGradient
          id={`rm-${uniqueId}`}
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{
            cx: "50%",
            cy: "50%",
          }}
          animate={maskPosition}
          transition={{
            duration: duration ?? 0,
            ease: "easeOut",
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`tm-${uniqueId}`}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#rm-${uniqueId})`} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-white/10 font-display text-7xl font-bold"
        style={{
          opacity: hovered ? 0.7 : 0,
        }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-white/15 font-display text-7xl font-bold"
        initial={{
          strokeDashoffset: 1e3,
          strokeDasharray: 1e3,
        }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 1e3,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#tg-${uniqueId})`}
        strokeWidth="0.3"
        mask={`url(#tm-${uniqueId})`}
        className="fill-transparent font-display text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
