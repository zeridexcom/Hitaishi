"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Lightbulb,
  HelpCircle,
  Target,
  Heart,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ROLE_ITEMS = [
  {
    icon: Compass,
    title: "Guide through the journey",
    body: "Walk students through every phase of JEE prep — from building fundamentals in Class 11 to the final push before exams.",
  },
  {
    icon: Lightbulb,
    title: "Share what worked for you",
    body: "Your strategies, your shortcuts, your mistakes — the real-world playbook that textbooks don't cover.",
  },
  {
    icon: HelpCircle,
    title: "Resolve doubts, personally",
    body: "Answer questions that coaching centres can't always address. Be the mentor who actually listens.",
  },
  {
    icon: Target,
    title: "Exam tips & stress management",
    body: "Teach time management, paper strategy, and how to stay calm when it matters most — from someone who's been there.",
  },
  {
    icon: Heart,
    title: "Be a role model & motivator",
    body: "More than scores — inspire confidence, discipline, and the belief that they can do it. Your story proves it's possible.",
  },
];

export function MentorRoleSection() {
  return (
    <section
      id="role"
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
          Your Role
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-5 max-w-3xl font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          What you&apos;ll do as a Hitaishi mentor.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          Mentorship isn&apos;t about being perfect — it&apos;s about being present.
          Here&apos;s what you can do for the students who look up to you.
        </motion.p>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {ROLE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.08,
                  ease: EASE,
                }}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-7 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lift)] md:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-medium text-[var(--color-fg)] md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
