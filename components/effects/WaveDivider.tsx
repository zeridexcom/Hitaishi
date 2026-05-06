"use client";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  flip?: boolean;
  color?: string;
};

export function WaveDivider({ 
  className, 
  flip = false,
  color = "var(--color-background-alt)"
}: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-0 right-0 h-20 md:h-32 overflow-hidden",
        flip ? "top-0 rotate-180" : "bottom-0",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill={color}
        />
        <path
          d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 94 960 98 1080 100C1200 102 1320 102 1380 102L1440 102V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill={color}
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
}
