"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { GlassCard } from "@/components/effects/GlassCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const t = useTranslations("contactPage.form");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: new FormData(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Submission failed. Please try again.");
      }
      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    }
  }

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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-fg)]">
              {t("heading")}
            </h2>
            <p className="mt-5 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed">
              {t("subtext")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-7">
            <GlassCard tilt={false} className="p-7 md:p-10">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                aria-label="Contact form"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label={t("fields.name")} type="text" required autoComplete="name" />
                  <Field id="email" label={t("fields.email")} type="email" required autoComplete="email" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="phone" label={t("fields.phone")} type="tel" autoComplete="tel" />
                  <Field id="subject" label={t("fields.subject")} type="text" />
                </div>
                <FieldTextarea id="message" label={t("fields.message")} required />
                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <MagneticButton
                    type="submit"
                    size="lg"
                    className={`sm:w-auto ${status === "submitting" ? "pointer-events-none opacity-70" : ""}`}
                  >
                    {status === "submitting" ? "Sending…" : t("cta")}
                    <Send size={16} aria-hidden className="rtl:rotate-180" />
                  </MagneticButton>
                  {status === "success" && (
                    <p className="text-sm text-[var(--color-cyan)]" role="status">
                      ✓ Thanks — we&apos;ll be in touch.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-600" role="alert">
                      {errorMsg}
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
