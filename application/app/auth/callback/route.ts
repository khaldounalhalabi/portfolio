import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { setAuthCookies } from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=Invalid%20auth%20callback.", origin));
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/login?error=Unable%20to%20verify%20auth%20callback.", origin));
  }

  await setAuthCookies(data.session);
  return NextResponse.redirect(new URL(next, origin));
}
