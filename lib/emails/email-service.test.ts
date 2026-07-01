import { describe, it, expect, vi } from "vitest";
import {
  sendWelcomeEmail,
  sendOnboardingMatchEmail,
  sendSessionScheduledEmail,
  sendDoubtAssignedEmail,
  sendWeeklyDigestEmail,
  sendInstitutionPartnerEmail,
  sendMentorWelcomeEmail,
} from "./email-service";

describe("email-service", () => {
  it("uses mock log fallback in dev when key is not configured", async () => {
    // Assert that the default test execution correctly falls back to mock logic
    const res = await sendWelcomeEmail("test@example.com", "John Doe", "http://localhost:3000/onboard");
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendOnboardingMatchEmail runs successfully", async () => {
    const res = await sendOnboardingMatchEmail(
      "test@example.com",
      "Arjun",
      "Rahul",
      "IIT Delhi",
      "Computer Science",
      "http://localhost:3000/book"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendSessionScheduledEmail runs successfully", async () => {
    const res = await sendSessionScheduledEmail(
      "test@example.com",
      "Arjun",
      "Rahul",
      false,
      "Monday, Oct 12",
      "5:00 PM - 5:45 PM",
      "http://localhost:3000/call"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendDoubtAssignedEmail runs successfully", async () => {
    const res = await sendDoubtAssignedEmail(
      "test@example.com",
      "Rahul",
      "Arjun",
      "Physics",
      "Rotational Mechanics",
      "http://localhost:3000/doubts"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendWeeklyDigestEmail runs successfully", async () => {
    const res = await sendWeeklyDigestEmail(
      "test@example.com",
      "Arjun",
      "Rahul",
      4,
      5,
      "80%",
      "185 / 300",
      "Great work this week, focus on integration!"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendInstitutionPartnerEmail runs successfully", async () => {
    const res = await sendInstitutionPartnerEmail(
      "test@example.com",
      "Principal Sharma",
      "DPS RK Puram",
      "http://localhost:3000/partner-onboard"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });

  it("sendMentorWelcomeEmail runs successfully", async () => {
    const res = await sendMentorWelcomeEmail(
      "test@example.com",
      "Priya Iyer",
      "http://localhost:3000/mentor-onboard"
    );
    expect(res.ok).toBe(true);
    expect(res.mock).toBe(true);
  });
});
