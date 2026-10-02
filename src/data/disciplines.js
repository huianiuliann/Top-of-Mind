import {
  IconActivityHeartbeat,
  IconBrowser,
  IconHash,
  IconMessageCircle,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { ContentRotationVisual } from "../components/effects/ContentRotationVisual";
import { EventStreamVisual } from "../components/effects/EventStreamVisual";
import { LeadFlowVisual } from "../components/effects/LeadFlowVisual";
import { SplitTestVisual } from "../components/effects/SplitTestVisual";
import { WebsiteBuildVisual } from "../components/effects/WebsiteBuildVisual";
import { L } from "../i18n";

// The four disciplines plus tracking. `id` is the anchor on services.html, `short` the label in the orbit and the converging paths.
export const ADS = {
  id: "paid-advertising",
  icon: IconSpeakerphone,
  name: L("Paid advertising", "Publicitate plătită"),
  short: L("Ads", "Reclame"),
  Visual: SplitTestVisual,
};
export const WEBSITES = {
  id: "websites",
  icon: IconBrowser,
  name: L("Websites & SEO", "Site-uri și SEO"),
  short: L("Website", "Site"),
  Visual: WebsiteBuildVisual,
};
export const SOCIAL = {
  id: "social",
  icon: IconHash,
  name: L("Social media", "Social media"),
  short: L("Social", "Social media"),
  Visual: ContentRotationVisual,
};
export const LEADS = {
  id: "lead-generation",
  icon: IconMessageCircle,
  name: L("Lead generation", "Generare de lead-uri"),
  short: L("Follow-up", "Follow-up"),
  Visual: LeadFlowVisual,
};
export const TRACKING = {
  id: "tracking",
  icon: IconActivityHeartbeat,
  name: L("Tracking you can trust", "Tracking pe care te poți baza"),
  short: L("Tracking", "Tracking"),
  Visual: EventStreamVisual,
};
export const DISCIPLINES = [ADS, WEBSITES, SOCIAL, LEADS, TRACKING];
