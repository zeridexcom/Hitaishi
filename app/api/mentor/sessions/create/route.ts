import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createMeeting } from "@/lib/meet";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema";

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

  try {
    const startTime = new Date(body.scheduledAt);
    const meet = await createMeeting({
      title: body.title,
      startTime,
      durationMinutes: body.durationMinutes,
      description: body.description,
      mentorEmail: body.mentorEmail ?? user.email ?? undefined,
    });

    // TODO(phase-5): wire to real DB insert with participant assignment
    const session = await db
      .insert(sessions)
      .values({
        hostId: user.id,
        title: body.title,
        type: body.type === "group" ? "group" : "one_on_one",
        scheduledAt: startTime,
        durationMinutes: body.durationMinutes,
        meetLink: meet.meetLink,
        status: "scheduled",
      })
      .returning({ id: sessions.id, meetLink: sessions.meetLink });

    return NextResponse.json({
      success: true,
      data: { id: session[0].id, meetLink: session[0].meetLink },
    });
  } catch (err: any) {
    console.error("create session error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Failed to create session" },
      { status: 500 },
    );
  }
}
