"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { business } from "@/lib/business";
import { fadeUp, viewportOnce } from "@/lib/motion";

// Bengaluru â€” Electronic City coords corrected per .md Â§3 PAGE 6.
const { lat, lng } = business.coords;
// Plain embed (no API key needed). Centred on the corrected Electronic City coords.
const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;

export function ContactMap() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-8 lg:grid-cols-12 lg:items-stretch"
        >
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-fg)] text-white p-8 md:p-10">
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Visit
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Drop by the Electronic City office
              </h2>
              <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                Walk-ins welcome during working hours, but a quick call ahead lets us pull your file before you arrive.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <span className="text-neutral-200 leading-relaxed">{business.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <span className="text-neutral-200 leading-relaxed">{business.hours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl overflow-hidden border border-[var(--color-border)] bg-neutral-200 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[360px]">
              <iframe
                title={`Map of ${business.name} â€” Electronic City, Bengaluru`}
                src={embedSrc}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
