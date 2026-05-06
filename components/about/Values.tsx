"use client";

import { motion } from "framer-motion";
import { HeartHandshake, FileCheck2, Infinity as InfinityIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { aboutPage } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const icons = [HeartHandshake, FileCheck2, InfinityIcon];

export function Values() {
  return (
    <Section
      eyebrow="What we believe"
      title="The principles behind every case we take"
      subtitle="Three commitments that guide every conversation, every form, and every send-off."
      alt
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 md:grid-cols-3"
      >
        {aboutPage.values.map((v, i) => {
          const Icon = icons[i];
          const glowColors = ["cyan", "accent", "cyan"] as const;
          
          return (
            <motion.div key={v.title} variants={fadeUp}>
              <GlassCard tilt glow={glowColors[i]} className="p-7 md:p-8 h-full">
                <div 
                  className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] text-white"
                  style={{
                    boxShadow: i % 2 === 0 
                      ? "0 0 30px rgba(6, 182, 212, 0.4)" 
                      : "0 0 30px rgba(79, 70, 229, 0.4)"
                  }}
                >
                  <Icon size={24} aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-fg)]">
                  {v.title}
                </h3>
                <p className="mt-4 text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed">
                  {v.body}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
