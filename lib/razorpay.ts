import { createHmac, timingSafeEqual } from "node:crypto";

export function signRazorpayPayload(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  if (!body || !signature || !secret) return false;
  const expected = signRazorpayPayload(body, secret);
  // timingSafeEqual throws on length mismatch — guard explicitly.
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}
