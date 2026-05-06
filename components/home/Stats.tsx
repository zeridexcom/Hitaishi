"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { CountUp } from "@/components/effects/CountUp";
import { stats } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const statsData = [
  { value: 12, suffix: "+", label: "Countries Covered" },
  { value: 5, suffix: "", label: "Visa Types" },
  { value: 500, suffix: "+", label: "Successful Students" },
  { value: 10, suffix: "+", label: "Expert Consultants" },
];

export function Stats() {
  return (
    <Section
      eyebrow="By the numbers"
      title={stats.heading}
      subtitle="A quick look at where we've helped people land — real numbers, no fluff."
      alt
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statsData.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp}>
            <GlassCard 
              tilt 
              glow={i % 2 === 0 ? "cyan" : "accent"}
              className="p-6 md:p-8 text-center"
            >
              {/* Decorative top line */}
              <div 
                className="mx-auto h-1 w-12 rounded-full mb-6"
                style={{
                  background: i % 2 === 0 
                    ? "linear-gradient(90deg, var(--color-cyan), var(--color-accent))"
                    : "linear-gradient(90deg, var(--color-accent), var(--color-cyan))",
                  boxShadow: i % 2 === 0
                    ? "0 0 20px rgba(6, 182, 212, 0.5)"
                    : "0 0 20px rgba(79, 70, 229, 0.5)"
                }}
              />
              
              {/* Animated count */}
              <div 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, var(--color-cyan) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(6, 182, 212, 0.3)"
                }}
              >
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              
              <div className="mt-4 text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                {s.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
