import { TextHoverEffect } from "../effects/TextHoverEffect";
import { SecondaryButton } from "../ui/Button";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { useLink, useT } from "../../i18n";
import { CALENDLY_URL, CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_URL, useNavItems } from "../../data/site";
import { LangSwitch } from "./LangSwitch";
export function Footer({ current }) {
  const t = useT();
  const link = useLink();
  const navItems = useNavItems();
  const linkClassName = "text-[15px] text-neutral-400 transition-colors hover:text-accent-300";
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950 pt-20">
      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="-ml-2" />
            <p className="mt-5 text-[15px] leading-relaxed text-neutral-400">
              {t(
                "A research-first marketing studio in Cluj-Napoca. Two founders, one method, and reporting in plain language.",
                "Studio de marketing din Cluj-Napoca care începe cu cercetarea. Doi fondatori, o singură metodă și rapoarte pe înțelesul tău.",
              )}
            </p>
            <div className="mt-7">
              <SecondaryButton href={CALENDLY_URL} external size="sm">
                {t("Book a free 30-min call", "Programează un apel gratuit de 30 de minute")}
              </SecondaryButton>
            </div>
            <LangSwitch page={current} className="mt-6 w-fit" />
          </div>
          <div>
            <p className="font-mono text-[12px] text-neutral-500">{t("Site", "Pagini")}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a className={linkClassName} href={link("index.html")}>
                  {t("Home", "Acasă")}
                </a>
              </li>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a className={linkClassName} href={link(item.link)}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[12px] text-neutral-500">{t("Talk to us", "Vorbește cu noi")}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a className={linkClassName} href={CALENDLY_URL} target="_blank" rel="noopener">
                  {t("30-minute call on Calendly", "Apel de 30 de minute pe Calendly")}
                </a>
              </li>
              <li>
                <a className={linkClassName} href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a className={linkClassName} href={WHATSAPP_URL} target="_blank" rel="noopener">
                  {"WhatsApp \xB7 "}
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="text-[15px] text-neutral-500">{t("Cluj-Napoca, Romania", "Cluj-Napoca, România")}</li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="relative mt-10 -mb-6 h-[9rem] w-full sm:h-[14rem] md:-mb-10 md:h-[22rem]">
        <TextHoverEffect text="TOP OF MIND" viewBox="0 0 520 100" />
      </div>
      <Container className="relative border-t border-white/[0.07] py-6">
        <div className="flex flex-col gap-2 font-mono text-[12px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>TOM BUREAU SRL · CUI 54043345 · Cluj-Napoca</span>
          <span>© 2026 Top of Mind</span>
        </div>
      </Container>
    </footer>
  );
}
