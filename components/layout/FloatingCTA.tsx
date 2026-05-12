"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

export function FloatingCTA() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const t = useTranslations("nav");

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > 600);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-6 z-40 md:bottom-28 md:right-8"
        >
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#6366f1] px-5 py-3 md:px-6 md:py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(67,56,202,0.35)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(67,56,202,0.5)] hover:-translate-y-0.5"
            aria-label={t("bookAppointment")}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-60 animate-[fab-pulse_2.4s_ease-out_infinite]"
            />
            <Calendar size={16} aria-hidden className="relative z-10" />
            <span className="relative z-10 hidden sm:inline">{t("bookAppointment")}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
