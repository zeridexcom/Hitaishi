import { conversationChannel } from "./channels";
import { scanMessage, type ScanFlag } from "./content-scanner";

export interface MessageStore {
  getConversationParticipants(conversationId: string): Promise<{
    participantIds: string[];
    flagged: boolean;
  } | null>;
  insertMessage(input: {
    conversationId: string;
    senderId: string;
    body: string;
    flags: ScanFlag[];
  }): Promise<{ id: string }>;
  markConversationFlagged(conversationId: string): Promise<void>;
  touchConversationActivity(conversationId: string): Promise<void>;
}

export interface RealtimePublisher {
  publish(channel: string, event: string, data: unknown): Promise<void>;
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  body: string;
}

export type SendMessageResult =
  | { status: "sent"; messageId: string; flags: ScanFlag[] }
  | { status: "invalid"; reason: string }
  | { status: "forbidden" }
  | { status: "not_found" };

const MAX_BODY_CHARS = 4000;

export async function sendMessage(
  input: SendMessageInput,
  store: MessageStore,
  publisher: RealtimePublisher,
): Promise<SendMessageResult> {
  const trimmed = input.body?.trim() ?? "";
  if (trimmed.length === 0) {
    return { status: "invalid", reason: "empty body" };
  }
  if (input.body.length > MAX_BODY_CHARS) {
    return { status: "invalid", reason: "body too long" };
  }

  const conv = await store.getConversationParticipants(input.conversationId);
  if (!conv) return { status: "not_found" };

  if (!conv.participantIds.includes(input.senderId)) {
    return { status: "forbidden" };
  }

  const scan = scanMessage(input.body);

  const row = await store.insertMessage({
    conversationId: input.conversationId,
    senderId: input.senderId,
    body: input.body,
    flags: scan.flags,
  });

  if (!scan.clean && !conv.flagged) {
    await store.markConversationFlagged(input.conversationId);
  }

  await store.touchConversationActivity(input.conversationId);

  await publisher.publish(
    conversationChannel(input.conversationId),
    "message:new",
    {
      id: row.id,
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: input.body,
      flags: scan.flags,
    },
  );

  return { status: "sent", messageId: row.id, flags: scan.flags };
}
