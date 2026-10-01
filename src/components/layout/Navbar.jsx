import React, { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { useLink, useT } from "../../i18n";
import { CALENDLY_URL, useNavItems } from "../../data/site";
import { LangSwitch } from "./LangSwitch";
const ResizableNav = ({ children, className }) => {
  const navRef = useRef(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
  });
  return (
    <motion.div ref={navRef} className={cn("fixed inset-x-0 top-3 z-[70] w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              visible: isScrolled,
            })
          : child,
      )}
    </motion.div>
  );
};
const NavbarDesktopBody = ({ children, className, visible }) => (
  <motion.div
    animate={{
      boxShadow: visible
        ? "0 0 0 1px rgba(244,244,246,0.08), 0 12px 40px rgba(0,0,0,0.45)"
        : "0 0 0 1px rgba(244,244,246,0), 0 0 0 rgba(0,0,0,0)",
      width: visible ? "62%" : "100%",
      y: visible ? 12 : 0,
    }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 50,
    }}
    style={{
      minWidth: "900px",
    }}
    className={cn(
      "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-[20px] bg-transparent px-4 py-2.5 lg:flex",
      visible && "bg-ink-900/80 backdrop-blur-md",
      className,
    )}
  >
    {children}
  </motion.div>
);
const NavItems = ({ items, className, onItemClick, current }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const t = useT();
  const link = useLink();
  return (
    <motion.nav
      aria-label={t("Main", "Principal")}
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 font-mono text-[13px] lg:flex",
        className,
      )}
    >
      {items.map((item, index) => (
        <a
          key={`link-${index}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onClick={onItemClick}
          className={cn(
            "relative px-4 py-2 text-neutral-400 transition-colors duration-200 hover:text-white",
            current === item.id && "text-white",
          )}
          href={link(item.link)}
        >
          {hoveredIndex === index && (
            <motion.div
              layoutId="nav-hovered"
              className="absolute inset-0 h-full w-full rounded-[10px] bg-white/[0.06]"
            />
          )}
          <span className="relative z-20">{item.name}</span>
          {current === item.id && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-accent-400" />}
        </a>
      ))}
    </motion.nav>
  );
};
const MobileNav = ({ children, className, visible }) => (
  <motion.div
    animate={{
      boxShadow: visible
        ? "0 0 0 1px rgba(244,244,246,0.08), 0 12px 40px rgba(0,0,0,0.45)"
        : "0 0 0 1px rgba(244,244,246,0), 0 0 0 rgba(0,0,0,0)",
      width: visible ? "92%" : "100%",
      paddingRight: visible ? "12px" : "4px",
      paddingLeft: visible ? "12px" : "4px",
      borderRadius: visible ? "5px" : "1rem",
      y: visible ? 8 : 0,
    }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 20,
    }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
      visible && "bg-ink-900/85 backdrop-blur-md",
      className,
    )}
  >
    {children}
  </motion.div>
);
const MobileNavHeader = ({ children, className }) => (
  <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>
);
const MobileNavMenu = ({ children, className, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -8,
        }}
        transition={{
          duration: 0.25,
        }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-1 rounded-2xl border border-white/10 bg-ink-900 px-4 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]",
          className,
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
const MobileNavToggle = ({ isOpen, onClick }) => {
  const t = useT();
  return (
    <button
      type="button"
      aria-label={isOpen ? t("Close menu", "Închide meniul") : t("Open menu", "Deschide meniul")}
      aria-expanded={isOpen}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full text-white"
    >
      {isOpen ? <IconX className="size-5" /> : <IconMenu2 className="size-5" />}
    </button>
  );
};
export function Navbar({ current }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useT();
  const link = useLink();
  const navItems = useNavItems();
  return (
    <ResizableNav>
      <NavbarDesktopBody>
        <Logo />
        <NavItems items={navItems} current={current} />
        <div className="relative z-20 flex items-center gap-3">
          <LangSwitch page={current} />
          <SecondaryButton href={CALENDLY_URL} external size="sm" icon="none">
            {t("Book a call", "Apel gratuit")}
          </SecondaryButton>
        </div>
      </NavbarDesktopBody>
      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <div className="flex items-center gap-1">
            <LangSwitch page={current} />
            <MobileNavToggle isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          <a
            href={link("index.html")}
            className="w-full rounded-xl px-3 py-3 font-display text-2xl font-bold tracking-[-0.02em] text-neutral-200 hover:bg-white/5"
          >
            {t("Home", "Acasă")}
          </a>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={link(item.link)}
              onClick={() => setIsMenuOpen(false)}
              className={
                "flex w-full items-center justify-between rounded-xl px-3 py-3 font-display text-2xl font-bold tracking-[-0.02em] hover:bg-white/5 " +
                (current === item.id ? "text-white" : "text-neutral-300")
              }
            >
              {item.name}
              <IconArrowRight className="size-5 text-neutral-600" stroke={1.6} />
            </a>
          ))}
          <div className="mt-3 w-full">
            <PrimaryButton href={CALENDLY_URL} external className="w-full" magnetic={false}>
              {t("Book a free 30-min call", "Programează un apel gratuit de 30 de minute")}
            </PrimaryButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNav>
  );
}
