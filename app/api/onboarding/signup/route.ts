import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, profiles } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/emails/email-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ ok: false, error: "Required fields missing." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existing[0]) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const userId = await db.transaction(async (tx: any) => {
      const insertedUser = await tx
        .insert(users)
        .values({
          email: cleanEmail,
          passwordHash,
          role: "student",
          status: "active",
        })
        .returning({ id: users.id });

      const id = insertedUser[0]!.id;

      await tx.insert(profiles).values({
        userId: id,
        fullName: fullName.trim(),
        onboardingStep: 1,
      });

      return id;
    });

    await createSession(userId);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.hitaishii.com";
    sendWelcomeEmail(cleanEmail, fullName, `${appUrl}/student-onboarding`).catch((e) => {
      console.error("Failed to send student onboarding welcome email:", e);
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/onboarding/signup] error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong during account creation." }, { status: 500 });
  }
}
