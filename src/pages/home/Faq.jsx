import { Reveal } from "../../components/effects/Reveal";
import { Container } from "../../components/ui/Container";
import { SectionHeading, SerifEm } from "../../components/ui/SectionHeading";
import { useT } from "../../i18n";
import { ContactFaq, contactFaqItems } from "../contact/Faq";
// The three objections a visitor has right before booking: no case studies, the price, being stuck if it fails.
const homeFaqItems = [0, 1, 4].map((index) => contactFaqItems[index]);
export function HomeFaq() {
  const t = useT();
  return (
    <section className="theme-light relative py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow={t("Before you book", "Înainte să programezi")}
            title={
              <>
                {t("Three questions ", "Trei întrebări ")}
                <SerifEm>{t("worth asking first.", "pe care merită să le pui.")}</SerifEm>
              </>
            }
          />
          <Reveal>
            <ContactFaq items={homeFaqItems} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
