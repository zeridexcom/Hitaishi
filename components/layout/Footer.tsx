"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Clock, ArrowUpRight, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { business } from "@/lib/business";
import { ParticleField } from "@/components/effects/ParticleField";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type FooterLinkData = { label: string; href: string };

export function Footer() {
  const t = useTranslations("footer");
  const tNewsletter = useTranslations("newsletter");
  const explore = t.raw("explore") as FooterLinkData[];
  const services = t.raw("services") as FooterLinkData[];

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <ParticleField count={15} color="mixed" className="opacity-30" />

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
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Link href="/" className="inline-block" aria-label={`${business.name} home`}>
              <span className="relative block w-48 h-16 overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt={business.name}
                  className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                />
              </span>
            </Link>
            <p className="mt-4 text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-xs">
              {t("intro")}
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={`tel:${business.phones[0].tel}`}
                className="inline-flex items-center gap-3 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors group"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                  <Phone size={14} aria-hidden className="text-[var(--color-cyan)]" />
                </span>
                <span dir="ltr">{business.phones[0].display}</span>
              </a>
              <a
                href={`mailto:${business.emails[0]}`}
                className="inline-flex items-center gap-3 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors group"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                  <Mail size={14} aria-hidden className="text-[var(--color-cyan)]" />
                </span>
                <span dir="ltr">{business.emails[0]}</span>
              </a>
              <span className="inline-flex items-center gap-3 text-[var(--color-fg-subtle)]">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-background-alt)] border border-[var(--color-border)]">
                  <Clock size={14} aria-hidden className="text-[var(--color-accent)]" />
                </span>
                {business.hours}
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <FooterColumn title={t("exploreHeading")}>
              {explore.map((l) => (
                <FooterLink key={l.href + l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </motion.div>

          <motion.div variants={fadeUp}>
            <FooterColumn title={t("servicesHeading")}>
              {services.map((l) => (
                <FooterLink key={l.href + l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </motion.div>

          <motion.div variants={fadeUp}>
            <FooterColumn title={t("branchesHeading")}>
              <li className="text-sm text-[var(--color-fg-muted)] inline-flex gap-3 items-start leading-relaxed">
                <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded bg-[var(--color-background-alt)]">
                  <MapPin size={12} aria-hidden className="text-[var(--color-cyan)]" />
                </span>
                <span>{business.address}</span>
              </li>
            </FooterColumn>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="py-8 border-t border-[var(--color-border)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-fg)]">
                {tNewsletter("heading")}
              </h4>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={tNewsletter("placeholder")}
                className="flex-1 md:w-64 h-11 rounded-full bg-[var(--color-background-alt)] border border-[var(--color-border)] px-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)] transition-all"
              />
              <button
                type="submit"
                aria-label={tNewsletter("cta")}
                className="inline-flex items-center justify-center size-11 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-shadow"
              >
                <Send size={16} aria-hidden className="rtl:rotate-180" />
              </button>
            </form>
          </div>
        </motion.div>

        <div className="border-t border-[var(--color-border)] py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[var(--color-fg-subtle)]">
          <span>{business.copyright}</span>
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
          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--color-cyan)] rtl:rotate-90"
        />
      </Link>
    </li>
  );
}
