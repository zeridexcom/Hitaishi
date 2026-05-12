import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, BookOpenCheck, Calendar, Sparkles, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "Coaching | EduExpert",
};

const featureIcons = [BookOpenCheck, Sparkles, Calendar, Users];

type Test = { title: string; description: string; band: string };
type Feature = { title: string; body: string };
type Batch = { name: string; schedule: string; duration: string };

export default async function CoachingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("coachingPage");
  const tNav = await getTranslations("nav");
  const tNewsletter = await getTranslations("newsletter");

  const tests = t.raw("tests") as Test[];
  const features = t.raw("features") as Feature[];
  const batches = t.raw("batches") as Batch[];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: tNav("coaching") },
        ]}
      />

      <Section eyebrow={t("hero.eyebrow")} title={t("hero.title")}>
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <FadeIn
              key={test.title}
              className="group rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-fg)] hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                  {test.title}
                </h3>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  {test.band}
                </span>
              </div>
              <p className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed">
                {test.description}
              </p>
              <ButtonLink href="/contact" variant="ghost" size="sm" className="mt-6">
                {tNav("contact")} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
              </ButtonLink>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section eyebrow={t("hero.eyebrow")} title={t("hero.title")} alt>
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <FadeIn
                key={f.title}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7"
              >
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[var(--color-fg)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{f.body}</p>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      <Section eyebrow={t("hero.eyebrow")} title={t("hero.title")}>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {batches.map((b) => (
            <FadeIn
              key={b.name}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7"
            >
              <h3 className="mt-2 text-lg md:text-xl font-semibold text-[var(--color-fg)]">
                {b.name}
              </h3>
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dd className="text-neutral-700">{b.schedule}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                  <dd className="text-neutral-700">{b.duration}</dd>
                </div>
              </dl>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
