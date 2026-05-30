import { randomBytes } from "crypto";

export interface CreateMeetingInput {
  title: string;
  startTime: Date;
  durationMinutes: number;
  description?: string;
  mentorEmail?: string;
}

export interface MeetingResult {
  meetLink: string;
}

function generateRoomSlug(): string {
  const prefix = "hitaishi";
  const random = randomBytes(4).toString("hex");
  return `${prefix}-${random}`;
}

export async function createMeeting(input: CreateMeetingInput): Promise<MeetingResult> {
  const slug = generateRoomSlug();
  return { meetLink: `https://meet.jit.si/${slug}` };
}
