"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/cn";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { ParticleField } from "@/components/effects/ParticleField";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  alt?: boolean;
  particles?: boolean;
  className?: string;
  headerAlign?: "left" | "center";
  children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  alt = false,
  particles = false,
  className,
  headerAlign = "center",
  children,
}: Props) {
  const showHeader = eyebrow || title || subtitle;
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-28 lg:py-36 overflow-hidden",
        alt ? "bg-[var(--color-background-alt)]" : "bg-[var(--color-background)]",
        className,
      )}
    >
      {/* Subtle particles for visual interest */}
      {particles && <ParticleField count={20} color="mixed" className="opacity-30" />}
      
      <Container className="relative z-10">
        {showHeader && (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className={cn(
              "mb-14 md:mb-20 max-w-3xl",
              headerAlign === "center" ? "mx-auto text-center" : "",
            )}
          >
            {eyebrow && (
              <motion.div
                variants={fadeUp}
                className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-cyan)]"
              >
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
                {eyebrow}
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-cyan)]" />
              </motion.div>
            )}
            {title && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-fg)]"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                variants={fadeUp}
                className="mt-5 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </Container>
    </section>
  );
}
