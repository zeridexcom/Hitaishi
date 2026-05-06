"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { faq } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      eyebrow="FAQ"
      title={faq.heading}
      subtitle="Quick answers to the things people ask us most. Anything we didn't cover? Get in touch."
      alt
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-3xl"
      >
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-alt)] backdrop-blur-sm overflow-hidden">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div 
                key={item.q} 
                variants={fadeUp}
                className={cn(
                  "border-b border-[var(--color-border)] last:border-b-0",
                  isOpen && "bg-[var(--color-background-alt)]"
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 md:py-6 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span 
                      className={cn(
                        "shrink-0 inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300",
                        isOpen 
                          ? "bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cyan)] shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                          : "bg-[var(--color-background-alt)] border border-[var(--color-border)] group-hover:border-[var(--color-cyan)]"
                      )}
                    >
                      <HelpCircle 
                        size={18} 
                        aria-hidden 
                        className={cn(
                          "transition-colors",
                          isOpen ? "text-[var(--color-fg)]" : "text-[var(--color-cyan)]"
                        )}
                      />
                    </span>
                    <span className={cn(
                      "text-base md:text-lg font-medium transition-colors",
                      isOpen ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]"
                    )}>
                      {item.q}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex size-10 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] border-transparent"
                        : "bg-transparent border-[var(--color-border)] group-hover:border-[var(--color-cyan)]",
                    )}
                  >
                    <ChevronDown
                      size={18}
                      aria-hidden
                      className={cn(
                        "transition-transform duration-300 text-[var(--color-fg)]",
                        isOpen ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 pl-20 md:pl-[88px] text-base text-[var(--color-fg-muted)] leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
