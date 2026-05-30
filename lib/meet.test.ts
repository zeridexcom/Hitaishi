import { describe, it, expect } from "vitest";
import { createMeeting } from "./meet";

describe("createMeeting", () => {
  it("returns a Jitsi meet link", async () => {
    const result = await createMeeting({
      title: "Physics — Rotational Dynamics",
      startTime: new Date("2026-06-01T17:30:00+05:30"),
      durationMinutes: 60,
      mentorEmail: "mentor@hitaishi.app",
    });

    expect(result.meetLink).toMatch(/^https:\/\/meet\.jit\.si\/hitaishi-/);
  });

  it("generates different slugs each time", async () => {
    const a = await createMeeting({ title: "A", startTime: new Date(), durationMinutes: 30 });
    const b = await createMeeting({ title: "B", startTime: new Date(), durationMinutes: 45 });

    expect(a.meetLink).not.toBe(b.meetLink);
  });

  it("handles minimal input", async () => {
    const result = await createMeeting({
      title: "minimal",
      startTime: new Date("2026-07-01T10:00:00Z"),
      durationMinutes: 30,
    });

    expect(result.meetLink).toMatch(/^https:\/\/meet\.jit\.si\/hitaishi-/);
  });
});
