import { Shell } from "@/components/Shell";
import { Card, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import {
  users,
  profiles,
  payments,
  refunds,
  payouts,
  webhookEvents,
  plans,
  subscriptions,
} from "@/db/schema";
import { and, count, desc, eq, gte, isNull, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const LEDGER_LIMIT = 50;

const statusTone: Record<string, Tone> = {
  captured: "primary",
  success: "primary",
  failed: "error",
  refunded: "neutral",
  pending: "warn",
  created: "warn",
};

const statusLabel: Record<string, string> = {
  success: "captured",
  created: "pending",
};

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const INR_FMT = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export default async function AdminPaymentsPage() {
  await requireRole("admin");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [mtdRow] = await db
    .select({ total: sql<number>`coalesce(sum(${payments.amountInr}), 0)::int` })
    .from(payments)
    .where(
      and(
        eq(payments.status, "success"),
        gte(payments.createdAt, startOfMonth),
      ),
    );

  const [paidPayoutsRow] = await db
    .select({ c: count() })
    .from(payouts)
    .where(eq(payouts.status, "paid"));

  const [pendingRefundsRow] = await db
    .select({ c: count() })
    .from(refunds)
    .where(eq(refunds.status, "pending"));

  const [failedWebhooksRow] = await db
    .select({ c: count() })
    .from(webhookEvents)
    .where(isNull(webhookEvents.processedAt));

  const mtd = Number(mtdRow?.total ?? 0);
  const paidPayouts = Number(paidPayoutsRow?.c ?? 0);
  const pendingRefunds = Number(pendingRefundsRow?.c ?? 0);
  const failedWebhooks = Number(failedWebhooksRow?.c ?? 0);

  const kpis = [
    {
      label: "MTD VOLUME",
      value: `₹${INR_FMT.format(mtd)}`,
      delta: `${mtd === 0 ? "0 captured" : `${mtd} INR captured`}`,
    },
    {
      label: "PAYOUT SUCCESS",
      value: paidPayouts.toLocaleString("en-IN"),
      delta: `${paidPayouts} transfers`,
    },
    {
      label: "PENDING REFUNDS",
      value: pendingRefunds.toLocaleString("en-IN"),
      delta: `${pendingRefunds} awaiting approval`,
      tone: "warn" as Tone,
    },
    {
      label: "FAILED WEBHOOKS",
      value: failedWebhooks.toString(),
      delta: failedWebhooks === 0 ? "All clear" : "Urgent — manual provision",
      tone: (failedWebhooks === 0 ? "primary" : "error") as Tone,
    },
  ];

  const failedWebhookRows = await db
    .select({
      id: webhookEvents.id,
      externalId: webhookEvents.externalId,
      provider: webhookEvents.provider,
      eventType: webhookEvents.eventType,
      processingAttempts: webhookEvents.processingAttempts,
      createdAt: webhookEvents.createdAt,
    })
    .from(webhookEvents)
    .where(isNull(webhookEvents.processedAt))
    .orderBy(desc(webhookEvents.createdAt))
    .limit(20);

  const [allCountRow] = await db
    .select({ c: count() })
    .from(payments);
  const [capturedCountRow] = await db
    .select({ c: count() })
    .from(payments)
    .where(eq(payments.status, "success"));
  const [failedCountRow] = await db
    .select({ c: count() })
    .from(payments)
    .where(eq(payments.status, "failed"));
  const [refundedCountRow] = await db
    .select({ c: count() })
    .from(payments)
    .where(eq(payments.status, "refunded"));
  const [pendingCountRow] = await db
    .select({ c: count() })
    .from(payments)
    .where(eq(payments.status, "created"));

  const filters = [
    { key: "all", label: "All", count: Number(allCountRow?.c ?? 0) },
    { key: "captured", label: "Captured", count: Number(capturedCountRow?.c ?? 0) },
    { key: "failed", label: "Failed", count: Number(failedCountRow?.c ?? 0) },
    { key: "refunded", label: "Refunded", count: Number(refundedCountRow?.c ?? 0) },
    { key: "pending", label: "Pending", count: Number(pendingCountRow?.c ?? 0) },
  ];

  const ledger = await db
    .select({
      id: payments.id,
      createdAt: payments.createdAt,
      amountInr: payments.amountInr,
      razorpayOrderId: payments.razorpayOrderId,
      razorpayPaymentId: payments.razorpayPaymentId,
      status: payments.status,
      method: payments.method,
      studentName: profiles.fullName,
      studentEmail: users.email,
      planName: sql<string | null>`(
        SELECT ${plans.name} FROM ${plans}
          INNER JOIN ${subscriptions} ON ${subscriptions.planId} = ${plans.id}
         WHERE ${subscriptions.paymentId} = ${payments.id}
         LIMIT 1
      )`,
    })
    .from(payments)
    .leftJoin(users, eq(users.id, payments.userId))
    .leftJoin(profiles, eq(profiles.userId, payments.userId))
    .orderBy(desc(payments.createdAt))
    .limit(LEDGER_LIMIT);

  return (
    <Shell
      role="admin"
      active="payments"
      pageCode="A.06 — PAYMENTS & ACCESS CONTROL"
      pageTitle="Payments"
      pageSubtitle="Razorpay ledger, refunds, webhook health, and manual access grants."
      actions={
        <div className="flex items-center gap-2">
          <button className="chip-ghost">Manual access grant</button>
          <button className="chip-ghost">Export CSV</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="meta">{k.label}</div>
            <div className="font-serif text-2xl text-primary-deep mt-2">{k.value}</div>
            <div className="text-xs text-ink-soft mt-1">{k.delta}</div>
          </Card>
        ))}
      </div>

      {failedWebhookRows.length > 0 && (
        <Card className="mb-6 border-danger/40 bg-danger-soft/30">
          <CardHeader
            meta={`${failedWebhookRows.length} FAILED WEBHOOKS — URGENT`}
            title="Manual provisioning required"
          />
          <ul>
            {failedWebhookRows.map((w: {
              id: string;
              externalId: string;
              provider: "razorpay" | "msg91" | "resend";
              eventType: string;
              processingAttempts: number;
              createdAt: Date | null;
            }) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div className="flex-1 min-w-[260px]">
                  <div className="font-mono text-sm">{w.externalId}</div>
                  <div className="text-sm mt-1">
                    {w.provider} · {w.eventType} · attempts {w.processingAttempts}
                  </div>
                  <div className="meta mt-1">
                    received {w.createdAt ? DATE_FMT.format(new Date(w.createdAt)) : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="chip-ghost">Retry</button>
                  <button className="chip-cta">Manual provision →</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {f.label}
            <span className="font-mono text-xs opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Plan
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Razorpay ID
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-ink-faint italic"
                >
                  No data yet
                </td>
              </tr>
            ) : (
              ledger.map((l: {
                id: string;
                createdAt: Date | null;
                amountInr: number;
                razorpayOrderId: string;
                razorpayPaymentId: string | null;
                status: "created" | "success" | "failed" | "refunded";
                method: "upi" | "card" | "netbanking" | "emi" | null;
                studentName: string | null;
                studentEmail: string | null;
                planName: string | null;
              }) => {
                const name = l.studentName ?? l.studentEmail?.split("@")[0] ?? "—";
                const payKey = l.status;
                const pillText = statusLabel[payKey] ?? payKey;
                const razorpayId = l.razorpayPaymentId ?? l.razorpayOrderId;
                return (
                  <tr
                    key={l.id}
                    className="border-b border-rule last:border-0 hover:bg-surface-elevated/60"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {l.createdAt ? DATE_FMT.format(new Date(l.createdAt)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-7 !h-7 !text-xs">
                          {initials(name)}
                        </div>
                        {name}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-ink-soft">
                      {l.planName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      ₹{INR_FMT.format(l.amountInr)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-ink-faint">
                      {razorpayId}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={statusTone[payKey] ?? "neutral"}>
                        {pillText}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {l.status === "success" && (
                        <button className="text-xs text-primary-deep underline">
                          Refund
                        </button>
                      )}
                      {l.status === "failed" && (
                        <button className="text-xs text-primary-deep underline">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      <div className="meta text-center mt-5">
        Showing 1–{ledger.length} of {Number(allCountRow?.c ?? 0)}
      </div>
    </Shell>
  );
}
