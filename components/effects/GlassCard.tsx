"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: "none" | "cyan" | "accent";
  as?: "div" | "article" | "figure";
};

export function GlassCard({
  children,
  className,
  tilt = true,
  glow = "none",
  as: Component = "div",
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;

    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)";
  };

  const glowClasses = {
    none: "",
    cyan: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
    accent: "hover:shadow-[0_0_30px_rgba(79,70,229,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "rounded-[20px] border border-[var(--color-border)] bg-[var(--color-background-alt)] backdrop-blur-xl shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out",
        "hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-lift)]",
        glowClasses[glow],
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
