import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createMeeting } from "@/lib/meet";
import { db } from "@/lib/db";
import { assignments, sessionParticipants, sessions, users } from "@/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }
  if (user.role !== "mentor") {
    return NextResponse.json({ success: false, error: "Only mentors can create sessions" }, { status: 403 });
  }

  let body: {
    title?: string;
    scheduledAt?: string;
    durationMinutes?: number;
    type?: string;
    description?: string;
    mentorEmail?: string;
    studentIds?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.title || !body.scheduledAt || !body.durationMinutes) {
    return NextResponse.json(
      { success: false, error: "title, scheduledAt, and durationMinutes are required" },
      { status: 400 },
    );
  }

  const studentIds = Array.isArray(body.studentIds)
    ? Array.from(new Set(body.studentIds.filter((id): id is string => typeof id === "string" && id.length > 0)))
    : [];
  const sessionType = body.type === "group" ? "group" : "one_on_one";
  if (studentIds.length === 0) {
    return NextResponse.json(
      { success: false, error: "At least one student is required" },
      { status: 400 },
    );
  }
  if (sessionType === "one_on_one" && studentIds.length > 1) {
    return NextResponse.json(
      { success: false, error: "1-on-1 sessions can only include one student" },
      { status: 400 },
    );
  }

  try {
    const startTime = new Date(body.scheduledAt);
    if (Number.isNaN(startTime.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid scheduledAt" }, { status: 400 });
    }

    // Defense-in-depth: a mentor can only schedule sessions for students they
    // are *actively* assigned to. The page filters students the same way, but
    // the API must re-check — a direct call could otherwise target students
    // the mentor has no relationship with.
    const validStudents = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(assignments, eq(assignments.studentId, users.id))
      .where(
        and(
          eq(users.role, "student"),
          inArray(users.id, studentIds),
          eq(assignments.mentorId, user.id),
          eq(assignments.status, "active"),
          isNull(users.deletedAt),
          eq(users.status, "active"),
        ),
      );
    const validIds = (validStudents as any[]).map((s) => s.id);
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid students found" },
        { status: 400 },
      );
    }

    const meet = await createMeeting({
      title: body.title,
      startTime,
      durationMinutes: body.durationMinutes,
      description: body.description,
      mentorEmail: body.mentorEmail ?? user.email ?? undefined,
    });

    const created = await db.transaction(async (tx: any) => {
      const [row] = await tx
        .insert(sessions)
        .values({
          hostId: user.id,
          title: body.title!,
          type: sessionType,
          scheduledAt: startTime,
          durationMinutes: body.durationMinutes!,
          meetLink: meet.meetLink,
          status: "scheduled",
        })
        .returning({ id: sessions.id, meetLink: sessions.meetLink });

      await tx.insert(sessionParticipants).values(
        validIds.map((sid: string) => ({
          sessionId: row!.id,
          userId: sid,
          roleInSession: "participant" as const,
        })),
      );

      return row!;
    });

    return NextResponse.json({
      success: true,
      data: { id: created.id, meetLink: created.meetLink, participantIds: validIds },
    });
  } catch (err: any) {
    console.error("create session error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Failed to create session" },
      { status: 500 },
    );
  }
}
