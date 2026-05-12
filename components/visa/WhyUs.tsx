"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Shield, Users, Award } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const icons = [Sparkles, Shield, Users, Award];

export function WhyUs() {
  const t = useTranslations("visaPage.whyUs");
  const items = t.raw("items") as { title: string; body: string }[];
  return (
    <Section
      eyebrow="Why us"
      title={t("heading")}
      alt
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item, i) => {
          const Icon = icons[i % icons.length];
          const glowColors = ["cyan", "accent", "cyan", "accent"] as const;
          
          return (
            <motion.div key={item.title} variants={fadeUp}>
              <GlassCard tilt glow={glowColors[i]} className="p-6 md:p-7 h-full">
                <div 
                  className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] text-white"
                  style={{
                    boxShadow: i % 2 === 0 
                      ? "0 0 25px rgba(6, 182, 212, 0.4)" 
                      : "0 0 25px rgba(79, 70, 229, 0.4)"
                  }}
                >
                  <Icon size={20} aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  {item.body}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
