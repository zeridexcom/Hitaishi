# Hitaishi Platform Overhaul — Implementation Plan

*Major feature expansion for Hitaishi. May 2026.*

---

## Phase 0: Rebrand MentorIIT → Hitaishi

### Files to update
| File | Change |
|------|--------|
| `app/layout.tsx:9` | title → "Hitaishi", description → "Private mentorship & guidance for JEE/IIT aspirants" |
| `app/page.tsx:22,34` | Header logo "MentorIIT" → "Hitaishi" |
| `components/Shell.tsx:99` | Sidebar brand → "Hitaishi" |
| `middleware.ts:3` | Cookie `mentoriit_session` → `hitaishi_session` |
| `lib/session.ts:10` | `SESSION_COOKIE` constant value |
| `app/loading.tsx:20` | Loading text |
| `public/manifest.json` | name, short_name, icons |

### Logo assets
- Create `public/hitaishi-logo.svg`
- Create `public/icon-192.png`, `public/icon-512.png`
- Update manifest.json icon paths

### String search
- Global grep for `"mentoriit"` across `app/`, `lib/`, `db/`, `components/`

---

## Phase 1: Landing Page Updates

### 1a — "Why Hitaishi" Section
- Insert on `app/page.tsx` between "Mentors" and "Pricing" sections
- Combined value prop: "For Students", "For Mentors", "Why We're Different"

### 1b — Privacy Policy & Terms of Service
- Create `app/privacy/page.tsx`
- Create `app/terms/page.tsx`
- Add to `PUBLIC_EXACT` set in `middleware.ts`
- Link in footer (`app/page.tsx:230`)
- Content must include: admin monitoring disclosure, personal info prohibition, data handling

### 1c — Privacy Notice Banner
- Dismissible banner on chat & session pages (student + mentor)
- Message: "For quality & safety, sessions and chats may be monitored. Do not share personal contact info (phone, bank details) — use the in-app chat system."

---

## Phase 2: Mentor Portal — Nav & Sessions

### 2a — Shell Navigation Update
- `components/Shell.tsx:48-55` — Add `sessions` nav item for mentor
- Remove `earnings` from mentor nav array (keep route accessible)
- Update `MentorNav` type to include `"sessions"`

### 2b — Create `app/mentor/sessions/page.tsx`
- "Create Session" button → opens modal with popup
- Popup fields: title, subject, date/time, type (1:1/group), student/cohort selection
- **Privacy warning** inside popup about admin observation
- Sessions list: Upcoming (join), Live (join now), Past (recordings + feedback)

### 2c — Create `app/mentor/sessions/create/page.tsx`
- Session creation form
- Google Meet API integration to auto-generate meeting link
- Mentor is host, empty room created for them

---

## Phase 3: Google Meet Integration

### 3a — Database Schema Changes
- `db/schema/sessions.ts` — Replace `hmsRoomId` with `meetLink` (varchar, nullable)
- Add `feedbackTemplateId` column (FK to new `feedback_templates` table)

### 3b — Create `lib/meet.ts`
- Google Calendar/Meet API client
- `createMeeting(title, startTime, duration)` → returns meet link
- `lib/meet.test.ts` with tests

### 3c — Remove/Repurpose 100ms
- `lib/hms.ts` → remove or repurpose for Meet token logic
- `lib/hms.test.ts` → update or remove

### 3d — Update Session Room Page
- `app/session/[sessionId]/page.tsx` — Replace 100ms mock with Google Meet embed
- Join button with meet link
- Privacy notice banner
- Participant list from DB
- Chat sidebar

### 3e — Update Admin Observe Route
- `app/api/admin/sessions/[id]/observe/route.ts` — Return meet link instead of 100ms token

---

## Phase 4: Hidden Admin Features

### 4a — FLAGGED CONVERSATIONS
- `app/admin/sessions/page.tsx:50-63` already has mock flagged items
- Wire real DB queries: `conversations WHERE flagged = true`
- Create `app/admin/sessions/flagged/[id]/page.tsx` — review page
- Detection via `lib/content-scanner.ts` (phone, email, WhatsApp patterns)
- Actions: Dismiss flag, Warn user, Disable conversation

### 4b — RECENT RECORDINGS
- `app/admin/sessions/page.tsx:65-80` already has mock recordings
- Wire real DB queries from `recordings` table
- Create `app/admin/sessions/recording/[id]/page.tsx` — playback page
- Filters: by date, mentor, student

### 4c — Auto-Flagging
- Wire `lib/content-scanner.ts` to auto-flag conversations when personal info detected

---

## Phase 5: Feedback & MCQ System

### 5a — Database Schema (`db/schema/feedback.ts`)
```typescript
feedback_templates: id, sessionId (FK→sessions), createdBy (FK→users),
                    questions (jsonb: [{question, options[], correctIndex}]),
                    createdAt, updatedAt

session_feedback: id, sessionId (FK→sessions), studentId (FK→users),
                  answers (jsonb: [selectedIndex, ...]),
                  score (smallint), graded (boolean), createdAt
```

### 5b — Template Creation UI
- Mentor/Admin creates 7-8 MCQ questions per session
- Each: question text + 4 options + correct answer (hidden from students)
- Drag-and-drop reorder, add/remove questions

### 5c — Student Response
- After session, student sees MCQ form
- Auto-graded on submission
- Score shown to student + mentor

### 5d — Create `lib/grading.ts`
- Calculate score, percentile, trend over time
- `lib/grading.test.ts`

---

## Phase 6: Student Weekly Timetable

### 6a — Database Schema (`db/schema/timetables.ts`)
```typescript
weekly_timetables: id, studentId (FK→users), mentorId (FK→users),
                   weekStart (date),
                   entries (jsonb: [{day, startTime, endTime, subject, topic}]),
                   sentAt (timestamp), createdAt
```

### 6b — Mentor Creates & Sends Timetable
- Add timetable form in mentor portal (or integrate with Students section)
- Week starting date + entries per day (Mon-Sat)
- "Send to Student" button

### 6c — Student View (`app/student/timetable/page.tsx`)
- Grid layout (Mon-Sat columns, time rows)
- Week-by-week navigation with CSS animations
- Previous/Next week arrows
- Cards slide/transition on week change
- Mobile: stacked day cards

---

## Phase 7: WhatsApp-like Chat Enhancements

### 7a — Chat UI Overhaul (`app/student/chat/page.tsx`, `app/mentor/students/[studentId]/page.tsx`)
- Message status: Sent ✓, Delivered ✓✓, Read (blue ✓✓)
- Typing indicator (poll-based)
- Reactions (long-press/context menu)
- File sharing in-chat (images, PDF preview)
- Voice notes (browser recording API → upload)
- Message search
- Unread count badges on nav
- Timestamp grouping (Today/Yesterday/date headers)

### 7b — Backend (`lib/messages.ts`)
- Add message status tracking (sent/delivered/read fields to messages table)
- Add reactions support (jsonb column on messages)

### 7c — Privacy Banner in Chat
- Sticky banner: "Do not share personal contact info."

---

## Phase 8: Onboarding & Start Journey

### 8a — "Start Journey" CTA
- Hero section on landing page → links to `/mentor/onboarding`

### 8b — Mentor Onboarding Enhancement
- `app/mentor/onboarding/page.tsx` — Add Step 0: "Basic Details"
- Simplified first step: name, email, phone, why they want to mentor
- Progress indicator improvements

---

## Database Migrations (new files)

| File | Creates |
|------|---------|
| `db/schema/feedback.ts` | `feedback_templates`, `session_feedback` tables |
| `db/schema/timetables.ts` | `weekly_timetables` table |
| Edit `db/schema/sessions.ts` | `meetLink` column, `feedbackTemplateId` column |
| Edit `db/schema/mentorship.ts` | Add `reactions` jsonb, status fields to `messages` |
| Edit `db/schema/index.ts` | Export new schema files |
| Run `npm run db:generate && npm run db:migrate` | Apply migrations |

## New Library Modules

| File | Purpose |
|------|---------|
| `lib/meet.ts` | Google Meet API client |
| `lib/grading.ts` | MCQ scoring + analytics |
| Edit `lib/messages.ts` | Message status, reactions |
| Wire `lib/content-scanner.ts` | Auto-flag conversations |

## New Pages

| Route | Purpose |
|-------|---------|
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/mentor/sessions` | Mentor session list + create |
| `/mentor/sessions/create` | Session creation form |
| `/admin/sessions/flagged/[id]` | Flag review |
| `/admin/sessions/recording/[id]` | Recording playback |
| `/student/timetable` | Weekly timetable with animation |

## Verification

After each phase:
1. `npm run typecheck` — no TypeScript errors
2. `npm run lint` — no lint errors
3. `npm test` — all 200+ tests pass (+ new tests)
4. `npm run build` — successful build
