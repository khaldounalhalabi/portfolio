import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/database.types";

function getEnv(name: string) {
  return process.env[name]?.trim();
}

function getPublishableKey() {
  return (
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function hasSupabaseServerEnv() {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") && getPublishableKey(),
  );
}

export function createSupabaseServerClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = getPublishableKey();

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
