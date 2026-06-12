import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(20).max(5000),
  topic: z.enum(["New Concepts", "Studio Support", "Game Sales", "Other"]),
});

// Simple in-memory rate limiter (per IP, 5 / hour)
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRate(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (b.count >= LIMIT) return false;
  b.count += 1;
  return true;
}

function getIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, message, topic } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "buildupsupport@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "BuildUp Games <noreply@buildupgames.com>";

  // If Resend isn't configured, log and return success in dev (so the form still works locally)
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contact] RESEND_API_KEY not set — logging email payload instead.");
      console.warn({ to, from, name, email, topic, message });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `[${topic}] ${name} via buildupgames.com`;
    const html = renderEmail({ name, email, topic, message });

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      html,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Email provider rejected the request" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function renderEmail({
  name,
  email,
  topic,
  message,
}: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const safe = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]!));
  return `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a1020; color: #e8ecf5; border-radius: 16px;">
      <h2 style="margin: 0 0 8px; color: #fff;">New contact form submission</h2>
      <p style="margin: 0 0 24px; color: #a8b2cb; font-size: 14px;">Topic: <strong style="color: #ef3b93;">${safe(topic)}</strong></p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #a8b2cb; font-size: 13px; width: 90px;">Name</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${safe(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #a8b2cb; font-size: 13px;">Email</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;"><a href="mailto:${safe(email)}" style="color: #2f77e4;">${safe(email)}</a></td>
        </tr>
      </table>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
      <div style="color: #cdd5e6; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${safe(message)}</div>
    </div>
  `;
}
