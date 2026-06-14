import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-medium text-primary-deep">
            Hitaishi
          </Link>
          <Link href="/" className="text-sm text-ink-soft hover:text-primary-deep">
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-[720px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="meta">TERMS OF SERVICE</div>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">The rules of the road.</h1>
        <p className="text-sm text-ink-faint mt-2">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-serif text-xl text-ink mb-2">1. Acceptance</h2>
            <p>By accessing or using Hitaishi, you agree to be bound by these Terms. If you do not agree, do not use the platform.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">2. Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. One person, one account.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">3. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Share personal contact information (phone, email, social media, bank details) with other users</li>
              <li>Use the platform for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to circumvent platform monitoring or safety features</li>
              <li>Share your account credentials with anyone else</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">4. Monitoring & privacy</h2>
            <p>You acknowledge that platform administrators may monitor chat conversations, session content, and resource uploads for quality assurance, safety, and compliance purposes. Administrators may join live sessions without prior consent for quality monitoring.</p>
            <p className="mt-3">Mentors are notified of this monitoring via a warning popup before creating any session, and all users see a privacy notice banner in chat and session interfaces. By using the platform, you consent to this monitoring.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">5. Payments & refunds</h2>
            <p>All payments are processed through Razorpay. Refunds are handled according to the policy at the time of purchase. The standard policy is a 7-day full refund from the date of payment.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">6. Mentor conduct</h2>
            <p>Mentors are verified IITians. They are expected to conduct sessions professionally, respond to doubts in a timely manner, and maintain appropriate boundaries with students. Violations may result in deactivation.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">7. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">8. Data handling</h2>
            <p>This section summarises where your data lives, how long we keep it, and what you can ask us to do with it. It is informational, not a separate contract.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">What we collect</h3>
            <p>Account profile (name, email, phone, target exam and year), session metadata (title, scheduled time, duration, Meet link, attendance), chat messages, and the contents you submit through in-app forms (doubts, resources, feedback). Payment data is handled by Razorpay — we store only the transaction reference and last-4 / status needed for receipts and refunds.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">Where it is stored</h3>
            <p>All application data is stored in a managed PostgreSQL database hosted on Supabase. Backups are taken by Supabase on a rolling schedule. Jitsi Meet rooms are peer-to-peer by default — video and audio traffic flow directly between participants and are not recorded by the platform unless a future feature explicitly opts in.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">Encryption</h3>
            <p>Data is encrypted in transit using TLS 1.2 or higher on all client and server connections. Application data is encrypted at rest using AES-256 on Supabase-managed storage and database volumes. Payment instrument data is never stored on our servers — card details are collected and tokenised directly by Razorpay.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">Retention</h3>
            <p>Session and chat records are retained for the lifetime of your account so you can review prior conversations and feedback. Chat messages may be retained for a longer period even after a session ends, as defined in our internal data lifecycle policy (see <code className="text-xs bg-surface-elevated px-1 py-0.5 rounded">REALTIME_CHAT_PLAN.md</code>). Account-level records (profile, payment history) are retained for the duration required by tax and accounting law in our operating jurisdiction.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">Third parties</h3>
            <p>We use a small set of vendors to operate the service: Supabase (Postgres hosting), Razorpay (payments), and Jitsi Meet (peer-to-peer video). We do not sell your data. We do not share it with advertisers. Vendor access is limited to what is necessary to provide their slice of the service and is governed by data-processing terms.</p>

            <h3 className="font-serif text-base text-ink mt-4 mb-1">Your rights</h3>
            <p>You may request an export of your data or deletion of your account by emailing <a href="mailto:support@hitaishi.app" className="underline">support@hitaishi.app</a>. We respond to verified requests within 30 days. Deletion removes your profile, chat history, and session participation; records we are legally required to keep (e.g. payment receipts) are retained in a restricted form.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">9. Contact</h2>
            <p>For questions about these terms, contact legal@hitaishi.app.</p>
          </section>
        </div>
      </div>

      <footer className="border-t border-rule bg-surface-card py-8">
        <div className="max-w-container mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>© 2026 Hitaishi</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
