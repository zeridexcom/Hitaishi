import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import {
  Card,
  CardBody,
  CardHeader,
  LinkButton,
  Pill,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { db } from "@/lib/db";
import { payments, plans, profiles, subscriptions, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const notificationPrefs = [
  { key: "wa", label: "WhatsApp updates", value: true },
  { key: "email", label: "Email digests", value: true },
  { key: "session", label: "Session reminders", value: true },
];

function examLabel(targetExam: string | null | undefined): string {
  if (targetExam === "jee_main") return "JEE Main";
  if (targetExam === "jee_advanced") return "JEE Adv";
  if (targetExam === "both") return "JEE Main + Adv";
  return "JEE";
}

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function paymentLabel(method: string | null, status: string): string {
  if (status === "refunded") return "Refund";
  if (status === "failed") return "Failed payment";
  if (method === "upi") return "UPI payment";
  if (method === "card") return "Card payment";
  if (method === "netbanking") return "Net-banking payment";
  if (method === "emi") return "EMI payment";
  return "Payment";
}

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const [profileRow, activeSubscriptionRows, recentPayments] = await Promise.all([
    db
      .select({
        email: users.email,
        phone: users.phone,
        fullName: profiles.fullName,
        bio: profiles.bio,
        targetExam: profiles.targetExam,
        targetYear: profiles.targetYear,
        institute: profiles.institute,
        subjectsFocus: profiles.subjectsFocus,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.id, user.id))
      .limit(1),
    db
      .select({
        planId: plans.id,
        planName: plans.name,
        amountInr: plans.priceInr,
        startedAt: subscriptions.startedAt,
        expiresAt: subscriptions.expiresAt,
      })
      .from(subscriptions)
      .innerJoin(plans, eq(plans.id, subscriptions.planId))
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, "active"),
        ),
      )
      .orderBy(desc(subscriptions.startedAt))
      .limit(1),
    db
      .select({
        id: payments.id,
        amountInr: payments.amountInr,
        status: payments.status,
        method: payments.method,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(eq(payments.userId, user.id))
      .orderBy(desc(payments.createdAt))
      .limit(10),
  ]);

  const profile = profileRow[0] ?? null;
  const activeSubscription = activeSubscriptionRows[0] ?? null;
  const fullName = profile?.fullName ?? user.fullName;
  const email = profile?.email ?? user.email;
  const phone = profile?.phone ?? "";
  const targetExam = examLabel(profile?.targetExam);
  const targetYear = profile?.targetYear ?? null;
  const targetExamFull = targetYear ? `${targetExam} ${targetYear}` : targetExam;
  const institute = profile?.institute ?? "";
  const subjects: string[] = Array.isArray(profile?.subjectsFocus)
    ? (profile!.subjectsFocus as string[])
    : [];

  const planDays = activeSubscription
    ? Math.max(
        1,
        Math.round(
          (activeSubscription.expiresAt.getTime() -
            activeSubscription.startedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;
  const daysUsed = activeSubscription
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - activeSubscription.startedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1,
      )
    : 0;
  const planPct =
    activeSubscription && planDays > 0
      ? Math.min(100, Math.round((daysUsed / planDays) * 100))
      : 0;

  return (
    <Shell
      role="student"
      active="profile"
      pageCode="S.09 — PROFILE & PLAN"
      pageTitle="Your profile"
      pageSubtitle="Manage personal details, plan, and notification preferences."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <Card>
          <CardHeader meta="PERSONAL INFO" title="Identity" />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full name">
              <Input defaultValue={fullName} />
            </Field>
            <Field label="Email">
              <Input defaultValue={email} readOnly />
            </Field>
            <Field label="Phone">
              <Input defaultValue={phone} />
            </Field>
            <Field label="Target exam">
              <Select defaultValue={targetExamFull}>
                <option>JEE Main 2026</option>
                <option>JEE Adv 2026</option>
                <option>JEE Adv 2027</option>
              </Select>
            </Field>
            <Field label="Dream institute">
              <Input defaultValue={institute} />
            </Field>
            <Field label="Subjects (priority order)">
              <div className="flex gap-2 flex-wrap">
                {subjects.length === 0 ? (
                  <span className="text-sm text-ink-faint">
                    No subjects added yet.
                  </span>
                ) : (
                  subjects.map((s, i) => (
                    <Pill key={s} tone="primary">
                      {i + 1}. {subjectLabel(s)}
                    </Pill>
                  ))
                )}
              </div>
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <button className="chip-cta">Save changes</button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            meta="CURRENT PLAN"
            title={activeSubscription?.planName ?? "No active plan"}
          />
          <CardBody>
            {activeSubscription ? (
              <>
                <div className="meta">EXPIRES</div>
                <div className="font-serif text-2xl mt-1">
                  {formatDate(activeSubscription.expiresAt)}
                </div>
                <div className="text-sm text-ink-soft mt-1">
                  {daysUsed} of {planDays} days used
                </div>
                <div className="h-2 bg-surface-elevated rounded-pill mt-3 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${planPct}%` }}
                  />
                </div>
                <div className="meta mt-5">PURCHASED</div>
                <div className="text-sm">
                  {formatDate(activeSubscription.startedAt)} · ₹
                  {activeSubscription.amountInr.toLocaleString("en-IN")}
                </div>
                <LinkButton href="/checkout" size="md" className="mt-5 w-full">
                  Renew plan
                </LinkButton>
              </>
            ) : (
              <>
                <div className="font-serif text-2xl text-ink-soft mt-1">
                  No active plan
                </div>
                <div className="text-sm text-ink-soft mt-1">
                  Pick a plan to unlock sessions, doubts, and resources.
                </div>
                <LinkButton href="/checkout" size="md" className="mt-5 w-full">
                  Choose a plan
                </LinkButton>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader meta="TRANSACTIONS" title="Recent transactions" />
        {recentPayments.length === 0 ? (
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-4">
              No transactions yet.
            </p>
          </CardBody>
        ) : (
          <ul>
            {recentPayments.map((t: any) => (
              <li
                key={t.id}
                className="flex items-center justify-between px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div>
                  <div className="text-sm font-medium">
                    {paymentLabel(t.method, t.status)}
                  </div>
                  <div className="meta mt-1">{formatDate(t.createdAt)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm">
                    ₹{t.amountInr.toLocaleString("en-IN")}
                  </div>
                  <LinkButton href="/student/profile" variant="ghost" size="sm">
                    Receipt
                  </LinkButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-5">
        <CardHeader meta="NOTIFICATIONS" title="Preferences" />
        <CardBody className="flex flex-col gap-3">
          {notificationPrefs.map((p) => (
            <label
              key={p.key}
              className="flex items-center justify-between py-2 border-b border-rule last:border-0"
            >
              <span className="text-sm">{p.label}</span>
              <input
                type="checkbox"
                defaultChecked={p.value}
                className="w-10 h-5 accent-primary"
              />
            </label>
          ))}
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader meta="ACCOUNT" title="Security" />
        <CardBody className="flex flex-wrap gap-3">
          <button className="chip-ghost">Change phone number</button>
          <button className="chip-ghost">Download my data</button>
          <button className="chip-ghost text-red-600 border-red-200 hover:bg-red-50">
            Delete account
          </button>
        </CardBody>
      </Card>
    </Shell>
  );
}
