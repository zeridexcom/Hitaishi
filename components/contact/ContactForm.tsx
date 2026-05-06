"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { GlassCard } from "@/components/effects/GlassCard";
import { contactPage } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type Status = "idle" | "submitting" | "info";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("info"), 600);
  }

  const f = contactPage.form.fields;

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-[var(--color-background-alt)]">
      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-12 lg:gap-16 lg:grid-cols-12 lg:items-start"
        >
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-cyan)]">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
              Send a message
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-fg)]">
              {contactPage.form.heading}
            </h2>
            <p className="mt-5 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed">
              {contactPage.form.subtext}
            </p>
            <ul className="mt-8 flex flex-col gap-4 text-sm text-[var(--color-fg-muted)]">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)]">
                  <CheckCircle2 size={12} aria-hidden className="text-white" />
                </span>
                Free profile review on first call
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)]">
                  <CheckCircle2 size={12} aria-hidden className="text-white" />
                </span>
                Response within one business day
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)]">
                  <CheckCircle2 size={12} aria-hidden className="text-white" />
                </span>
                No spam, no obligations
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-7">
            <GlassCard tilt={false} className="p-7 md:p-10">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                aria-label="Contact form"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label={f.name} type="text" required autoComplete="name" />
                  <Field id="email" label={f.email} type="email" required autoComplete="email" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="phone" label={f.phone} type="tel" autoComplete="tel" />
                  <Field id="subject" label={f.subject} type="text" />
                </div>
                <FieldTextarea id="message" label={f.message} required />
                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <MagneticButton
                    type="submit"
                    size="lg"
                    className="sm:w-auto"
                  >
                    {status === "submitting" ? "Sending..." : contactPage.form.cta}
                    {status !== "submitting" && <Send size={16} aria-hidden />}
                  </MagneticButton>
                  {status === "info" && (
                    <p className="text-xs text-[var(--color-cyan)]" role="status">
                      Message received! We&apos;ll get back to you within 24 hours.
                    </p>
                  )}
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

const inputBase =
  "h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] px-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] transition-all focus:border-[var(--color-cyan)] focus:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]";

function Field({
  id,
  label,
  type,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-cyan)]">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={inputBase}
      />
    </label>
  );
}

function FieldTextarea({
  id,
  label,
  required,
}: {
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-cyan)]">*</span>}
      </span>
      <textarea
        id={id}
        name={id}
        required={required}
        rows={5}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] p-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] transition-all focus:border-[var(--color-cyan)] focus:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] resize-none"
      />
    </label>
  );
}
