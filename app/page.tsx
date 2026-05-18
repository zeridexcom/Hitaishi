import Link from "next/link";
import { formatInr } from "@/lib/format";

const PRICE_PAISE = 1_499_900;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[760px] flex flex-col gap-10">
        <header className="flex justify-between items-baseline">
          <div className="serif text-xl font-bold">
            Mentor<span className="italic-serif">IIT</span>
          </div>
          <div className="meta">By invitation · By payment</div>
        </header>

        <section className="flex flex-col gap-6">
          <p className="meta">A closed coaching platform</p>
          <h1 className="serif text-4xl md:text-6xl leading-[1.02] font-medium">
            For the kids who actually want{" "}
            <span className="italic-serif">IIT.</span>
          </h1>
          <p className="text-[var(--ink-soft)] text-lg max-w-[55ch] leading-relaxed">
            One verified IIT mentor. Six months of 1:1 sessions, doubt-clearing,
            and shared resources. No public signups. No spam. No fraud.
          </p>
        </section>

        <div className="rule-strong" aria-hidden />

        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="meta mb-2">JEE Advanced · 6 months</div>
            <div className="serif text-5xl md:text-6xl font-bold">
              {formatInr(PRICE_PAISE)}
            </div>
            <div className="text-[var(--ink-soft)] text-sm mt-1">
              One payment. No renewals till month six.
            </div>
          </div>
          <Link href="/checkout" className="chip-cta text-base px-6 py-4">
            Pay &amp; Get Access →
          </Link>
        </section>

        <div className="rule" aria-hidden />

        <footer className="flex flex-wrap gap-x-6 gap-y-2 meta">
          <span>Razorpay secured</span>
          <span>·</span>
          <span>7-day refund window</span>
          <span>·</span>
          <span>Made in Indore</span>
        </footer>
      </div>
    </main>
  );
}
