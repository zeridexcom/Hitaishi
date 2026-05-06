import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { VisaCards } from "@/components/visa/VisaCards";
import { WhyUs } from "@/components/visa/WhyUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Countries } from "@/components/home/Countries";
import { Newsletter } from "@/components/home/Newsletter";
import { visaPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Visa | EduExpert",
  description:
    "Tourist, Commercial, Diplomatic, Student, Residence, and Working visas — every pathway, mapped clearly.",
};

export default function VisaPage() {
  return (
    <>
      <PageHero
        eyebrow={visaPage.hero.eyebrow}
        title={visaPage.hero.title}
        description={visaPage.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Visa" },
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
