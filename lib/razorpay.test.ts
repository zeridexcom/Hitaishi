import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyRazorpaySignature, signRazorpayPayload } from "./razorpay";

const SECRET = "whsec_test_123";

function sign(body: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyRazorpaySignature", () => {
  it("accepts a payload with a matching signature", () => {
    const body = '{"event":"payment.captured"}';
    expect(verifyRazorpaySignature(body, sign(body), SECRET)).toBe(true);
  });

  it("rejects a payload with a tampered signature", () => {
    const body = '{"event":"payment.captured"}';
    expect(verifyRazorpaySignature(body, sign(body) + "a", SECRET)).toBe(false);
  });

  it("rejects when the body is tampered after signing", () => {
    const original = '{"event":"payment.captured","amount":100}';
    const sig = sign(original);
    const tampered = '{"event":"payment.captured","amount":9999999}';
    expect(verifyRazorpaySignature(tampered, sig, SECRET)).toBe(false);
  });

  it("rejects with the wrong secret", () => {
    const body = '{"event":"x"}';
    expect(verifyRazorpaySignature(body, sign(body), "wrong-secret")).toBe(
      false,
    );
  });

  it("uses constant-time comparison (no early-exit on length mismatch crash)", () => {
    const body = '{"x":1}';
    expect(verifyRazorpaySignature(body, "deadbeef", SECRET)).toBe(false);
    expect(verifyRazorpaySignature(body, "", SECRET)).toBe(false);
  });

  it("rejects missing or non-string inputs defensively", () => {
    expect(verifyRazorpaySignature("", "x", SECRET)).toBe(false);
    expect(verifyRazorpaySignature("body", "", SECRET)).toBe(false);
    expect(verifyRazorpaySignature("body", "abc", "")).toBe(false);
  });
});

describe("signRazorpayPayload (test helper / dev only)", () => {
  it("produces a 64-char hex signature compatible with verify", () => {
    const sig = signRazorpayPayload("hello", SECRET);
    expect(sig).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyRazorpaySignature("hello", sig, SECRET)).toBe(true);
  });
});
