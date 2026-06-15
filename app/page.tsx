import Link from "next/link";
import { LinkButton } from "@/components/ui";
import { db } from "@/lib/db";
import { users, profiles } from "@/db/schema";
import { count, and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const valueProps = [
  {
    title: "Daily chat access",
    body: "Message your mentor anytime and get a response within hours, not days.",
  },
  {
    title: "Weekly 1:1 video calls",
    body: "Strategy reviews, stress management, and exam-week psychology with your IITian.",
  },
  {
    title: "Curated resource library",
    body: "Handwritten notes, marking schemes, and problem-solving frameworks — vetted, not scraped.",
  },
  {
    title: "Group doubt sessions",
    body: "Bi-weekly peer learning rooms moderated by a verified mentor.",
  },
];

const faqs = [
  {
    q: "How do you pick mentors?",
    a: "Only IITians from the top 1,000 ranks in JEE Advanced, vetted through a 3-step pedagogical audit before they meet a student.",
  },
  {
    q: "Is this a replacement for coaching?",
    a: "No — we sit alongside your coaching. The mentor handles strategy, stuck-points, and exam psychology, not the syllabus grind.",
  },
  {
    q: "What if I don't like my mentor?",
    a: "Tell us within the first 14 days and we will reassign you, no questions asked.",
  },
  {
    q: "How is access delivered?",
    a: "Through this portal. Daily chat, scheduled video calls, and the shared resource library — all in one place.",
  },
];

type MentorCard = {
  name: string;
  branch: string;
  focus: string;
  note: string;
};

function focusFromSubjects(subjectsFocus: unknown): string | null {
  if (!Array.isArray(subjectsFocus) || subjectsFocus.length === 0) return null;
  const first = subjectsFocus[0];
  if (!first || typeof first !== "object") return null;
  const subject = (first as { subject?: unknown }).subject;
  const level = (first as { level?: unknown }).level;
  if (typeof subject !== "string") return null;
  const cap = subject.charAt(0).toUpperCase() + subject.slice(1);
  return typeof level === "string" && level.trim() ? `${cap} · ${level}` : cap;
}

function deriveMentorCard(row: {
  fullName: string | null;
  institute: string | null;
  subjectsFocus: unknown;
  bio: string | null;
}): MentorCard {
  const name = row.fullName?.trim() || "Mentor";
  const branch = row.institute?.trim() || "IIT mentor";
  const focus = focusFromSubjects(row.subjectsFocus) || "Active mentor";
  const note = row.bio?.trim() || "Active mentor on Hitaishi";
  return { name, branch, focus, note };
}

export default async function LandingPage() {
  const [counterRow] = await db
    .select({ value: count() })
    .from(users)
    .where(and(eq(users.role, "student"), eq(users.status, "active")));
  const aspirantCount = counterRow?.value ?? 0;

  const mentorRows = await db
    .select({
      fullName: profiles.fullName,
      institute: profiles.institute,
      subjectsFocus: profiles.subjectsFocus,
      bio: profiles.bio,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(users.role, "mentor"), eq(users.status, "active")))
    .orderBy(desc(users.createdAt))
    .limit(3);
  const mentors: MentorCard[] = mentorRows.map(deriveMentorCard);

  const priceLabel = "—";

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-medium text-primary-deep"
          >
            Hitaishi
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
            <a href="#method">The Method</a>
            <a href="#mentors">Mentors</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-ink-soft hover:text-primary-deep"
            >
              Sign in
            </Link>
            <LinkButton href="/checkout" size="sm">
              Pay & Get Access
            </LinkButton>
          </div>
        </div>
      </header>

      <section className="max-w-container mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <div className="meta mb-4">PRIVATE 1:1 MENTORSHIP · S.01</div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">
            Your IIT mentor, every single day until JEE.
          </h1>
          <p className="text-lg text-ink-soft mt-6 max-w-[55ch]">
            Private 1:1 mentorship from recent JEE-clearing IIT students. Daily
            chat, weekly video calls, curated resources — not another coaching
            class.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/checkout" size="lg">
              Pay & Get Access
            </LinkButton>
            <div className="text-sm text-ink-soft">
              <span className="primary-dot mr-2" /> {aspirantCount}{" "}
              {aspirantCount === 1 ? "aspirant" : "aspirants"} currently
              enrolled
            </div>
          </div>
          <p className="text-xs text-ink-faint mt-4 font-mono">
            Secured by Razorpay · 7-day full refund · GST included
          </p>
        </div>
        <div className="bg-surface-card border border-rule rounded-card p-6 shadow-overlay">
          <div className="meta">RESERVE A SLOT</div>
          <div className="font-serif text-2xl mt-2">6-month Full Access</div>
          <div className="font-serif text-5xl text-primary-deep mt-4">
            {priceLabel}
          </div>
          <div className="text-sm text-ink-soft mt-1">total · taxes included</div>
          <ul className="text-sm text-ink-soft mt-6 space-y-2">
            <li>· Daily chat with your mentor</li>
            <li>· Personalized study plan</li>
            <li>· Weekly 1:1 video calls</li>
            <li>· Full resource library + group doubt rooms</li>
          </ul>
          <LinkButton href="/checkout" size="md" className="mt-6 w-full">
            Reserve your slot →
          </LinkButton>
        </div>
      </section>

      <section
        id="method"
        className="border-y border-rule bg-surface-card py-16"
      >
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">THE GARDEN METHOD</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-[30ch]">
            Four pieces, working together.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="border border-rule rounded-card p-5 bg-surface"
              >
                <div className="font-serif text-xl">{v.title}</div>
                <p className="text-sm text-ink-soft mt-3">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {mentors.length > 0 && (
        <section id="mentors" className="py-16">
          <div className="max-w-container mx-auto px-6 md:px-10">
            <div className="meta">VERIFIED MENTORS</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-[35ch]">
              Only top-1,000 JEE Advanced rankers. Audited before they meet you.
            </h2>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {mentors.map((m) => (
                <div
                  key={m.name}
                  className="bg-surface-card border border-rule rounded-card p-6"
                >
                  <div className="avatar mb-4">{m.name[0]}</div>
                  <div className="font-serif text-xl">{m.name}</div>
                  <div className="text-sm text-ink-soft mt-1">{m.branch}</div>
                  <div className="text-sm mt-3">{m.focus}</div>
                  <div className="meta mt-3">{m.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="why-hitaishi" className="py-16 bg-surface-elevated">
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">WHY HITAISHI</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-[40ch]">
            Built differently because the stakes are different.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-surface-card border border-rule rounded-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-lg font-serif text-primary-deep">1</div>
              <div className="font-serif text-xl mt-4">For Students</div>
              <p className="text-sm text-ink-soft mt-3">
                Your mentor isn&apos;t a lecturer — they&apos;re someone who sat in the same
                exam hall, cracked JEE, and now guides you through it. Daily chat,
                weekly calls, curated resources. No batch sizes, no recorded
                lectures, no one-size-fits-all.
              </p>
            </div>
            <div className="bg-surface-card border border-rule rounded-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-lg font-serif text-primary-deep">2</div>
              <div className="font-serif text-xl mt-4">For Mentors</div>
              <p className="text-sm text-ink-soft mt-3">
                You&apos;ve cleared JEE. Now help someone else do it. We handle the
                payments, scheduling, and compliance — you focus on the teaching.
                Set your own hours, work from anywhere, and earn doing what matters.
              </p>
            </div>
            <div className="bg-surface-card border border-rule rounded-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-lg font-serif text-primary-deep">3</div>
              <div className="font-serif text-xl mt-4">Why We&apos;re Different</div>
              <p className="text-sm text-ink-soft mt-3">
                We&apos;re not a coaching class. We&apos;re not a content library. We&apos;re a
                one-on-one relationship between you and someone who&apos;s been exactly
                where you are. Every feature — chat, sessions, doubts, resources —
                exists to protect and deepen that relationship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-rule bg-surface-elevated py-16"
      >
        <div className="max-w-container mx-auto px-6 md:px-10 grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <div className="meta">PRICING</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">
              One plan. No upsells. No hidden tiers.
            </h2>
            <p className="text-ink-soft mt-4 max-w-[50ch]">
              You either need a mentor or you don&apos;t. We don&apos;t believe in
              fragmenting access to your own strategist.
            </p>
          </div>
          <div className="bg-surface-card border border-rule rounded-card p-8">
            <div className="meta">6-MONTH FULL ACCESS</div>
            <div className="font-serif text-5xl text-primary-deep mt-2">
              {priceLabel}
            </div>
            <div className="text-sm text-ink-soft mt-1">
              total · taxes included
            </div>
            <LinkButton href="/checkout" size="lg" className="mt-8 w-full">
              Reserve your slot
            </LinkButton>
            <p className="text-xs text-ink-faint mt-4 font-mono text-center">
              7-day refund · No auto-renewal
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">FREQUENTLY ASKED</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">
            The honest answers.
          </h2>
          <dl className="mt-10 max-w-[70ch] space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-rule pb-6">
                <dt className="font-serif text-xl">{f.q}</dt>
                <dd className="text-ink-soft mt-2">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-rule bg-surface-card py-8">
        <div className="max-w-container mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>© 2026 Hitaishi · For JEE aspirants, by IITians</div>
          <div className="flex items-center gap-5">
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <span className="text-ink-faint">Terms</span>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
