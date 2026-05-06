"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Globe, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { ParticleField } from "@/components/effects/ParticleField";
import { WaveDivider } from "@/components/effects/WaveDivider";
import { GlassCard } from "@/components/effects/GlassCard";
import { CountUp } from "@/components/effects/CountUp";
import { Marquee } from "@/components/effects/Marquee";
import { hero } from "@/lib/content";
import { countries } from "@/lib/content";
import { fadeUp, heroStagger } from "@/lib/motion";

const headlineWords = ["Expert", "Guidance", "for", "Your", "Study", "Abroad", "Journey"];

const wordVariant = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Aurora animated background */}
      <AuroraBackground intensity="low" />
      
      {/* Particle field */}
      <ParticleField count={40} color="mixed" />
      
      {/* Floating decorative elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-[10%] opacity-20"
        style={{ animation: "float 8s ease-in-out infinite" }}
      >
        <Globe size={120} className="text-[var(--color-cyan)]" strokeWidth={0.5} />
      </div>
      
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/3 left-[5%] opacity-15"
        style={{ animation: "float-slow 10s ease-in-out infinite", animationDelay: "-3s" }}
      >
        <Sparkles size={80} className="text-[var(--color-accent)]" strokeWidth={0.5} />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:gap-16 py-24 md:py-32 lg:py-40 lg:grid-cols-12">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-7"
          >
            {/* Eyebrow badge */}
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-alt)] backdrop-blur-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-cyan)]"
            >
              <span className="size-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
              {hero.eyebrow}
            </motion.div>

            {/* Main headline — kinetic word fade-up */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-fg)] leading-[1.1]"
            >
              <motion.span
                aria-label={headlineWords.join(" ")}
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
                className="flex flex-wrap gap-x-3 gap-y-1"
              >
                {headlineWords.map((w, i) => (
                  <motion.span
                    key={`${w}-${i}`}
                    variants={wordVariant}
                    className={
                      w === "Study" || w === "Abroad"
                        ? "inline-block bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] bg-clip-text text-transparent"
                        : "inline-block"
                    }
                    style={{ paddingBottom: "0.08em" }}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            {/* Bullet points */}
            <motion.ul variants={fadeUp} className="mt-10 flex flex-col gap-4 max-w-xl">
              {hero.bullets.map((b, i) => (
                <li key={b} className="flex items-start gap-4 text-[var(--color-fg-muted)]">
                  <span 
                    className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <Check size={14} strokeWidth={3} aria-hidden className="text-white" />
                  </span>
                  <span className="text-base md:text-lg">{b}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton href={hero.primaryCta.href} size="lg" glow>
                {hero.primaryCta.label}
                <ArrowRight size={18} aria-hidden />
              </MagneticButton>
              <MagneticButton href={hero.secondaryCta.href} variant="ghost" size="lg" glow={false}>
                {hero.secondaryCta.label}
              </MagneticButton>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-3 max-w-lg gap-8"
            >
              {[
                { k: "Countries", end: 12, suffix: "+" },
                { k: "Visa Types", end: 5, suffix: "" },
                { k: "Avg Response", display: "<24h" },
              ].map((s) => (
                <div key={s.k} className="relative">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--color-fg)] neon-cyan">
                    {s.display ?? <CountUp end={s.end!} suffix={s.suffix} />}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {s.k}
                  </div>
                  {/* Subtle line accent */}
                  <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-[var(--color-cyan)] via-transparent to-transparent opacity-50" />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero image / Glass panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Main hero image */}
              <GlassCard tilt glow="cyan" className="overflow-hidden">
                <div className="aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1000&fit=crop&q=80"
                    alt="Students studying abroad at a university campus"
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-60" />
                </div>
              </GlassCard>

              {/* Floating info card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 hidden md:block"
              >
                <GlassCard tilt={false} glow="accent" className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="size-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] border-2 border-[var(--color-background)] flex items-center justify-center text-xs font-bold">JD</div>
                      <div className="size-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-[var(--color-background)] flex items-center justify-center text-xs font-bold">SK</div>
                      <div className="size-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[var(--color-background)] flex items-center justify-center text-xs font-bold">+</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        Trusted by
                      </div>
                      <div className="text-sm font-semibold text-[var(--color-fg)]">
                        500+ Students
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Success rate badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 hidden lg:block"
              >
                <GlassCard tilt={false} className="px-4 py-3">
                  <div className="text-2xl font-bold neon-cyan">98%</div>
                  <div className="text-xs text-[var(--color-fg-subtle)]">Success Rate</div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Country marquee — ambient motion under hero */}
      <div className="relative z-10 border-y border-[var(--color-border)] bg-[var(--color-background-alt)]/60 backdrop-blur-sm py-4">
        <Marquee speed={50} pauseOnHover fade>
          {countries.list.map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--color-fg-muted)] whitespace-nowrap"
            >
              <span className="font-bold tracking-wider text-[var(--color-cyan)]">{c.code}</span>
              <span>{c.name}</span>
              <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-border-hover)]" />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Wave divider at bottom */}
      <WaveDivider color="var(--color-background-alt)" />
    </section>
  );
}
