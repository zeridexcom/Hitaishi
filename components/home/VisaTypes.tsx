"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Briefcase, GraduationCap, Home, HardHat } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { visaTypes, type VisaCard } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const iconMap = {
  plane: Plane,
  briefcase: Briefcase,
  graduation: GraduationCap,
  home: Home,
  hardhat: HardHat,
} as const;

export function VisaTypes() {
  return (
    <Section
      eyebrow="Solutions"
      title={visaTypes.heading}
      subtitle="From a quick tourist trip to long-term residence â€” every visa pathway, mapped clearly."
      alt
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visaTypes.cards.map((c, i) => (
          <Card key={c.title} card={c} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

function Card({ card, index }: { card: VisaCard; index: number }) {
  const Icon = iconMap[card.icon];
  const glowColors = ["cyan", "accent", "cyan", "accent", "cyan"] as const;
  
  return (
    <motion.div variants={fadeUp}>
      <Link href={visaTypes.href} className="group block h-full">
        <GlassCard 
          tilt 
          glow={glowColors[index % glowColors.length]}
          className="h-full p-6 md:p-8 transition-all duration-300"
        >
          {/* Icon with glow */}
          <div className="relative mb-6">
            <div 
              className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] text-white"
              style={{
                boxShadow: index % 2 === 0 
                  ? "0 0 30px rgba(6, 182, 212, 0.4)" 
                  : "0 0 30px rgba(79, 70, 229, 0.4)"
              }}
            >
              <Icon size={24} aria-hidden />
            </div>
            {/* Decorative ring */}
            <div 
              aria-hidden
              className="absolute inset-0 size-14 rounded-2xl border border-[var(--color-cyan)] opacity-0 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500"
            />
          </div>

          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
            {card.title}
          </h3>
          
          <p className="mt-4 text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed">
            {card.description}
          </p>

          {/* Learn more link */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)] group-hover:text-[var(--color-fg)] transition-colors">
              Learn more
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
