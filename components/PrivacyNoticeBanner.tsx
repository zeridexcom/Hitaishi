"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hitaishi:privacy-banner-dismissed";

export function PrivacyNoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage may be blocked (private mode, sandboxed iframe); show banner.
    }
    setHydrated(true);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {
      // ignore; dismissal still works in-memory for this tab.
    }
  }

  if (dismissed) return null;
  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        className="bg-secondary-soft border-b border-secondary/20 px-4 md:px-6 py-2.5"
      />
    );
  }

  return (
    <div className="bg-secondary-soft border-b border-secondary/20 px-4 md:px-6 py-2.5 text-xs text-[#74240a] flex items-start justify-between gap-3">
      <p className="max-w-[800px]">
        For quality &amp; safety, sessions and chats may be monitored by admins.
        Do not share personal contact info (phone, email, bank details, social
        media) — use the in-app system. See{" "}
        <a href="/privacy" className="underline font-medium" target="_blank">
          Privacy Policy
        </a>.
      </p>
      <button
        onClick={handleDismiss}
        className="font-mono uppercase tracking-wider text-[10px] hover:underline shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
