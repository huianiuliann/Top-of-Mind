import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBrandWhatsapp, IconChecks } from "@tabler/icons-react";
import { L, useT } from "../../i18n";
const heroChatMessages = [
  {
    me: false,
    text: L(
      "Hi! We make custom railings and stairs. Can we talk this week?",
      "Bună! Facem balustrade și scări la comandă. Putem vorbi săptămâna asta?",
    ),
  },
  {
    me: true,
    text: L(
      "Sure \u2014 pick any 30-minute slot on Calendly and we'll look at your market before the call.",
      "Sigur \u2014 alege orice interval de 30 de minute pe Calendly și ne uităm la piața ta înainte de apel.",
    ),
  },
  {
    me: false,
    text: L("Booked for Thursday \u{1F44D}", "Programat pentru joi \u{1F44D}"),
  },
];
export function ContactHeroChat() {
  const t = useT();
  const [visibleCount, setVisibleCount] = useState(heroChatMessages.length);
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer;
    const showMessage = (step) => {
      if (step > heroChatMessages.length) {
        timer = setTimeout(() => showMessage(0), 3600);
        return;
      }
      setVisibleCount(step);
      step < heroChatMessages.length
        ? (timer = setTimeout(() => {
            setIsTyping(true);
            timer = setTimeout(() => {
              setIsTyping(false);
              showMessage(step + 1);
            }, 1100);
          }, 700))
        : (timer = setTimeout(() => showMessage(step + 1), 2600));
    };
    timer = setTimeout(() => showMessage(0), 900);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className="w-[22rem] overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-ink-900 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-[#1f3b2c] text-emerald-300">
          <IconBrandWhatsapp className="size-5" />
        </span>
        <div className="flex-1">
          <p className="font-display text-sm font-bold text-white">Top of Mind</p>
          <p className="text-[11px] text-emerald-300/80">{isTyping ? t("typing\u2026", "scrie\u2026") : "online"}</p>
        </div>
        <span className="rounded-full border border-dashed border-white/15 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
          {t("example", "exemplu")}
        </span>
      </div>
      <div className="flex min-h-[15rem] flex-col justify-end gap-2 p-4">
        <AnimatePresence initial={false}>
          {heroChatMessages.slice(0, visibleCount).map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{
                opacity: 0,
                y: 10,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
              className={
                message.me
                  ? "ml-8 self-end rounded-2xl rounded-br-md bg-white/90 px-3.5 py-2 text-[13px] leading-snug text-ink-950"
                  : "mr-8 self-start rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2 text-[13px] leading-snug text-neutral-200"
              }
            >
              {t(message.text)}
              {message.me && <IconChecks className="ml-1 inline size-3.5 text-ink-950/60" />}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className={
                (heroChatMessages[visibleCount]?.me ? "self-end bg-white/25" : "self-start bg-white/[0.07]") +
                " flex gap-1 rounded-2xl px-3 py-2.5"
              }
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="size-1.5 rounded-full bg-neutral-300"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: 1 / 0,
                    delay: dot * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
