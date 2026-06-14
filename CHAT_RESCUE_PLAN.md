# Hitaishi Chat Rescue — Multi-Agent Execution Plan

**Date:** 2026-06-08
**Project:** `G:\iit\hitaishi`
**Stack:** Next.js 14.2.18 + Drizzle ORM + Supabase Postgres + Supabase Realtime
**Author:** Orchestrator agent via `task-distributor`

---

## Pre-Flight Status (Verified)

| Check | Result |
|-------|--------|
| DB reachable (transaction pooler :6543) | ✅ PASS |
| DB reachable (session pooler :5432) | ✅ PASS |
| `mentor@demo.hitaishi.app` exists | ✅ role=mentor |
| `student@demo.hitaishi.app` exists | ✅ role=student |
| `messages` table exists | ✅ PASS |
| `conversations` table exists | ✅ PASS |
| `conversation_participants` table exists | ✅ PASS |
| `supabase_realtime` publication has `messages` | ✅ ALREADY DONE |
| `supabase_realtime` publication has `conversations` | ✅ ALREADY DONE |
| RLS enabled on `messages` | ✅ PASS |
| RLS enabled on `conversations` | ✅ PASS |
| RLS enabled on `conversation_participants` | ✅ PASS |
| **RLS policies on any chat table** | **❌ EMPTY — THE BLOCKER** |

**Conclusion:** Phase 1A (Enable Realtime Publication) is already done. Only **Phase 1B (RLS Policies)** is needed for the DB layer. Then Phase 2 (API verify) + Phase 3 (UI verify) are audits only.

---

## Architecture Overview

```
task-distributor (queue master)
│
├── Phase 1: DB Layer ──────────────────────────────────────
│   ├── 1.1 database-administrator → execute RLS script
│   ├── 1.2 security-auditor → audit the RLS output
│   ├── 1.3 security-engineer → fix any findings
│   ├── 1.4 security-auditor → re-verify sign-off
│   └── 1.5 debugger → (only if 1.4 fails ≥2×)
│
├── Phase 2: Backend API ───────────────────────────────────
│   ├── 2.1 backend-developer → audit 3 API routes
│   ├── 2.2 security-auditor → audit for vulnerabilities
│   ├── 2.3 security-engineer → fix findings
│   └── 2.4 security-auditor → re-verify sign-off
│
├── Phase 3: Frontend UI ───────────────────────────────────
│   ├── 3.1 frontend-design → audit SessionRoomClient
│   ├── 3.2 security-auditor → audit for XSS/secrets
│   ├── 3.3 security-engineer → fix findings
│   └── 3.4 security-auditor → re-verify sign-off
│
├── Phase 4: Integration Tests ─────────────────────────────
│   ├── 4.1 ui-ux-tester → UX audit
│   ├── 4.2 webapp-testing → Playwright automated 2-browser test
│   ├── 4.3 security-auditor → final security pass
│   └── 4.4 debugger → (only if any test fails ≥2×)
│
└── Phase 5: Deploy Gate ───────────────────────────────────
    └── 5.1 devops-engineer → build check + deploy readiness
```

---

## Context Hygiene Policy

**RULE: Every agent dispatch is 100% self-contained.**

Each agent receives:
1. Exact file paths + line numbers to read/modify
2. Exact CLI commands to run (copy-paste ready)
3. Exact return format (structured, max 20 lines)
4. A unique `task_id` — NO reference to previous agent state

Each agent returns:
- `STATUS: PASS | PASS-WITH-FIXES | FAIL`
- `FINDINGS:` max 5 bullet points
- `FILES TOUCHED:` path:line
- `OUTPUT:` truncated to 20 lines

The dispatcher (`task-distributor`) stores only:
- Phase name + STATUS (1 line)
- Next action (e.g. "dispatch security-auditor for phase 1.1")

**No sub-agent conversation history is ever retained.**
**Main agent context stays under 60 lines throughout.**

---

## Phase 1 — DB Layer (RLS Policies)

### Step 1.1 — Execute (`database-administrator`)

**Prompt:**

```
Task: Add RLS policies to enable Supabase Realtime subscriptions on the messages table.

Context:
- Project: G:\iit\hitaishi
- DB connection: session pooler at port 5432 (replaces :6543 with :5432 in DIRECT_URL)
- all 3 chat tables exist: messages, conversations, conversation_participants
- supabase_realtime publication already has messages + conversations (confirmed)
- RLS is ENABLED on all 3 tables but ZERO policies exist — this is the blocker

Execute:
1. Read the existing script: scripts/add-chat-rls.ts — if it exists, read its contents.
   If it doesn't exist, read db/schema/mentorship.ts lines 49-93 to understand the schema.

2. Create/update the file: scripts/add-chat-rls.ts with this EXACT content:

```typescript
import postgres from "postgres";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL or DIRECT_URL required"); process.exit(1); }

// Session pooler on port 5432 for DDL (ALTER PUBLICATION, CREATE POLICY)
const sessionUrl = url.replace(":6543/", ":5432/");
const sql = postgres(sessionUrl, { max: 1, ssl: "require", prepare: false, onnotice: () => {} });

async function main() {
  console.log("→ Enabling RLS on messages table (already enabled, idempotent)...");
  await sql`ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;`;
  console.log("✓ RLS enabled on messages");

  console.log("→ Creating SELECT policy for messages (Realtime subscription needs this)...");
  await sql`
    CREATE POLICY "Users can read messages in their conversations"
    ON public.messages FOR SELECT
    USING (
      auth.role() = 'service_role'
      OR
      EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = messages.conversation_id
        AND cp.user_id = auth.uid()
      )
    );
  `;
  console.log("✓ messages SELECT policy created");

  console.log("→ Creating INSERT policy for messages (defense in depth)...");
  await sql`
    CREATE POLICY "Users can insert messages as themselves"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);
  `;
  console.log("✓ messages INSERT policy created");

  console.log("→ Enabling RLS on conversations table...");
  await sql`ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;`;

  console.log("→ Creating SELECT policy for conversations...");
  await sql`
    CREATE POLICY "Users can read their conversations"
    ON public.conversations FOR SELECT
    USING (
      auth.role() = 'service_role'
      OR
      EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = conversations.id
        AND cp.user_id = auth.uid()
      )
    );
  `;
  console.log("✓ conversations SELECT policy created");

  console.log("→ All RLS policies installed successfully.");
}

main()
  .then(() => sql.end())
  .catch((e: any) => {
    const msg = e?.message ?? String(e);
    if (msg.includes("already exists")) {
      console.log("⚠ Policy already exists — safe to ignore, moving on.");
    } else {
      console.error("RLS script failed:", msg.substring(0, 300));
    }
    sql.end();
    process.exit(msg.includes("already exists") ? 0 : 1);
  });
```

3. RUN: npx tsx --env-file=.env scripts/add-chat-rls.ts
   Capture full output. If error mentions "already exists" — ignore, it's idempotent.

4. VERIFY — RUN: npx tsx --env-file=.env -e "
import postgres from 'postgres';
const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL).replace(':6543/', ':5432/');
const sql = postgres(url, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
const policies = await sql\`SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname='public' AND tablename IN ('messages','conversations') ORDER BY tablename, cmd\`;
console.log(JSON.stringify(policies, null, 2));
await sql.end();
"
   Must return 3 policies: messages SELECT, messages INSERT, conversations SELECT.

Return:
- STATUS: PASS | FAIL
- SCRIPT OUTPUT: first 30 lines
- VERIFICATION OUTPUT: JSON of policies found
- ERRORS: if any, exact text
```

### Step 1.2 — Audit (`security-auditor`)

**Prompt:**

```
Task: Audit the RLS policies just applied to the chat tables for security correctness.

Files to read:
- scripts/add-chat-rls.ts (the policy definitions)
- db/schema/mentorship.ts lines 49-93 (to confirm column names used in policies)

Audit checklist:
1. ✅ Do the policies use `auth.uid()` correctly? (Supabase's function for the current user's ID)
2. ✅ Does the messages SELECT policy restrict to conversation participants only?
3. ✅ Does the messages INSERT policy restrict `sender_id = auth.uid()`?
4. ✅ Does the conversations SELECT policy restrict to participants?
5. ✅ Is there a `service_role` bypass for server-side queries? (should exist)
6. ❌ Is there any `public` role access that leaks data? (should NOT exist)
7. ❌ Are there any SQL injection vectors in the policy definitions? (parameterized queries?)
8. ❌ Does the `conversation_participants` table need its own RLS policy?
   (If it's only queried via server-side Drizzle or via the subquery in other policies — 
    it may be fine without. But confirm: can the anon key query it directly?
    If yes, add a SELECT policy.)

Security implications:
- The Realtime subscription uses the anon key. Without the SELECT policy, it silently fails.
- With the policy, participants can only see messages in their conversations.
- Non-participants get empty results — no data leak.
- The INSERT policy prevents users from inserting messages as someone else.
- The service_role bypass allows the Drizzle server-side to work without RLS interference.

Run:
- npx tsc --noEmit (to ensure policy script has no TS errors — but it's .ts not checked by tsc)
- Read the script manually and confirm SQL syntax is valid

Return:
- STATUS: PASS | FAIL | PASS-WITH-FINDINGS
- FINDINGS: list specific issues if any
- If PASS — sign off and return SECURITY SIGNED
```

### Step 1.3 — Fix (`security-engineer`)

**Prompt:**

```
Task: Fix any security findings reported by the security-auditor for the RLS policies.

Only run if security-auditor returned FAIL or PASS-WITH-FINDINGS.
If PASS — return "No fixes needed" immediately.

If findings exist:
1. Read scripts/add-chat-rls.ts
2. Apply the fixes described in the audit report
3. Re-run: npx tsx --env-file=.env scripts/add-chat-rls.ts
4. Verify the policies again

Return:
- STATUS: FIXED | NOTHING-TO-FIX | STILL-BROKEN
- WHAT WAS CHANGED: list of changes with file:line
- VERIFICATION OUTPUT: policy listing
```

### Step 1.4 — Re-Audit (`security-auditor`)

**Prompt:**

```
Task: Re-verify the RLS policies after fixes were applied.

Same checklist as Step 1.2. If PASS — return SECURITY SIGNED — PHASE 1 COMPLETE.
If still FAIL — escalate to debugger.
```

### ⏸ Step 1.5 — Debugger (only if 1.4 fails ≥2×)

**Prompt:**

```
Task: Debug why RLS policies cannot be applied correctly.

Investigate:
1. Run: npx tsx --env-file=.env -e "
import postgres from 'postgres';
const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL).replace(':6543/', ':5432/');
const sql = postgres(url, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  await sql\`SELECT 1\`;
  console.log('DB OK');
  const policies = await sql\`SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname='public' AND tablename IN ('messages','conversations')\`;
  console.log('EXISTING POLICIES:', JSON.stringify(policies, null, 2));
  await sql.end();
} catch(e) { console.error(e?.message); }
"
2. Check if the policy creation fails due to Supabase project settings (e.g. "restricted" mode)
3. If session pooler fails, try direct connection: change host to db.wjjwjkdqkciolixnnrrk.supabase.co:5432
4. If ALL SQL methods fail — fallback: provide exact SQL for Supabase Dashboard → SQL Editor paste
   URL: https://supabase.com/dashboard/project/wjjwjkdqkciolixnnrrk/sql/new

Return:
- ROOT CAUSE: 1-2 sentence description
- FALLBACK: exact SQL to paste into Dashboard
- STATUS: FIXED | FALLBACK-PROVIDED
```

---

## Phase 2 — Backend API Audit

### Step 2.1 — Audit (`backend-developer`)

**Prompt:**

```
Task: Audit the 3 chat-related API routes and core library for correctness.

Files to read:
- app/api/session/[id]/chat/route.ts (lines 1-83)
- app/api/chat/conversations/[id]/messages/route.ts (lines 1-100)
- lib/messages.ts (lines 1-116)
- lib/realtime/client.ts (lines 1-69)

Audit checklist:

1. app/api/session/[id]/chat/route.ts:
   ✅ 401 when no user (line 18)
   ✅ 403 when not admin/participant (line 39-41)
   ✅ 404 when session not found (line 31)
   ✅ 400 when invalid UUID (line 21-23)
   ✅ Uses session UUID as conversationId (line 46)
   ✅ onConflictDoNothing prevents duplicates (lines 60, 69, 76)
   ✅ Transaction wraps both inserts (line 56)
   ⚠️ Any issues with the type casts (as any[])? Should be safe but note it.

2. app/api/chat/conversations/[id]/messages/route.ts:
   ✅ POST validates body with zod (lines 9-11, 59-60)
   ✅ POST checks participant auth via sendMessage (line 62-66)
   ✅ POST returns 201 on success (line 71)
   ✅ GET checks participant auth (lines 78-86)
   ✅ GET orders by createdAt (line 97)
   ✅ The noopPublisher comment explains Supabase Realtime (lines 47-52)
   ⚠️ The store.insertMessage doesn't pass 'flags' to DB (lines 26-31) — this is fine,
      flags are processed by the content scanner but not stored in this migration.

3. lib/messages.ts:
   ✅ Validates empty body and max length (lines 69-75)
   ✅ Checks participant access (lines 77-81)
   ✅ Uses content scanner (line 83)
   ✅ Transaction wraps insert + flag + activity (lines 85-98)
   ✅ Best-effort publish after commit (lines 100-113)
   ✅ Returns sent_unpublished if publish fails — correct resilience pattern (line 112)

4. lib/realtime/client.ts:
   ✅ Uses correct postgres_changes filter (line 35: conversation_id=eq.${conversationId})
   ✅ Column names use snake_case in filter (conversation_id) matching DB schema
   ✅ Cleanup function returns unsub (lines 48-50)
   ✅ EventsPerSecond limit set to 20 (line 11)
   ✅ Uses anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) — correct for client-side

Run:
- npx tsc --noEmit
- npm run lint

Return:
- STATUS: PASS | PASS-WITH-FINDINGS | FAIL
- Per-file: list of findings
- tsc/lint results
```

### Step 2.2 — Audit (`security-auditor`)

**Prompt:**

```
Task: Security audit of the chat API routes.

Files to read:
- app/api/session/[id]/chat/route.ts
- app/api/chat/conversations/[id]/messages/route.ts
- lib/messages.ts

Security checklist:
1. ✅ All user-facing inputs validated? (zod for body, UUID regex for session IDs)
2. ✅ No raw SQL string concatenation? (all Drizzle parameterized queries)
3. ✅ No PII in error responses? (check error messages returned to client)
4. ✅ No PII in server logs? (check console.error calls)
5. ✅ Auth checks at the TOP of each handler (before any DB reads)?
6. ✅ Principle of least privilege: non-participants get 403, not empty data?
7. ❌ Rate limiting? (no rate limiter on send endpoint — note as improvement)
8. ❌ Idempotency key sent but not stored? (X-Idempotency-Key header sent client-side but
   not yet persisted server-side — note as future hardening)

Return:
- STATUS: PASS | PASS-WITH-FINDINGS | FAIL
- FINDINGS: specific vulnerabilities or improvements
```

### Step 2.3 — Fix (`security-engineer`)

**Prompt:**

```
Task: Fix any security findings from the API audit.

Only run if Step 2.2 returned findings. Otherwise return "No fixes needed."

Common fixes to apply:
- Add rate limiting header to send endpoint (via Vercel headers or manual)
- Sanitize error messages to avoid leaking DB schema info
- Add idempotency key persistence if deemed critical
- Any other findings from the audit report

Return:
- STATUS: FIXED | NOTHING-TO-FIX
- CHANGES: file:line description
```

### Step 2.4 — Re-Audit (`security-auditor`) — same as 2.2

---

## Phase 3 — Frontend UI Audit

### Step 3.1 — Audit (`frontend-design`)

**Prompt:**

```
Task: Audit the SessionRoomClient chat UI component.

File to read: app/session/[sessionId]/SessionRoomClient.tsx (lines 1-280)

Audit checklist:
1. ✅ Loading state: conversationId not yet resolved → shows empty state (line 231-234)
2. ✅ Error state: fetch fails → shows error message (lines 229-230)
3. ✅ Empty state: "No messages yet. Say hello to start the conversation." (lines 231-234)
4. ✅ Message bubbles: mine = right + primary color, theirs = left + dark (lines 239-249)
5. ✅ Send button disabled when: empty draft / sending / no conversation (lines 270-271)
6. ✅ Input placeholder: "Message room…" (line 265)
7. ✅ Auto-scroll on new message (lines 121-123)
8. ✅ Optimistic send with clientMsgId UUID (lines 128-135)
9. ✅ Dedup logic: checks realId vs existing messages (lines 148-163)
10. ✅ Cleanup on unmount: cancelled flags + unsub (lines 71-73, 117-119)
11. ✅ Mobile responsive: grid layout collapses at lg breakpoint (line 181)
12. ✅ Keyboard accessible: form submit on Enter (lines 256-258)

Visual check:
- Colors match brand? bg-[#0a120e] (chat sidebar), bg-primary (send button) ✅
- No dangerouslySetInnerHTML — messages rendered as text inside div (safe from XSS) ✅
- Message body rendered as plain text content, not HTML ✅

Run:
- npx tsc --noEmit
- npm run lint

Return:
- STATUS: PASS | PASS-WITH-FINDINGS | FAIL
- Per-criterion: ✅ or ❌
- Visual polish notes
- tsc/lint results
```

### Step 3.2 — Security Audit (`security-auditor`)

**Prompt:**

```
Task: Security audit of the chat UI component for client-side vulnerabilities.

File to read: app/session/[sessionId]/SessionRoomClient.tsx

Security checklist:
1. ❌ Any dangerouslySetInnerHTML or raw HTML rendering? 
   (message body rendered as {m.body} inside a div — safe ✅)
2. ❌ Any secrets exposed to client bundle? (API routes not imported directly)
3. ❌ Any auth tokens in URLs or local storage exposed? (only session cookie used)
4. ✅ All user content treated as text, not HTML?
5. ✅ No eval or dynamic script execution?
6. ❌ Check websocket/realtime channel names — do they leak conversation IDs?
   (channel name: messages-conv-${conversationId} — conversationId is session UUID,
    which is already in the URL. No additional leak.)
7. ⚠️ Input max length checked client-side (line 265 placeholder only) but server-side
    enforces 4000 char limit in lib/messages.ts (line 73). Server-side is authoritative.

Return:
- STATUS: PASS | PASS-WITH-FINDINGS | FAIL
- FINDINGS: specific issues
```

### Step 3.3 — Fix (`security-engineer`) + Step 3.4 — Re-Audit — same pattern as Phase 2.

---

## Phase 4 — Integration Tests

### Step 4.1 — UX Audit (`ui-ux-tester`)

**Prompt:**

```
Task: UX audit of the session chat flow. Read-only inspection of all UI states.

Files to read:
- app/session/[sessionId]/SessionRoomClient.tsx (lines 179-280 for the JSX)
- app/session/[sessionId]/page.tsx (parent page context)

UX checklist:
1. The chat panel is part of a side-by-side layout (video left, chat right at lg breakpoint)
2. On mobile (< lg), the grid becomes single column: video on top, chat below
3. Empty state text is helpful ("No messages yet. Say hello…")
4. Loading state shows nothing harmful — just empty area
5. Error state is clearly visible and doesn't crash the page
6. Sent messages are distinguishable from received (right vs left, different colors)
7. Pending messages show opacity-60 — gives visual feedback that message is being sent
8. Chat input has a placeholder hint
9. Send button is clearly disabled when unusable (grayed out)
10. Auto-scroll keeps newest message visible

Return:
- STATUS: PASS | PASS-WITH-FINDINGS
- FINDINGS: any UX issues (e.g. "no typing indicator", "no timestamp on messages")
```

### Step 4.2 — Automated Browser Test (`webapp-testing` + BrowserMCP)

**BrowserMCP Setup (run once before tests):**

The `webapp-testing` agent should first ensure BrowserMCP is available:

Option A — Via MCP config:
```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

Option B — If MCP isn't available, use Playwright directly:
```bash
npm i -D @playwright/test
npx playwright install chromium
```

**Test script (to be written by `webapp-testing`):**

```
Test flow:
1. Launch browser context A (mentor session)
2. Navigate to localhost:3000 (or deployed URL)
3. Log in as mentor@demo.hitaishi.app
4. Navigate to a session room
5. Launch browser context B (student session — incognito)
6. Log in as student@demo.hitaishi.app
7. Navigate to same session room
8. In context A: type "Hello from mentor" → click Send
9. In context B: verify message appears within 3 seconds
10. In context B: type "Hello from student" → click Send
11. In context A: verify response appears within 3 seconds
12. Refresh both browsers
13. Verify message history loads in both
14. Launch browser context C (non-participant — incognito)
15. Navigate to the session room URL
16. Verify chat shows error or no access

Each step should take a screenshot and log the result.
```

**Prompt for `webapp-testing`:**

```
Task: End-to-end automated test of the real-time chat feature.

Context:
- App URL: http://localhost:3000 (or check .env for AUTH_URL)
- Mentor account: mentor@demo.hitaishi.app
- Student account: student@demo.hitaishi.app
- Both accounts confirmed existing in DB

Test setup:
1. Check if Playwright is available: npx playwright --version
   - If not, install it: npm i -D @playwright/test && npx playwright install chromium
2. Check if BrowserMCP is available (check MCP config files)
   - If not, use Playwright directly (more reliable)

Write a test script (test-chat.mjs or test-chat.ts) that:
- Launches 3 browser contexts (mentor, student, non-participant)
- Logs each one in
- Verifies bidirectional message delivery within 3 seconds
- Verifies message history survives refresh
- Verifies non-participant gets 403/error
- Takes screenshots at each step

Return:
- STATUS: ALL-PASS | PARTIAL-FAIL | FAIL
- SCREENSHOTS: saved to G:\iit\hitaishi\test-screenshots\
- Each step result: PASS/FAIL with timing
- ERRORS: if any, exact browser console output
```

### Step 4.3 — Debugger (on test failure) + re-test loops

---

## Phase 5 — Deploy Gate (`devops-engineer`)

**Prompt:**

```
Task: Final build verification and deploy readiness check.

Context:
- All 4 previous phases are complete and signed off.
- Files may have been modified by security-engineer fixes.

Run:
1. npx tsc --noEmit → 0 errors
2. npm run lint → 0 warnings
3. npm run build → compiled successfully
4. npm run test → all tests pass

Check:
5. Ensure scripts/add-chat-rls.ts exists and is valid TypeScript
6. Ensure no TODO, FIXME, or debug console.log left in touched files
7. Ensure .env is not committed (check .gitignore)
8. Check package.json scripts are intact

Return:
- BUILD STATUS: PASS | FAIL
- TEST STATUS: PASS | FAIL
- LINT STATUS: PASS | FAIL
- FILES STAGED: list of new/modified files
- DEPLOY READINESS: ✅ ALL CLEAR | ⚠️ MINOR ISSUES | ❌ BLOCKING
- FOLLOW-UP ACTIONS: any manual steps (e.g. "run npm run db:migrate before deploy")
```

---

## Rollback Plan

If anything breaks in production:

```sql
-- 1. Remove RLS policies (reverts Phase 1)
DROP POLICY IF EXISTS "Users can read messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages as themselves" ON public.messages;
DROP POLICY IF EXISTS "Users can read their conversations" ON public.conversations;

-- 2. Remove from publication (reverts Phase 1A — but it was already done)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.messages;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.conversations;

-- 3. After rollback: chat works in REST-only mode (must refresh to see new messages)
```

File rollback: delete `scripts/add-chat-rls.ts` (new file only, no existing files changed).

---

## Agent Dispatch Summary

| Order | Agent | Task | Max retries |
|-------|-------|------|-------------|
| 0 | `find-skills` | Discovery — check for relevant skills | 1 |
| 1.1 | `database-administrator` | Execute RLS script | 2 |
| 1.2 | `security-auditor` | Audit RLS policies | 2 |
| 1.3 | `security-engineer` | Fix RLS findings | 2 |
| 1.4 | `security-auditor` | Re-verify RLS | 2 |
| 1.5 | `debugger` | Debug RLS failures (only if needed) | 1 |
| 2.1 | `backend-developer` | Audit API routes | 1 |
| 2.2 | `security-auditor` | API security audit | 2 |
| 2.3 | `security-engineer` | Fix API findings | 2 |
| 2.4 | `security-auditor` | Re-verify API | 2 |
| 3.1 | `frontend-design` | Audit chat UI | 1 |
| 3.2 | `security-auditor` | UI security audit | 2 |
| 3.3 | `security-engineer` | Fix UI findings | 2 |
| 3.4 | `security-auditor` | Re-verify UI | 2 |
| 4.1 | `ui-ux-tester` | UX audit | 1 |
| 4.2 | `webapp-testing` | Automated browser test | 3 |
| 4.3 | `security-auditor` | Final security pass | 1 |
| 4.4 | `debugger` | Debug test failures (only if needed) | 1 |
| 5.1 | `devops-engineer` | Deploy gate | 1 |

**Total dispatches:** ~19 (each clean sub-agent, no context bleed)

---

## BrowserMCP Setup

For the automated browser testing (Phase 4.2), `webapp-testing` should set up BrowserMCP:

### Option 1 — Via MCP server config (recommended if MCP is available)
Add to AI app's MCP config:
```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

### Option 2 — Standalone installation
```bash
# Install BrowserMCP globally
npm i -g @browsermcp/mcp

# Add to VS Code MCP config (.vscode/mcp.json):
{
  "servers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

### Option 3 — Direct Playwright (fallback if MCP unavailable)
```bash
npm i -D @playwright/test
npx playwright install chromium
```

Then write a test script using Playwright's API directly (no MCP needed).

---

## Files That May Be Touched

| File | Change type | Phase |
|------|-------------|-------|
| `scripts/add-chat-rls.ts` | **NEW** — RLS policy script | Phase 1 |
| `app/api/session/[id]/chat/route.ts` | Possible audit fix | Phase 2 |
| `app/api/chat/conversations/[id]/messages/route.ts` | Possible audit fix | Phase 2 |
| `lib/messages.ts` | Possible audit fix | Phase 2 |
| `lib/realtime/client.ts` | Possible audit fix | Phase 2 |
| `app/session/[sessionId]/SessionRoomClient.tsx` | Possible audit fix | Phase 3 |
| `.vscode/mcp.json` | **NEW** — BrowserMCP config | Phase 4 |

---

## Escalation Matrix

| Situation | Action |
|-----------|--------|
| Any step fails 2× | Route to `debugger` for root cause |
| debugger can't fix | Route to user with full diagnostics |
| DB connection lost | Provide Supabase Dashboard SQL and direct link |
| Phase 4 tests fail consistently | Fall back to manual testing instructions |
| Build fails after all fixes | Rollback all changes, report to user |

---

*End of plan. Dispatch `task-distributor` to begin execution.*
