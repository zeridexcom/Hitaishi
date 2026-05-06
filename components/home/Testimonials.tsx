"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { testimonials } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const testimonialData = [
  {
    quote: "EduExpert made my dream of studying in Germany a reality. Their guidance through the visa process was exceptional and stress-free.",
    name: "Priya Sharma",
    destination: "Germany",
    program: "MS Computer Science",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
  },
  {
    quote: "The team's expertise in Canadian immigration helped me secure my study permit in record time. Highly recommended for anyone planning to study abroad!",
    name: "Rahul Verma",
    destination: "Canada",
    program: "MBA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
  },
];

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="Voices"
      title={testimonials.heading}
      subtitle="Stories from students and families who've made the move with us."
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 lg:grid-cols-2"
      >
        {testimonialData.map((t, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlassCard 
              tilt 
              glow={i % 2 === 0 ? "cyan" : "accent"}
              className="p-8 md:p-10 h-full"
            >
              {/* Quote icon with glow */}
              <div className="relative inline-block mb-6">
                <Quote
                  size={40}
                  aria-hidden
                  className="text-[var(--color-cyan)]"
                  strokeWidth={1}
                />
                <div 
                  aria-hidden
                  className="absolute inset-0 blur-xl bg-[var(--color-cyan)] opacity-30"
                />
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={16}
                    className="text-[var(--color-cyan)] fill-[var(--color-cyan)]"
                  />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--color-fg)]">
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <figcaption className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center gap-4">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="size-14 rounded-full object-cover border-2 border-[var(--color-cyan)]"
                  />
                  <div 
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-[var(--color-fg)]">{t.name}</div>
                  <div className="text-sm text-[var(--color-cyan)]">
                    {t.destination} &middot; {t.program}
                  </div>
                </div>
              </figcaption>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
