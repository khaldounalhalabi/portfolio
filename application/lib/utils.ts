import { Path, PathValue } from "@/types/helper-types";
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
