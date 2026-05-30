"use client";

import { useState } from "react";

export function PrivacyNoticeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

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
        onClick={() => setDismissed(true)}
        className="font-mono uppercase tracking-wider text-[10px] hover:underline shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
