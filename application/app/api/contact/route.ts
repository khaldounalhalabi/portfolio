import { NextResponse } from "next/server";
import { z } from "zod";

// Simple in-memory sliding-window rate limiter, keyed by client IP. This guards
// the owner's personal inbox against flooding with otherwise-valid submissions.
// It is per-instance (state is not shared across serverless instances); for a
// single long-running deployment that is sufficient. For multi-instance/edge
// deployments, move this to a shared store (e.g. Upstash/Redis).
const RATE_LIMIT_MAX = 5; // submissions allowed per window, per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const rateLimitHits = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // First entry is the original client; the rest are proxies.
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitHits.get(ip) ?? []).filter((ts) => ts > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitHits.set(ip, recent);

  // Opportunistically prune stale entries so the map cannot grow unbounded.
  if (rateLimitHits.size > 5000) {
    for (const [key, timestamps] of rateLimitHits) {
      const live = timestamps.filter((ts) => ts > windowStart);
      if (live.length === 0) {
        rateLimitHits.delete(key);
      } else {
        rateLimitHits.set(key, live);
      }
    }
  }

  return false;
}

// name, email and subject are interpolated into email headers downstream, so
// reject any CR/LF here to block SMTP header injection at the internet-facing
// boundary (the services API validates again as defense in depth).
const noNewlines = /^[^\r\n]*$/;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120)
    .regex(noNewlines, "Name contains invalid characters"),
  email: z
    .email("A valid email is required")
    .trim()
    .max(254)
    .regex(noNewlines, "Email contains invalid characters"),
  subject: z
    .string()
    .trim()
    .max(160)
    .regex(noNewlines, "Subject contains invalid characters")
    .optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot field — humans never see it, so it should arrive empty. We accept
  // any string here (rather than enforcing empty) so a filled value can be
  // silently dropped below instead of surfacing a validation error to the bot.
  company: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.RESUME_SERVICE_URL;
    const apiKey = process.env.RESUME_SERVICE_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error("Contact service is not configured");
    }

    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 422 },
      );
    }

    // Silently accept honeypot hits so bots don't learn they were filtered.
    if (parsed.data.company) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    };

    const response = await fetch(`${baseUrl}/api/v1/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      throw new Error(
        body.error ?? `Contact service returned ${response.status}`,
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to send contact message:", error);

    return NextResponse.json(
      { error: "Your message could not be sent. Please try again later." },
      { status: 500 },
    );
  }
}
