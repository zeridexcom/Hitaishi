"use client";

import { Section } from "@/components/ui/Section";
import { Marquee } from "@/components/effects/Marquee";
import { partners } from "@/lib/content";

export function Partners() {
  return (
    <Section title={partners.heading}>
      <Marquee speed={45} pauseOnHover fade>
        {Array.from({ length: partners.count }).map((_, i) => (
          <div
            key={i}
            className="group h-14 md:h-16 w-32 md:w-40 shrink-0 rounded-xl bg-[var(--color-background-alt)] border border-[var(--color-border)] grid place-items-center transition-all duration-300 hover:border-[var(--color-cyan)] hover:shadow-[0_8px_24px_rgba(67,56,202,0.12)]"
            aria-label={`Partner logo placeholder ${i + 1}`}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] group-hover:text-[var(--color-cyan)] transition-colors">
              Partner
            </span>
          </div>
        ))}
      </Marquee>
    </Section>
  );
}
