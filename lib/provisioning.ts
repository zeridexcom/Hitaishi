import { computeExpiry } from "./auth";
import type { RazorpayEvent } from "./razorpay-schema";

export interface ProvisioningStore {
  claimWebhookEvent(externalId: string): Promise<{
    firstTime: boolean;
    alreadyProcessed: boolean;
  }>;
  markWebhookProcessed(externalId: string): Promise<void>;
  findUserByEmail(email: string): Promise<{ id: string } | null>;
  createStudent(input: { email: string }): Promise<{ id: string }>;
  findPlanByCode(
    code: string,
  ): Promise<{ id: string; durationDays: number } | null>;
  recordPayment(input: {
    userId: string;
    orderId: string;
    razorpayPaymentId: string;
    amountInr: number;
  }): Promise<{ id: string }>;
  createSubscription(input: {
    userId: string;
    planId: string;
    paymentId: string;
    startedAt: Date;
    expiresAt: Date;
  }): Promise<{ id: string }>;
  assignMentor(studentId: string): Promise<{ mentorId: string }>;
  enqueueWelcome(recipientId: string): Promise<void>;
}

export type ProvisioningResult =
  | { status: "provisioned"; userId: string; subscriptionId: string }
  | { status: "duplicate"; eventId: string }
  | { status: "ignored"; eventId: string };

const DEFAULT_PLAN_CODE = "JEE_ADV_6MO";

export async function provisionStudentAccess(
  event: RazorpayEvent,
  store: ProvisioningStore,
): Promise<ProvisioningResult> {
  if (event.kind !== "payment.captured") {
    return { status: "ignored", eventId: event.eventId };
  }

  const claim = await store.claimWebhookEvent(event.eventId);
  if (!claim.firstTime || claim.alreadyProcessed) {
    return { status: "duplicate", eventId: event.eventId };
  }

  const planCode = event.payment.planCode ?? DEFAULT_PLAN_CODE;
  const plan = await store.findPlanByCode(planCode);
  if (!plan) {
    throw new Error(`unknown plan code: ${planCode}`);
  }

  const existing = await store.findUserByEmail(event.payment.email);
  const user =
    existing ?? (await store.createStudent({ email: event.payment.email }));

  const payment = await store.recordPayment({
    userId: user.id,
    orderId: event.payment.orderId,
    razorpayPaymentId: event.payment.id,
    amountInr: event.payment.amountInr,
  });

  const startedAt = new Date();
  const sub = await store.createSubscription({
    userId: user.id,
    planId: plan.id,
    paymentId: payment.id,
    startedAt,
    expiresAt: computeExpiry(startedAt, plan.durationDays),
  });

  await store.assignMentor(user.id);
  await store.enqueueWelcome(user.id);
  await store.markWebhookProcessed(event.eventId);

  return { status: "provisioned", userId: user.id, subscriptionId: sub.id };
}
