"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { ParticleField } from "@/components/effects/ParticleField";
import { DotGlobe } from "@/components/effects/DotGlobe";
import { WaveDivider } from "@/components/effects/WaveDivider";
import { GlassCard } from "@/components/effects/GlassCard";
import { CountUp } from "@/components/effects/CountUp";
import { Marquee } from "@/components/effects/Marquee";
import { countries } from "@/lib/content";
import { fadeUp, heroStagger } from "@/lib/motion";

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
  const t = useTranslations("hero");
  const headlineWords = t.raw("headlineWords") as string[];
  const bullets = t.raw("bullets") as string[];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-background)]">
      <AuroraBackground intensity="low" />
      <ParticleField count={40} color="mixed" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[-10%] md:right-[-5%] hidden md:block w-[55%] lg:w-[45%] opacity-60"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-cyan-glow) 0%, transparent 55%)",
          }}
        />
        <DotGlobe color="#0e7490" />
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
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-alt)] backdrop-blur-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-cyan)]"
            >
              <span className="size-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
              {t("eyebrow")}
            </motion.div>

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
                      i === 1 || i === 4 || i === 5
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

            <motion.ul variants={fadeUp} className="mt-10 flex flex-col gap-4 max-w-xl">
              {bullets.map((b, i) => (
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

            <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton href="/contact" size="lg" glow>
                {t("primaryCta")}
                <ArrowRight size={18} aria-hidden />
              </MagneticButton>
              <MagneticButton href="/about" variant="ghost" size="lg" glow={false}>
                {t("secondaryCta")}
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-3 max-w-lg gap-8"
            >
              {[
                { k: t("stats.countries"), end: 12, suffix: "+" },
                { k: t("stats.visaTypes"), end: 5, suffix: "" },
                { k: t("stats.avgResponse"), display: t("stats.responseValue") },
              ].map((s, idx) => (
                <div key={idx} className="relative">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--color-fg)] neon-cyan">
                    {s.display ?? <CountUp end={s.end!} suffix={s.suffix} />}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {s.k}
                  </div>
                  <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-[var(--color-cyan)] via-transparent to-transparent opacity-50" />
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <GlassCard tilt glow="cyan" className="overflow-hidden">
                <div className="aspect-[4/5] relative">
                  <img
                    src="/images/home_hero.png"
                    alt="Students studying abroad at a university campus"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-60" />
                </div>
              </GlassCard>

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
                        {t("trustedBy")}
                      </div>
                      <div className="text-sm font-semibold text-[var(--color-fg)]">
                        {t("trustedCount")}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 hidden lg:block"
              >
                <GlassCard tilt={false} className="px-4 py-3">
                  <div className="text-2xl font-bold neon-cyan">98%</div>
                  <div className="text-xs text-[var(--color-fg-subtle)]">{t("successRate")}</div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

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

      <WaveDivider color="var(--color-background-alt)" />
    </section>
  );
}
