"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { business } from "@/lib/business";

const TOTAL_DURATION_MS = 3600;

export function LogoIntro() {
  const [show, setShow] = useState(true);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("intro");

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(
      () => {
        setShow(false);
        document.body.style.overflow = "";
      },
      reduceMotion ? 800 : TOTAL_DURATION_MS,
    );
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="logo-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-lg"
          >
            <img
              src="/images/logo.png"
              alt={business.name}
              className="block w-[min(80vw,500px)] h-auto"
            />
            {!reduceMotion && (
              <motion.span
                aria-hidden
                initial={{ left: "-150%" }}
                animate={{ left: "200%" }}
                transition={{ duration: 2, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="pointer-events-none absolute top-0 h-full w-1/2 -skew-x-[25deg]"
                style={{
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-sm md:text-base font-light tracking-[0.3em] text-[var(--color-fg-muted)] uppercase"
          >
            {t("tagline")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
