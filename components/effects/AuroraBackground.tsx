"use client";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  intensity?: "low" | "medium" | "high";
};

export function AuroraBackground({ className, intensity = "medium" }: Props) {
  const opacityMap = {
    low: "opacity-[0.12]",
    medium: "opacity-20",
    high: "opacity-30",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Primary indigo blob */}
      <div
        className={cn(
          "absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full blur-[120px]",
          opacityMap[intensity]
        )}
        style={{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, transparent 70%)",
          animation: "aurora 20s ease-in-out infinite",
        }}
      />
      
      {/* Secondary cyan blob */}
      <div
        className={cn(
          "absolute -top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full blur-[100px]",
          opacityMap[intensity]
        )}
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)",
          animation: "aurora-slow 25s ease-in-out infinite reverse",
        }}
      />
      
      {/* Tertiary purple blob */}
      <div
        className={cn(
          "absolute top-1/2 left-1/3 h-[400px] w-[400px] rounded-full blur-[80px]",
          opacityMap[intensity]
        )}
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          animation: "aurora 30s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />

      {/* Bottom accent glow */}
      <div
        className={cn(
          "absolute -bottom-1/4 left-1/4 h-[500px] w-[700px] rounded-full blur-[100px]",
          opacityMap[intensity]
        )}
        style={{
          background: "radial-gradient(ellipse, rgba(79, 70, 229, 0.3) 0%, transparent 60%)",
          animation: "aurora-slow 22s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />
    </div>
  );
}
