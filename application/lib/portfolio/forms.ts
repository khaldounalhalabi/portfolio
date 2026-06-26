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

export function parseTechStack(
  value: FormDataEntryValue | null,
): ProjectTech[] {
  return splitLines(value).map((line) => {
    const [name = "", icon = "", description = ""] = line
      .split("|")
      .map((item) => item.trim());

    return { name, icon, description };
  });
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function title(value: string): string {
  return (
    value
      // Split camelCase and PascalCase
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      // Convert snake_case and kebab-case to spaces
      .replace(/[_-]+/g, " ")
      // Collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim()
      // Title case each word
      .replace(
        /\p{L}+/gu,
        (word) =>
          word.charAt(0).toLocaleUpperCase() +
          word.slice(1).toLocaleLowerCase(),
      )
  );
}
