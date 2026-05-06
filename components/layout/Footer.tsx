"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, ArrowUpRight, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { business } from "@/lib/business";
import { footer } from "@/lib/content";
import { ParticleField } from "@/components/effects/ParticleField";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Subtle particle effect */}
      <ParticleField count={15} color="mixed" className="opacity-30" />
      
      {/* Gradient overlay */}
      <div 
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(79,70,229,0.03)] to-[rgba(6,182,212,0.05)]"
      />

      <Container className="relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="py-16 md:py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand + intro */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-fg)] group inline-block">
              {business.name}
              <span className="text-[var(--color-cyan)] group-hover:text-[var(--color-accent)] transition-colors">.</span>
            </Link>
            <p className="mt-4 text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-xs">
              Expert guidance for a seamless study abroad journey. Your dreams are our mission.
            </p>
            
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={`tel:${business.phones[0].tel}`}
                className="inline-flex items-center gap-3 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors group"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                  <Phone size={14} aria-hidden className="text-[var(--color-cyan)]" />
                </span>
                {business.phones[0].display}
              </a>
              <a
                href={`mailto:${business.emails[0]}`}
                className="inline-flex items-center gap-3 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors group"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                  <Mail size={14} aria-hidden className="text-[var(--color-cyan)]" />
                </span>
                {business.emails[0]}
              </a>
              <span className="inline-flex items-center gap-3 text-[var(--color-fg-subtle)]">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)]">
                  <Clock size={14} aria-hidden className="text-[var(--color-accent)]" />
                </span>
                {business.hours}
              </span>
            </div>
          </motion.div>

          {/* Explore */}
          <motion.div variants={fadeUp}>
            <FooterColumn title="Explore">
              {footer.explore.map((l) => (
                <FooterLink key={l.href + l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp}>
            <FooterColumn title="Services">
              {footer.services.map((l) => (
                <FooterLink key={l.href + l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </motion.div>

          {/* Branches */}
          <motion.div variants={fadeUp}>
            <FooterColumn title="Our Branches">
              {footer.branches.map((b) => (
                <li
                  key={b}
                  className="text-sm text-[var(--color-fg-muted)] inline-flex gap-3 items-start leading-relaxed"
                >
                  <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded bg-[var(--color-background-alt)]">
                    <MapPin size={12} aria-hidden className="text-[var(--color-cyan)]" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
              <li className="pt-3 text-xs text-[var(--color-fg-subtle)] leading-relaxed pl-8">
                {business.address}
              </li>
            </FooterColumn>
          </motion.div>
        </motion.div>

        {/* Newsletter mini form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="py-8 border-t border-[var(--color-border)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-fg)]">Stay Updated</h4>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Get the latest visa tips and study abroad news.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 h-11 rounded-full bg-[var(--color-background-alt)] border border-[var(--color-border)] px-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)] transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center size-11 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-shadow"
              >
                <Send size={16} aria-hidden />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-border)] py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[var(--color-fg-subtle)]">
          <span>{business.copyright}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Built with care for a journey worth taking
          </span>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cyan)] mb-5">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
      >
        {children}
        <ArrowUpRight 
          size={12} 
          aria-hidden 
          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--color-cyan)]" 
        />
      </Link>
    </li>
  );
}
