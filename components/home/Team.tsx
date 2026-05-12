"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { team } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const teamImages = ["/images/team_member.png"];

export function Team() {
  const t = useTranslations("team");
  const roles = t.raw("roles") as string[];

  return (
    <Section
      eyebrow="People"
      title={t("heading")}
      alt
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: team.placeholders }).map((_, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlassCard
              tilt
              glow={i % 2 === 0 ? "cyan" : "accent"}
              className="overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={teamImages[i % teamImages.length]}
                  alt={t("memberLabel")}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[var(--color-cyan)] to-transparent opacity-20"
                />
              </div>

              <div className="p-5">
                <div className="text-lg font-semibold text-[var(--color-fg)]">
                  {t("memberLabel")}
                </div>
                <div className="mt-1 text-sm text-[var(--color-cyan)]">
                  {roles[i % roles.length]}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
