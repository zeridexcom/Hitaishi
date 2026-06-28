"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MentorHeroSection() {
  return (
    <section className="relative min-h-[640px] min-h-[100svh] w-full overflow-hidden bg-[var(--color-background)]">
      {/* Decorative background orbs */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "var(--color-primary)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--color-primary-deep)" }}
        aria-hidden
      />

      {/* Floating accent ring */}
      <motion.div
        className="pointer-events-none absolute top-1/3 right-[12%] hidden h-44 w-44 rounded-full border border-[var(--color-primary)]/20 md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)] md:text-xs md:tracking-[0.4em]"
        >
          Become a Mentor
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="mt-7 max-w-4xl font-serif text-[clamp(2.5rem,6.5vw,5rem)] font-medium leading-[1.05] tracking-tight text-[var(--color-fg)]"
        >
          Turn your JEE journey into{" "}
          <span className="text-aurora">someone else&apos;s</span>{" "}
          breakthrough.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:mt-9 md:text-lg"
        >
          You cleared JEE. Now help the next wave of aspirants navigate the same
          grind — with your strategies, your insight, and your story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
          className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 md:mt-12 md:w-auto md:max-w-none md:flex-row md:items-center md:justify-center"
        >
          <Link
            href="#apply"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-hover)]"
          >
            Apply as a Mentor <span aria-hidden>→</span>
          </Link>
          <Link
            href="#role"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-rule-strong)] bg-transparent px-8 py-3.5 text-sm font-medium text-[var(--color-primary-deep)] transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-soft)]"
          >
            See What You&apos;ll Do
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-8 max-w-sm text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] md:max-w-xl md:text-xs md:tracking-[0.2em]"
        >
          Open to IIT students &amp; alumni · top JEE rankers · NIT/IIIT mentors
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 2.5, delay: 2.0, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            ↓
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
