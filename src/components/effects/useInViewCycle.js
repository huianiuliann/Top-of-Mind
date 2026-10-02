import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
export function useInViewCycle(stepCount, intervalMs) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const intervalId = setInterval(() => setStep((prevStep) => (prevStep + 1) % stepCount), intervalMs);
    return () => clearInterval(intervalId);
  }, [inView, stepCount, intervalMs]);
  return { ref, step, inView };
}
