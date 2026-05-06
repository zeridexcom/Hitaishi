import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CountryGrid } from "@/components/country/CountryGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { countryIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "Country | EduExpert",
  description:
    "Browse the countries we cover. Each page lists eligible institutes, why students pick that country, and what to expect.",
};

export default function CountryIndexPage() {
  return (
    <>
      <PageHero
        eyebrow={countryIndex.hero.eyebrow}
        title={countryIndex.hero.title}
        description={countryIndex.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Country" },
        ]}
      />
      <CountryGrid />
      <Newsletter />
    </>
  );
}
