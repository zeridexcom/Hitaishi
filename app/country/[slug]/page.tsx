import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Download, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { Newsletter } from "@/components/home/Newsletter";
import { countryDetails, getCountry } from "@/lib/countries";

export function generateStaticParams() {
  return countryDetails.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return { title: "Country not found | EduExpert" };
  return {
    title: `Study in ${country.name} | EduExpert`,
    description: country.tagline,
  };
}

const whyChooseUs = [
  { title: "Supportive environment", body: "Honest guidance from advisors who've walked applicants through this exact pathway." },
  { title: "Student-friendly policies", body: "Clear cost breakdowns, scholarship surfacing, and pre-departure support." },
  { title: "Quality higher education", body: "Only accredited, recognised institutions on every shortlist we present." },
  { title: "Opportunities for growth", body: "Post-study work options and PR pathways assessed up front, not as an afterthought." },
];

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  return (
    <>
      <PageHero
        eyebrow="Destination"
        title={`Study in ${country.name}`}
        description={country.tagline}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Country", href: "/country" },
          { label: country.name },
        ]}
      />

      {/* Intro + flag card */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 lg:items-center">
            <FadeIn className="lg:col-span-7">
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Why study in {country.name}?
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
                {country.name} at a glance
              </h2>
              <p className="mt-6 text-base md:text-lg text-neutral-600 leading-relaxed">
                {country.intro}
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {country.whyStudy.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-neutral-700">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Check size={14} strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-5">
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-8 md:p-10">
                <div className="aspect-square w-full rounded-2xl border border-[var(--color-border)] bg-white grid place-items-center text-[120px] md:text-[160px] leading-none">
                  <span aria-label={`${country.name} flag`}>{country.flagEmoji}</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Country</div>
                    <div className="mt-1 font-medium text-[var(--color-fg)]">{country.name}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Code</div>
                    <div className="mt-1 font-medium text-[var(--color-fg)]">{country.code}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Institutes</div>
                    <div className="mt-1 font-medium text-[var(--color-fg)]">
                      {country.universities.length} listed
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <Section
        eyebrow="Why choose us"
        title={`We map the ${country.name} pathway end to end`}
        alt
      >
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <FadeIn
              key={item.title}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7"
            >
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-fg)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{item.body}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Top institutes */}
      <Section
        eyebrow="Top institutes"
        title={`Universities we work with in ${country.name}`}
        subtitle="A starting shortlist â€” your final list will reflect your programme, budget, and intake."
      >
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {country.universities.map((u) => (
            <FadeIn
              key={u}
              className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6"
            >
              <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <GraduationCap size={18} aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base font-medium text-[var(--color-fg)] leading-snug">
                  {u}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{country.name}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Downloads */}
      <Section eyebrow="Resources" title="Documents & forms" alt>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 max-w-3xl mx-auto">
          {/* TODO(client): real PDFs â€” currently both downloads are placeholders. */}
          {[
            { name: "TOEFL Application Form", note: "Sample TOEFL registration walk-through (PDF pending)" },
            { name: "Terms & Conditions", note: "Service terms (PDF pending from client)" },
          ].map((d) => (
            <div
              key={d.name}
              className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6"
            >
              <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                <Download size={18} aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-[var(--color-fg)]">{d.name}</div>
                <div className="mt-1 text-xs text-neutral-500">{d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <Container>
          <FadeIn className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-fg)] text-[var(--color-fg)] p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Ready to start your {country.name} application?
            </h2>
            <p className="mt-4 text-neutral-300 max-w-xl mx-auto">
              Book a free consultation. We'll review your profile, surface the strongest universities for you, and map the next 90 days.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <ButtonLink href="/contact" size="lg">
                Book Appointment
                <ArrowRight size={16} aria-hidden />
              </ButtonLink>
              <Link
                href="/country"
                className="text-sm font-medium text-neutral-300 hover:text-[var(--color-fg)]"
              >
                Compare other countries â†’
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
