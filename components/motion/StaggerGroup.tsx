"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { stagger, viewportOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
} & Omit<MotionProps, "variants" | "initial" | "whileInView" | "viewport">;

export function StaggerGroup({ children, className, ...rest }: Props) {
  return (
    <motion.div
      {...rest}
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}
