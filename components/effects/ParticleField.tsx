"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  count?: number;
  color?: "cyan" | "white" | "mixed";
};

export function ParticleField({ className, count = 30, color = "mixed" }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -20;
      
      let particleColor: string;
      if (color === "cyan") {
        particleColor = "rgba(14, 116, 144, 0.4)";
      } else if (color === "white") {
        particleColor = "rgba(15, 23, 42, 0.18)";
      } else {
        particleColor = i % 3 === 0
          ? "rgba(14, 116, 144, 0.35)"
          : i % 3 === 1
            ? "rgba(67, 56, 202, 0.28)"
            : "rgba(15, 23, 42, 0.16)";
      }

      return {
        id: i,
        size,
        x,
        y,
        duration,
        delay,
        color: particleColor,
      };
    });
  }, [count, color]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {mounted && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `particle-float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
