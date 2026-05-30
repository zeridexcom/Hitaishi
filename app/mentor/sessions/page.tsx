import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { SessionsClient } from "./SessionsClient";

export default function MentorSessionsPage() {
  return (
    <Shell
      role="mentor"
      active="sessions"
      pageCode="M.10 — SESSIONS"
      pageTitle="Your sessions"
      pageSubtitle="Create, join, and review live mentoring sessions."
    >
      <PrivacyNoticeBanner />
      <SessionsClient />
    </Shell>
  );
}
