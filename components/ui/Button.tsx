import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const base =
  "magnetic-btn group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[var(--color-accent)] to-[#6366f1] text-white border border-[var(--color-border)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]",
  secondary:
    "bg-[var(--color-surface-hover)] text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)]",
  ghost:
    "bg-transparent text-[var(--color-fg)] border border-[var(--color-border-hover)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-background-alt)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button {...rest} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link {...rest} href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
