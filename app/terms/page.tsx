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
            <h2 className="font-serif text-xl text-ink mb-2">8. Contact</h2>
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
