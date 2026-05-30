"use client";

import { useState, useRef } from "react";
import { Card, CardBody, LinkButton, Pill, Button } from "@/components/ui";

const mockUpcoming = [
  { id: "u1", title: "Rotational Dynamics \u2014 Advanced Problems", date: "Today \u00b7 5:30 PM", duration: "60 min", student: "Arjun S.", type: "1-on-1" as const, meetLink: "https://meet.google.com/abc-defg-hij" },
  { id: "u2", title: "Organic Chemistry \u2014 Aldol Reactions", date: "Tomorrow \u00b7 4:00 PM", duration: "45 min", student: "Meera K.", type: "1-on-1" as const },
  { id: "u3", title: "Weekly Group Doubt Session", date: "Sat \u00b7 10:00 AM", duration: "90 min", student: "5 attending", type: "Group" as const },
];

const mockLive = [
  { id: "l1", title: "Wave Optics \u2014 Young\u2019s Double Slit", date: "Started 12 min ago", duration: "00:12:34", student: "Kabir S.", type: "1-on-1" as const, meetLink: "https://meet.google.com/xyz-uvw-rst" },
];

const mockPast = [
  { id: "p1", title: "Thermodynamics \u2014 Practice", date: "22 May 2026", duration: "47 min", student: "Saanvi P.", type: "1-on-1" as const, feedback: 4 },
  { id: "p2", title: "Calculus \u2014 Integration Clinic", date: "20 May 2026", duration: "55 min", student: "Group (4)", type: "Group" as const, feedback: 5 },
  { id: "p3", title: "Kinematics Review", date: "18 May 2026", duration: "32 min", student: "Diya R.", type: "1-on-1" as const, feedback: null as number | null },
];

export function SessionsClient() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-5">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Create session
        </Button>
      </div>

      {showCreate && <CreateSessionModal onClose={() => setShowCreate(false)} />}

      {mockLive.length > 0 && (
        <section className="mb-8">
          <div className="meta mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            LIVE NOW
          </div>
          <div className="grid gap-3">
            {mockLive.map((s) => (
              <Card key={s.id}>
                <CardBody className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="coral">LIVE</Pill>
                      <Pill tone="primary">{s.type}</Pill>
                      <span className="font-mono text-xs text-ink-faint">{s.duration}</span>
                    </div>
                    <div className="font-serif text-lg mt-1">{s.title}</div>
                    <div className="text-sm text-ink-soft mt-1">{s.student} &middot; {s.date}</div>
                  </div>
                  <LinkButton href={s.meetLink || "#"} size="sm" target="_blank">
                    Join session &rarr;
                  </LinkButton>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="meta mb-3">UPCOMING</div>
        <div className="grid gap-3">
          {mockUpcoming.map((s) => (
            <Card key={s.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill tone="neutral">{s.type}</Pill>
                    <span className="text-xs text-ink-faint">{s.duration}</span>
                  </div>
                  <div className="font-serif text-lg mt-1">{s.title}</div>
                  <div className="text-sm text-ink-soft mt-1">{s.student} &middot; {s.date}</div>
                </div>
                {s.meetLink ? (
                  <LinkButton href={s.meetLink} size="sm" variant="ghost" target="_blank">
                    Join &rarr;
                  </LinkButton>
                ) : (
                  <Pill tone="warn">No link yet</Pill>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="meta mb-3">PAST SESSIONS</div>
        <div className="grid gap-3">
          {mockPast.map((s) => (
            <Card key={s.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill tone="neutral">{s.type}</Pill>
                    <span className="text-xs text-ink-faint">{s.duration}</span>
                  </div>
                  <div className="font-serif text-lg mt-1">{s.title}</div>
                  <div className="text-sm text-ink-soft mt-1">{s.student} &middot; {s.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={s.feedback ? "primary" : "warn"}>
                    {s.feedback ? `${s.feedback}/5` : "No feedback"}
                  </Pill>
                  <LinkButton href={`/session/${s.id}`} variant="ghost" size="sm">
                    Details
                  </LinkButton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ meetLink: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const submitting = useRef(false);

  function now() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
  }

  const { date: today, time: nowTime } = now();
  const minTime = selectedDate === today ? nowTime : undefined;

  function validateField(name: string, value: string): string {
    let err = "";
    if (name === "title" && !value.trim()) {
      err = "Session title is required";
    }
    if (name === "date") {
      if (!value) err = "Date is required";
      else if (value < today) err = "Date cannot be in the past";
    }
    if (name === "time") {
      if (!value) err = "Time is required";
      else if (selectedDate === today && value < nowTime) err = "Time cannot be in the past";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  }

  function handleBlur(name: string, value: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }

  function handleChange(name: string, value: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const title = (data.get("title") as string) ?? "";
    const sessionType = (data.get("type") as string) ?? "";
    const date = (data.get("date") as string) ?? "";
    const time = (data.get("time") as string) ?? "";

    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Session title is required";
    if (!date) errs.date = "Date is required";
    else if (date < today) errs.date = "Date cannot be in the past";
    if (!time) errs.time = "Time is required";
    else if (date === today && time < nowTime) errs.time = "Time cannot be in the past";

    setFieldErrors(errs);
    setTouched({ title: true, date: true, time: true });

    if (errs.title || errs.date || errs.time) return;

    if (submitting.current) return;
    submitting.current = true;
    setError("");

    try {
      const res = await fetch("/api/mentor/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: sessionType === "Group" ? "group" : "one_on_one",
          scheduledAt: new Date(`${date}T${time}:00+05:30`).toISOString(),
          durationMinutes: 60,
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        setError(resData.error ?? "Failed to create session");
      } else {
        setResult(resData.data);
      }
    } catch {
      setError("Network error \u2014 try again");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-card border border-rule rounded-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-rule flex items-center justify-between">
          <div>
            <div className="meta">NEW SESSION</div>
            <h2 className="font-serif text-xl mt-1">Create a mentoring session</h2>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink text-xl">&times;</button>
        </div>

        {result ? (
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary text-2xl">&#10003;</div>
            <div className="font-serif text-lg mb-2">Session created!</div>
            <p className="text-sm text-ink-soft mb-4">
              Your Jitsi Meet room is ready. Share the link with your student.
            </p>
            <div className="bg-secondary-soft rounded-card px-4 py-3 mb-4 break-all text-sm font-mono">
              {result.meetLink}
            </div>
            <div className="flex items-center gap-3 justify-center">
              <a href={result.meetLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm">Open Meet room</Button>
              </a>
              <button onClick={onClose} className="px-4 py-2 text-sm text-ink-soft hover:text-ink">
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 bg-secondary-soft border-b border-secondary/20">
              <p className="text-xs text-[#74240a]">
                By creating this session, you agree that admins may observe for quality
                assurance. Do not share personal contact information with students.
                All communication must stay within the Hitaishi platform.
              </p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="meta block mb-1">Session title *</label>
                <input
                  id="session-title"
                  name="title"
                  className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.title && fieldErrors.title ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                  placeholder="e.g. Thermodynamics \u2014 Advanced Practice"
                  onBlur={(e) => handleBlur("title", e.target.value)}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
                {touched.title && fieldErrors.title && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="meta block mb-1">Subject</label>
                  <select name="subject" className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface-card">
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="meta block mb-1">Type</label>
                  <select name="type" className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface-card">
                    <option value="1-on-1">1-on-1</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="meta block mb-1">Date *</label>
                  <input
                    id="session-date"
                    name="date"
                    type="date"
                    min={today}
                    className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.date && fieldErrors.date ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                    onBlur={(e) => handleBlur("date", e.target.value)}
                    onChange={(e) => { setSelectedDate(e.target.value); handleChange("date", e.target.value); }}
                  />
                  {touched.date && fieldErrors.date && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="meta block mb-1">Time *</label>
                  <input
                    id="session-time"
                    name="time"
                    type="time"
                    min={minTime}
                    className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.time && fieldErrors.time ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                    onBlur={(e) => handleBlur("time", e.target.value)}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                  {touched.time && fieldErrors.time && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.time}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-input px-3 py-2">{error}</div>
              )}

              <div className="border-t border-rule pt-4 mt-2">
                <p className="text-xs text-ink-faint mb-3">
                  A Jitsi Meet link will be auto-generated when you create this session. The Meet room
                  will be empty &mdash; you are the host and must admit participants.
                </p>
                <div className="flex items-center gap-3">
                  <Button type="submit" size="md" className="flex-1">
                    Generate Meet Link & Create
                  </Button>
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink-soft hover:text-ink">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
