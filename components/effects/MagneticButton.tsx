"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
};

type ButtonProps = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type LinkProps = CommonProps & {
  href: string;
  onClick?: () => void;
  type?: never;
};

type Props = ButtonProps | LinkProps;

const baseStyles =
  "magnetic-btn group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out cursor-pointer select-none overflow-hidden";

const variants = {
  primary:
    "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white border border-[var(--color-border)]",
  secondary:
    "bg-[var(--color-surface-hover)] text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]",
  ghost:
    "bg-transparent text-[var(--color-fg)] border border-[var(--color-border-hover)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-alt)]",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  glow = true,
  href,
  onClick,
  type = "button",
}: Props) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current || !contentRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    contentRef.current.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  };

  const handleMouseLeave = () => {
    if (!contentRef.current) return;
    contentRef.current.style.transform = "translate(0px, 0px)";
  };

  const glowStyles = glow
    ? "hover:shadow-[0_0_30px_rgba(79,70,229,0.5),0_0_60px_rgba(79,70,229,0.3)]"
    : "";

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    glowStyles,
    "ripple",
    className
  );

  const content = (
    <span
      ref={contentRef}
      className="relative z-10 inline-flex items-center gap-2 transition-transform duration-200"
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <Link
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={combinedClassName}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}
