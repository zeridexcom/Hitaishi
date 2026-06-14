import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";
import { initials, formatLastSeen } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import {
  users,
  profiles,
  subscriptions,
  plans,
  payments,
  assignments,
} from "@/db/schema";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const dynamic = "force-dynamic";

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const STUDENT_LIMIT = 50;

const statusTone: Record<"active" | "expired" | "refunded" | "comp", Tone> = {
  active: "primary",
  expired: "warn",
  refunded: "error",
  comp: "neutral",
};

const statusLabel: Record<"active" | "expired" | "refunded" | "comp", string> = {
  active: "Active",
  expired: "Expired",
  refunded: "Refunded",
  comp: "Comp",
};

const paymentTone: Record<string, Tone> = {
  captured: "primary",
  success: "primary",
  refunded: "error",
  failed: "error",
  pending: "warn",
  created: "warn",
  "n/a": "neutral",
};

const paymentLabel: Record<string, string> = {
  success: "captured",
  refunded: "refunded",
  failed: "failed",
  created: "pending",
};

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminStudentsPage() {
  await requireRole("admin");

  const studentBase = and(eq(users.role, "student"), isNull(users.deletedAt));

  const [allRow] = await db
    .select({ c: count() })
    .from(users)
    .where(studentBase);

  const [activeRow] = await db
    .select({ c: sql<number>`count(distinct ${subscriptions.userId})::int` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  const [expiredRow] = await db
    .select({ c: sql<number>`count(distinct ${subscriptions.userId})::int` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "expired"));

  const [refundedRow] = await db
    .select({ c: sql<number>`count(distinct ${payments.userId})::int` })
    .from(payments)
    .where(eq(payments.status, "refunded"));

  const [compRow] = await db
    .select({ c: count() })
    .from(users)
    .where(
      and(
        studentBase,
        eq(users.status, "active"),
        sql`${users.id} NOT IN (SELECT ${payments.userId} FROM ${payments} WHERE ${payments.userId} IS NOT NULL)`,
      ),
    );

  const filters = [
    { key: "all", label: "All", count: Number(allRow?.c ?? 0) },
    { key: "active", label: "Active", count: Number(activeRow?.c ?? 0) },
    { key: "expired", label: "Expired", count: Number(expiredRow?.c ?? 0) },
    { key: "comp", label: "Comp", count: Number(compRow?.c ?? 0) },
    { key: "refunded", label: "Refunded", count: Number(refundedRow?.c ?? 0) },
  ];

  const mentorProfile = alias(profiles, "mp");

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      phone: users.phone,
      fullName: profiles.fullName,
      lastLoginAt: users.lastLoginAt,
      planName: sql<string | null>`(
        SELECT ${plans.name} FROM ${plans}
          INNER JOIN ${subscriptions} ON ${subscriptions.planId} = ${plans.id}
         WHERE ${subscriptions.userId} = ${users.id}
         ORDER BY ${subscriptions.startedAt} DESC
         LIMIT 1
      )`,
      subStatus: sql<string | null>`(
        SELECT status FROM ${subscriptions}
         WHERE user_id = ${users.id}
         ORDER BY started_at DESC
         LIMIT 1
      )`,
      subExpiresAt: sql<Date | null>`(
        SELECT expires_at FROM ${subscriptions}
         WHERE user_id = ${users.id}
         ORDER BY started_at DESC
         LIMIT 1
      )`,
      paymentStatus: sql<string | null>`(
        SELECT status FROM ${payments}
         WHERE user_id = ${users.id}
         ORDER BY created_at DESC
         LIMIT 1
      )`,
      mentorName: sql<string | null>`(
        SELECT ${mentorProfile.fullName} FROM ${mentorProfile}
          INNER JOIN ${assignments} ON ${assignments.mentorId} = ${mentorProfile.userId}
         WHERE ${assignments.studentId} = ${users.id}
           AND ${assignments.status} = 'active'
         ORDER BY ${assignments.startedAt} DESC
         LIMIT 1
      )`,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(studentBase)
    .orderBy(desc(users.createdAt))
    .limit(STUDENT_LIMIT);

  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENTS MANAGEMENT"
      pageTitle="Students"
      pageSubtitle="Filter, search, and act on the full student roster."
      actions={
        <div className="flex items-center gap-2">
          <input
            placeholder="Search name, email, phone…"
            className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
          />
          <button className="chip-cta">+ Add manually</button>
        </div>
      }
    >
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

      <div className="flex items-center justify-between mb-3">
        <div className="meta">0 selected</div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost text-xs">Message selected</button>
          <button className="chip-ghost text-xs">Export CSV</button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Plan / Payment
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Mentor
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden xl:table-cell">
                Expires
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-ink-faint italic"
                >
                  No data yet
                </td>
              </tr>
            ) : (
              rows.map((s: {
                id: string;
                email: string;
                fullName: string | null;
                lastLoginAt: Date | null;
                planName: string | null;
                subStatus: string | null;
                subExpiresAt: Date | null;
                paymentStatus: string | null;
                mentorName: string | null;
              }) => {
                const name = s.fullName ?? s.email.split("@")[0];
                const payKey = s.paymentStatus ?? "n/a";
                const payText = paymentLabel[payKey] ?? payKey;
                const subStatus = s.subStatus as
                  | "active"
                  | "expired"
                  | "refunded"
                  | "revoked"
                  | null;
                const statusKey: "active" | "expired" | "refunded" | "comp" =
                  !s.paymentStatus
                    ? "comp"
                    : subStatus === "active"
                      ? "active"
                      : subStatus === "expired"
                        ? "expired"
                        : payKey === "refunded"
                          ? "refunded"
                          : "comp";
                return (
                  <tr
                    key={s.id}
                    className="border-b border-rule last:border-0 hover:bg-surface-elevated/60"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-8 !h-8 !text-xs">
                          {initials(name)}
                        </div>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="meta">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm">{s.planName ?? "—"}</div>
                      <Pill
                        tone={paymentTone[payKey] ?? "neutral"}
                        className="mt-1"
                      >
                        {payText}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">
                      {s.mentorName ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell font-mono text-xs">
                      {s.subExpiresAt
                        ? DATE_FMT.format(new Date(s.subExpiresAt))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={statusTone[statusKey]}>
                        {statusLabel[statusKey]}
                      </Pill>
                      <div className="meta mt-1">
                        {s.lastLoginAt
                          ? formatLastSeen(new Date(s.lastLoginAt))
                          : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton
                        href={`/admin/students/${s.id}`}
                        variant="ghost"
                        size="sm"
                      >
                        Open
                      </LinkButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">
          Showing 1–{rows.length} of {Number(allRow?.c ?? 0)}
        </div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <span className="meta">Page 1 / 1</span>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>
    </Shell>
  );
}
