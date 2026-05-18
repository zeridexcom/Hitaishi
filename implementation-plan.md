# Implementation Plan: MentorIIT Platform (v1)

**Source:** `system design hitachi.md`
**Created:** 2026-05-18
**Scope:** v1 only (skip v2/v3 from §10)

---

## Requirements Restatement

Build a closed, paid coaching platform with **three role-based portals** (Student, Mentor, Admin) on a single Next.js 15 monolith backed by PostgreSQL, with Razorpay payments → automated access provisioning, Pusher-compatible real-time chat (Soketi), 100ms video, R2 file storage, and WhatsApp OTP auth — all deployed to one Hostinger VPS.

## Current State

Repo is empty except for `system design hitachi.md`. No code, no `package.json`, no git. Greenfield build.

## Risks & Open Questions

| Risk | Severity | Notes |
|---|---|---|
| MSG91 WhatsApp Business API onboarding | HIGH | Template approval takes days; blocks login. **Mitigation:** start with email magic-link (Brevo, §09), swap to MSG91 once approved. |
| Razorpay Routes mentor onboarding (PAN, bank, KYC) | HIGH | Required before any payout flow works. Begin paperwork on day 1. |
| 100ms account + recording webhook + admin spectator mode | MEDIUM | Spectator mode requires correct role tokens; test early. |
| Single-VPS blast radius (Postgres + app + Soketi + Redis) | MEDIUM | Acceptable for v1; daily R2 backups + UptimeRobot. |
| Legal disclosure for admin chat/session oversight | MEDIUM | Must land in TOS before launch — non-engineering blocker. |
| Mentor matching algorithm undefined | LOW | Doc says "round-robin or admin-curated" — default to **admin-curated** for v1. |

## Stack Confirmation

Next.js 15 App Router · React 19 · TypeScript · Tailwind + shadcn/ui · Drizzle + Postgres 16 · NextAuth v5 · Soketi · 100ms · Cloudflare R2 · BullMQ + Redis · Razorpay · MSG91 · Resend · Sentry + PostHog · PM2 + Caddy on Hostinger KVM 2.

---

## Phases

### Phase 0 — Foundation (3–4 days)
- `git init`, scaffold Next.js 15 + TS + Tailwind + shadcn/ui
- ESLint, Prettier, Husky, conventional commits, `.env.example`
- Folder layout: `app/(student)`, `app/(mentor)`, `app/(admin)`, `app/(public)`, `lib/`, `db/`, `workers/`
- Drizzle config, Postgres locally via Docker Compose (Postgres + Redis)
- Sentry + PostHog SDK wired (no-op in dev)
- CI: GitHub Actions for lint + typecheck + test

### Phase 1 — Database & Auth (4–5 days)
- Drizzle migrations for **all 24 tables** across 7 domains (D.01–D.07)
- Seed script: plans, one admin, two test mentors, two students
- NextAuth v5 with email magic-link provider (Brevo SMTP) — **WhatsApp OTP swap is Phase 9**
- `auth_sessions` persisted in Postgres
- **Role-based middleware** (`middleware.ts`) — redirects `/student/*` → student role, etc., 403 otherwise
- Unit tests for role guard

### Phase 2 — Payments & Provisioning (4–5 days)
- Razorpay test-mode integration
- `S.01` landing page + inline Razorpay checkout
- `/api/webhooks/razorpay` — verify signature, idempotent insert into `webhook_events`
- BullMQ job `provision-student-access`: create user, subscription, assign mentor (admin-curated → fallback round-robin), send welcome email
- Refund flow (admin-initiated) — atomic revoke of subscription
- Integration tests (mock Razorpay webhook payloads)

### Phase 3 — Chat (Soketi + Messages) (4 days)
- Soketi container in local Docker Compose; Pusher SDK wired
- `conversations`, `conversation_participants`, `messages` server actions
- File attachments → R2 (signed PUT/GET URLs)
- Presence channel for online status; **no read receipts** (per UX choice)
- Naive content scanner job: flags phone numbers / "meet outside" patterns → sets `conversations.flagged`

### Phase 4 — Student Portal (5–6 days)
Pages S.02 → S.06:
- `S.02` Dashboard — mentor card, upcoming sessions, recent resources
- `S.03` Mentor Chat — wire to Phase 3
- `S.04` Sessions list (read-only join button; video integrated in Phase 6)
- `S.05` Resources Library — subject pills, search, signed R2 downloads
- `S.06` Profile & Plan — plan expiry, subject focus tags
- Mobile-first responsive pass on real devices

### Phase 5 — Mentor Portal (5–6 days)
Pages M.01 → M.06:
- `M.01` Dashboard — triage ranking (unread + last reply + score drop) computed server-side
- `M.02` My Students — dense table, derived engagement metric
- `M.03` Student Conversation — chat + side panel (notes, history, resources)
- `M.04` Calendar & Availability — admin-curated mode for v1
- `M.05` Resources upload + scope (private / per-student / cohort / platform-with-approval)
- `M.06` Earnings (read-only ledger from `payouts`)

### Phase 6 — Video Sessions (100ms) (4 days)
- 100ms account + room template
- `sessions` CRUD + invite participants
- Token-issuance API per role (host / participant / observer)
- "Join" button opens 100ms web SDK in route
- Recording webhook → R2 → `recordings` row → `processing_status` transitions
- Reminder job: BullMQ scheduled 15min before `scheduled_at` (email v1, SMS later)

### Phase 7 — Admin Portal (5–6 days)
Pages A.01 → A.06:
- `A.01` Master Dashboard — Redis-cached aggregates, 30s refresh
- `A.02` Students Management — search, filter, full detail page, manual add
- `A.03` Mentor Verification — document viewer modal, approve/reject → triggers activation email
- `A.04` Session Monitor — live sessions, "Watch silently" (observer token), flagged queue
- `A.05` Payments & Access — failed webhook retry, manual provision, refund
- `A.06` Analytics — 2 charts (revenue, retention) + mentor performance

### Phase 8 — Doubts (1 day, lean v1)
- `doubts` + `doubt_answers` minimal flow: student posts → assigned mentor sees in chat thread
- Skip the top-scorer claim/payout for v1 (spec line: mentors own doubts in v1)

### Phase 9 — Production Hardening (3–4 days)
- Swap email magic-link → MSG91 WhatsApp OTP (once templates approved)
- PWA via `next-pwa` — manifest, service worker, offline cache for last 10 messages + PDFs
- Audit log writes for every admin action
- Resend transactional email templates (React Email): receipt, welcome, session reminder, weekly digest
- Sentry alerts, PostHog funnel events on key conversion points
- Razorpay → live mode

### Phase 10 — Deploy (2–3 days)
Per §08 checklist:
- Provision Hostinger KVM 2 (Mumbai), Ubuntu 24.04, SSH hardening
- Install Node 20 / Postgres 16 / Redis 7 / Docker
- Cloudflare DNS + Caddy + Let's Encrypt for `mentoriit.com` and `realtime.mentoriit.com`
- GitHub Actions deploy: SSH → pull → migrate → `pm2 reload` → healthcheck gate
- `pg_dump` → R2 cron @ 03:00 IST, 30-day retention
- UptimeRobot on `/api/health`
- Practice DR restore once

### Phase 11 — Pilot & Launch (ongoing)
- 10 friendly/comp students, 2 mentors
- Bug bash, fix, then enable paid signups

---

## File / Module Layout (preview)

```
app/(public)/page.tsx                   # S.01 landing
app/(student)/dashboard|chat|sessions|resources|profile
app/(mentor)/dashboard|students|chat/[id]|calendar|resources|earnings
app/(admin)/dashboard|students|mentors|sessions|payments|analytics
app/api/webhooks/{razorpay,100ms,msg91,resend}/route.ts
db/schema/{identity,payments,mentorship,sessions,doubts,resources,system}.ts
lib/{auth,rbac,razorpay,hms,pusher,r2,queue,scanner}.ts
workers/{provision,reminders,payouts,scanner}.ts
```

## Estimated Complexity: **HIGH**

~7–9 weeks for one engineer; 3–4 weeks with 2–3 engineers + iTarang reuse. Matches the doc's "3–4 months for v1" target with buffer for external-service onboarding.

---

## Acceptance

- [ ] All 11 phases complete
- [ ] All 18 portal pages (S.01–S.06, M.01–M.06, A.01–A.06) live
- [ ] All 24 DB tables migrated
- [ ] Razorpay live, mentor payouts working
- [ ] Daily backup + DR drill verified
- [ ] 10 pilot students onboarded end-to-end
