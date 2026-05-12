import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { VisaCards } from "@/components/visa/VisaCards";
import { WhyUs } from "@/components/visa/WhyUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Countries } from "@/components/home/Countries";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "Visa | EduExpert",
};

export default async function VisaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("visaPage.hero");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: tNav("visa") },
        ]}
      />
      <VisaCards />
      <WhyUs />
      <HowItWorks />
      <Countries />
      <Newsletter />
    </>
  );
}
