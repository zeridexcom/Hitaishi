import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { SessionRoomClient } from "./SessionRoomClient";

interface PageProps {
  params: { sessionId: string };
}

export default async function SessionRoomPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student" && user.role !== "mentor") {
    redirect(`/${user.role}/dashboard`);
  }

  // TODO(phase-3f): hydrate from DB — sessions + sessionParticipants + user profiles
  const session = {
    id: params.sessionId,
    title: "Advanced Calculus: Integration by Parts & Series",
    meetLink: "https://meet.google.com/abc-defg-hij",
    mentor: { name: "Priya Sharma" },
    status: "live" as const,
    elapsedHms: "00:42:15",
  };

  const participants = [
    { id: "p1", name: "Priya Sharma", role: "mentor" as const, muted: false, raised: false, primary: true },
    { id: "p2", name: "Arush V.", role: "student" as const, muted: false, raised: true },
    { id: "p3", name: "Meera K.", role: "student" as const, muted: false, raised: false },
    { id: "p4", name: "Rohan S.", role: "student" as const, muted: true, raised: false },
    { id: "p5", name: "Sarah L.", role: "student" as const, muted: true, raised: false },
  ];

  return (
    <main className="min-h-screen bg-[#0c1612] text-white flex flex-col">
      <PrivacyNoticeBanner />
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
            S.08 · {session.status === "live" ? "LIVE SESSION" : "SESSION ROOM"}
          </div>
          <h1 className="font-serif text-lg mt-0.5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {session.status === "live" && (
            <span className="font-mono text-sm text-white/70">
              {session.elapsedHms}
            </span>
          )}
          <Link
            href={`/${user.role}/sessions`}
            className="px-3 py-1.5 rounded-btn bg-red-600 hover:bg-red-700 text-sm font-medium"
          >
            Leave session
          </Link>
        </div>
      </header>

      <SessionRoomClient
        meetLink={session.meetLink}
        status={session.status}
        participants={participants}
        mentorName={session.mentor.name}
      />
    </main>
  );
}
