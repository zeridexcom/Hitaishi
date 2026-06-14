# Real-time Chat for Hitaishi — Full Implementation Plan

**Stack:** Vercel (Next.js 14.2 serverless) + Supabase Realtime + Supabase Postgres
**Target:** 1000+ concurrent users, minimal cost (~$45–90/mo)
**Audience:** Student ↔ Mentor 1:1, Admin → all (broadcast), Admin → any user (DM)
**Migration path:** Soketi on a $20/mo VPS once you exceed ~1500 CCU (swap one file)

---

## 1. Why this stack

- You're already on Supabase Postgres; Realtime uses logical replication — no new broker
- Vercel can't host persistent WebSockets; Supabase Realtime runs the WS layer separately
- Free tier covers 200 CCU, Pro ($25/mo) covers 500 — pay-as-you-go above
- The existing `RealtimePublisher` interface (`lib/messages.ts:38`) and `isAuthorizedForChannel` rules (`lib/channels.ts:26`) are perfect seams: we plug Supabase Realtime in as the concrete impl, zero contract changes

**Biggest risk:** naive impl burns CCU. We mitigate with single-connection-per-tab + lazy-subscribe.

---

## 2. Architecture

```
Browser (Vercel)                          Supabase
  ├─ /student/chat ──┐                    ├─ Postgres (messages, conversations, announcements)
  ├─ /mentor/chat  ──┤                    ├─ Realtime WS (pg logical replication)
  └─ /admin/chat   ──┘                    └─ Auth + RLS
        │                                  ▲
        │ HTTPS (Next.js API routes)       │
        ▼                                  │
  Next.js API (Vercel serverless) ─────────┘
    ├─ POST /api/chat/conversations/[id]/messages
    ├─ POST /api/admin/announcements
    ├─ POST /api/admin/dm/[userId]
    ├─ GET  /api/announcements?since=...
    ├─ GET  /api/chat/conversations/[id]/messages?cursor=...
    └─ POST /api/realtime/auth (channel subscribe auth)
```

**No Soketi, no Redis, no extra infra at this scale.** Cost: Supabase Pro $25 + Vercel Pro $20 ≈ $45/mo at 500 CCU; ~$70–90/mo at 1000 CCU.

---

## 3. Schema changes

### 3.1 Enable Realtime on existing tables (run in Supabase SQL editor)

```sql
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.announcements;
alter publication supabase_realtime add table public.announcement_reads;
```

### 3.2 RLS policies for messages (so Realtime broadcasts are filtered per-user)

```sql
alter table public.messages enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;

-- Participants (or admin) can SELECT a message
create policy "messages_select_participants" on public.messages for select
using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
  or coalesce(auth.jwt() ->> 'role', '') = 'admin'
);

-- Only the sender can INSERT (and only if they're a participant)
create policy "messages_insert_participants" on public.messages for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

-- Conversation visibility
create policy "conversations_select_participants" on public.conversations for select
using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversations.id and cp.user_id = auth.uid()
  )
  or coalesce(auth.jwt() ->> 'role', '') = 'admin'
);

create policy "conv_participants_select_self" on public.conversation_participants for select
using (user_id = auth.uid() or coalesce(auth.jwt() ->> 'role', '') = 'admin');
```

**Note:** Service role bypasses RLS. Use service role for server-side writes, anon key for client WS subscribe with RLS gating.

### 3.3 Idempotency column on messages

```sql
alter table public.messages
  add column client_msg_id uuid;

create unique index messages_client_msg_id_uq
  on public.messages (sender_id, client_msg_id)
  where client_msg_id is not null;
```

### 3.4 Announcements + reads (new tables)

```sql
create type announcement_audience as enum ('all', 'students', 'mentors');

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  body text not null check (char_length(body) <= 4000),
  audience announcement_audience not null default 'all',
  created_by uuid not null references public.users(id),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index announcements_created_at_idx on public.announcements (created_at desc);

create table public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

create index announcement_reads_user_idx on public.announcement_reads (user_id, read_at desc);

alter table public.announcements enable row level security;
alter table public.announcement_reads enable row level security;

-- Any authenticated user can read non-expired announcements targeted at their role
create policy "announcements_select_role" on public.announcements for select
using (
  expires_at is null or expires_at > now()
  and (
    audience = 'all'
    or (audience = 'students' and coalesce(auth.jwt() ->> 'role', '') in ('student', 'admin'))
    or (audience = 'mentors'  and coalesce(auth.jwt() ->> 'role', '') in ('mentor', 'admin'))
  )
);

create policy "announcements_insert_admin" on public.announcements for insert
with check (coalesce(auth.jwt() ->> 'role', '') = 'admin');

create policy "announcement_reads_select_self" on public.announcement_reads for select
using (user_id = auth.uid());

create policy "announcement_reads_insert_self" on public.announcement_reads for insert
with check (user_id = auth.uid());
```

### 3.5 Scale indexes

```sql
-- Cursor pagination for message history
create index messages_conv_id_id_desc_idx
  on public.messages (conversation_id, id desc);

-- Conversation list lookup
create index conversation_participants_user_conv_idx
  on public.conversation_participants (user_id, conversation_id);

-- When row count > 1M: monthly partitioning
-- (defer until metrics show need; document the migration in §10)
```

### 3.6 Drizzle schema updates

**File:** `db/schema/system.ts` (new)

```ts
import {
  pgTable, pgEnum, uuid, text, timestamp, index, primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const announcementAudienceEnum = pgEnum("announcement_audience", [
  "all", "students", "mentors",
]);

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    body: text("body").notNull(),
    audience: announcementAudienceEnum("audience").notNull().default("all"),
    createdBy: uuid("created_by").references(() => users.id).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ createdAtIdx: index("announcements_created_at_idx").on(t.createdAt) }),
);

export const announcementReads = pgTable(
  "announcement_reads",
  {
    announcementId: uuid("announcement_id").references(() => announcements.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.announcementId, t.userId] }) }),
);
```

**File:** `db/schema/mentorship.ts` — add `clientMsgId` to messages:

```ts
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("sender_id").references(() => users.id).notNull(),
    body: text("body").notNull(),
    attachments: jsonb("attachments"),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    clientMsgId: uuid("client_msg_id"),  // NEW
    ...ts(),
  },
  (t) => ({
    convIdx: index("messages_conversation_idx").on(t.conversationId),
    // composite for cursor pagination (added in §3.5 SQL)
  }),
);
```

**File:** `db/schema/index.ts` — export the new schema.

---

## 4. Files to create

### 4.1 Realtime client/server wrappers

**File:** `lib/realtime/client.ts` (browser)

```ts
"use client";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: { params: { eventsPerSecond: 10 } },
      auth: { persistSession: true, autoRefreshToken: true },
    },
  );
  return _client;
}

const subs = new Map<string, RealtimeChannel>();
let activeConvId: string | null = null;

export function subscribeConversation(
  conversationId: string,
  onMessage: (msg: { id: string; senderId: string; body: string; createdAt: string }) => void,
  onEdit?: (msg: { id: string; body: string }) => void,
): () => void {
  const c = getClient();
  const channel = c.channel(`private-conversation-${conversationId}`, {
    config: { broadcast: { ack: false, self: false }, private: true },
  });
  channel
    .on("broadcast", { event: "message:new" }, ({ payload }) => onMessage(payload))
    .on("broadcast", { event: "message:edited" }, ({ payload }) => onEdit?.(payload))
    .subscribe();
  subs.set(conversationId, channel);
  activeConvId = conversationId;
  return () => {
    channel.unsubscribe();
    subs.delete(conversationId);
    if (activeConvId === conversationId) activeConvId = null;
  };
}

export function subscribeAnnouncements(
  onAnnounce: (a: { id: string; body: string; createdAt: string; audience: string }) => void,
): () => void {
  const c = getClient();
  const channel = c.channel("public:announcements");
  channel
    .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "announcements" },
      (payload) => onAnnounce(payload.new as any))
    .subscribe();
  return () => { channel.unsubscribe(); };
}

export function subscribeTyping(conversationId: string, onTyping: (userId: string) => void) {
  const c = getClient();
  const channel = c.channel(`private-typing-${conversationId}`, { config: { broadcast: { ack: false }, presence: { key: "self" } } });
  channel.on("broadcast", { event: "typing" }, ({ payload }) => onTyping(payload.userId)).subscribe();
  return () => channel.unsubscribe();
}

export function publishTyping(conversationId: string, userId: string) {
  const channel = subs.get(conversationId);
  channel?.send({ type: "broadcast", event: "typing", payload: { userId } });
}

export function pauseOnHide(): () => void {
  if (typeof document === "undefined") return () => {};
  const handler = () => {
    if (document.visibilityState === "hidden") {
      for (const ch of subs.values()) ch.unsubscribe();
    } else if (activeConvId) {
      // re-subscribe the last active conversation
      const last = activeConvId;
      const ch = subs.get(last);
      ch?.subscribe();
    }
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
```

**File:** `lib/realtime/server.ts` (server-side publisher)

```ts
import { createClient } from "@supabase/supabase-js";
import type { RealtimePublisher, RealtimeEvent } from "../messages";

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  return _client;
}

export const supabaseRealtimePublisher: RealtimePublisher = {
  async publish(channel: string, event: RealtimeEvent) {
    const c = getClient();
    const ch = c.channel(channel, { config: { private: true } });
    await new Promise<void>((resolve, reject) => {
      ch.subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          reject(new Error(`subscribe ${status}`));
        }
      });
      setTimeout(() => reject(new Error("subscribe timeout")), 5000);
    });
    const r = await ch.send({ type: "broadcast", event: event.type, payload: event.payload });
    await ch.unsubscribe();
    if (r !== "ok") throw new Error(`send ${r}`);
  },
};
```

**File:** `lib/realtime/publishMessage.ts` — admin broadcast + DM publisher

```ts
import { supabaseRealtimePublisher } from "./server";
import { conversationChannel } from "../channels";

export async function publishNewMessage(conversationId: string, payload: {
  id: string; senderId: string; body: string; createdAt: string;
}) {
  return supabaseRealtimePublisher.publish(conversationChannel(conversationId), {
    type: "message:new",
    payload: { ...payload, conversationId },
  });
}
```

### 4.2 API routes

**File:** `app/api/chat/conversations/[id]/messages/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { messages, conversationParticipants, conversations } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { sendMessage } from "@/lib/messages";
import { scanMessage } from "@/lib/content-scanner";
import { publishNewMessage } from "@/lib/realtime/publishMessage";

const Body = z.object({
  body: z.string().min(1).max(4000),
  clientMsgId: z.string().uuid().optional(),
});

const store = {
  async withTransaction<T>(fn: () => Promise<T>) {
    return db.transaction(async (tx) => { return fn(); });
  },
  async getConversationParticipants(conversationId: string) {
    const rows = await db
      .select({ userId: conversationParticipants.userId, flagged: conversations.flagged })
      .from(conversationParticipants)
      .innerJoin(conversations, eq(conversations.id, conversationParticipants.conversationId))
      .where(eq(conversationParticipants.conversationId, conversationId));
    if (rows.length === 0) return null;
    return { participantIds: rows.map((r: any) => r.userId), flagged: rows[0].flagged };
  },
  async insertMessage(input: { conversationId: string; senderId: string; body: string; clientMsgId?: string }) {
    const [r] = await db.insert(messages).values({
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: input.body,
      clientMsgId: input.clientMsgId ?? null,
    }).returning({ id: messages.id });
    return { id: r!.id };
  },
  async markConversationFlagged(conversationId: string) {
    await db.update(conversations)
      .set({ flagged: true })
      .where(and(eq(conversations.id, conversationId), eq(conversations.flagged, false)));
  },
  async touchConversationActivity(conversationId: string) {
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  },
};

const publisher = {
  async publish(channel: string, event: any) {
    if (event.type !== "message:new") return;
    await publishNewMessage(event.payload.conversationId, {
      id: event.payload.id,
      senderId: event.payload.senderId,
      body: event.payload.body,
      createdAt: new Date().toISOString(),
    });
  },
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const idempotencyKey = req.headers.get("x-idempotency-key");
  if (idempotencyKey) {
    const existing = await db.select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.senderId, user.id), eq(messages.clientMsgId, idempotencyKey)))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ id: existing[0].id, deduped: true }, { status: 200 });
    }
  }

  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const result = await sendMessage(
    { conversationId: params.id, senderId: user.id, body: parsed.data.body },
    { ...store, insertMessage: (i: any) => store.insertMessage({ ...i, clientMsgId: idempotencyKey ?? undefined }) } as any,
    publisher,
  );

  if (result.status === "forbidden") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (result.status === "not_found") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.status === "invalid")   return NextResponse.json({ error: result.reason }, { status: 400 });
  if (result.status === "sent_unpublished") {
    return NextResponse.json({ id: result.messageId, flags: result.flags, published: false }, { status: 202 });
  }
  return NextResponse.json({ id: result.messageId, flags: result.flags, published: true }, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 30), 100);

  const rows = await db.select({
    id: messages.id, senderId: messages.senderId, body: messages.body,
    createdAt: messages.createdAt, editedAt: messages.editedAt,
  })
  .from(messages)
  .where(eq(messages.conversationId, params.id))
  .orderBy(sql`${messages.id} desc`)
  .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = (hasMore ? rows.slice(0, limit) : rows).reverse();
  return NextResponse.json({ items, nextCursor: hasMore ? items[0]?.id : null });
}
```

**File:** `app/api/chat/conversations/route.ts` — list user's conversations (with cache)

```ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/cache"; // optional; see §7
import { db } from "@/lib/db";
import { conversationParticipants, conversations, messages, users, profiles } from "@/db/schema";
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cacheKey = `convs:${user.id}`;
  // const cached = await redis.get(cacheKey);
  // if (cached) return NextResponse.json(JSON.parse(cached));

  const myParticipations = await db.select({ convId: conversationParticipants.conversationId })
    .from(conversationParticipants).where(eq(conversationParticipants.userId, user.id));
  const convIds = myParticipations.map((p: any) => p.convId);
  if (convIds.length === 0) return NextResponse.json({ items: [] });

  const [convs, allParticipants, latestMsgs] = await Promise.all([
    db.select().from(conversations).where(inArray(conversations.id, convIds)).orderBy(desc(conversations.lastMessageAt)),
    db.select({
      conversationId: conversationParticipants.conversationId,
      userId: users.id, email: users.email, fullName: profiles.fullName,
    })
    .from(conversationParticipants)
    .innerJoin(users, eq(users.id, conversationParticipants.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(inArray(conversationParticipants.conversationId, convIds)),
    db.select({
      conversationId: messages.conversationId, body: messages.body, createdAt: messages.createdAt,
    })
    .from(messages)
    .where(inArray(messages.conversationId, convIds))
    .orderBy(desc(messages.createdAt)),
  ]);

  const result = convs.map((c: any) => {
    const others = allParticipants.filter((p: any) => p.conversationId === c.id && p.userId !== user.id);
    const latest = latestMsgs.find((m: any) => m.conversationId === c.id);
    const o = others[0];
    return {
      id: c.id, type: c.type, title: c.title,
      otherId: o?.userId, otherName: o?.fullName ?? o?.email ?? "Unknown",
      otherEmail: o?.email, lastMessageAt: c.lastMessageAt, preview: latest?.body ?? "",
    };
  });

  // await redis.set(cacheKey, JSON.stringify(result), "EX", 5);
  return NextResponse.json({ items: result });
}
```

**File:** `app/api/admin/announcements/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { announcements } from "@/db/schema";
import { requireRole } from "@/lib/session";

const Body = z.object({
  body: z.string().min(1).max(4000),
  audience: z.enum(["all", "students", "mentors"]).default("all"),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireRole("admin");
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const [row] = await db.insert(announcements).values({
    body: parsed.data.body, audience: parsed.data.audience,
    createdBy: user.id, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
  }).returning();
  return NextResponse.json({ id: row!.id }, { status: 201 });
}
```

**File:** `app/api/announcements/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements, announcementReads } from "@/db/schema";
import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const since = url.searchParams.get("since");

  const audienceFilter =
    user.role === "admin" ? undefined :
    user.role === "student" ? or(eq(announcements.audience, "all"), eq(announcements.audience, "students")) :
    or(eq(announcements.audience, "all"), eq(announcements.audience, "mentors"));

  const rows = await db.select().from(announcements)
    .where(and(
      or(isNull(announcements.expiresAt), gt(announcements.expiresAt, new Date())),
      since ? gt(announcements.createdAt, new Date(since)) : undefined,
      audienceFilter,
    ))
    .orderBy(desc(announcements.createdAt))
    .limit(50);

  const reads = await db.select({ announcementId: announcementReads.announcementId })
    .from(announcementReads)
    .where(eq(announcementReads.userId, user.id));
  const readSet = new Set(reads.map((r: any) => r.announcementId));

  return NextResponse.json({
    items: rows.map((r: any) => ({ ...r, read: readSet.has(r.id) })),
  });
}
```

**File:** `app/api/announcements/[id]/read/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcementReads } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await db.insert(announcementReads).values({ announcementId: params.id, userId: user.id })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true });
}
```

**File:** `app/api/admin/dm/[userId]/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversations, conversationParticipants, assignments, users } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { userId: string } }) {
  const admin = await requireRole("admin");
  const target = params.userId;

  const targetUser = await db.select({ id: users.id, role: users.role })
    .from(users).where(eq(users.id, target)).limit(1);
  if (targetUser.length === 0) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  const role = targetUser[0]!.role;
  const convType = role === "mentor" ? "student_mentor" : "student_mentor";

  // Find existing DM conv
  const existing = await db.select({ id: conversations.id })
    .from(conversations)
    .innerJoin(conversationParticipants, eq(conversationParticipants.conversationId, conversations.id))
    .where(inArray(conversationParticipants.userId, [admin.id, target]))
    .groupBy(conversations.id)
    .having(sql`count(*) = 2 and bool_or(${conversationParticipants.userId} = ${admin.id}) and bool_or(${conversationParticipants.userId} = ${target})`);

  if (existing.length > 0) return NextResponse.json({ id: existing[0]!.id });

  const [conv] = await db.insert(conversations).values({ type: convType }).returning();
  await db.insert(conversationParticipants).values([
    { conversationId: conv!.id, userId: admin.id },
    { conversationId: conv!.id, userId: target },
  ]);
  return NextResponse.json({ id: conv!.id }, { status: 201 });
}
```

**File:** `app/api/realtime/auth/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { conversationParticipants } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { isAuthorizedForChannel } from "@/lib/channels";

// Pusher-style channel auth endpoint
// POST { socket_id, channel_name } -> { auth: `${key}:${hmac}` }
// For Supabase Realtime, this is the equivalent of /api/realtime/auth
// Note: Supabase uses RLS instead of explicit channel auth; this endpoint
// is here as a placeholder if you migrate to Pusher/Soketi later.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { channel } = await req.json();
  if (channel?.startsWith("private-conversation-")) {
    const convId = channel.replace("private-conversation-", "");
    const rows = await db.select({ userId: conversationParticipants.userId })
      .from(conversationParticipants).where(eq(conversationParticipants.conversationId, convId));
    const ok = isAuthorizedForChannel({
      channel, userId: user.id, role: user.role as any,
      participantIds: rows.map((r: any) => r.userId),
    });
    if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
```

### 4.3 Client components

**File:** `app/student/chat/ChatClient.tsx`

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { initials } from "@/lib/format";
import { subscribeConversation, subscribeTyping, publishTyping, pauseOnHide } from "@/lib/realtime/client";

type Msg = { id: string; senderId: string; body: string; createdAt: string; pending?: boolean };
type Conv = { id: string; otherName: string; otherEmail: string; lastMessageAt: string | null; preview: string };

export function ChatClient({ userId, initialConvs }: { userId: string; initialConvs: Conv[] }) {
  const [convs, setConvs] = useState<Conv[]>(initialConvs);
  const [activeId, setActiveId] = useState<string | null>(initialConvs[0]?.id ?? null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => pauseOnHide(), []);

  useEffect(() => {
    if (!activeId) return;
    setMessages([]);
    fetch(`/api/chat/conversations/${activeId}/messages`)
      .then(r => r.json())
      .then(d => setMessages(d.items ?? []));

    const unsubMsg = subscribeConversation(activeId, (m) => {
      setMessages(prev => prev.some(x => x.id === m.id) ? prev : [...prev, { ...m, createdAt: m.createdAt }]);
    });
    const unsubTyping = subscribeTyping(activeId, (uid) => {
      setTyping(prev => new Set(prev).add(uid));
      setTimeout(() => setTyping(prev => { const s = new Set(prev); s.delete(uid); return s; }), 3000);
    });
    return () => { unsubMsg(); unsubTyping(); };
  }, [activeId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages]);

  async function send() {
    const body = draft.trim();
    if (!body || !activeId) return;
    const clientMsgId = crypto.randomUUID();
    const optimistic: Msg = { id: clientMsgId, senderId: userId, body, createdAt: new Date().toISOString(), pending: true };
    setMessages(prev => [...prev, optimistic]);
    setDraft("");
    try {
      const r = await fetch(`/api/chat/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-idempotency-key": clientMsgId },
        body: JSON.stringify({ body, clientMsgId }),
      });
      if (!r.ok) throw new Error("send failed");
      const data = await r.json();
      setMessages(prev => prev.map(m => m.id === clientMsgId ? { ...m, id: data.id, pending: false } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === clientMsgId ? { ...m, pending: false } : m));
    }
  }

  const active = convs.find(c => c.id === activeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 h-[70vh]">
      <Card className="overflow-y-auto">
        <div className="px-4 py-3 border-b border-rule meta">ACTIVE CONVERSATIONS</div>
        {convs.length === 0
          ? <CardBody><p className="text-sm text-ink-soft text-center">No conversations yet.</p></CardBody>
          : <ul>{convs.map(c => (
              <li key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`px-4 py-3 border-b border-rule hover:bg-surface-elevated cursor-pointer ${activeId === c.id ? "bg-primary-soft" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="avatar !w-9 !h-9 !text-sm">{initials(c.otherName)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.otherName}</div>
                    <div className="text-xs text-ink-faint truncate">{c.preview || "No messages yet"}</div>
                  </div>
                </div>
              </li>
            ))}</ul>}
      </Card>

      <Card className="flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.length === 0
            ? <p className="text-sm text-ink-soft text-center py-10">No messages yet. Say hello.</p>
            : messages.map(m => {
                const mine = m.senderId === userId;
                return (
                  <div key={m.id} className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}>
                    <div className="avatar !w-8 !h-8 !text-xs">{initials(mine ? "You" : active?.otherName ?? "")}</div>
                    <div className={`max-w-[70%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div className={`rounded-card px-4 py-3 text-sm ${mine ? "bg-primary text-primary-on" : "bg-surface-elevated text-ink"} ${m.pending ? "opacity-60" : ""}`}>
                        {m.body}
                      </div>
                      <span className="meta mt-1">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                );
              })}
          {typing.size > 0 && <div className="meta italic">typing…</div>}
        </div>
        <div className="border-t border-rule p-4 flex items-center gap-3">
          <input
            value={draft}
            onChange={(e) => { setDraft(e.target.value); if (activeId) publishTyping(activeId, userId); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message…"
            className="flex-1 rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button onClick={send} className="chip-cta">Send</button>
        </div>
      </Card>
    </div>
  );
}
```

**File:** `app/student/chat/page.tsx` — rewrite to use ChatClient (the server component fetches initial convs and passes them down)

**File:** `app/mentor/chat/page.tsx` (new) — same component, mentor role
**File:** `app/mentor/chat/ChatClient.tsx` (new) — mirror of student ChatClient

**File:** `app/admin/chat/page.tsx` (new) — admin observer (read-only) + compose DM

**File:** `app/admin/chat/AdminChatClient.tsx` (new) — list users, open DM, observe any conversation

**File:** `components/Bell.tsx` (new) — announcement dropdown in `Shell` header

```tsx
"use client";
import { useEffect, useState } from "react";

type A = { id: string; body: string; createdAt: string; read: boolean; audience: string };

export function Bell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<A[]>([]);
  const unread = items.filter(a => !a.read).length;

  useEffect(() => {
    fetch("/api/announcements").then(r => r.json()).then(d => setItems(d.items ?? []));
    const i = setInterval(() => fetch("/api/announcements").then(r => r.json()).then(d => setItems(d.items ?? [])), 60_000);
    return () => clearInterval(i);
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/announcements/${id}/read`, { method: "POST" });
    setItems(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative p-2 rounded-full hover:bg-surface-elevated">
        <span aria-hidden>🔔</span>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-card border border-rule rounded-card shadow-lg z-50">
          <div className="p-3 border-b border-rule meta">ANNOUNCEMENTS</div>
          {items.length === 0
            ? <div className="p-4 text-sm text-ink-soft text-center">No announcements</div>
            : <ul className="max-h-80 overflow-y-auto">
                {items.map(a => (
                  <li key={a.id} onClick={() => markRead(a.id)}
                      className={`p-3 border-b border-rule cursor-pointer ${a.read ? "opacity-60" : "bg-primary-soft/30"}`}>
                    <div className="text-sm">{a.body}</div>
                    <div className="meta mt-1">{new Date(a.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>}
        </div>
      )}
    </div>
  );
}
```

**File:** `app/admin/chat/compose/page.tsx` (new) — admin compose announcement form (calls `POST /api/admin/announcements`)

### 4.4 Shell integration

**File:** `components/Shell.tsx` — add `<Bell />` to the header

---

## 5. Phase-by-phase build order

| Phase | Days | Deliverable |
|-------|------|-------------|
| **0. Prep** | 0.5 | `npm i @supabase/supabase-js` (peer of existing client pattern) |
| **1. Realtime plumbing** | 1–2 | SQL migrations (§3.1, §3.2), `lib/realtime/{client,server}.ts`, channel auth endpoint |
| **2. Send + chat UI** | 3–5 | `POST /api/chat/.../messages`, `ChatClient`, student + mentor + admin pages |
| **3. Admin broadcast** | 1–2 | `announcements` + `announcement_reads` tables, API routes, `Bell.tsx`, compose UI |
| **4. Admin DM** | 1 | `POST /api/admin/dm/[userId]`, admin chat UI with user list |
| **5. Scale hardening** | 2–3 | Indexes (§3.5), rate limits (§6.2), lazy-subscribe (`pauseOnHide`), throttled typing |
| **6. Observability** | 1 | Sentry capture on publish failures, PostHog events for connect/send/reconnect |
| **Total** | **9–14 days** | |

---

## 6. Scale hardening (Phase 5)

### 6.1 Connection budget

- **Single WS per tab**: each `subscribe*` reuses the same `realtime.channel()` instance via the `subs` map in `lib/realtime/client.ts`
- **Lazy-subscribe**: only import `lib/realtime/client` from the chat page; other pages don't open the WS
- **Pause on hide**: `pauseOnHide()` subscribes to `document.visibilitychange`; unsubscribes on `hidden`, resubscribes on `visible`
- **Throttle typing**: `publishTyping` is throttled to 1 broadcast per 3s in the caller (add a `lastTypingSent` ref in `ChatClient`)
- **Presence heartbeat**: Supabase Realtime default 25s — no action needed

### 6.2 Rate limits (server-side, Postgres-backed)

**File:** `app/api/chat/conversations/[id]/messages/route.ts` — add before `sendMessage`:

```ts
const oneMinAgo = new Date(Date.now() - 60_000);
const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
  .from(messages)
  .where(and(eq(messages.senderId, user.id), gt(messages.createdAt, oneMinAgo)));
if (count > 30) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
```

(For burst control, add an in-memory token bucket in `lib/rate-limit.ts` keyed by userId; refresh on sliding 1s window.)

### 6.3 Backpressure

- Bounded outbox: Supabase Realtime drops oldest events if a client connection is in `JOINING` for >10s (server-side; not configurable client-side, but the client just disconnects and reconnects with `last_seen_id`)
- Cursor recovery on reconnect: in `ChatClient`, when WS reconnects, refetch `GET /api/chat/conversations/[id]/messages?cursor=lastSeenId` to fill the gap
- Idempotency key (UUID per send) prevents duplicate inserts on retry

### 6.4 Caching

**Optional but recommended** at >500 CCU. Wire Redis (env var `REDIS_URL` already set):

**File:** `lib/cache.ts`

```ts
import { createClient } from "redis";
const _r = createClient({ url: process.env.REDIS_URL });
let connected = false;
async function ensure() { if (!connected) { await _r.connect(); connected = true; } return _r; }
export const redis = { get: async (k: string) => (await ensure()).get(k), set: async (k: string, v: string, ...args: any[]) => (await ensure()).set(k, v, ...args) };
```

Cache `convs:{userId}` for 5s, invalidate via a `lastMessageAt` change (read-through is fine at this scale — 5s staleness is acceptable).

---

## 7. Observability (Phase 6)

| Tool | Event | Field |
|------|-------|-------|
| Sentry | `publish_failed` | conv_id, sender_id, retry_count, error |
| Sentry | `rate_limited` | user_id, count |
| PostHog | `chat_connected` | user_role, latency_ms |
| PostHog | `chat_disconnected` | user_role, duration_s, reason |
| PostHog | `message_sent` | user_role, conv_type, body_len, publish_latency_ms |
| Supabase Dashboard | Realtime CCU | (built-in) |
| Vercel | API p95 | (built-in) |

---

## 8. Open decisions (need user input)

| # | Question | Default if not answered |
|---|----------|------------------------|
| 1 | Move full auth to Supabase Auth, or keep current session cookie + use Supabase anon key only for WS? | Keep current cookie; anon key for WS only |
| 2 | Attachments support (S3/R2, env wired)? | Skip for v1; `attachments jsonb` column is there but unused |
| 3 | Read receipts (blue ticks)? | Defer; add `read_by` table in Phase 7 |
| 4 | Typing indicators? | Yes, throttled 1/3s |
| 5 | Message search? | Defer; add `tsvector` index + GIN search in Phase 8 |
| 6 | Mobile push (web push API)? | Defer; Bell + in-page is enough for v1 |

---

## 9. Cost projection at 1000 CCU

| Service | Tier | Cost |
|---------|------|------|
| Supabase Pro | $25/mo base + Realtime CCU beyond 500 | $25 + ~$30 = **$55** |
| Vercel Pro | Functions + edge bandwidth | **$20** |
| Domain + email (Resend) | | **$0–20** |
| **Total** | | **~$75–95/mo** |

Migration off Supabase Realtime at >1500 CCU: deploy Soketi on a Hetzner CX22 ($5/mo), point `lib/realtime/server.ts` to it. The `RealtimePublisher` swap is one file.

---

## 10. Future hardening (post-1000 CCU)

| Concern | Mitigation |
|---------|-----------|
| `messages` table growth (1KB × 100 msgs/day × 1000 users = ~3GB/mo) | Monthly partitioning: `ALTER TABLE messages PARTITION BY RANGE (created_at);` with `messages_2026_06`, `messages_2026_07`, etc. Move old partitions to cold storage (Supabase doesn't natively support this; manual export to R2). |
| Slow conversation list | Materialized view `conversation_summaries(user_id, conv_id, last_msg, unread_count)` refreshed every 5s via cron |
| Hot conversations (popular mentor with 100+ active students) | `pg_advisory_xact_lock(hashtext(conv_id))` to serialize inserts; or queue via `pg_queue` extension |
| Realtime WS reconnect storms | Exponential backoff (1s, 2s, 4s, max 30s) in `realtime-js` client config |
| Abuse / spam | `lib/content-scanner.ts` already flags phone/email/off-platform; add a daily sender cap (e.g. 500 msgs/day) |

---

## 11. File inventory

**New files (15):**
- `db/schema/system.ts`
- `lib/realtime/client.ts`
- `lib/realtime/server.ts`
- `lib/realtime/publishMessage.ts`
- `lib/cache.ts` (optional)
- `app/api/chat/conversations/[id]/messages/route.ts`
- `app/api/chat/conversations/route.ts`
- `app/api/admin/announcements/route.ts`
- `app/api/admin/dm/[userId]/route.ts`
- `app/api/announcements/route.ts`
- `app/api/announcements/[id]/read/route.ts`
- `app/api/realtime/auth/route.ts`
- `app/student/chat/ChatClient.tsx`
- `app/mentor/chat/page.tsx` + `app/mentor/chat/ChatClient.tsx`
- `app/admin/chat/page.tsx` + `app/admin/chat/AdminChatClient.tsx`
- `app/admin/chat/compose/page.tsx`
- `components/Bell.tsx`

**Modified files (4):**
- `db/schema/mentorship.ts` — add `clientMsgId` to messages
- `db/schema/index.ts` — export new schema
- `app/student/chat/page.tsx` — pass initial data to ChatClient
- `components/Shell.tsx` — add `<Bell />` in header
- `package.json` — add `@supabase/supabase-js`

**SQL migrations (1 file):**
- `db/migrations/0003_realtime_chat.sql` — all SQL from §3.1–3.5 in one file

---

## 12. Acceptance criteria

- [ ] Student A sends a message → Mentor B sees it within 1s
- [ ] Mentor B replies → Student A sees it within 1s
- [ ] Admin opens any conversation in read-only mode (TOS-disclosed)
- [ ] Admin posts announcement → all online users see it in the Bell within 1s
- [ ] User sends duplicate with same `X-Idempotency-Key` → server returns the same `id`, no duplicate row
- [ ] User refreshes mid-send → no duplicate message appears
- [ ] User tab hidden for 60s → WS closes; visible again → reconnects within 2s, no missed messages
- [ ] User sends 31st message in 60s → 429 response, UI shows retry
- [ ] Sentry receives `publish_failed` when Supabase Realtime is down; messages still persist in DB
- [ ] Lighthouse score for /student/chat: Performance ≥ 85, single WS connection verified in DevTools
