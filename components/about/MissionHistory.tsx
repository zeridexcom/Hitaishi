"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/effects/GlassCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const sectionImages = [
  "/images/about_mission_history.png",
  "/images/about_mission_history.png",
];

export function MissionHistory() {
  const t = useTranslations("aboutPage");
  const blocks = [
    { eyebrow: t("mission.eyebrow"), heading: t("mission.heading"), body: t("mission.body"), label: "Mission" },
    { eyebrow: t("history.eyebrow"), heading: t("history.heading"), body: t("history.body"), label: "History" },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-[var(--color-background)]">
      <Container>
        <div className="flex flex-col gap-24 md:gap-32">
          {blocks.map((b, i) => (
            <motion.div
              key={b.heading}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center"
            >
              <motion.div
                variants={fadeUp}
                className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-last" : ""}`}
              >
                <GlassCard tilt glow={i % 2 === 0 ? "cyan" : "accent"} className="overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    <img
                      src={sectionImages[i]}
                      alt={b.label}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-60" />
                  </div>
                </GlassCard>
              </motion.div>
              
              <div className="lg:col-span-7">
                <motion.div
                  variants={fadeUp}
                  className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-cyan)]"
                >
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
                  {b.eyebrow}
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-fg)]"
                >
                  {b.heading}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="mt-6 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-2xl"
                >
                  {b.body}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
