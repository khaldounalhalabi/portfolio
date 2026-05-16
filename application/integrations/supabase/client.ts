import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/database.types";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

function getBrowserPublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = getBrowserPublishableKey();

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  if (!browserClient) {
    browserClient = createClient<Database>(url, publishableKey);
  }

  return browserClient;
}
