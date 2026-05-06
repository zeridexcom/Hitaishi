"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { countries } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Countries() {
  const [active, setActive] = useState("Europe");

  return (
    <Section
      eyebrow="Destinations"
      title={countries.heading}
      subtitle={countries.subtext}
      particles
    >
      {/* Tab buttons */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {countries.tabs.map((t) => {
          const enabled = t === "Europe";
          const isActive = active === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => enabled && setActive(t)}
              disabled={!enabled}
              aria-pressed={isActive}
              className={cn(
                "h-10 px-5 rounded-full text-sm font-medium transition-all duration-300 border",
                isActive
                  ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] text-white border-transparent shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  : enabled
                    ? "bg-[var(--color-background-alt)] text-[var(--color-fg-muted)] border-[var(--color-border)] hover:border-[var(--color-cyan)] hover:text-[var(--color-fg)]"
                    : "bg-transparent text-[var(--color-fg-subtle)] border-[var(--color-border)] cursor-not-allowed",
              )}
            >
              {t}
              {!enabled && <span className="ml-2 text-[9px] uppercase tracking-wider opacity-50">soon</span>}
            </button>
          );
        })}
      </div>

      {/* Country grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {countries.list.map((c, i) => (
          <motion.div key={c.slug} variants={fadeUp}>
            <Link href={`/country/${c.slug}`} className="group block">
              <GlassCard 
                tilt 
                glow={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "accent" : "none"}
                className="p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Country code badge */}
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(79,70,229,0.3)] to-[rgba(6,182,212,0.3)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)] transition-all"
                    style={{
                      boxShadow: "0 0 15px rgba(6, 182, 212, 0.1)"
                    }}
                  >
                    <span className="text-sm font-bold tracking-wider text-[var(--color-fg)]">
                      {c.code}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-[var(--color-fg)] truncate">
                      {c.name}
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-subtle)] group-hover:text-[var(--color-cyan)] transition-colors">
                      Explore 
                      <ArrowRight size={11} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
