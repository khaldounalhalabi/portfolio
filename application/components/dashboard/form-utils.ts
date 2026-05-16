"use client";

import { useEffect, useMemo } from "react";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export type DashboardActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export function fileListToFirstFile(value: FileList | null | undefined) {
  return value && value.length > 0 ? value.item(0) : null;
}

export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors?: Record<string, string[] | undefined>,
) {
  if (!fieldErrors) {
    return;
  }

  Object.entries(fieldErrors).forEach(([field, messages]) => {
    const message = messages?.[0];
    if (!message) {
      return;
    }

    setError(field as FieldPath<TFieldValues>, {
      type: "server",
      message,
    });
  });
}

export function getClientErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useObjectUrl(file: File | null) {
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(
    () => () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    },
    [objectUrl],
  );

  return objectUrl;
}
