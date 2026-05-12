"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const labels: Record<
  Locale,
  { native: string; english: string; flag: string }
> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  ar: { native: "العربية", english: "Arabic", flag: "🇸🇦" },
  bn: { native: "বাংলা", english: "Bangla", flag: "🇧🇩" },
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LanguageSwitcher({ onSelect }: { onSelect?: () => void }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => setMounted(true), []);

  useIsoLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + 8,
      right: window.innerWidth - r.right,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScrollOrResize = () => {
      if (!buttonRef.current) return;
      const r = buttonRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  const change = (next: Locale) => {
    setOpen(false);
    onSelect?.();
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  const current = labels[locale];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 h-10 px-3.5 rounded-full border text-sm font-medium transition-all",
          open
            ? "border-[var(--color-cyan)] bg-white text-[var(--color-fg)] shadow-[0_0_0_3px_var(--color-cyan-glow)]"
            : "border-[var(--color-border)] bg-white/70 text-[var(--color-fg-muted)] hover:bg-white hover:text-[var(--color-fg)] hover:border-[var(--color-border-hover)]",
        )}
      >
        <Globe size={15} aria-hidden className="text-[var(--color-cyan)]" />
        <span className="hidden sm:inline">{current.native}</span>
        <span className="sm:hidden text-xs uppercase tracking-wider font-semibold">
          {locale}
        </span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn(
            "transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.ul
                ref={menuRef}
                role="listbox"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "fixed",
                  top: pos.top,
                  right: pos.right,
                  zIndex: 9999,
                }}
                className="w-64 rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_18px_40px_-12px_rgba(15,23,42,0.25)] p-1.5 origin-top-right"
              >
                <li className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Select language
                </li>
                {routing.locales.map((loc) => {
                  const isActive = loc === locale;
                  const data = labels[loc as Locale];
                  return (
                    <li key={loc}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => change(loc as Locale)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                          isActive
                            ? "bg-[var(--color-cyan-glow)] text-[var(--color-fg)]"
                            : "text-[var(--color-fg-muted)] hover:bg-[var(--color-background-alt)] hover:text-[var(--color-fg)]",
                        )}
                      >
                        <span
                          aria-hidden
                          className="text-xl leading-none shrink-0"
                          style={{
                            fontFamily:
                              "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
                          }}
                        >
                          {data.flag}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium leading-tight">
                            {data.native}
                          </span>
                          <span className="block text-[11px] text-[var(--color-fg-subtle)] leading-tight mt-0.5">
                            {data.english}
                          </span>
                        </span>
                        {isActive && (
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-cyan)]">
                            <Check
                              size={12}
                              aria-hidden
                              className="text-white"
                              strokeWidth={3}
                            />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
