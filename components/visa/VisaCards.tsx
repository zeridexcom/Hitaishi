"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Plane,
  Briefcase,
  GraduationCap,
  Home,
  HardHat,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const iconMap = {
  tourist: Plane,
  commercial: Briefcase,
  diplomatic: ShieldCheck,
  student: GraduationCap,
  residence: Home,
  working: HardHat,
} as const;

const cardKeys: (keyof typeof iconMap)[] = [
  "tourist",
  "commercial",
  "diplomatic",
  "student",
  "residence",
  "working",
];

export function VisaCards() {
  const t = useTranslations("visaTypes");
  const tNav = useTranslations("nav");

  return (
    <Section
      eyebrow="Visa categories"
      title={t("heading")}
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cardKeys.map((key, index) => {
          const Icon = iconMap[key];
          const glowColors = ["cyan", "accent", "cyan", "accent", "cyan", "accent"] as const;
          return (
            <motion.div key={key} variants={fadeUp}>
              <Link href="/contact" className="group block h-full">
                <GlassCard
                  tilt
                  glow={glowColors[index % glowColors.length]}
                  className="h-full p-6 md:p-8"
                >
                  <div className="relative mb-6">
                    <div
                      className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] text-white"
                      style={{
                        boxShadow: index % 2 === 0
                          ? "0 0 30px rgba(6, 182, 212, 0.4)"
                          : "0 0 30px rgba(79, 70, 229, 0.4)",
                      }}
                    >
                      <Icon size={24} aria-hidden />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                    {t(`cards.${key}.title`)}
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed">
                    {t(`cards.${key}.description`)}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)] group-hover:text-[var(--color-fg)] transition-colors">
                      {tNav("contact")}
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
          );
        })}
      </motion.div>
    </Section>
  );
}
