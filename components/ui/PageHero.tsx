"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "./Container";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { ParticleField } from "@/components/effects/ParticleField";
import { fadeUp, heroStagger } from "@/lib/motion";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
};

export function PageHero({ eyebrow, title, description, crumbs }: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      {/* Aurora background */}
      <AuroraBackground intensity="medium" />
      
      {/* Particles */}
      <ParticleField count={25} color="mixed" className="opacity-40" />

      <Container>
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="relative z-10 py-20 md:py-28 lg:py-36 max-w-3xl"
        >
          {/* Breadcrumbs */}
          {crumbs && crumbs.length > 0 && (
            <motion.nav
              variants={fadeUp}
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]"
            >
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
                    {c.href && !last ? (
                      <Link
                        href={c.href}
                        className="hover:text-[var(--color-cyan)] transition-colors"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-[var(--color-fg)]" : undefined}>
                        {c.label}
                      </span>
                    )}
                    {!last && <ChevronRight size={12} aria-hidden className="text-[var(--color-cyan)]" />}
                  </span>
                );
              })}
            </motion.nav>
          )}
          
          {/* Eyebrow */}
          {eyebrow && (
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-cyan)]"
            >
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
              {eyebrow}
            </motion.div>
          )}
          
          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-fg)] leading-[1.1]"
          >
            {title}
          </motion.h1>
          
          {/* Description */}
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </Container>
      
      {/* Bottom gradient fade */}
      <div 
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-background-alt)] to-transparent"
      />
    </section>
  );
}
