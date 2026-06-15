import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversationParticipants, conversations, messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { sendMessage, type MessageStore, type RealtimePublisher } from "@/lib/messages";
import { broadcastNewMessage } from "@/lib/realtime/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// In-process rate limiter: max 20 messages per 10 seconds per user
const rateLimits = new Map<string, number[]>();
function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entries = rateLimits.get(key) ?? [];
  const windowed = entries.filter((t) => now - t < windowMs);
  if (windowed.length >= limit) return false;
  windowed.push(now);
  rateLimits.set(key, windowed);
  return true;
}

const Body = z.object({
  body: z.string().min(1).max(4000),
});

const store: MessageStore = {
  async withTransaction<T>(fn: () => Promise<T>) {
    return db.transaction(async () => fn());
  },
  async getConversationParticipants(conversationId) {
    const rows = await db
      .select({ userId: conversationParticipants.userId, flagged: conversations.flagged })
      .from(conversationParticipants)
      .innerJoin(conversations, eq(conversations.id, conversationParticipants.conversationId))
      .where(eq(conversationParticipants.conversationId, conversationId));
    if (rows.length === 0) return null;
    return { participantIds: (rows as any[]).map((r) => r.userId), flagged: rows[0].flagged };
  },
  async insertMessage(input) {
    const [r] = await db
      .insert(messages)
      .values({ conversationId: input.conversationId, senderId: input.senderId, body: input.body, flags: input.flags })
      .returning({ id: messages.id });
    return { id: r!.id };
  },
  async markConversationFlagged(conversationId) {
    await db
      .update(conversations)
      .set({ flagged: true })
      .where(and(eq(conversations.id, conversationId), eq(conversations.flagged, false)));
  },
  async touchConversationActivity(conversationId) {
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  },
};

const realtimePublisher: RealtimePublisher = {
  async publish(_channel, event) {
    if (event.type === "message:new") {
      broadcastNewMessage({
        id: event.payload.id,
        conversation_id: event.payload.conversationId,
        sender_id: event.payload.senderId,
        body: event.payload.body,
        created_at: new Date().toISOString(),
      }).catch(() => {});
    }
  },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid conversation id" }, { status: 400 });
  }

  if (!checkRateLimit(user.id, 20, 10_000)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const result = await sendMessage(
    { conversationId: id, senderId: user.id, body: parsed.data.body },
    store,
    realtimePublisher,
  );

  if (result.status === "forbidden") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (result.status === "not_found") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.status === "invalid") return NextResponse.json({ error: result.reason }, { status: 400 });
  return NextResponse.json({ id: result.messageId, flags: result.flags }, { status: 201 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid conversation id" }, { status: 400 });
  }

  const participant = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.conversationId, id));
  const ids = (participant as any[]).map((p) => p.userId);
  const isAdmin = user.role === "admin";
  if (!isAdmin && !ids.includes(user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const rows = await db
    .select({
      id: messages.id,
      senderId: messages.senderId,
      body: messages.body,
      flags: messages.flags,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return NextResponse.json({ items: rows });
}
