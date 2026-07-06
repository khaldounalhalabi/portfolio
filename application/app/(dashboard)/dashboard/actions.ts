"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePortfolio() {
  revalidatePath("/", "layout");
  revalidatePath("/experience", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/contact", "page");
}
