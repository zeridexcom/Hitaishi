"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<MotionProps, "variants" | "initial" | "whileInView" | "viewport">;

export function FadeIn({ children, delay = 0, className, ...rest }: Props) {
  return (
    <motion.div
      {...rest}
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
