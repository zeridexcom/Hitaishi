import { createHmac, randomUUID } from "node:crypto";

export type HmsRole = "host" | "participant" | "observer";

export interface IssueTokenInput {
  appAccessKey: string;
  appSecret: string;
  roomId: string;
  userId: string;
  role: HmsRole;
  /** seconds; default 3600 (1 hour) */
  ttlSeconds?: number;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

export function issueHmsToken(input: IssueTokenInput): string {
  if (!input.appAccessKey) throw new Error("appAccessKey required");
  if (!input.appSecret || input.appSecret.length < 32) {
    throw new Error("appSecret must be at least 32 chars");
  }
  if (!input.roomId || !input.userId) {
    throw new Error("roomId and userId required");
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = input.ttlSeconds ?? 3600;

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    access_key: input.appAccessKey,
    room_id: input.roomId,
    user_id: input.userId,
    role: input.role,
    type: "app",
    version: 2,
    jti: randomUUID(),
    iat: now,
    nbf: now,
    exp: now + ttl,
  };

  const h = b64url(Buffer.from(JSON.stringify(header)));
  const p = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", input.appSecret)
    .update(`${h}.${p}`)
    .digest("base64url");

  return `${h}.${p}.${sig}`;
}
