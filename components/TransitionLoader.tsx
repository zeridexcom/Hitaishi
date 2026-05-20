"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hide loader when the page pathname or search parameters change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        // Only show loader for internal links that don't open in a new tab
        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("/#") &&
          targetAttr !== "_blank" &&
          !anchor.hasAttribute("download")
        ) {
          const currentUrl = window.location.pathname + window.location.search;
          if (href !== currentUrl) {
            setIsLoading(true);
          }
        }
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      // Show loader on form submission (login, demo login, etc.)
      if (form.getAttribute("target") !== "_blank") {
        setIsLoading(true);
      }
    };

    // Backup click listener for submit buttons, just in case React intercepts submit events
    const handleSubmitButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("button, input[type='submit']");
      if (button) {
        const type = button.getAttribute("type");
        const form = button.closest("form");
        if (form && type === "submit" && form.getAttribute("target") !== "_blank") {
          setIsLoading(true);
        }
      }
    };

    const handlePopState = () => {
      // Show loader for back/forward navigation
      setIsLoading(true);
    };

    document.addEventListener("click", handleLinkClick);
    document.addEventListener("click", handleSubmitButtonClick);
    document.addEventListener("submit", handleFormSubmit);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("click", handleSubmitButtonClick);
      document.removeEventListener("submit", handleFormSubmit);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Safety timeout: hide loader after 8 seconds if no navigation completed
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Double-ring Premium Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-soft/60"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/40 border-b-transparent border-l-transparent animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-secondary border-r-transparent border-b-secondary/40 border-l-transparent animate-spin-reverse-slow"></div>
        </div>

        {/* Elegant Logo / Loading Text */}
        <div className="text-center">
          <h2 className="font-serif italic text-3xl font-medium text-primary-deep tracking-wide animate-pulse">
            MentorIIT
          </h2>
          <p className="font-mono text-[10px] text-ink-faint tracking-widest uppercase mt-2">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
