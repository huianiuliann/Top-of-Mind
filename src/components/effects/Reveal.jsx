import { useEffect, useRef, useState } from "react";
const revealFrom = {
  "fade-up": "translateY(24px)",
  "fade-left": "translateX(-24px)",
  "zoom-in": "scale(0.92)",
  "blur-in": "translateY(16px)",
};
// The prerendered HTML shows the block as is, so nothing waits for JavaScript. After hydration a block that is still
// below the fold is hidden and fades in once 10% of it scrolls into view; the motion itself is CSS ([data-reveal] in index.css).
export function Reveal({ children, className, variant = "fade-up", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [state, setState] = useState("shown");
  useEffect(() => {
    const el = ref.current;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("wait");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      data-reveal={state}
      className={className}
      style={{ "--reveal-from": revealFrom[variant], "--reveal-delay": `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
