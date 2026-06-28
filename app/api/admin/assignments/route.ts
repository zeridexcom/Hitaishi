import { NextRequest } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { fail, ok } from "@/lib/api";
import { db } from "@/lib/db";
import { assignments, auditLog, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const bodySchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  mentorId: z.string().uuid("Invalid mentor ID"),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json(fail("unauthorized"), { status: 401 });
  if (user.role !== "admin") return Response.json(fail("forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(fail("invalid JSON"), { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      fail(parsed.error.issues.map((i) => i.message).join("; ")),
      { status: 400 },
    );
  }

  const { studentId, mentorId } = parsed.data;

  if (studentId === mentorId) {
    return Response.json(fail("student and mentor cannot be the same"), { status: 400 });
  }

  try {
    const [studentRow, mentorRow] = await Promise.all([
      db
        .select({ role: users.role })
        .from(users)
        .where(and(eq(users.id, studentId), eq(users.role, "student")))
        .limit(1),
      db
        .select({ role: users.role })
        .from(users)
        .where(and(eq(users.id, mentorId), eq(users.role, "mentor")))
        .limit(1),
    ]);

    if (!studentRow[0]) {
      return Response.json(fail("student not found"), { status: 404 });
    }
    if (!mentorRow[0]) {
      return Response.json(fail("mentor not found"), { status: 404 });
    }

    const now = new Date();

    await db.transaction(async (tx: typeof db) => {
      await tx
        .update(assignments)
        .set({ status: "ended", endedAt: now })
        .where(
          and(
            eq(assignments.studentId, studentId),
            eq(assignments.status, "active"),
          ),
        );

      await tx.insert(assignments).values({
        studentId,
        mentorId,
        status: "active",
        startedAt: now,
      });

      await tx.insert(auditLog).values({
        actorId: user.id,
        action: "assignment_created",
        targetType: "assignment",
        targetId: studentId,
        metadata: {
          mentorId,
          adminEmail: user.email,
        },
        createdAt: now,
      });
    });

    return Response.json(ok(null), { status: 201 });
  } catch (err) {
    console.error("assign mentor error:", err);
    return Response.json(fail("failed to assign mentor"), { status: 500 });
  }
}
