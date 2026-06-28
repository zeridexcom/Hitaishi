"use client";

import { motion } from "framer-motion";
import {
  HandHeart,
  Banknote,
  Clock,
  BadgeCheck,
  Users,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BENEFITS = [
  {
    icon: HandHeart,
    title: "Give back to the community",
    body: "You know how hard JEE is. Every hour you spend mentoring is an hour someone else gets the guidance you wish you had.",
  },
  {
    icon: Banknote,
    title: "Earn while you teach",
    body: "Mentorship on Hitaishi is rewarded. Set your availability, connect with students, and earn on your own terms.",
  },
  {
    icon: Clock,
    title: "Flexible scheduling",
    body: "No fixed hours. No commute. Mentor from your hostel room, your desk, or wherever you are — on your schedule.",
  },
  {
    icon: BadgeCheck,
    title: "Build your profile",
    body: "Earn a verified mentor badge. Showcase your mentorship experience — something that stands out on a CV or college application.",
  },
  {
    icon: Users,
    title: "Connect with serious aspirants",
    body: "Work with students who are genuinely committed to cracking JEE. Be matched based on your expertise and availability.",
  },
];

export function WhyMentorSection() {
  return (
    <section
      id="why-mentor"
      className="bg-[var(--color-background)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left column — heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-sm"
            >
              Why Hitaishi
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="mt-5 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
            >
              Why mentor with Hitaishi?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
            >
              It&apos;s not just about helping students — it&apos;s about building something
              meaningful. Here&apos;s what you get in return.
            </motion.p>
          </div>

          {/* Right column — benefit cards */}
          <div className="space-y-5">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.05 + i * 0.06,
                    ease: EASE,
                  }}
                  className="group flex gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-6 transition-all hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lift)] md:p-7"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[var(--color-fg)]">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {benefit.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
