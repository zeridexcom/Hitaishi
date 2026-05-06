"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Building2, FileText, BadgeCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { howItWorks } from "@/lib/content";

const icons = [Compass, Building2, FileText, BadgeCheck];

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const badgeVariant = {
  hidden: { scale: 0, rotate: -90 },
  show: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: { delay: 0.35 + i * 0.18, type: "spring" as const, stiffness: 260, damping: 18 },
  }),
};

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <Section
      eyebrow="Process"
      title={howItWorks.heading}
      subtitle={howItWorks.subtext}
    >
      <div ref={ref} className="relative">
        {/* Animated SVG connector line — only shown on lg+ where steps are horizontal */}
        <svg
          aria-hidden
          className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-1 w-[76%] pointer-events-none"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="howline" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0" />
              <stop offset="15%" stopColor="var(--color-cyan)" stopOpacity="1" />
              <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="1" />
              <stop offset="85%" stopColor="var(--color-cyan)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.line
            x1="0"
            x2="100"
            y1="0.5"
            y2="0.5"
            stroke="url(#howline)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step.title}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative"
              >
                <GlassCard tilt glow={i % 2 === 0 ? "cyan" : "accent"} className="p-6 h-full">
                  <div className="relative mb-6">
                    <div
                      className="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(67,56,202,0.15)] to-[rgba(14,116,144,0.15)] border border-[var(--color-border)]"
                    >
                      <Icon size={28} aria-hidden className="text-[var(--color-cyan)]" />
                    </div>

                    <motion.span
                      custom={i}
                      variants={badgeVariant}
                      initial="hidden"
                      animate={inView ? "show" : "hidden"}
                      className="absolute -top-2 -right-2 inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] text-xs font-bold text-white shadow-[0_4px_14px_rgba(67,56,202,0.4)]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-[var(--color-fg)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    {step.body}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
