import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MissionHistory } from "@/components/about/MissionHistory";
import { Values } from "@/components/about/Values";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import { Newsletter } from "@/components/home/Newsletter";
import { aboutPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | EduExpert",
  description:
    "Committed to your visa success. Learn about our mission, our story, and the team behind every application we send.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={aboutPage.hero.eyebrow}
        title={aboutPage.hero.title}
        description={aboutPage.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "About" },
        ]}
      />
      <MissionHistory />
      <Values />
      <Stats />
      <AboutTeam />
      <Partners />
      <Newsletter />
    </>
  );
}
