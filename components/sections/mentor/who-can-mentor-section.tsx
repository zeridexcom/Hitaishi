"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, Building } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ELIGIBILITY = [
  {
    icon: GraduationCap,
    label: "IIT Students & Alumni",
    description:
      "Currently studying at an IIT, or an IIT graduate. Your campus experience and deep subject knowledge make you an ideal mentor.",
    badge: "Most common",
  },
  {
    icon: Trophy,
    label: "Top JEE Rankers",
    description:
      "Secured a strong JEE Main or Advanced rank. You know what it takes to crack the exam — and that insight is invaluable.",
    badge: null,
  },
  {
    icon: Building,
    label: "NIT / IIIT Students",
    description:
      "Studying at an NIT or IIIT with a solid JEE rank. You're close enough to the grind to relate, and experienced enough to guide.",
    badge: null,
  },
];

export function WhoCanMentorSection() {
  return (
    <section
      id="who-can-mentor"
      className="bg-[var(--color-background-alt)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-sm"
        >
          Eligibility
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-5 max-w-3xl font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          Who can mentor on Hitaishi?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          If you&apos;ve navigated the JEE path successfully, you have something to
          offer. Here&apos;s who we&apos; looking for.
        </motion.p>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {ELIGIBILITY.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.1,
                  ease: EASE,
                }}
                className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lift)] md:p-10"
              >
                {item.badge && (
                  <span className="absolute top-5 right-5 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {item.badge}
                  </span>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 font-serif text-xl font-medium text-[var(--color-fg)] md:text-2xl">
                  {item.label}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
