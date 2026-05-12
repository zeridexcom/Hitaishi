import { Container } from "@/components/ui/Container";
import { readLeads } from "@/lib/leadsStore";
import { LeadsTableActions } from "./LeadsTableActions";
import { Mail, Phone, MessageSquare, Inbox, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function countToday(leads: { createdAt: string }[]): number {
  const today = new Date().toDateString();
  return leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;
}

function countThisWeek(leads: { createdAt: string }[]): number {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return leads.filter((l) => now - new Date(l.createdAt).getTime() <= weekMs).length;
}

export default async function LeadsAdminPage() {
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const total = leads.length;
  const today = countToday(leads);
  const week = countThisWeek(leads);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(900px 400px at 10% -10%, var(--color-cyan-glow) 0%, transparent 60%), radial-gradient(700px 400px at 95% 10%, var(--color-accent-glow) 0%, transparent 60%)",
          }}
        />
        <Container>
          <div className="py-10 md:py-14 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-cyan)]">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-cyan)]" />
                Leads dashboard
              </p>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-fg)] leading-[1.1]">
                Contact form submissions
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed">
                All inquiries from the contact form, newest first. Stored locally in{" "}
                <code className="px-1.5 py-0.5 rounded bg-[var(--color-surface-hover)] text-xs">
                  data/leads.json
                </code>{" "}
                for testing.
              </p>
            </div>
            <LeadsTableActions count={total} />
          </div>
        </Container>
      </section>

      {/* Stats */}
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-6 md:-mt-8 relative z-10">
          <StatCard
            icon={<Inbox size={18} aria-hidden />}
            label="Total leads"
            value={total}
            tone="accent"
          />
          <StatCard
            icon={<Calendar size={18} aria-hidden />}
            label="Today"
            value={today}
            tone="cyan"
          />
          <StatCard
            icon={<MessageSquare size={18} aria-hidden />}
            label="Last 7 days"
            value={week}
            tone="neutral"
          />
        </div>
      </Container>

      {/* Body */}
      <section className="py-10 md:py-14">
        <Container>
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background-alt)] p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-cyan-glow)] text-[var(--color-cyan)] mb-4">
                <Inbox size={24} aria-hidden />
              </div>
              <p className="text-base text-[var(--color-fg)] font-medium">No leads yet</p>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                Submit the contact form to see entries appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] shadow-[var(--shadow-soft)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--color-background-alt)] text-left">
                    <tr>
                      <Th>Created</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Subject</Th>
                      <Th>Message</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <Td className="whitespace-nowrap text-[var(--color-fg-muted)]">
                          {formatDate(lead.createdAt)}
                        </Td>
                        <Td>
                          <div className="font-semibold text-[var(--color-fg)]">{lead.name}</div>
                        </Td>
                        <Td>
                          <div className="flex flex-col gap-1.5">
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:underline"
                            >
                              <Mail size={13} aria-hidden />
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center gap-1.5 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                              >
                                <Phone size={13} aria-hidden />
                                {lead.phone}
                              </a>
                            )}
                          </div>
                        </Td>
                        <Td className="text-[var(--color-fg-muted)]">
                          {lead.subject ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-cyan-glow)] text-[var(--color-cyan)] border border-[var(--color-cyan)]/15">
                              {lead.subject}
                            </span>
                          ) : (
                            <span className="text-[var(--color-fg-subtle)]">—</span>
                          )}
                        </Td>
                        <Td className="max-w-md">
                          <p className="text-[var(--color-fg)] whitespace-pre-wrap break-words leading-relaxed">
                            {lead.message}
                          </p>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "accent" | "cyan" | "neutral";
}) {
  const toneClasses: Record<typeof tone, string> = {
    accent: "text-[var(--color-accent)] bg-[var(--color-accent-glow)] border-[var(--color-accent)]/15",
    cyan: "text-[var(--color-cyan)] bg-[var(--color-cyan-glow)] border-[var(--color-cyan)]/15",
    neutral: "text-[var(--color-fg-muted)] bg-[var(--color-surface-hover)] border-[var(--color-border)]",
  };
  return (
    <div className="glass p-5 flex items-center gap-4">
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${toneClasses[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-[var(--color-fg)]">{value}</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-top ${className}`}>{children}</td>;
}
