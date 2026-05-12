"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type Testimonial = {
  quote: string;
  name: string;
  destination: string;
  program: string;
};

const avatar = "/images/team_member.png";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Testimonial[];

  return (
    <Section
      id="testimonials"
      eyebrow="Voices"
      title={t("heading")}
      subtitle={t("subtitle")}
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 lg:grid-cols-2"
      >
        {items.map((item, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlassCard
              tilt
              glow={i % 2 === 0 ? "cyan" : "accent"}
              className="p-8 md:p-10 h-full"
            >
              <div className="relative inline-block mb-6">
                <Quote size={40} aria-hidden className="text-[var(--color-cyan)]" strokeWidth={1} />
                <div aria-hidden className="absolute inset-0 blur-xl bg-[var(--color-cyan)] opacity-30" />
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={16} className="text-[var(--color-cyan)] fill-[var(--color-cyan)]" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--color-fg)]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={item.name}
                    className="size-14 rounded-full object-cover border-2 border-[var(--color-cyan)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-[var(--color-fg)]">{item.name}</div>
                  <div className="text-sm text-[var(--color-cyan)]">
                    {item.destination} &middot; {item.program}
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
