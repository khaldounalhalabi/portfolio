"use server";

import { createClient } from "@/lib/supabase/server";
import ResumeService from "@/services/ResumeService";

export async function regenerateResumeAction() {
  try {
    const supabase = await createClient();
    const publicUrl = await ResumeService.make().generateAndUpload(supabase);

    return { publicUrl };
  } catch (error) {
    console.error("Failed to regenerate resume:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Resume regeneration failed",
    };
  }
}
