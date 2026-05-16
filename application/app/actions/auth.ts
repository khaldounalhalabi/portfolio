"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  clearAuthCookies,
  requireAuthenticatedUserForWrite,
  setAuthCookies,
  updateAuthenticatedUserPassword,
} from "@/lib/auth/session";

function getTrimmed(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData) {
  const email = getTrimmed(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required.");
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    redirect("/login?error=Invalid%20email%20or%20password.");
  }

  await setAuthCookies(data.session);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getTrimmed(formData, "email");

  if (!email) {
    redirect("/login?error=Enter%20your%20email%20to%20reset%20your%20password.");
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect("/login?error=Unable%20to%20send%20reset%20email.");
  }

  redirect("/login?message=Password%20reset%20email%20sent.");
}

export async function updatePasswordAction(formData: FormData) {
  await requireAuthenticatedUserForWrite();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect("/reset-password?error=Password%20must%20be%20at%20least%208%20characters.");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?error=Passwords%20do%20not%20match.");
  }

  await updateAuthenticatedUserPassword(password);
  await clearAuthCookies();
  redirect(
    "/login?message=Password%20updated.%20Sign%20in%20with%20your%20new%20password.",
  );
}
