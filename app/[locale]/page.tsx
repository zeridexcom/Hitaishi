import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Partners } from "@/components/home/Partners";
import { VisaTypes } from "@/components/home/VisaTypes";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Stats } from "@/components/home/Stats";
import { Countries } from "@/components/home/Countries";
import { Team } from "@/components/home/Team";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Newsletter } from "@/components/home/Newsletter";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Partners />
      <VisaTypes />
      <HowItWorks />
      <Stats />
      <Countries />
      <Team />
      <Testimonials />
      <FAQ />
      <BlogPreview />
      <Newsletter />
    </>
  );
}
