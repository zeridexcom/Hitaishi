import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, profiles } from "@/db/schema";
import { createSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/onboarding/google
 * Receives the Google user info (email, name) after a successful Supabase OAuth popup
 * and creates/finds the local user + session.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, avatarUrl, supabaseAccessToken } = body;

    if (!email) {
      return NextResponse.json({ ok: false, error: "No email received from Google." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    let userId: string;
    let role: string;

    if (existing[0]) {
      // Existing user — just sign them in
      userId = existing[0].id;
      role = existing[0].role;
    } else {
      // New user — create account (no password needed for OAuth)
      const result = await db.transaction(async (tx: any) => {
        const inserted = await tx
          .insert(users)
          .values({
            email: cleanEmail,
            passwordHash: "__oauth_google__", // sentinel: no password login allowed
            role: "student",
            status: "active",
          })
          .returning({ id: users.id });

        const id = inserted[0]!.id;

        await tx.insert(profiles).values({
          userId: id,
          fullName: (fullName || cleanEmail.split("@")[0]).trim(),
          onboardingStep: 1,
        });

        return id;
      });

      userId = result;
      role = "student";
    }

    await createSession(userId);
    return NextResponse.json({ ok: true, role, isNew: !existing[0] });
  } catch (err) {
    console.error("[/api/onboarding/google] error:", err);
    return NextResponse.json({ ok: false, error: "Google sign-in failed." }, { status: 500 });
  }
}
