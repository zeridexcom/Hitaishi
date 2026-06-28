"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MentorCtaSection() {
  return (
    <section
      id="apply"
      className="relative overflow-hidden bg-[var(--color-background)] py-24 md:py-32"
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]"
        style={{ background: "var(--color-primary)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12 lg:px-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-sm"
        >
          Ready to begin?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-3xl mx-auto font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          Your experience is someone&apos;s roadmap.{" "}
          <span className="text-aurora">Share it.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          Apply in under 5 minutes. We&apos;ll review your profile, verify your credentials,
          and get you started within a week.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 md:mt-12 md:w-auto md:max-w-none md:flex-row md:items-center md:justify-center"
        >
          <Link
            href="/mentor/onboarding"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-hover)]"
          >
            Apply as a Mentor <span aria-hidden>→</span>
          </Link>
          <Link
            href="https://wa.me/919964081555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-rule-strong)] bg-transparent px-8 py-3.5 text-sm font-medium text-[var(--color-primary-deep)] transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-soft)]"
          >
            Questions? Chat on WhatsApp
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-fg-subtle)] md:gap-10 md:text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            Verified credentials
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            Flexible hours
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            Earn from day one
          </span>
        </motion.div>
      </div>
    </section>
  );
}
