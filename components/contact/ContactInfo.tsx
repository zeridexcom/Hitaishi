"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { business } from "@/lib/business";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const mapsHref = `https://www.google.com/maps?q=${business.coords.lat},${business.coords.lng}`;

export function ContactInfo() {
  const tNav = useTranslations("nav");
  return (
    <Section
      eyebrow={tNav("contact")}
      title={tNav("contact")}
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 md:grid-cols-3"
      >
        <Card
          icon={<Phone size={24} aria-hidden />}
          title="Call us"
          glow="cyan"
          links={business.phones.map((p) => ({ label: p.display, href: `tel:${p.tel}` }))}
        />
        <Card
          icon={<Mail size={24} aria-hidden />}
          title="Email us"
          glow="accent"
          links={business.emails.map((e) => ({ label: e, href: `mailto:${e}` }))}
        />
        <Card
          icon={<MapPin size={24} aria-hidden />}
          title="Visit us"
          glow="cyan"
          links={[{ label: business.address, href: mapsHref, external: true }]}
        />
      </motion.div>
    </Section>
  );
}

type Link = { label: string; href: string; external?: boolean };

function Card({
  icon,
  title,
  links,
  glow,
}: {
  icon: React.ReactNode;
  title: string;
  links: Link[];
  glow: "cyan" | "accent";
}) {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard tilt glow={glow} className="p-7 md:p-8 h-full">
        <div 
          className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] text-white"
          style={{
            boxShadow: glow === "cyan" 
              ? "0 0 30px rgba(6, 182, 212, 0.4)" 
              : "0 0 30px rgba(79, 70, 229, 0.4)"
          }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-fg)]">{title}</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-start gap-2 text-sm md:text-base text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors leading-relaxed"
              >
                <span>{l.label}</span>
                {l.external && (
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="mt-1 shrink-0 text-[var(--color-cyan)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  );
}
