"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

const navItems = [
  { key: "home", href: "/" },
  { key: "coaching", href: "/coaching" },
  { key: "visa", href: "/visa" },
  { key: "about", href: "/about" },
  { key: "country", href: "/country" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("nav");

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
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50",
          "w-[calc(100%-1.5rem)] md:w-auto",
        )}
      >
        <div
          className={cn(
            "relative mx-auto overflow-hidden rounded-full border backdrop-blur-xl transition-all duration-500 ease-out",
            "border-[var(--color-border)]",
            scrolled
              ? "bg-white/85 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.25)] ring-1 ring-white/60"
              : "bg-white/70 shadow-[var(--shadow-lift)]",
          )}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
            style={{
              background:
                "linear-gradient(115deg, var(--color-cyan-glow) 0%, transparent 35%, transparent 65%, var(--color-accent-glow) 100%)",
              backgroundSize: "220% 220%",
            }}
            animate={
              reduceMotion
                ? undefined
                : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
            }
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)]/40 to-transparent"
          />

          <div className="relative flex h-14 md:h-16 items-center justify-between gap-4 md:gap-6 px-4 md:px-6">
            <Link
              href="/"
              className="flex items-center"
              aria-label={`${business.name} home`}
            >
              <motion.span
                className="relative block w-36 md:w-48 h-12 md:h-14 overflow-hidden"
                animate={reduceMotion ? undefined : { y: [0, -1.5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="/images/logo.png"
                  alt={business.name}
                  className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                />
              </motion.span>
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main"
              onMouseLeave={() => setHovered(null)}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  className="relative px-4 py-2 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
                >
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-blob"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--color-cyan-glow)]"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -6px var(--color-cyan-glow)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{t(item.key)}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 md:gap-4">
              <LanguageSwitcher />
              <MagneticButton href="/contact" size="sm" glow>
                {t("bookAppointment")}
              </MagneticButton>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] bg-white/60 hover:bg-white transition-colors"
            >
              <Menu size={18} aria-hidden className="text-[var(--color-fg)]" />
            </button>
          </div>
        </div>
      </motion.header>

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
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--color-background)] border-l border-[var(--color-border)] flex flex-col rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)]">
                <span className="relative block w-36 h-12 overflow-hidden">
                  <img
                    src="/images/logo.png"
                    alt={business.name}
                    className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                  />
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

              <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1" aria-label="Mobile">
                {navItems.map((item, i) => (
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
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-6 border-t border-[var(--color-border)] flex flex-col gap-4">
                <LanguageSwitcher onSelect={() => setOpen(false)} />
                <MagneticButton
                  href="/contact"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {t("bookAppointment")}
                </MagneticButton>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
