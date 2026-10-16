import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = { name?: unknown; email?: unknown; message?: unknown; company?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint.
 * It only reports success when the email provider (Resend) actually accepted the message.
 * Without RESEND_API_KEY + CONTACT_TO_EMAIL it returns 501 so the UI can be honest about it.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ error: "rejected" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = "Please enter a valid email address.";
  if (message.length < 10 || message.length > 5000) errors.message = "Message should be between 10 and 5000 characters.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "validation", fields: errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
}
