"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. Higher = slower. */
  duration?: number;
  /** Scroll direction. */
  reverse?: boolean;
  /** Pause the animation while hovering the strip. */
  pauseOnHover?: boolean;
}

/**
 * A seamless, low-key horizontal marquee. The children are duplicated once so
 * the loop wraps without a visible jump. Motion is disabled automatically for
 * users who prefer reduced motion (handled in globals.css).
 */
export function Marquee({
  children,
  className,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        pauseOnHover && "marquee-paused",
        className,
      )}
    >
      <div
        className="animate-marquee flex min-w-full shrink-0 items-center"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
        aria-hidden={false}
      >
        {children}
      </div>
      <div
        className="animate-marquee flex min-w-full shrink-0 items-center"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
