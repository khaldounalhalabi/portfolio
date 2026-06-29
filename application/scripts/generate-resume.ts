import { createSupabaseServiceRoleClient } from "@/integrations/supabase/server";
import ResumeService from "@/services/ResumeService";

async function main() {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const publicUrl = await ResumeService.make().generateAndUpload(supabase);

    console.log(`Resume generated and uploaded: ${publicUrl}`);
  } catch (error) {
    console.error("Failed to generate resume during build:", error);
    process.exit(1);
  }
}

void main();
