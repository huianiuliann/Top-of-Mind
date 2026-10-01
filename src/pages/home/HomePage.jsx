import { SiteLayout } from "../../components/layout/SiteLayout";
import { HomeAgencyProblem } from "./AgencyProblem";
import { HomeFinalCta } from "./FinalCta";
import { HomeHero } from "./Hero";
import { HomeHowWeWork } from "./HowWeWork";
import { HomeHowYouSell } from "./HowYouSell";
import { HomeProcess } from "./Process";
import { HomeServices } from "./Services";
import { HomeTeam } from "./Team";
export default function HomePage() {
  return (
    <SiteLayout current="home">
      <HomeHero />
      <HomeAgencyProblem />
      <HomeHowYouSell />
      <HomeProcess />
      <HomeServices />
      <HomeHowWeWork />
      <HomeTeam />
      <HomeFinalCta />
    </SiteLayout>
  );
}
