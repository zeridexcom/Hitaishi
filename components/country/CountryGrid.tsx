"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { countryDetails } from "@/lib/countries";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export function CountryGrid() {
  const t = useTranslations("countries");
  return (
    <Section
      eyebrow="Destinations"
      title={t("heading")}
      subtitle={t("subtext")}
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {countryDetails.map((c, i) => (
          <motion.div key={c.slug} variants={fadeUp}>
            <Link href={`/country/${c.slug}`} className="group block h-full">
              <GlassCard 
                tilt 
                glow={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "accent" : "none"}
                className="h-full p-6 md:p-7"
              >
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] text-3xl"
                  >
                    {c.flagEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-cyan)]">
                      {c.code}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-[var(--color-fg)]">
                      {c.name}
                    </h3>
                  </div>
                </div>
                
                <p className="mt-5 text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed flex-1">
                  {c.tagline}
                </p>
                
                <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)] group-hover:text-[var(--color-fg)] transition-colors">
                    {c.name}
                    <ArrowRight
                      size={14}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                    />
                  </span>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
