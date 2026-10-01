import { MotionConfig } from "framer-motion";
import { useT } from "../../i18n";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
export function SiteLayout({ children, current }) {
  const t = useT();
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-[300] rounded-full bg-white px-4 py-2 font-mono text-sm text-ink-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t("Skip to content", "Sari la conținut")}
      </a>
      <Navbar current={current} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer current={current} />
    </MotionConfig>
  );
}
