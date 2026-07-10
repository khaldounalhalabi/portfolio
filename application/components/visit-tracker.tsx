"use client";

import { trackPageView } from "@/lib/visits";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function VisitTracker() {
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;
    void trackPageView(pathname);
  }, [pathname]);

  return null;
}
