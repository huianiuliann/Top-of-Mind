import { useEffect, useState } from "react";
// Decor that CSS hides below `minWidth` is not even mounted there, so phones skip its DOM, hydration, timers and loops.
// The server HTML leaves it out too; wide screens mount it right after hydration (it is absolutely positioned: no layout shift).
export function DesktopOnly({ minWidth = 1400, children }) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [minWidth]);
  return wide ? children : null;
}
