import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, Calendar, Sparkles, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { Newsletter } from "@/components/home/Newsletter";
import { coachingPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Coaching | EduExpert",
  description:
    "IELTS, TOEFL, PTE, GRE, GMAT â€” test-prep coaching focused on the skills that actually move scores.",
};

const featureIcons = [BookOpenCheck, Sparkles, Calendar, Users];

export default function CoachingPage() {
  return (
    <>
      <PageHero
        eyebrow={coachingPage.hero.eyebrow}
        title={coachingPage.hero.title}
        description={coachingPage.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Coaching" },
        ]}
      />

      {/* Tests */}
      <Section
        eyebrow="Tests we coach"
        title="Pick the test, hit the score"
        subtitle="Each track is built around section-wise drills, weekly diagnostics, and trainer-led mock reviews."
      >
        {/* TODO(client): confirm exact list of tests EduExpert actually coaches */}
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coachingPage.tests.map((t) => (
            <FadeIn
              key={t.title}
              className="group rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-fg)] hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                  {t.title}
                </h3>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  {t.band}
                </span>
              </div>
              <p className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed">
                {t.description}
              </p>
              <ButtonLink href="/contact" variant="ghost" size="sm" className="mt-6">
                Enquire <ArrowRight size={14} aria-hidden />
              </ButtonLink>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section
        eyebrow="What's included"
        title="More than just classes"
        subtitle="Every batch â€” regardless of test or schedule â€” comes with the same baseline of support."
        alt
      >
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {coachingPage.features.map((f, i) => {
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

      {/* Batches */}
      <Section
        eyebrow="Batches"
        title="A schedule that fits around your life"
        subtitle="Pick the cadence â€” weekday, weekend, online, or one-on-one."
      >
        {/* TODO(client): confirm batch sizes, durations, and pricing per track */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {coachingPage.batches.map((b) => (
            <FadeIn
              key={b.name}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                Batch
              </div>
              <h3 className="mt-2 text-lg md:text-xl font-semibold text-[var(--color-fg)]">
                {b.name}
              </h3>
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Schedule</dt>
                  <dd className="text-neutral-700 text-right">{b.schedule}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                  <dt className="text-neutral-500">Duration</dt>
                  <dd className="text-neutral-700 text-right">{b.duration}</dd>
                </div>
              </dl>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Fees CTA */}
      <section className="py-16 md:py-24">
        <Container>
          <FadeIn className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-fg)] text-[var(--color-fg)] p-10 md:p-14 text-center">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Fees & next steps
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
              Want a fee structure tailored to your test and batch?
            </h2>
            <p className="mt-4 text-neutral-300 max-w-xl mx-auto">
              {/* TODO(client): publish a real fee table once finalised */}
              Pricing varies by test and batch type. Share your target test and timeline â€” we'll send a quote within one working day.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/contact" size="lg">
                Request fee details
                <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
