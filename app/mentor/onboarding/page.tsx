import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Textarea, Button, Pill } from "@/components/ui";

const STEPS = [
  { label: "Profile" },
  { label: "Subjects" },
  { label: "Availability" },
];

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"] as const;
const LEVELS = ["Foundational", "Advanced (JEE Adv)"] as const;
const COHORTS = [
  "Class XI Foundation",
  "Class XII Syllabus & Boards",
  "Droppers — Intensive JEE",
] as const;
const TEACHING_TAGS = [
  "Concept building",
  "Problem solving",
  "Exam strategy",
  "Doubt clearing",
  "Speed tactics",
] as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Mor", "Aft", "Eve", "Night"];

interface Props {
  searchParams?: any;
}

export default async function MentorOnboardingPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const step = Math.max(0, Math.min(2, Number(resolved?.step ?? 0)));

  return (
    <main className="min-h-screen bg-surface text-ink relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Glowing Accent Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="absolute -top-[250px] -left-[250px] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute -bottom-[250px] -right-[250px] w-[700px] h-[700px] rounded-full bg-secondary/8 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col flex-grow">
        <header className="border-b border-rule bg-surface-card/60 backdrop-blur-md px-6 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-medium tracking-tight text-primary-deep hover:opacity-80 transition-opacity">
            Hitaishi
          </Link>
          <div className="text-xs font-mono tracking-widest text-ink-faint uppercase bg-surface-elevated/80 px-3 py-1 rounded-full border border-rule">
            Mentor Onboarding
          </div>
        </header>

        <div className="max-w-3xl w-full mx-auto px-6 py-10 md:py-16 flex-grow flex flex-col justify-center">
          <Stepper steps={STEPS} current={step} className="mb-8" />

          <div className="relative">
            {step === 0 && <Step1Profile />}
            {step === 1 && <Step2Subjects />}
            {step === 2 && <Step3Availability />}
          </div>
        </div>
      </div>
    </main>
  );
}

function Step1Profile() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 1 OF 3 · 33%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">Tell students about you</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Profile information is automatically cross-referenced with IIT
          institutional databases.
        </p>

        <form
          action="/mentor/onboarding?step=1"
          method="get"
          className="grid gap-4 mt-8"
        >
          <div className="flex items-center gap-4 p-4 bg-surface-elevated/50 rounded-card border border-rule">
            <div className="w-20 h-20 rounded-full bg-white border border-rule-strong flex items-center justify-center text-3xl text-ink-faint">
              📷
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Professional headshot</div>
              <div className="meta mt-1">Shown to prospective students</div>
              <button type="button" className="chip-ghost text-xs mt-2">
                Upload photo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display name" required>
              <Input name="displayName" placeholder="Priya Sharma" required />
            </Field>
            <Field label="JEE Adv rank">
              <Input type="number" name="jeeRank" placeholder="227" />
            </Field>
            <Field label="IIT" required>
              <Select name="iit" required>
                <option>IIT Bombay</option>
                <option>IIT Delhi</option>
                <option>IIT Madras</option>
                <option>IIT Kanpur</option>
                <option>IIT Kharagpur</option>
                <option>Other IIT</option>
              </Select>
            </Field>
            <Field label="Branch" required>
              <Input name="branch" placeholder="Computer Science" required />
            </Field>
            <Field label="Graduation year" required>
              <Input type="number" name="gradYear" placeholder="2024" required />
            </Field>
            <Field label="LinkedIn URL">
              <Input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/priya"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Bio" hint="Max 280 characters — shown during student selection.">
                <Textarea
                  name="bio"
                  rows={3}
                  maxLength={280}
                  placeholder="Cleared JEE Adv 2020 in top 250. I focus on building intuition, not shortcuts."
                />
              </Field>
            </div>
          </div>

          <input type="hidden" name="step" value="1" />
          <div className="flex justify-between mt-4">
            <button type="button" className="chip-ghost">Save draft</button>
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step2Subjects() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 2 OF 3 · 67%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">What you teach</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Subject expertise and pedagogical style. Pick what&apos;s true, not what
          markets well.
        </p>

        <form
          action="/mentor/onboarding?step=2"
          method="get"
          className="grid gap-5 mt-8"
        >
          <div className="grid gap-3">
            {SUBJECTS.map((s) => (
              <div key={s} className="border border-rule bg-surface-card/50 rounded-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-medium text-ink">{s}</div>
                  <div className="flex gap-2">
                    {LEVELS.map((lvl) => (
                      <label key={lvl} className="cursor-pointer">
                        <input
                          type="checkbox"
                          name={`level-${s}`}
                          value={lvl}
                          className="sr-only peer"
                        />
                        <span className="px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border border-rule-strong bg-white/50 peer-checked:bg-primary peer-checked:text-primary-on peer-checked:border-primary transition-all duration-200">
                          {lvl}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Field label="Preferred student batches">
            <div className="flex flex-wrap gap-2">
              {COHORTS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="checkbox" name="batches" value={c} className="sr-only peer" />
                  <span className="px-3 py-2 rounded-pill text-sm border border-rule-strong bg-white/50 peer-checked:bg-primary peer-checked:text-primary-on peer-checked:border-primary transition-all duration-200">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Teaching style" hint="Pick up to two.">
            <div className="flex flex-wrap gap-2">
              {TEACHING_TAGS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="checkbox" name="style" value={t} className="sr-only peer" />
                  <span className="px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border border-rule-strong bg-white/50 peer-checked:bg-secondary peer-checked:text-white peer-checked:border-secondary transition-all duration-200">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <p className="text-xs text-ink-faint italic">
            Students often value &ldquo;Concept building&rdquo; over pure shortcuts.
          </p>

          <input type="hidden" name="step" value="2" />
          <div className="flex justify-between mt-2">
            <Link href="/mentor/onboarding?step=0" className="chip-ghost">
              ← Back
            </Link>
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step3Availability() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 3 OF 3 · 100%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">When you&apos;re available</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Tap to toggle blocks. You can refine this any time after activation.
        </p>

        <form
          action="/mentor/dashboard"
          method="get"
          className="grid gap-5 mt-8"
        >
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-1 text-center">
            <div />
            {SLOTS.map((s) => (
              <div key={s} className="meta py-2 text-ink-soft font-medium">
                {s}
              </div>
            ))}
            {DAYS.map((d) => (
              <div key={d} className="contents">
                <div className="meta py-2 text-left font-semibold text-ink-soft">{d}</div>
                {SLOTS.map((s) => (
                  <label key={`${d}-${s}`} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name={`avail-${d}-${s}`}
                      className="sr-only peer"
                    />
                    <span className="block h-10 rounded-input bg-white/50 border border-rule-strong peer-checked:bg-primary peer-checked:border-primary transition-colors duration-150" />
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Field label="Time zone">
              <Select defaultValue="ist">
                <option value="ist">IST (GMT+5:30)</option>
                <option value="utc">UTC</option>
                <option value="pst">PST</option>
              </Select>
            </Field>
            <Field label="Target hours per week" hint="2–40 hours">
              <Input
                type="number"
                name="weeklyHours"
                min={2}
                max={40}
                defaultValue={10}
              />
            </Field>
          </div>

          <div className="flex justify-between mt-6">
            <Link href="/mentor/onboarding?step=1" className="chip-ghost">
              ← Back
            </Link>
            <Button type="submit" size="lg">
              Activate my profile →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
