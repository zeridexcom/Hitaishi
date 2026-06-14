"use client";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: { params: { eventsPerSecond: 20 } },
      auth: { persistSession: false },
    },
  );
  return _client;
}

export type IncomingMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export function subscribeToConversation(
  conversationId: string,
  onMessage: (msg: IncomingMessage) => void,
): () => void {
  const c = getClient();
  const channel: RealtimeChannel = c
    .channel(`messages-conv-${conversationId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
      (payload) => {
        const r = payload.new as any;
        onMessage({
          id: r.id,
          conversationId: r.conversation_id,
          senderId: r.sender_id,
          body: r.body,
          createdAt: r.created_at,
        });
      },
    )
    .subscribe();
  return () => {
    c.removeChannel(channel);
  };
}

export function subscribeToConversationList(
  userId: string,
  onChange: () => void,
): () => void {
  const c = getClient();
  const channel = c
    .channel("messages-list")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      () => onChange(),
    )
    .subscribe();
  return () => {
    c.removeChannel(channel);
  };
}
