import { NextResponse } from "next/server";
import { appendLead, clearLeads, readLeads } from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function GET() {
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let name = "";
  let email = "";
  let phone = "";
  let subject = "";
  let message = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    name = typeof body.name === "string" ? body.name.trim() : "";
    email = typeof body.email === "string" ? body.email.trim() : "";
    phone = typeof body.phone === "string" ? body.phone.trim() : "";
    subject = typeof body.subject === "string" ? body.subject.trim() : "";
    message = typeof body.message === "string" ? body.message.trim() : "";
  } else {
    const form = await request.formData();
    name = str(form.get("name"));
    email = str(form.get("email"));
    phone = str(form.get("phone"));
    subject = str(form.get("subject"));
    message = str(form.get("message"));
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const lead = await appendLead({
    name,
    email,
    phone: phone || undefined,
    subject: subject || undefined,
    message,
  });

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}

export async function DELETE() {
  await clearLeads();
  return NextResponse.json({ ok: true });
}
