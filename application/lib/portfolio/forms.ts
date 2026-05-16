import type { ProjectTech } from "@/lib/portfolio/types";

export function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitCommaList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseTechStack(value: FormDataEntryValue | null): ProjectTech[] {
  return splitLines(value).map((line) => {
    const [name = "", icon = "", detail = ""] = line
      .split("|")
      .map((item) => item.trim());

    return { name, icon, detail };
  });
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
