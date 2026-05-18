import { describe, it, expect } from "vitest";
import { parseRazorpayEvent } from "./razorpay-schema";

const paymentCaptured = {
  entity: "event",
  account_id: "acc_x",
  event: "payment.captured",
  contains: ["payment"],
  payload: {
    payment: {
      entity: {
        id: "pay_ABC123",
        order_id: "order_XYZ789",
        amount: 1499900,
        currency: "INR",
        status: "captured",
        method: "upi",
        email: "student@example.com",
        contact: "+919999999999",
        notes: { planCode: "JEE_ADV_6MO" },
      },
    },
  },
  created_at: 1715000000,
  id: "evt_payment_captured_001",
};

const refundProcessed = {
  entity: "event",
  account_id: "acc_x",
  event: "refund.processed",
  contains: ["refund"],
  payload: {
    refund: {
      entity: {
        id: "rfnd_ABC",
        payment_id: "pay_ABC123",
        amount: 1499900,
        status: "processed",
      },
    },
  },
  created_at: 1715000100,
  id: "evt_refund_processed_001",
};

describe("parseRazorpayEvent", () => {
  it("parses a well-formed payment.captured event", () => {
    const ev = parseRazorpayEvent(paymentCaptured);
    expect(ev.kind).toBe("payment.captured");
    if (ev.kind === "payment.captured") {
      expect(ev.eventId).toBe("evt_payment_captured_001");
      expect(ev.payment.id).toBe("pay_ABC123");
      expect(ev.payment.orderId).toBe("order_XYZ789");
      expect(ev.payment.amountInr).toBe(1499900);
      expect(ev.payment.email).toBe("student@example.com");
      expect(ev.payment.planCode).toBe("JEE_ADV_6MO");
    }
  });

  it("parses a refund.processed event", () => {
    const ev = parseRazorpayEvent(refundProcessed);
    expect(ev.kind).toBe("refund.processed");
    if (ev.kind === "refund.processed") {
      expect(ev.refund.paymentId).toBe("pay_ABC123");
      expect(ev.refund.amountInr).toBe(1499900);
    }
  });

  it("rejects events with missing required fields", () => {
    expect(() => parseRazorpayEvent({ event: "payment.captured" })).toThrow();
    expect(() => parseRazorpayEvent({})).toThrow();
    expect(() => parseRazorpayEvent(null)).toThrow();
  });

  it("rejects unsupported event types as a known 'ignored' shape", () => {
    const ev = parseRazorpayEvent({
      ...paymentCaptured,
      event: "payment.authorized",
    });
    expect(ev.kind).toBe("ignored");
    if (ev.kind === "ignored") {
      expect(ev.rawEvent).toBe("payment.authorized");
    }
  });

  it("rejects negative or zero amounts", () => {
    const bad = JSON.parse(JSON.stringify(paymentCaptured));
    bad.payload.payment.entity.amount = -1;
    expect(() => parseRazorpayEvent(bad)).toThrow();
    bad.payload.payment.entity.amount = 0;
    expect(() => parseRazorpayEvent(bad)).toThrow();
  });

  it("rejects invalid email", () => {
    const bad = JSON.parse(JSON.stringify(paymentCaptured));
    bad.payload.payment.entity.email = "not-an-email";
    expect(() => parseRazorpayEvent(bad)).toThrow();
  });

  it("requires the top-level event id (used for idempotency)", () => {
    const bad = JSON.parse(JSON.stringify(paymentCaptured));
    delete bad.id;
    expect(() => parseRazorpayEvent(bad)).toThrow();
  });
});
