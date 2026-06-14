# Hitaishi — Progress Tracker

## ✅ Completed

### Phase 0 — Rebrand
- Rebranded ~25 files from Hitachi → Hitaishi
- All logo, name, favicon references updated

### Phase 1a — "Why Hitaishi" Landing Section
- Landing page value proposition section

### Phase 1b — Legal Pages
- `/privacy` page
- `/terms` page

### Phase 1c — Privacy Notice Banner
- `PrivacyNoticeBanner` component

### Phase 2a — Shell Navigation
- Sessions nav item added
- Earnings nav item hidden

### Phase 2b — Mentor Sessions Page
- `/mentor/sessions` page
- `SessionsClient` component with list + create modal

### Phase 3a — DB Schema & Migration
- `hms_room_id` → `meet_link` (varchar 512)
- `feedback_template_id` → `feedback_templates` table
- Migration `0002_thankful_veda.sql` (drops `hms_100` from enum)

### Phase 3b — Jitsi Meet Library
- `lib/meet.ts` — generates `https://meet.jit.si/hitaishi-{8-hex}` URLs
- `lib/meet.test.ts` — 3 tests

### Phase 3c — HMS & Google Calendar Cleanup
- `lib/hms.ts` deleted
- `lib/hms.test.ts` deleted
- Google Calendar env vars removed from `lib/env.ts`, `lib/env.test.ts`, `.env`, `.env.example`
- `googleapis` removed from `package.json`
- Admin settings/dashboard/sessions pages cleaned

### Phase 3d — Session Room Page
- `app/session/[sessionId]/page.tsx`
- `SessionRoomClient.tsx` — Jitsi iframe embed, join, participants, chat sidebar, privacy banner

### Phase 3e — Create Session API
- `app/api/mentor/sessions/create/route.ts` — auth mentor, calls `createMeeting()`, inserts DB row

### Login Flow Fixes
- Demo buttons removed; `student@demo.hitaishi.app` / `demo1234` in normal form
- Password visibility toggle (eye/eye-off SVG)
- Demo API route created

### Inline Form Validation
- Title, date, time validated on blur + submit
- Red border + error text on invalid fields
- No loading state on submit button
- `useRef` prevents double-clicks

### Redirect Pages
- `/mentor`, `/student`, `/admin` redirect pages (38 pages total)

### DB Seed
- 3 demo users seeded in Supabase

### Git
- Pushed to `origin` (nandhuitarang-ops/hitaishi) + `target` (zeridexcom/Hitaishi)

---

## 🔜 Next Phases

### Phase 3f — Recreate opencode.jsonc
- Restore `C:\Users\UR.PXL\.config\opencode\opencode.jsonc` with Browser MCP entry + all agent definitions

### Phase 4 — Hidden Admin Features
- Wire flagged conversations and recordings to real DB queries

### Phase 5 — Feedback & MCQ System
- DB schema
- Template creation UI
- Student response collection
- Grading logic

### Phase 6 — Student Weekly Timetable
- DB schema
- Mentor create/send
- Student animated view

### Phase 7 — WhatsApp-like Chat
- Message status
- Reactions
- File sharing
- Voice notes

### Phase 8 — Onboarding & Start Journey
- Enhanced mentor onboarding flow

---

## Key Context

| Item | Value |
|------|-------|
| DB | Supabase Postgres |
| Demo users | `student@demo.hitaishi.app`, `mentor@demo.hitaishi.app`, `admin@demo.hitaishi.app` — password `demo1234` |
| Jitsi URL | `https://meet.jit.si/hitaishi-{8-hex-chars}` |
| Session cookie | `hitaishi_session` |
| Tests | 176 passing |
| Pages | 38 deployed |
| Remotes | `origin` → nandhuitarang-ops/hitaishi, `target` → zeridexcom/Hitaishi |
