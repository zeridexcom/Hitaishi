import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { issueHmsToken } from "./hms";

const APP_ACCESS_KEY = "appkey_test";
const APP_SECRET = "secret_test_at_least_32_chars_long_xx";

function decode(token: string) {
  const [h, p, s] = token.split(".");
  const header = JSON.parse(Buffer.from(h, "base64url").toString());
  const payload = JSON.parse(Buffer.from(p, "base64url").toString());
  const expectedSig = createHmac("sha256", APP_SECRET)
    .update(`${h}.${p}`)
    .digest("base64url");
  return { header, payload, signatureValid: s === expectedSig };
}

describe("issueHmsToken", () => {
  it("issues a 3-part JWT (header.payload.signature)", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "room_1",
      userId: "user_1",
      role: "host",
    });
    expect(t.split(".").length).toBe(3);
  });

  it("uses HS256 header", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "r",
      userId: "u",
      role: "host",
    });
    expect(decode(t).header.alg).toBe("HS256");
    expect(decode(t).header.typ).toBe("JWT");
  });

  it("encodes role, room, user in payload", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "room_42",
      userId: "user_42",
      role: "participant",
    });
    const { payload } = decode(t);
    expect(payload.role).toBe("participant");
    expect(payload.room_id).toBe("room_42");
    expect(payload.user_id).toBe("user_42");
    expect(payload.access_key).toBe(APP_ACCESS_KEY);
  });

  it("admin observer gets the spectator role (silent oversight)", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "room_1",
      userId: "admin_1",
      role: "observer",
    });
    expect(decode(t).payload.role).toBe("observer");
  });

  it("default lifetime is ~1 hour", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "r",
      userId: "u",
      role: "host",
    });
    const { payload } = decode(t);
    const ttl = payload.exp - payload.iat;
    expect(ttl).toBeGreaterThan(3590);
    expect(ttl).toBeLessThan(3610);
  });

  it("signature verifies under shared secret", () => {
    const t = issueHmsToken({
      appAccessKey: APP_ACCESS_KEY,
      appSecret: APP_SECRET,
      roomId: "r",
      userId: "u",
      role: "host",
    });
    expect(decode(t).signatureValid).toBe(true);
  });

  it("rejects empty / invalid inputs", () => {
    expect(() =>
      issueHmsToken({
        appAccessKey: "",
        appSecret: APP_SECRET,
        roomId: "r",
        userId: "u",
        role: "host",
      }),
    ).toThrow();
    expect(() =>
      issueHmsToken({
        appAccessKey: APP_ACCESS_KEY,
        appSecret: "short",
        roomId: "r",
        userId: "u",
        role: "host",
      }),
    ).toThrow();
  });
});
