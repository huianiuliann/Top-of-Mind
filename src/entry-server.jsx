// Used only by the build: renders each page in each language to static HTML (scripts/prerender.mjs).
import { renderToString } from "react-dom/server";
import { LangProvider } from "./i18n";
import HomePage from "./pages/home/HomePage";
import ServicesPage from "./pages/services/ServicesPage";
import ProcessPage from "./pages/process/ProcessPage";
import TeamPage from "./pages/team/TeamPage";
import ContactPage from "./pages/contact/ContactPage";
import HowYouSellPage from "./pages/how-you-sell/HowYouSellPage";

const pages = {
  index: HomePage,
  services: ServicesPage,
  process: ProcessPage,
  team: TeamPage,
  contact: ContactPage,
  "how-you-sell": HowYouSellPage,
};

export function render(page, lang = "en") {
  const Page = pages[page];
  return renderToString(
    <LangProvider lang={lang}>
      <Page />
    </LangProvider>,
  );
}

export const pageNames = Object.keys(pages);
export const langs = ["en", "ro"];
