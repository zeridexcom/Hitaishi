import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { db } from "@/lib/db";
import {
  doubtAnswers,
  doubts,
  payouts,
  profiles,
  resources,
  sessions,
} from "@/db/schema";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

function firstOfMonth(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}
function monthName(d: Date): string {
  return d.toLocaleString("en-IN", { month: "long" });
}
function lastFour(value: string | null | undefined): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  return digits.slice(-4);
}

const SESSION_RATE = 500;
const DOUBT_RATE = 40;
const RESOURCE_RATE = 100;

export default async function MentorEarningsPage() {
  const user = await requireRole("mentor");
  const now = new Date();
  const monthStart = firstOfMonth(now);
  const monthStartDate = new Date(monthStart + "T00:00:00");

  const [thisMonthRow] = await db
    .select({
      sum: sql<number>`coalesce(sum(${payouts.netInr}), 0)::int`,
    })
    .from(payouts)
    .where(and(eq(payouts.userId, user.id), gte(payouts.periodStart, monthStart)));

  const [lifetimeRow] = await db
    .select({
      sum: sql<number>`coalesce(sum(${payouts.netInr}), 0)::int`,
    })
    .from(payouts)
    .where(eq(payouts.userId, user.id));

  const [sessionsMonthRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(sessions)
    .where(
      and(
        eq(sessions.hostId, user.id),
        eq(sessions.status, "completed"),
        gte(sessions.endedAt, monthStartDate),
      ),
    );

  const [doubtsMonthRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(doubtAnswers)
    .where(
      and(
        eq(doubtAnswers.answererId, user.id),
        gte(doubtAnswers.createdAt, monthStartDate),
      ),
    );

  const [resourcesMonthRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(resources)
    .where(
      and(
        eq(resources.uploaderId, user.id),
        eq(resources.platformApproved, true),
        gte(resources.createdAt, monthStartDate),
      ),
    );

  const nextPayoutRows = await db
    .select({
      id: payouts.id,
      amount: payouts.netInr,
      periodEnd: payouts.periodEnd,
    })
    .from(payouts)
    .where(and(eq(payouts.userId, user.id), eq(payouts.status, "pending")))
    .orderBy(asc(payouts.periodEnd))
    .limit(1);

  const nextPayout = nextPayoutRows[0];

  const historyRows = await db
    .select({
      id: payouts.id,
      periodStart: payouts.periodStart,
      amount: payouts.netInr,
      status: payouts.status,
      razorpayTransferId: payouts.razorpayTransferId,
    })
    .from(payouts)
    .where(eq(payouts.userId, user.id))
    .orderBy(desc(payouts.periodStart))
    .limit(10);

  const [mentorProfile] = await db
    .select({ payoutDetails: profiles.payoutDetails })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  const thisMonth = Number(thisMonthRow?.sum ?? 0);
  const lifetime = Number(lifetimeRow?.sum ?? 0);
  const sessionsThisMonth = Number(sessionsMonthRow?.c ?? 0);
  const doubtsThisMonth = Number(doubtsMonthRow?.c ?? 0);
  const resourcesThisMonth = Number(resourcesMonthRow?.c ?? 0);

  const breakdown = [
    {
      label: "Live sessions",
      count: sessionsThisMonth,
      unit: SESSION_RATE,
      total: sessionsThisMonth * SESSION_RATE,
    },
    {
      label: "Doubts resolved",
      count: doubtsThisMonth,
      unit: DOUBT_RATE,
      total: doubtsThisMonth * DOUBT_RATE,
    },
    {
      label: "Resource approvals",
      count: resourcesThisMonth,
      unit: RESOURCE_RATE,
      total: resourcesThisMonth * RESOURCE_RATE,
    },
  ];

  const history = historyRows.map((h: any) => ({
    id: h.id,
    date: new Date(h.periodStart).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    amount: h.amount,
    status: h.status === "paid" ? ("Paid" as const) : (h.status === "pending" ? ("Pending" as const) : (h.status === "processing" ? ("Processing" as const) : ("Failed" as const))),
    utr: h.razorpayTransferId ?? "—",
  }));

  const payoutDetails = (mentorProfile?.payoutDetails ?? null) as
    | { bankName?: string; accountLast4?: string; accountNumber?: string }
    | null;
  const last4 = lastFour(
    payoutDetails?.accountLast4
      ? `0000${payoutDetails.accountLast4}`
      : payoutDetails?.accountNumber,
  );
  const payoutMethodTitle = payoutDetails?.bankName
    ? `${payoutDetails.bankName}${last4 ? ` ····${last4}` : ""}`
    : "No bank account linked";

  return (
    <Shell
      role="mentor"
      active="earnings"
      pageCode="M.09 — EARNINGS & PAYOUTS"
      pageTitle="Earnings"
      pageSubtitle="Payouts are processed via Razorpay Routes to your verified bank account."
      actions={<LinkButton href="/mentor/earnings/export" variant="ghost" size="sm">Export CSV</LinkButton>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card>
          <CardHeader
            meta="NEXT PAYOUT"
            title={
              nextPayout
                ? `Scheduled ${new Date(nextPayout.periodEnd).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
                : "No payout scheduled"
            }
          />
          <CardBody>
            <div className="font-serif text-5xl text-primary-deep">
              ₹{(nextPayout?.amount ?? 0).toLocaleString("en-IN")}
            </div>
            <Pill tone="primary" className="mt-3">
              {nextPayout ? "Pending bank transfer" : "Nothing queued"}
            </Pill>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="THIS MONTH" title={monthName(now)} />
          <CardBody>
            <div className="font-serif text-4xl text-primary-deep">
              ₹{thisMonth.toLocaleString("en-IN")}
            </div>
            <div className="meta mt-3">
              {sessionsThisMonth} session{sessionsThisMonth === 1 ? "" : "s"} · {doubtsThisMonth} doubt{doubtsThisMonth === 1 ? "" : "s"}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="LIFETIME EARNINGS" title="All time" />
          <CardBody>
            <div className="font-serif text-4xl text-ink">
              ₹{lifetime.toLocaleString("en-IN")}
            </div>
            <div className="meta mt-3">Across {historyRows.length} payout{historyRows.length === 1 ? "" : "s"}</div>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader meta="THIS MONTH'S BREAKDOWN" title="Where your earnings come from" />
        <ul>
          {breakdown.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between gap-4 px-5 py-4 border-t border-rule first:border-t-0"
            >
              <div>
                <div className="font-medium text-sm">{b.label}</div>
                <div className="meta mt-1">
                  {b.count} × ₹{b.unit}
                </div>
              </div>
              <div className="font-mono text-lg">
                ₹{b.total.toLocaleString("en-IN")}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader meta="PAYOUT HISTORY" title="Past transfers" />
        {history.length === 0 ? (
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-4">No payouts yet.</div>
          </CardBody>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated border-b border-rule">
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden md:table-cell">
                  UTR
                </th>
                <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((h: any) => (
                <tr key={h.id} className="border-b border-rule last:border-0">
                  <td className="px-4 py-3">{h.date}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    ₹{h.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone="primary">{h.status}</Pill>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-ink-faint">
                    {h.utr}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LinkButton href={`/mentor/earnings/receipt/${h.id}`} variant="ghost" size="sm">
                      PDF
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader meta="PAYOUT METHOD" title={payoutMethodTitle} />
          <CardBody>
            <button className="chip-ghost">Change account</button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader meta="TAX & COMPLIANCE" title="Form 16 / TDS" />
          <CardBody>
            <p className="text-sm text-ink-soft">
              Certificates for FY 2025-26 will be available after April 2026.
            </p>
            <button className="chip-ghost mt-3">Request prior-year docs</button>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
