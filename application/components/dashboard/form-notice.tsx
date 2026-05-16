"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type FormNoticeProps = {
  type: "error" | "success" | "info";
  message: string;
};

const noticeStyles: Record<FormNoticeProps["type"], string> = {
  error:
    "border-red-500/25 bg-red-500/10 text-red-100 [&_svg]:text-red-300",
  success:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-100 [&_svg]:text-emerald-300",
  info:
    "border-white/10 bg-surface-container-high text-on-surface-variant [&_svg]:text-secondary",
};

const noticeIcons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} satisfies Record<FormNoticeProps["type"], typeof Info>;

export function FormNotice({ type, message }: FormNoticeProps) {
  const Icon = noticeIcons[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        noticeStyles[type],
      )}
      role={type === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
