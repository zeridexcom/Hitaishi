"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { GlassCard } from "@/components/effects/GlassCard";
import { FadeIn } from "@/components/motion/FadeIn";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "info">("idle");
  const t = useTranslations("newsletter");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("info");
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[var(--color-background)]">
      {/* Aurora background */}
      <AuroraBackground intensity="medium" />
      
      <Container className="relative z-10">
        <FadeIn>
          <GlassCard tilt={false} className="p-8 md:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              {/* Left content */}
              <div className="max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--color-cyan)]">
                  <Mail size={14} aria-hidden />
                  Newsletter
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-fg)] leading-tight">
                  {t("heading")}
                </h2>
              </div>

              {/* Right form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                aria-label="Subscribe to newsletter"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {t("placeholder")}
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    className="flex-1 h-14 rounded-full bg-[var(--color-background-alt)] border border-[var(--color-border)] px-6 text-base text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:bg-[var(--color-surface-hover)] focus:border-[var(--color-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] transition-all"
                  />
                  <MagneticButton type="submit" size="lg" className="sm:w-auto">
                    <Send size={18} aria-hidden />
                    {t("cta")}
                  </MagneticButton>
                </div>
                
                {status === "info" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[var(--color-cyan)] bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] rounded-lg px-4 py-3"
                    role="status"
                  >
                    {email}
                  </motion.p>
                )}
              </form>
            </div>
          </GlassCard>
        </FadeIn>
      </Container>
    </section>
  );
}
