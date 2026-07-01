import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Button, Pill } from "@/components/ui";

const STEPS = [
  { label: "Details" },
  { label: "Cohort" },
  { label: "Goals" },
];

const COHORT_SIZES = [
  "< 50",
  "50–200",
  "200–500",
  "500–1000",
  "1000+",
];

const BATCHES = [
  "Class XI Foundation",
  "Class XII Syllabus & Boards",
  "Droppers — Intensive JEE",
] as const;

interface Props {
  searchParams?: any;
}

export default async function InstitutionOnboardingPage({ searchParams }: Props) {
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
            Partner Onboarding
          </div>
        </header>

        <div className="max-w-2xl w-full mx-auto px-6 py-10 md:py-16 flex-grow flex flex-col justify-center">
          <Stepper steps={STEPS} current={step} className="mb-8" />

          <div className="relative">
            {step === 0 && <Step1Details />}
            {step === 1 && <Step2Cohort />}
            {step === 2 && <Step3Goals />}
          </div>
        </div>
      </div>
    </main>
  );
}

function Step1Details() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 1 OF 3 · 33%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">Institutional Details</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Tell us about your coaching center or academy.
        </p>

        <form
          action="/institution/onboarding?step=1"
          method="get"
          className="grid gap-4 mt-8"
        >
          <Field label="Institution Name" required>
            <Input name="institutionName" placeholder="e.g. Bright Future JEE Academy" required />
          </Field>
          <Field label="Contact Person Name" required>
            <Input name="contactPerson" placeholder="Full name" required />
          </Field>
          <Field label="Your Role" required>
            <Input name="role" placeholder="e.g. Director, Principal, Academic Head" required />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Official Email" required>
              <Input type="email" name="email" placeholder="director@brightfuture.com" required />
            </Field>
            <Field label="Phone Number" required>
              <Input type="tel" name="phone" placeholder="e.g. +91 98765 43210" required />
            </Field>
          </div>
          <Field label="City" required>
            <Input name="city" placeholder="Hyderabad" required />
          </Field>
          <input type="hidden" name="step" value="1" />
          <div className="flex justify-end mt-4">
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step2Cohort() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 2 OF 3 · 67%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">Student Cohort Details</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Help us estimate the mentor capacity needed for your batches.
        </p>

        <form
          action="/institution/onboarding?step=2"
          method="get"
          className="grid gap-5 mt-8"
        >
          <Field label="Number of JEE Students" required>
            <Select name="studentCount" required>
              <option value="">Select size…</option>
              {COHORT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} students
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Batches Running Currently">
            <div className="flex flex-col gap-3 mt-2">
              {BATCHES.map((batch) => (
                <label key={batch} className="flex items-center gap-3 cursor-pointer text-sm text-ink">
                  <input
                    type="checkbox"
                    name="batches"
                    value={batch}
                    className="rounded border-rule text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>{batch}</span>
                </label>
              ))}
            </div>
          </Field>

          <input type="hidden" name="step" value="2" />
          <div className="flex justify-between mt-4">
            <Link
              href="/institution/onboarding?step=0"
              className="chip-ghost"
            >
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

function Step3Goals() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
      <CardBody className="p-8 md:p-10">
        <div className="meta text-xs tracking-widest font-mono text-primary font-semibold">STEP 3 OF 3 · 100%</div>
        <h2 className="font-serif text-3xl font-medium mt-2 text-ink">Partnership Goals</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          Define how Hitaishi&apos;s IITian mentors can support your institution.
        </p>

        <form
          action="/"
          method="get"
          className="grid gap-5 mt-8"
        >
          <Field label="Preferred Integration Model" required>
            <Select name="integrationModel" required>
              <option value="">Select model…</option>
              <option value="addon">Add-on service for our students</option>
              <option value="integrated">Integrated into our fee structure</option>
              <option value="pilot">Pilot batch / small cohort</option>
              <option value="discussion">Not sure — let&apos;s discuss</option>
            </Select>
          </Field>

          <Field label="Primary Partnership Goal" required>
            <Select name="primaryGoal" required>
              <option value="">Select goal…</option>
              <option value="backlog">Reduce doubt backlog & clear concepts</option>
              <option value="guidance">Provide personal study strategies</option>
              <option value="analytics">Performance analytics & reviews</option>
              <option value="marketing">Gain a marketing edge with IITian mentors</option>
            </Select>
          </Field>

          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mt-4">
            <Link
              href="/institution/onboarding?step=1"
              className="chip-ghost"
            >
              ← Back
            </Link>
            <div className="flex gap-3 items-center">
              <Link
                href="/"
                className="text-sm text-ink-soft hover:text-primary-deep underline underline-offset-2"
              >
                Skip for now
              </Link>
              <Button type="submit" size="lg">
                Submit Partnership Enquiry →
              </Button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 border-t border-rule/60 pt-8">
          <div className="rounded-xl border border-rule/60 p-5 bg-white/50">
            <Pill tone="primary">INSTITUTIONS</Pill>
            <h4 className="font-serif text-lg mt-3 text-ink">White-Labeled Reports</h4>
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">
              Receive weekly engagement and confidence ratings per student batch.
            </p>
          </div>
          <div className="rounded-xl border border-rule/60 p-5 bg-white/50">
            <Pill tone="coral">SCALABLE</Pill>
            <h4 className="font-serif text-lg mt-3 text-ink">IITian Mentor Matching</h4>
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">
              Every student gets one-on-one time with high rankers from top IITs.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
