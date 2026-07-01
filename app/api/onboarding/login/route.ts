import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required." }, { status: 400 });
    }

    const rows = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    const u = rows[0];
    const hash = u?.passwordHash ?? "$2a$12$0000000000000000000000000000000000000000000000000000";
    const ok = await verifyPassword(password, hash);

    if (!u || !ok) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }
    if (u.status !== "active") {
      return NextResponse.json({ ok: false, error: "Account is not active." }, { status: 403 });
    }

    await createSession(u.id);
    return NextResponse.json({ ok: true, role: u.role });
  } catch (err) {
    console.error("[/api/onboarding/login] error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong during sign-in." }, { status: 500 });
  }
}
