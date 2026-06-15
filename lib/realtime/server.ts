import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

async function sendOnChannel(channelName: string, event: string, payload: unknown) {
  const client = getClient();
  if (!client) return;
  const channel = client.channel(channelName);
  await new Promise<void>((resolve) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({ type: "broadcast", event, payload });
        resolve();
      }
    });
  });
  client.removeChannel(channel);
}

export async function broadcastNewMessage(payload: {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}) {
  await Promise.all([
    sendOnChannel(`messages-conv-${payload.conversation_id}`, "message:new", payload),
    sendOnChannel("sidebar-updates", "sidebar:update", {
      conversation_id: payload.conversation_id,
      preview: payload.body,
      sender_id: payload.sender_id,
      created_at: payload.created_at,
    }),
  ]);
}
