"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { syncServerAuthSession } from "@/lib/auth/browser-session";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      await syncServerAuthSession(null);
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary disabled:opacity-60"
    >
      {isSubmitting ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Logging out...
        </span>
      ) : (
        "Logout"
      )}
    </button>
  );
}
