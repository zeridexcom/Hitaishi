import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { CountryGrid } from "@/components/country/CountryGrid";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "Country | EduExpert",
};

export default async function CountryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("countryIndex.hero");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: tNav("country") },
        ]}
      />
      <CountryGrid />
      <Newsletter />
    </>
  );
}
