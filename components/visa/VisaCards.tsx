"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Briefcase,
  GraduationCap,
  Home,
  HardHat,
  ShieldCheck,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { visaPage, type VisaCardExt } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const iconMap = {
  plane: Plane,
  briefcase: Briefcase,
  graduation: GraduationCap,
  home: Home,
  hardhat: HardHat,
  shield: ShieldCheck,
} as const;

export function VisaCards() {
  return (
    <Section
      eyebrow="Visa categories"
      title="Visa types and eligibility assessment"
      subtitle="Six pathways, six profiles. Tap any card and we'll walk you through eligibility, documents, and timelines."
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visaPage.cards.map((c, i) => (
          <Card key={c.title} card={c} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

function Card({ card, index }: { card: VisaCardExt; index: number }) {
  const Icon = iconMap[card.icon];
  const glowColors = ["cyan", "accent", "cyan", "accent", "cyan", "accent"] as const;
  
  return (
    <motion.div variants={fadeUp}>
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
                  : "0 0 30px rgba(79, 70, 229, 0.4)"
              }}
            >
              <Icon size={24} aria-hidden />
            </div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
            {card.title}
          </h3>
          <p className="mt-4 text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed">
            {card.description}
          </p>
          
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)] group-hover:text-[var(--color-fg)] transition-colors">
              Talk to an advisor
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
