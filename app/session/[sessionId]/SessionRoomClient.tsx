"use client";

import { Pill } from "@/components/ui";

interface Participant {
  id: string;
  name: string;
  role: "mentor" | "student";
  muted: boolean;
  raised: boolean;
  primary?: boolean;
}

interface Props {
  meetLink: string | null;
  status: string;
  participants: Participant[];
  mentorName: string;
}

export function SessionRoomClient({ meetLink, status, participants, mentorName }: Props) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
      <section className="p-6 flex flex-col gap-4 overflow-y-auto">
        {meetLink && status === "live" ? (
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative overflow-hidden">
            <iframe
              src={meetLink}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture"
              title="Jitsi Meet"
            />
          </div>
        ) : (
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center font-serif text-4xl mx-auto text-white/40">
                ?
              </div>
              <div className="mt-4 text-white/40 text-sm">
                Meet link will appear here when the session starts
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {participants.slice(1).map((p) => (
            <div
              key={p.id}
              className="bg-[#16241d] rounded-card border border-white/10 aspect-video flex flex-col items-center justify-center relative p-2"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-mono">
                {p.name[0]}
              </div>
              <div className="text-xs mt-2 text-white/80">{p.name}</div>
              <div className="absolute bottom-2 right-2 flex gap-1 text-xs">
                {p.raised && <Pill tone="coral">raised</Pill>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="bg-[#0a120e] border-l border-white/10 flex flex-col">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
            Live chat &middot; {participants.length} in room
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
          <div className="text-white/40 text-xs text-center py-8">
            Chat will be available once the session room is active
          </div>
        </div>
        <form className="border-t border-white/10 p-3 flex items-center gap-2">
          <input
            placeholder="Message room&hellip;"
            className="flex-1 bg-white/5 border border-white/10 rounded-input px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button className="px-3 py-2 rounded-btn bg-primary hover:bg-primary-hover text-sm">
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}
