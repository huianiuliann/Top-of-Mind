import { L, useT } from "../i18n";
export const CALENDLY_URL = "https://calendly.com/huianiuliann/30min";
export const CONTACT_EMAIL = "iulian@topofmind.me";
export const WHATSAPP_URL = "https://wa.me/40756883206";
export const PHONE_DISPLAY = "0756 883 206";
export const NAV_ITEMS = [
  {
    name: L("Services", "Servicii"),
    link: "services.html",
    id: "services",
  },
  {
    name: L("Process", "Proces"),
    link: "process.html",
    id: "process",
  },
  {
    name: L("How you sell", "Cum vinzi"),
    link: "how-you-sell.html",
    id: "how-you-sell",
  },
  {
    name: L("Team", "Echipă"),
    link: "team.html",
    id: "team",
  },
  {
    name: L("Contact", "Contact"),
    link: "contact.html",
    id: "contact",
  },
];
export const founders = [
  {
    name: "Iulian Huian",
    role: L("Co-founder & CEO", "Co-fondator & CEO"),
    focus: L("Strategy & paid media", "Strategie și publicitate plătită"),
    src: "/assets/img/iulian.jpg",
    duo: "/assets/img/iulian-duo.jpg",
    crop: {
      card: "50% 58%",
      portrait: "50% 60%",
      circleOrigin: "50% 57%",
    },
    line: L(
      "Runs every account's Meta and Google Ads, and sets the research process behind each campaign. If you book the call, you'll most likely talk to him first.",
      "Se ocupă de Meta Ads și Google Ads la fiecare cont și stabilește procesul de cercetare din spatele fiecărei campanii. Dacă programezi apelul, cel mai probabil vei vorbi mai întâi cu el.",
    ),
    tags: [
      "Meta Ads",
      "Google Ads",
      L("Research & positioning", "Cercetare și poziționare"),
      L("Studying marketing at Babeș-Bolyai University", "Studiază marketing la Universitatea Babeș-Bolyai"),
    ],
  },
  {
    name: "Sebastian Răzeșu",
    role: L("Co-founder & CTO", "Co-fondator & CTO"),
    focus: L("Websites & web analytics", "Site-uri și analiză web"),
    src: "/assets/img/sebi.webp",
    duo: "/assets/img/sebi-duo.webp",
    crop: {
      card: "50% 50%",
      portrait: "50% 50%",
      circleOrigin: "50% 40%",
    },
    line: L(
      "Builds and maintains every client website, and owns the tracking behind it — if a campaign's numbers are right, it's because the analytics were set up to measure them properly in the first place.",
      "Construiește și întreține site-ul fiecărui client și răspunde de tracking-ul din spatele lui — dacă cifrele unei campanii sunt corecte, e pentru că analitica a fost configurată de la început să le măsoare cum trebuie.",
    ),
    tags: [
      L("Websites", "Site-uri"),
      L("Technical SEO", "SEO tehnic"),
      L("Analytics & tracking", "Analitică și tracking"),
      L("Keeps this site running", "Ține acest site în funcțiune"),
    ],
  },
];
// Copies with names, roles and bios in the current language, for components.
export function useNavItems() {
  const t = useT();
  return NAV_ITEMS.map((item) => ({ ...item, name: t(item.name) }));
}
export function useFounders() {
  const t = useT();
  return founders.map((founder) => ({
    ...founder,
    role: t(founder.role),
    focus: t(founder.focus),
    line: t(founder.line),
    tags: founder.tags.map((tag) => t(tag)),
  }));
}
