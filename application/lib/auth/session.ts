import "server-only";

import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/integrations/supabase/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setAuthCookies(session: {
  access_token: string;
  refresh_token: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, cookieOptions);
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, cookieOptions);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

async function refreshUser(refreshToken: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    return null;
  }

  await setAuthCookies(data.session);
  return data.user;
}

type AuthReadOptions = {
  allowCookieMutation?: boolean;
};

async function clearAuthCookiesIfAllowed(allowCookieMutation: boolean) {
  if (allowCookieMutation) {
    await clearAuthCookies();
  }
}

export async function getOptionalAuthenticatedUser(
  options: AuthReadOptions = {},
): Promise<User | null> {
  const { allowCookieMutation = false } = options;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (!error && data.user) {
    return data.user;
  }

  if (refreshToken && allowCookieMutation) {
    const refreshedUser = await refreshUser(refreshToken);
    if (refreshedUser) {
      return refreshedUser;
    }
  }

  await clearAuthCookiesIfAllowed(allowCookieMutation);
  return null;
}

export async function requireAuthenticatedUser() {
  const user = await getOptionalAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAuthenticatedUserForWrite() {
  const user = await getOptionalAuthenticatedUser({ allowCookieMutation: true });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function updateAuthenticatedUserPassword(password: string) {
  const user = await requireAuthenticatedUserForWrite();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password,
  });

  if (error) {
    throw error;
  }
}
