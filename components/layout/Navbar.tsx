"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { nav } from "@/lib/content";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[rgba(10,15,46,0.85)] backdrop-blur-xl border-b border-[var(--color-border)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <Container>
          <div className="flex h-16 md:h-20 items-center justify-between gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-fg)] group"
              aria-label={`${business.name} home`}
            >
              {business.name}
              <span className="text-[var(--color-cyan)] group-hover:text-[var(--color-accent)] transition-colors">.</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-200 rounded-full group"
                >
                  {item.label}
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={`tel:${business.phones[0].tel}`}
                className="hidden xl:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                <Phone size={16} aria-hidden className="text-[var(--color-cyan)]" />
                {business.phones[0].display}
              </a>
              <MagneticButton href="/contact" size="sm" glow>
                Book Appointment
              </MagneticButton>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-background-alt)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <Menu size={20} aria-hidden className="text-[var(--color-fg)]" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--color-background)] border-l border-[var(--color-border)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)]">
                <span className="text-lg font-bold text-[var(--color-fg)]">
                  {business.name}
                  <span className="text-[var(--color-cyan)]">.</span>
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-background-alt)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <X size={20} aria-hidden className="text-[var(--color-fg)]" />
                </button>
              </div>

              {/* Mobile navigation */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1" aria-label="Mobile">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-4 text-base font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] rounded-xl hover:bg-[var(--color-background-alt)] transition-all"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile footer */}
              <div className="p-6 border-t border-[var(--color-border)] flex flex-col gap-4">
                <a
                  href={`tel:${business.phones[0].tel}`}
                  className="inline-flex items-center gap-3 text-sm font-medium text-[var(--color-fg-muted)]"
                >
                  <Phone size={16} aria-hidden className="text-[var(--color-cyan)]" />
                  {business.phones[0].display}
                </a>
                <MagneticButton href="/contact" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Book Appointment
                </MagneticButton>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
