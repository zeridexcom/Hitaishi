import Link from "next/link";
import { db } from "@/lib/db";
import { plans } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatInr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [topPlan] = await db
    .select({ priceInr: plans.priceInr })
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(desc(plans.priceInr))
    .limit(1);
  const priceLabel = topPlan ? formatInr(topPlan.priceInr) : "—";

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full flex flex-col gap-6">
        <div className="meta">Checkout</div>
        <h1 className="serif text-3xl font-medium leading-tight">
          Razorpay checkout opens here.
        </h1>
        <p className="text-[var(--ink-soft)]">
          Phase 2 ships the inline Razorpay overlay. Until then this stub stands
          in so the landing CTA doesn&rsquo;t 404.
        </p>
        <div className="rule" aria-hidden />
        <div className="flex items-baseline justify-between">
          <div>
            <div className="meta">JEE Advanced · 6 months</div>
            <div className="serif text-3xl font-bold mt-1">
              {priceLabel}
            </div>
          </div>
          <Link href="/" className="chip-ghost">
            ← Back
          </Link>
        </div>
      </div>
    </main>
  );
}
