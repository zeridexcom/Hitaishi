# Hitaishi Chat Rescue — All-Phase Master Execution Probe

**File:** One probe per phase, self-contained, recursive, no sign-off until done.
**Project:** `G:\iit\hitaishi`
**Stack:** Next.js 14.2.18 + Drizzle ORM + Supabase Postgres + Supabase Realtime
**Pre-flight facts (apply to ALL phases):**

| Fact | Value |
|------|-------|
| Supabase project ref | wjjwjkdqkciolixnnrrk |
| DB host | aws-1-ap-south-1.pooler.supabase.com |
| URL session pooler (DDL) | port 5432 (replace :6543/ with :5432/) |
| URL transaction pooler | port 6543 |
| Accounts exist | mentor@demo.hitaishi.app, student@demo.hitaishi.app |
| BrowserMCP | Installed v0.1.3, enabled in opencode.jsonc |

---

# Phase 1 — DB Layer (RLS Policies)

```
╔══════════════════════════════════════════════════════════════╗
║         PHASE 1 — DB LAYER (RLS Policies)                   ║
║         Recursive execution probe — no sign-off until done   ║
╚══════════════════════════════════════════════════════════════╝
```

## Phase 1 Pre-flight Facts

| Fact | Value |
|------|-------|
| messages table | ✅ EXISTS |
| conversations table | ✅ EXISTS |
| conversation_participants table | ✅ EXISTS |
| supabase_realtime publication has messages | ✅ ALREADY DONE — SKIP |
| supabase_realtime publication has conversations | ✅ ALREADY DONE — SKIP |
| RLS enabled on all 3 chat tables | ✅ YES |
| RLS policies on chat tables | ❌ EMPTY — THE BLOCKER |
| Phase 1A (enable publication) | ✅ SKIP — already done |

## Phase 1 Goal

Add 3 RLS policies so the anon key can subscribe to Realtime INSERT events:
1. `messages` — SELECT policy (conversation participants only)
2. `messages` — INSERT policy (sender_id = auth.uid())
3. `conversations` — SELECT policy (participants only)

## Phase 1 Recursive Flow

```
START
  │
  ▼
Step 1.1 — database-administrator ───→ PASS ──→ Step 1.2
                  │                              │
                  ▼ FAIL                         ▼ FAIL
             debugger ◄──────────────────── debugger
                  │                              │
                  ▼ FIXED                        ▼ FIXED
             retry 1.1                      retry 1.2
  │
  ▼
Step 1.2 — security-auditor ──────────→ PASS ──→ Step 1.3
                  │                              │
                  ▼ FAIL                         ▼
             debugger ◄──────────────────── Step 1.3 (if findings exist)
                  │                              │
                  ▼ FIXED                        ▼ DONE
             retry 1.2                      re-verify with 1.2
  │
  ▼
Step 1.3 — security-engineer (fix) ────→ PASS ──→ Step 1.4
  (skip if 1.2 had zero findings)                  │
                                                   ▼ FAIL
                                              debugger
                                                   │
                                                   ▼ FIXED
                                              retry 1.3 → 1.4
  │
  ▼
Step 1.4 — security-auditor (re-verify) ─→ PASS ──→ PHASE 1 COMPLETE
                                                   │
                                                   ▼ FAIL 2×
                                              debugger → escalate to user
```

## Step 1.1 — Execute: `database-administrator`

```
TASK: Phase 1.1 — Create and run RLS policy script
PLAN REF: G:\iit\hitaishi\CHAT_RESCUE_PLAN.md § Phase 1 → Step 1.1
WORKDIR: G:\iit\hitaishi

CONTEXT:
- .env at G:\iit\hitaishi\.env has DIRECT_URL on port 6543 (transaction pooler)
- For DDL like CREATE POLICY, use port 5432 (session pooler)
- Replace :6543/ with :5432/ in the URL before connecting
- All 3 chat tables exist: messages, conversations, conversation_participants
- supabase_realtime publication already has messages + conversations (DO NOT re-add)
- RLS is enabled on all 3 tables but ZERO policies exist

EXECUTE:

1. Read G:\iit\hitaishi\db\schema\mentorship.ts lines 49-93 to confirm column names:
   - messages table → columns: id, conversation_id, sender_id, body, ...
   - conversations table → columns: id, title, ...
   - conversation_participants → columns: conversation_id, user_id, ...

2. Create file: scripts/add-chat-rls.ts with this EXACT content:

   ```typescript
   import postgres from "postgres";

   const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
   if (!url) { console.error("DATABASE_URL or DIRECT_URL required"); process.exit(1); }

   const sessionUrl = url.replace(":6543/", ":5432/");
   const sql = postgres(sessionUrl, { max: 1, ssl: "require", prepare: false, onnotice: () => {} });

   async function main() {
     console.log("→ Creating SELECT policy for messages...");
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

     console.log("→ Creating INSERT policy for messages...");
     await sql`
       CREATE POLICY "Users can insert messages as themselves"
       ON public.messages FOR INSERT
       WITH CHECK (auth.uid() = sender_id);
     `;
     console.log("✓ messages INSERT policy created");

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
     console.log("→ All 3 RLS policies installed successfully.");
   }

   main()
     .then(() => sql.end())
     .catch((e: any) => {
       const msg = e?.message ?? String(e);
       if (msg.includes("already exists")) {
         console.log("⚠ Policy already exists — safe to ignore.");
         sql.end();
         process.exit(0);
       }
       console.error("FAILED:", msg.substring(0, 300));
       sql.end();
       process.exit(1);
     });
   ```

3. Run: npx tsx --env-file=.env scripts/add-chat-rls.ts
4. Verify: npx tsx --env-file=.env -e "
   import postgres from 'postgres';
   const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL).replace(':6543/', ':5432/');
   const sql = postgres(url, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
   const policies = await sql\`SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname='public' AND tablename IN ('messages','conversations') ORDER BY tablename, cmd\`;
   console.log(JSON.stringify(policies, null, 2));
   await sql.end();
   "

   Expected: 3 policies (messages SELECT, messages INSERT, conversations SELECT)

RETURN FORMAT:
  STATUS: PASS | FAIL
  SCRIPT OUTPUT: (first 30 lines)
  VERIFICATION OUTPUT: (JSON of pg_policies)
  ERROR: (if any)
  FILES TOUCHED: scripts/add-chat-rls.ts
```

## Step 1.2 — Audit: `security-auditor`

```
TASK: Phase 1.2 — Security audit of RLS policies
WORKDIR: G:\iit\hitaishi

FILES TO READ:
- G:\iit\hitaishi\scripts\add-chat-rls.ts
- G:\iit\hitaishi\db\schema\mentorship.ts lines 49-93

AUDIT CHECKLIST (every item must pass):
  1. Does messages SELECT policy restrict to conversation participants?
  2. Does messages INSERT policy restrict sender_id = auth.uid()?
  3. Does conversations SELECT policy restrict to participants?
  4. Is there a service_role bypass? (required for Drizzle)
  5. Is there any public/unauthenticated access? (MUST NOT exist)
  6. Are column names correct? (snake_case: conversation_id, user_id, sender_id)
  7. Is auth.uid() used correctly?
  8. Can the anon key query conversation_participants directly? (If yes → needs policy too)

RUN: npx tsc --noEmit

RETURN FORMAT:
  STATUS: PASS | FAIL | PASS-WITH-FINDINGS
  FINDINGS: max 5 bullets
  FILES AUDITED: path:line
  VERDICT: SECURITY SIGNED | CHANGES REQUIRED
```

## Step 1.3 — Fix: `security-engineer`

```
TASK: Phase 1.3 — Fix RLS policy findings
WORKDIR: G:\iit\hitaishi

Only run if Step 1.2 returned FAIL or PASS-WITH-FINDINGS.
If PASS — skip.

AUDIT FINDINGS TO FIX: <embed from Step 1.2>

FILES: G:\iit\hitaishi\scripts\add-chat-rls.ts

EXECUTE:
1. Read current file
2. Apply fixes for each finding
3. Re-run: npx tsx --env-file=.env scripts/add-chat-rls.ts
4. Re-verify: pg_policies query

RETURN FORMAT:
  STATUS: FIXED | NOTHING-TO-FIX | STILL-BROKEN
  WHAT WAS CHANGED: file:line
  VERIFICATION: JSON of pg_policies
```

## Step 1.4 — Re-verify: `security-auditor`

```
TASK: Phase 1.4 — Re-verify RLS policies after fixes
Same checklist as Step 1.2. Re-read scripts/add-chat-rls.ts and confirm all 8 items pass.

RETURN:
  STATUS: PASS | FAIL
  VERDICT: SECURITY SIGNED — PHASE 1 COMPLETE | STILL FAILING
```

## Step 1.5 (Emergency) — `debugger`

```
TASK: Phase 1.5 — Debug RLS policy failure
WORKDIR: G:\iit\hitaishi

PROBLEM: <embed exact error from failed step>

INVESTIGATE:
1. Is session pooler (port 5432) reachable?
   npx tsx --env-file=.env -e "import postgres from 'postgres'; const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL).replace(':6543/', ':5432/'); const sql = postgres(url, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} }); try { await sql\`SELECT 1\`; console.log('OK'); } catch(e) { console.error(e?.message?.substring(0,200)); } await sql.end();"

2. If that fails → try direct: db.wjjwjkdqkciolixnnrrk.supabase.co:5432

3. If ALL SQL fails → fallback: provide exact SQL for Supabase Dashboard
   URL: https://supabase.com/dashboard/project/wjjwjkdqkciolixnnrrk/sql/new

RETURN:
  ROOT CAUSE: 1-2 sentences
  STATUS: FIXED | FALLBACK-PROVIDED | ESCALATE
  FALLBACK SQL: (the exact SQL to paste)
```

## Phase 1 Completion Criteria

All must be true:
- [ ] scripts/add-chat-rls.ts exists and is valid
- [ ] messages SELECT policy in pg_policies
- [ ] messages INSERT policy in pg_policies
- [ ] conversations SELECT policy in pg_policies
- [ ] security-auditor signed off (Steps 1.2 + 1.4 both PASS)
- [ ] All needed fixes applied and re-verified

## Phase 1 Max Retry Limits

| Step | Max | Then |
|------|-----|------|
| 1.1 | 2 | debugger |
| 1.2 | 2 | debugger |
| 1.3 | 2 | debugger |
| 1.4 | 2 | debugger |
| 1.5 | 1 | escalate to user |

## Phase 1 Completion Report

```
╔════════════════════════════════════════════════════╗
║              PHASE 1 — COMPLETION REPORT           ║
╠════════════════════════════════════════════════════╣
║ Step 1.1 (database-administrator): PASS | FAIL     ║
║ Step 1.2 (security-auditor):        PASS | FAIL    ║
║ Step 1.3 (security-engineer):       PASS | SKIPPED ║
║ Step 1.4 (security-auditor re-verify): PASS | FAIL ║
║ Step 1.5 (debugger):                N/A | FIXED    ║
╠════════════════════════════════════════════════════╣
║ Files created:   scripts/add-chat-rls.ts           ║
║ Policies created: 3 (messages SELECT, messages     ║
║                    INSERT, conversations SELECT)    ║
║ Security sign-off: YES | NO                       ║
║ Ready for Phase 2: YES | BLOCKED                  ║
╚════════════════════════════════════════════════════╝
```

---

# Phase 2 — Backend API Audit

```
╔══════════════════════════════════════════════════════════════╗
║         PHASE 2 — BACKEND API AUDIT                         ║
║         Recursive execution probe — no sign-off until done   ║
╚══════════════════════════════════════════════════════════════╝
```

## Phase 2 Pre-flight Facts

| Fact | Value |
|------|-------|
| Phase 1 completed? | Must be YES before starting |
| API route: session chat init | app/api/session/[id]/chat/route.ts |
| API route: messages CRUD | app/api/chat/conversations/[id]/messages/route.ts |
| Core library: messages | lib/messages.ts |
| Core library: realtime client | lib/realtime/client.ts |

## Phase 2 Goal

Audit 4 files for correctness, security, and consistency. Fix any issues found. Get security sign-off.

## Phase 2 Recursive Flow

```
START
  │
  ▼
Step 2.1 — backend-developer ───────→ PASS ──→ Step 2.2
                  │                              │
                  ▼ FAIL                         ▼ FAIL
             debugger ◄──────────────────── debugger
  │
  ▼
Step 2.2 — security-auditor ─────────→ PASS ──→ Step 2.3
                  │                              │
                  ▼ FAIL                         ▼
             debugger ◄──────────────────── Step 2.3 (if findings exist)
                  │                              │
                  ▼ FIXED                        ▼ DONE
             retry 2.2                      re-verify with 2.2
  │
  ▼
Step 2.3 — security-engineer (fix) ───→ PASS ──→ Step 2.4
  (skip if 2.2 had zero findings)                  │
                                                   ▼ FAIL
                                              debugger
  │
  ▼
Step 2.4 — security-auditor (re-verify) ─→ PASS ──→ PHASE 2 COMPLETE
                                                   │
                                                   ▼ FAIL 2×
                                              debugger → escalate to user
```

## Step 2.1 — Audit: `backend-developer`

```
TASK: Phase 2.1 — Audit 4 chat API files for correctness
WORKDIR: G:\iit\hitaishi

FILES TO READ:
- app/api/session/[id]/chat/route.ts (entire file)
- app/api/chat/conversations/[id]/messages/route.ts (entire file)
- lib/messages.ts (entire file)
- lib/realtime/client.ts (entire file)

AUDIT CHECKLIST:

1. app/api/session/[id]/chat/route.ts:
   [ ] 401 when no user
   [ ] 403 when not admin/participant
   [ ] 404 when session not found
   [ ] 400 when invalid UUID
   [ ] Uses session UUID as conversationId (line 46)
   [ ] onConflictDoNothing prevents duplicates (lines 60, 69, 76)
   [ ] Transaction wraps both inserts (line 56)

2. app/api/chat/conversations/[id]/messages/route.ts:
   [ ] POST validates body with zod (lines 9-11, 59-60)
   [ ] POST checks participant auth via sendMessage (line 62-66)
   [ ] POST returns 201 on success (line 71)
   [ ] GET checks participant auth (lines 78-86)
   [ ] GET orders by createdAt (line 97)
   [ ] noopPublisher explains Supabase Realtime auto-broadcast (lines 47-52)

3. lib/messages.ts:
   [ ] Validates empty body and max length (lines 69-75)
   [ ] Checks participant access (lines 77-81)
   [ ] Content scanner runs before insert (line 83)
   [ ] Transaction wraps insert + flag + touch (lines 85-98)
   [ ] Best-effort publish after commit (lines 100-113)

4. lib/realtime/client.ts:
   [ ] Correct postgres_changes filter (conversation_id=eq.${conversationId})
   [ ] Snake_case column names match DB schema
   [ ] Cleanup: return unsub for useEffect (lines 48-50)
   [ ] eventsPerSecond: 20 set (line 11)
   [ ] Uses anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) — correct for client

RUN: npx tsc --noEmit
RUN: npm run lint

RETURN FORMAT:
  STATUS: PASS | PASS-WITH-FINDINGS | FAIL
  PER-FILE FINDINGS: list of [✅|❌] for each checklist item
  tsc RESULT: 0 errors | errors found
  lint RESULT: 0 warnings | warnings found
```

## Step 2.2 — Security Audit: `security-auditor`

```
TASK: Phase 2.2 — Security audit of chat API routes
WORKDIR: G:\iit\hitaishi

FILES TO READ:
- app/api/session/[id]/chat/route.ts
- app/api/chat/conversations/[id]/messages/route.ts
- lib/messages.ts

SECURITY CHECKLIST:
  [ ] All user inputs validated? (zod body, UUID regex for IDs)
  [ ] No raw SQL string concatenation? (all Drizzle parameterized queries)
  [ ] No PII in error responses returned to client?
  [ ] No PII in server logs? (console.error calls)
  [ ] Auth checks at TOP of handlers (before any DB reads)?
  [ ] Least privilege: non-participants get 403, not empty data?
  [ ] Rate limiting on send endpoint? (note if missing)
  [ ] Idempotency key sent but not persisted? (client sends X-Idempotency-Key, not stored server-side)

RUN: npx tsc --noEmit

RETURN:
  STATUS: PASS | PASS-WITH-FINDINGS | FAIL
  FINDINGS: max 5 bullets with file:line
  VERDICT: SECURITY SIGNED | CHANGES REQUIRED
```

## Step 2.3 — Fix: `security-engineer`

```
TASK: Phase 2.3 — Fix API security findings
WORKDIR: G:\iit\hitaishi

Skip if Step 2.2 returned PASS.

AUDIT FINDINGS: <embed from Step 2.2>

FILES: app/api/session/[id]/chat/route.ts, app/api/chat/conversations/[id]/messages/route.ts, lib/messages.ts, lib/realtime/client.ts

EXECUTE:
1. Read each file listed
2. Apply fixes per findings
3. Re-run: npx tsc --noEmit && npm run lint

RETURN:
  STATUS: FIXED | NOTHING-TO-FIX | STILL-BROKEN
  CHANGES: file:line description
  tsc/lint: results
```

## Step 2.4 — Re-verify: `security-auditor`

```
TASK: Phase 2.4 — Re-verify API security after fixes
Same checklist as Step 2.2.

RETURN:
  STATUS: PASS | FAIL
  VERDICT: SECURITY SIGNED — PHASE 2 COMPLETE | STILL FAILING
```

## Step 2.5 (Emergency) — `debugger`

```
TASK: Phase 2.5 — Debug API audit failure
WORKDIR: G:\iit\hitaishi

PROBLEM: <embed exact failure>

INVESTIGATE:
1. Run: npx tsc --noEmit 2>&1
2. Run: npm run lint 2>&1
3. Identify if it's a TS error, logic bug, or schema mismatch
4. Read the failing file and diagnose

RETURN:
  ROOT CAUSE: 1-2 sentences
  STATUS: FIXED | STILL-BROKEN | ESCALATE
```

## Phase 2 Completion Criteria

- [ ] All 4 files audited
- [ ] All checklist items verified
- [ ] security-auditor signed off (Steps 2.2 + 2.4 both PASS)
- [ ] Any needed fixes applied and re-verified
- [ ] tsc --noEmit: 0 errors
- [ ] npm run lint: 0 warnings

## Phase 2 Max Retry Limits

| Step | Max | Then |
|------|-----|------|
| 2.1 | 2 | debugger |
| 2.2 | 2 | debugger |
| 2.3 | 2 | debugger |
| 2.4 | 2 | debugger |
| 2.5 | 1 | escalate |

## Phase 2 Completion Report

```
╔════════════════════════════════════════════════════╗
║              PHASE 2 — COMPLETION REPORT           ║
╠════════════════════════════════════════════════════╣
║ Step 2.1 (backend-developer):       PASS | FAIL    ║
║ Step 2.2 (security-auditor):        PASS | FAIL    ║
║ Step 2.3 (security-engineer):       PASS | SKIPPED ║
║ Step 2.4 (security-auditor re-verify): PASS | FAIL ║
║ Step 2.5 (debugger):                N/A | FIXED    ║
╠════════════════════════════════════════════════════╣
║ Files audited: 4                                   ║
║ Files modified: <list>                             ║
║ Security sign-off: YES | NO                       ║
║ tsc: 0 errors | errors                            ║
║ lint: 0 warnings | warnings                       ║
║ Ready for Phase 3: YES | BLOCKED                  ║
╚════════════════════════════════════════════════════╝
```

---

# Phase 3 — Frontend UI Audit

```
╔══════════════════════════════════════════════════════════════╗
║         PHASE 3 — FRONTEND UI AUDIT                         ║
║         Recursive execution probe — no sign-off until done   ║
╚══════════════════════════════════════════════════════════════╝
```

## Phase 3 Pre-flight Facts

| Fact | Value |
|------|-------|
| Phase 2 completed? | Must be YES before starting |
| UI component to audit | app/session/[sessionId]/SessionRoomClient.tsx (280 lines) |
| Framework | Next.js 14 App Router, React 18, Tailwind CSS |

## Phase 3 Goal

Audit SessionRoomClient.tsx for UX correctness, visual polish, and security. Fix any issues. Get security sign-off.

## Phase 3 Recursive Flow

```
START
  │
  ▼
Step 3.1 — frontend-design ─────────→ PASS ──→ Step 3.2
                  │                              │
                  ▼ FAIL                         ▼ FAIL
             debugger ◄──────────────────── debugger
  │
  ▼
Step 3.2 — security-auditor ─────────→ PASS ──→ Step 3.3
                  │                              │
                  ▼ FAIL                         ▼
             debugger ◄──────────────────── Step 3.3 (if findings exist)
                  │                              │
                  ▼ FIXED                        ▼ DONE
             retry 3.2                      re-verify with 3.2
  │
  ▼
Step 3.3 — security-engineer (fix) ───→ PASS ──→ Step 3.4
  (skip if 3.2 had zero findings)                  │
                                                   ▼ FAIL
                                              debugger
  │
  ▼
Step 3.4 — security-auditor (re-verify) ─→ PASS ──→ PHASE 3 COMPLETE
                                                   │
                                                   ▼ FAIL 2×
                                              debugger → escalate to user
```

## Step 3.1 — Audit: `frontend-design`

```
TASK: Phase 3.1 — Audit SessionRoomClient chat UI
WORKDIR: G:\iit\hitaishi

FILE TO READ: app/session/[sessionId]/SessionRoomClient.tsx (entire file, 280 lines)

AUDIT CHECKLIST:

State handling:
  [ ] Loading state: conversationId not yet resolved → shows empty state
  [ ] Error state: fetch fails → shows error message (line 229-230)
  [ ] Empty state: "No messages yet. Say hello…" (line 232-233)
  [ ] Send button disabled when: empty draft / sending / no conversation (line 270-271)

Message bubbles:
  [ ] Mine: right-aligned + bg-primary color (line 245)
  [ ] Theirs: left-aligned + bg-white/5 dark (line 245)
  [ ] Pending messages: opacity-60 visual feedback (line 246)
  [ ] Sender labels shown above each bubble (line 240-241)

Interaction:
  [ ] Input placeholder: "Message room…" (line 265)
  [ ] Auto-scroll to latest message on new message (lines 121-123)
  [ ] Optimistic send with clientMsgId UUID (lines 128-135)
  [ ] Dedup logic: checks realId vs existing messages (lines 148-163)
  [ ] Form submit on Enter (lines 256-258)

Visual polish:
  [ ] Chat panel matches brand design language (colors, typography, spacing)
  [ ] Mobile responsive: grid collapses at lg breakpoint (line 181)
  [ ] Scroll area properly styled and functional
  [ ] No dangerouslySetInnerHTML — messages rendered as text content only

Cleanup:
  [ ] useEffect cleanup: cancelled flags on async fetches (lines 71-73)
  [ ] Realtime unsubscribe on unmount (lines 117-119)

RUN: npx tsc --noEmit
RUN: npm run lint

RETURN:
  STATUS: PASS | PASS-WITH-FINDINGS | FAIL
  PER-ITEM: [✅|❌] for each checklist item
  VISUAL NOTES: any polish recommendations
  tsc: 0 errors | errors
  lint: 0 warnings | warnings
```

## Step 3.2 — Security Audit: `security-auditor`

```
TASK: Phase 3.2 — Security audit of chat UI
WORKDIR: G:\iit\hitaishi

FILE: app/session/[sessionId]/SessionRoomClient.tsx

SECURITY CHECKLIST:
  [ ] No dangerouslySetInnerHTML? (message rendered as {m.body} — safe)
  [ ] No raw HTML rendering? (all text content)
  [ ] No secrets in client bundle? (API calls go to Next.js server, not directly to Supabase)
  [ ] No auth tokens in URLs or localStorage? (cookie-based auth)
  [ ] No eval or dynamic script execution?
  [ ] Channel name leaks conversationId? (messages-conv-{id} — id is session UUID already in URL, not sensitive)
  [ ] Input max length? (4000 char server-side limit in lib/messages.ts:73 — server is authoritative)
  [ ] XSS vector through message body? ({m.body} rendered as text inside div — safe)
  [ ] Form submission safe? (prevents default, uses fetch to server-side API)

RUN: npx tsc --noEmit

RETURN:
  STATUS: PASS | PASS-WITH-FINDINGS | FAIL
  FINDINGS: max 5 bullets
  VERDICT: SECURITY SIGNED | CHANGES REQUIRED
```

## Step 3.3 — Fix: `security-engineer`

```
TASK: Phase 3.3 — Fix UI security findings
WORKDIR: G:\iit\hitaishi

Skip if Step 3.2 returned PASS.

AUDIT FINDINGS: <embed from Step 3.2>

FILE: app/session/[sessionId]/SessionRoomClient.tsx

EXECUTE:
1. Read file
2. Apply fixes per findings
3. Re-run: npx tsc --noEmit && npm run lint

RETURN:
  STATUS: FIXED | NOTHING-TO-FIX | STILL-BROKEN
  CHANGES: file:line description
  tsc/lint: results
```

## Step 3.4 — Re-verify: `security-auditor`

```
TASK: Phase 3.4 — Re-verify UI security after fixes
Same checklist as Step 3.2.

RETURN:
  STATUS: PASS | FAIL
  VERDICT: SECURITY SIGNED — PHASE 3 COMPLETE | STILL FAILING
```

## Step 3.5 (Emergency) — `debugger`

```
TASK: Phase 3.5 — Debug UI audit failure
WORKDIR: G:\iit\hitaishi

PROBLEM: <embed exact failure>

INVESTIGATE:
1. Run: npx tsc --noEmit 2>&1
2. Run: npm run lint 2>&1
3. Read failing file and diagnose

RETURN:
  ROOT CAUSE: 1-2 sentences
  STATUS: FIXED | STILL-BROKEN | ESCALATE
```

## Phase 3 Completion Criteria

- [ ] SessionRoomClient.tsx audited for all UX states
- [ ] Security audit passed (no XSS, no secret leaks, no raw HTML)
- [ ] security-auditor signed off (Steps 3.2 + 3.4 both PASS)
- [ ] All fixes applied and re-verified
- [ ] tsc --noEmit: 0 errors
- [ ] npm run lint: 0 warnings

## Phase 3 Max Retry Limits

| Step | Max | Then |
|------|-----|------|
| 3.1 | 2 | debugger |
| 3.2 | 2 | debugger |
| 3.3 | 2 | debugger |
| 3.4 | 2 | debugger |
| 3.5 | 1 | escalate |

## Phase 3 Completion Report

```
╔════════════════════════════════════════════════════╗
║              PHASE 3 — COMPLETION REPORT           ║
╠════════════════════════════════════════════════════╣
║ Step 3.1 (frontend-design):         PASS | FAIL    ║
║ Step 3.2 (security-auditor):        PASS | FAIL    ║
║ Step 3.3 (security-engineer):       PASS | SKIPPED ║
║ Step 3.4 (security-auditor re-verify): PASS | FAIL ║
║ Step 3.5 (debugger):                N/A | FIXED    ║
╠════════════════════════════════════════════════════╣
║ Files audited: 1 (SessionRoomClient.tsx)           ║
║ Files modified: <list>                             ║
║ Security sign-off: YES | NO                       ║
║ tsc: 0 errors | errors                            ║
║ lint: 0 warnings | warnings                       ║
║ Ready for Phase 4: YES | BLOCKED                  ║
╚════════════════════════════════════════════════════╝
```

---

# Phase 4 — Integration Tests

```
╔══════════════════════════════════════════════════════════════╗
║         PHASE 4 — INTEGRATION TESTS                         ║
║         Recursive execution probe — no sign-off until done   ║
╚══════════════════════════════════════════════════════════════╝
```

## Phase 4 Pre-flight Facts

| Fact | Value |
|------|-------|
| Phases 1-3 completed? | Must be YES before starting |
| App URL | http://localhost:3000 |
| Mentor account | mentor@demo.hitaishi.app |
| Student account | student@demo.hitaishi.app |
| BrowserMCP | Already enabled in opencode.jsonc |
| Playwright installed? | Check: npx playwright --version |
| Fallback | Direct Playwright (npm i -D @playwright/test && npx playwright install chromium) |

## Phase 4 Goal

Run automated 2-browser chat test via BrowserMCP or Playwright. Verify:
1. Bidirectional real-time message delivery
2. Message history survives refresh
3. Non-participant gets 403/error
4. UX audit of all states

## Phase 4 Recursive Flow

```
START
  │
  ▼
Step 4.1 — ui-ux-tester (UX audit) ─→ PASS ──┐
                  │                           │
                  ▼ FAIL                      │
             debugger                         │
                  │                           │
                  ▼ FIXED                     │
             retry 4.1                        │
                                              ▼
Step 4.2 — webapp-testing (browser) ───────→ BOTH PASS ──→ PHASE 4 COMPLETE
                  │                                          │
                  ▼ FAIL                                     ▼ FAIL 2×
             debugger ◄───────────────────────────────── debugger
                  │                                          │
                  ▼ FIXED                                    ▼ ESCALATE
             retry 4.2                                  escalate to user
```

## Step 4.1 — UX Audit: `ui-ux-tester`

```
TASK: Phase 4.1 — UX audit of session chat
WORKDIR: G:\iit\hitaishi

FILES TO READ:
- app/session/[sessionId]/SessionRoomClient.tsx (lines 179-280 for JSX)
- app/session/[sessionId]/page.tsx (parent page context)

UX CHECKLIST:
  [ ] Chat panel side-by-side with video at lg breakpoint
  [ ] Mobile (< lg): single column, video on top, chat below
  [ ] Empty state text: "No messages yet. Say hello…"
  [ ] Loading state shows nothing harmful — empty area
  [ ] Error state clearly visible, doesn't crash page
  [ ] Sent vs received messages visually distinct (right/left, different colors)
  [ ] Pending messages show opacity-60
  [ ] Input has placeholder hint
  [ ] Send button visibly disabled when unusable
  [ ] Auto-scroll keeps newest message visible
  [ ] Screen reader friendly? aria labels on buttons?

RETURN:
  STATUS: PASS | PASS-WITH-FINDINGS | FAIL
  FINDINGS: max 5 items
  NOTES: any improvements suggested
```

## Step 4.2 — Browser Test: `webapp-testing`

```
TASK: Phase 4.2 — Automated 2-browser real-time chat test
WORKDIR: G:\iit\hitaishi

CONTEXT:
- App URL: http://localhost:3000
- Mentor: mentor@demo.hitaishi.app
- Student: student@demo.hitaishi.app
- Both accounts confirmed existing in DB
- Phases 1-3 (RLS, API, UI) already complete

TEST SETUP:
1. Check Playwright: npx playwright --version
   - If not installed: npm i -D @playwright/test && npx playwright install chromium
   - If that fails → use BrowserMCP (already enabled in opencode.jsonc)

2. Create a test script test-chat.mjs:

   The script should:
   a. Start the app if not running (npm run dev in background, or assume already running)
   b. Launch 3 browser contexts:
      - Context A: mentor@demo (logged in)
      - Context B: student@demo (logged in, separate incognito)
      - Context C: incognito (non-participant, NOT logged in)
   c. Navigate to login page, log in each context
   d. Navigate to a session room URL (need to create one or use an existing session ID)
   e. Send message from A → verify it appears on B within 3 seconds
   f. Send message from B → verify it appears on A within 3 seconds
   g. Refresh both → verify history loads
   h. Context C → verify 403/error on chat
   i. Take screenshots at each step
   j. Save screenshots to test-screenshots/ folder

3. Run the test script

TEST: npx playwright test test-chat.mjs --headed 2>&1
OR: node test-chat.mjs 2>&1

RETURN FORMAT:
  STATUS: ALL-PASS | PARTIAL-FAIL | FAIL
  STEPS:
    [✅] Login A (mentor)
    [✅] Login B (student)
    [✅] Navigate to session room (both)
    [✅] Send A → received B (<3s)
    [✅] Send B → received A (<3s)
    [✅] History on refresh (both)
    [✅] Non-participant blocked (Context C)
  SCREENSHOTS: path to each screenshot
  ERRORS: if any, exact browser console output
  TIMING: time per message delivery (ms)
```

## Step 4.3 (Emergency) — `debugger`

```
TASK: Phase 4.3 — Debug test failure
WORKDIR: G:\iit\hitaishi

PROBLEM: <embed exact failure details>

INVESTIGATE:
1. Check if app is running: curl http://localhost:3000/api/health
2. Check browser console errors from the failed test
3. Check network tab for failing requests
4. Check Supabase Realtime connection status
5. If run failed:
   - Check if Playwright is installed: npx playwright --version
   - Check if chromium is installed: npx playwright install chromium --dry-run
   - Try running in headed mode to see what happens

RETURN:
  ROOT CAUSE: 1-2 sentences
  STATUS: FIXED | STILL-BROKEN | ESCALATE
  FIX: what was changed
```

## Phase 4 Completion Criteria

- [ ] UX audit passed (all checklist items)
- [ ] 2-browser test passed (all 7 steps)
- [ ] Messages deliver within 3 seconds
- [ ] History persists on refresh
- [ ] Non-participant blocked
- [ ] Screenshots saved

## Phase 4 Max Retry Limits

| Step | Max | Then |
|------|-----|------|
| 4.1 | 2 | debugger |
| 4.2 | 3 | debugger |
| 4.3 | 1 | escalate |

## Phase 4 Completion Report

```
╔════════════════════════════════════════════════════╗
║              PHASE 4 — COMPLETION REPORT           ║
╠════════════════════════════════════════════════════╣
║ Step 4.1 (ui-ux-tester):            PASS | FAIL    ║
║ Step 4.2 (webapp-testing):          ALL-PASS |     ║
║                                     PARTIAL | FAIL ║
║ Step 4.3 (debugger):                N/A | FIXED    ║
╠════════════════════════════════════════════════════╣
║ Test script: test-chat.mjs                         ║
║ Screenshots: <path>                                ║
║ Message delivery time: <avg ms>                    ║
║ Ready for Phase 5: YES | BLOCKED                  ║
╚════════════════════════════════════════════════════╝
```

---

# Phase 5 — Deploy Gate

```
╔══════════════════════════════════════════════════════════════╗
║         PHASE 5 — DEPLOY GATE                               ║
║         Recursive execution probe — no sign-off until done   ║
╚══════════════════════════════════════════════════════════════╝
```

## Phase 5 Pre-flight Facts

| Fact | Value |
|------|-------|
| Phases 1-4 completed? | Must be YES before starting |
| Hosting | Vercel (hobby tier) |
| Files possibly modified | scripts/add-chat-rls.ts, possibly API/UI files from Phases 2-3 |

## Phase 5 Goal

Final build verification. Ensure nothing is broken. Confirm deploy readiness.

## Phase 5 Recursive Flow

```
START
  │
  ▼
Step 5.1 — devops-engineer ─────────→ PASS ──→ PHASE 5 COMPLETE
                  │                              │
                  ▼ FAIL                         └──→ ALL PHASES DONE
             debugger ◄──────→ retry 5.1
                  │
                  ▼ FAIL 3×
             escalate to user
```

## Step 5.1 — Gate: `devops-engineer`

```
TASK: Phase 5.1 — Final build check and deploy readiness
WORKDIR: G:\iit\hitaishi

CONTEXT:
- All previous phases complete
- Files may have been modified by Phases 2-3

EXECUTE (in this order):
1. npx tsc --noEmit
2. npm run lint
3. npm run build
4. npm test

Then verify:
5. scripts/add-chat-rls.ts exists (created in Phase 1)
6. No TODO/FIXME left in modified files:
   grep -r "TODO\|FIXME\|debugger\|console.log" --include="*.ts" --include="*.tsx" app/api/session app/api/chat lib/realtime app/session
7. .gitignore contains .env (check)
8. package.json scripts are intact (check)

RETURN FORMAT:
  STATUS: PASS | FAIL | PASS-WITH-NOTES
  BUILD: exit code
  LINT: exit code  
  TEST: pass count / total
  FILES STAGED: list of new/modified files to commit
  DEPLOY READINESS: ✅ ALL CLEAR | ⚠️ MINOR ISSUES | ❌ BLOCKING
  FOLLOW-UP: any manual steps needed before deploy
```

## Step 5.2 (Emergency) — `debugger`

```
TASK: Phase 5.2 — Debug build failure
WORKDIR: G:\iit\hitaishi

PROBLEM: <embed exact build error>

INVESTIGATE:
1. Run the failing command manually
2. Identify root cause (TS error, missing dep, lint violation)
3. Fix it
4. Re-run the full gate

RETURN:
  ROOT CAUSE: 1-2 sentences
  STATUS: FIXED | STILL-BROKEN | ESCALATE
  CHANGES: file:line
```

## Phase 5 Completion Criteria

- [ ] tsc --noEmit: 0 errors
- [ ] npm run lint: 0 warnings
- [ ] npm run build: compiled successfully
- [ ] npm test: all pass
- [ ] No TODO/FIXME left in touched files
- [ ] .env in .gitignore
- [ ] scripts/add-chat-rls.ts exists

## Phase 5 Max Retry Limits

| Step | Max | Then |
|------|-----|------|
| 5.1 | 3 | debugger |
| 5.2 | 1 | escalate |

## Phase 5 Completion Report

```
╔════════════════════════════════════════════════════╗
║              PHASE 5 — COMPLETION REPORT           ║
╠════════════════════════════════════════════════════╣
║ Step 5.1 (devops-engineer):        PASS | FAIL    ║
║ Step 5.2 (debugger):               N/A | FIXED    ║
╠════════════════════════════════════════════════════╣
║ tsc: 0 errors | errors                            ║
║ lint: 0 warnings | warnings                       ║
║ build: compiled | failed                          ║
║ tests: all pass | X/Y failing                     ║
║ Deploy readiness: ✅ ALL CLEAR                      ║
╚════════════════════════════════════════════════════╝
```

---

# Final — All Phases Complete

```
╔══════════════════════════════════════════════════════════════════╗
║              CHAT RESCUE — MASTER COMPLETION REPORT              ║
╠══════════════════════════════════════════════════════════════════╣
║ Phase 1 (DB Layer — RLS):          PASS | FAIL | SKIPPED        ║
║ Phase 2 (Backend API):             PASS | FAIL | SKIPPED        ║
║ Phase 3 (Frontend UI):             PASS | FAIL | SKIPPED        ║
║ Phase 4 (Integration Tests):       PASS | FAIL | SKIPPED        ║
║ Phase 5 (Deploy Gate):             PASS | FAIL | SKIPPED        ║
╠══════════════════════════════════════════════════════════════════╣
║ Files created:                                                  ║
║   - scripts/add-chat-rls.ts                                     ║
║   - test-chat.mjs                                               ║
║ Files modified:                                                 ║
║   - <list from Phases 2-3>                                      ║
╠══════════════════════════════════════════════════════════════════╣
║ TOTAL RLS POLICIES ADDED: 3                                     ║
║ TOTAL FILES AUDITED: 4 (Phase 2) + 1 (Phase 3) = 5             ║
║ SECURITY SIGN-OFFS: 3 (Phase 1, Phase 2, Phase 3)              ║
║ BROWSER TESTS PASSED: X/7                                       ║
╠══════════════════════════════════════════════════════════════════╣
║ Real-time chat IS WORKING: YES | NO | PARTIAL                   ║
║ Last blocker: <if any>                                          ║
║ Manual steps remaining: <list>                                  ║
║ Next action: <your recommendation>                              ║
╚══════════════════════════════════════════════════════════════════╝
```
