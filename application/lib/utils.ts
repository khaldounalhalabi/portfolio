import { Path, PathValue } from "@/types/helper-types";
import { User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNestedPropertyValue<
  OBJECT extends Record<string, unknown>,
  KEY extends Path<OBJECT>,
>(obj: OBJECT, path: KEY): PathValue<OBJECT, KEY> | undefined {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) {
    return undefined;
  }

  let cur = obj;
  for (const key of parts) {
    if (cur == null) {
      return undefined;
    }
    if (!Object.prototype.hasOwnProperty.call(cur, key)) {
      return undefined;
    }
    // @ts-expect-error accessing properties dynamically
    cur = cur[key];
  }
  return cur as PathValue<OBJECT, KEY> | undefined;
}

export function getUserInitials(user: User) {
  if (user.user_metadata.first_name && user.user_metadata.last_name) {
    return (
      user.user_metadata.first_name.charAt(0).toUpperCase() +
      user.user_metadata.last_name.charAt(0).toUpperCase()
    );
  }

  return user.email
    ? user.email?.charAt(0).toUpperCase() + user.email?.charAt(1).toUpperCase()
    : "US";
}

export function userFullName(user: User) {
  if (user.user_metadata.first_name && user.user_metadata.last_name) {
    return (
      user.user_metadata.first_name.charAt(0).toUpperCase() +
      user.user_metadata.first_name.slice(1) +
      " " +
      user.user_metadata.last_name.charAt(0).toUpperCase() +
      user.user_metadata.last_name.slice(1)
    );
  }

  return user.email ?? "User";
}
