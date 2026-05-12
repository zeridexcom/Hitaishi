import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { MissionHistory } from "@/components/about/MissionHistory";
import { Values } from "@/components/about/Values";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "About | EduExpert",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage.hero");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: tNav("about") },
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
