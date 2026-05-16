"use client";

import type { Session } from "@supabase/supabase-js";

export async function syncServerAuthSession(session: Session | null) {
  if (session?.access_token && session.refresh_token) {
    await fetch("/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      }),
    });
    return;
  }

  await fetch("/auth/session", {
    method: "DELETE",
  });
}
