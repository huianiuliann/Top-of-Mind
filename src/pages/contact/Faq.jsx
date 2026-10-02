import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";
import { cn } from "../../lib/cn";
import { L, useT } from "../../i18n";
import { easeOutExpo } from "../../components/effects/motion";
export const contactFaqItems = [
  {
    q: L("Do you have case studies?", "Aveți studii de caz?"),
    a: L(
      "Not published ones yet — we're a young studio and we'd rather say that plainly than dress up numbers that aren't there. What you get instead is full visibility into our process from day one, and a pricing model where part of what we earn depends on your results.",
      "Nu avem încă studii de caz publicate — suntem la început și preferăm să o spunem pe șleau decât să umflăm cifre. În schimb, vezi tot ce facem din prima zi, iar o parte din banii noștri depinde de rezultatele tale.",
    ),
  },
  {
    q: L("How does pricing work?", "Cum funcționează prețul?"),
    a: L(
      "A monthly retainer, with part of our fee tied to results: per qualified lead if you sell by quote, tied to ad performance if you sell by cart, tied to direct bookings if you sell by calendar. We put exact numbers on the table after the call, once we know which one you are.",
      "Abonament lunar, cu o parte din tarif legată de rezultate: per lead calificat dacă vinzi prin ofertă, după performanța reclamelor dacă vinzi prin coș, după rezervările directe dacă vinzi prin calendar. Sumele exacte le primești după apel, când știm în care dintre ele ești.",
    ),
  },
  {
    q: L("How fast will I see results?", "Cât de repede văd rezultate?"),
    a: L(
      "Paid ads can produce first signals within two to three weeks. SEO and organic social take longer — usually two to three months before it's meaningful. We'll tell you which to expect for your specific case before you commit to anything.",
      "Reclamele plătite pot da primele semne în două-trei săptămâni. SEO și social media organic durează mai mult — de obicei două-trei luni până se vede ceva. Îți spunem la ce să te aștepți în cazul tău înainte să semnezi orice.",
    ),
  },
  {
    q: L("Do you work with small budgets?", "Lucrați și cu bugete mici?"),
    a: L(
      "Yes. We'd rather start small and prove the approach than ask you to bet big on us before we've earned it.",
      "Da. Preferăm să pornim cu puțin și să arătăm că merge, decât să-ți cerem să pariezi mult pe noi înainte să fi dovedit ceva.",
    ),
  },
  {
    q: L("What happens if it isn't working?", "Ce se întâmplă dacă nu merge?"),
    a: L(
      "We tell you. Every report is built to surface what isn't performing, not just what is — and because there's no long contract, you're never stuck paying for something that clearly isn't right.",
      "Îți spunem. În fiecare raport se vede la fel de clar ce n-a mers ca și ce a mers — și, pentru că nu există un contract lung, nu rămâi niciodată blocat să plătești pentru ceva ce clar nu funcționează.",
    ),
  },
  {
    q: L("What do you need from me to start?", "De ce aveți nevoie de la mine ca să începem?"),
    a: L(
      "A 30-minute call. Bring whatever you already have — a website, a page, an idea of who buys from you — and we'll tell you honestly whether we're the right fit.",
      "Un apel de 30 de minute. Vino cu ce ai deja — un site, o pagină de Facebook, o idee despre cine cumpără de la tine — și îți spunem sincer dacă ne potrivim.",
    ),
  },
];
export function ContactFaq({ items = contactFaqItems }) {
  const t = useT();
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="divide-y divide-white/[0.06] rounded-card border border-white/10 bg-ink-900/50">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q.en} className="px-5 md:px-7">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
            >
              <span
                className={cn(
                  "font-display text-lg font-bold tracking-[-0.01em] transition-colors md:text-xl",
                  isOpen ? "text-white" : "text-neutral-300",
                )}
              >
                {t(item.q)}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border transition-colors",
                  isOpen
                    ? "border-accent-400 bg-white/[0.06] text-accent-300"
                    : "border-white/10 text-neutral-400",
                )}
              >
                <IconPlus className="size-4" stroke={1.6} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-neutral-400 md:text-base">
                    {t(item.a)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
