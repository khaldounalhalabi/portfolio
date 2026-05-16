"use client";

import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { syncServerAuthSession } from "@/lib/auth/browser-session";

export function SupabaseSessionSync() {
  useEffect(() => {
    let supabase: ReturnType<typeof createSupabaseBrowserClient>;

    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        void syncServerAuthSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        void syncServerAuthSession(session);
        return;
      }

      if (event === "SIGNED_OUT") {
        void syncServerAuthSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
