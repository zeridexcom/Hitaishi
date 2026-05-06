"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  fade?: boolean;
  className?: string;
  trackClassName?: string;
};

export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  className,
  trackClassName,
}: Props) {
  const animation = direction === "left" ? "marquee-left" : "marquee-right";
  return (
    <div
      className={cn(
        "marquee relative w-full overflow-hidden",
        fade && "marquee-fade",
        pauseOnHover && "marquee-hover-pause",
        className,
      )}
    >
      <div
        className={cn("flex w-max items-center gap-12 will-change-transform", trackClassName)}
        style={{ animation: `${animation} ${speed}s linear infinite` }}
        aria-hidden="false"
      >
        {children}
        <div className="flex items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
