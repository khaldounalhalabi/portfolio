"use server";

import { cookies, headers } from "next/headers";
import { randomUUID } from "node:crypto";

import { createClient } from "@/lib/supabase/server";

const VISIT_SESSION_COOKIE = "visit_session_id";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|lighthouse|preview|whatsapp|facebookexternalhit|twitterbot|linkedinbot|skypeuripreview/i;

export async function trackPageView(path: string): Promise<void> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") ?? "";

    if (BOT_PATTERN.test(userAgent)) {
      return;
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get(VISIT_SESSION_COOKIE)?.value;

    if (!sessionId) {
      sessionId = randomUUID();
      cookieStore.set(VISIT_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    const supabase = await createClient();
    await supabase.from("visits").insert({
      path,
      referrer: headersList.get("referer"),
      session_id: sessionId,
      user_agent: userAgent,
    });
  } catch {
    // Silently ignore tracking failures so page rendering is never blocked.
  }
}
