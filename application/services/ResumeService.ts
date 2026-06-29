import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/integrations/supabase/database.types";
import { generateResume } from "@/lib/resume/generateResume";

class ResumeService {
  private static instance?: ResumeService;

  private readonly bucketName = "resume";
  private readonly objectPath = "khaldoun-alhalabi-resume.pdf";

  private constructor() {}

  public static make(): ResumeService {
    if (!ResumeService.instance) {
      ResumeService.instance = new ResumeService();
    }

    return ResumeService.instance;
  }

  public getBucketName(): string {
    return this.bucketName;
  }

  public getObjectPath(): string {
    return this.objectPath;
  }

  public getPublicUrl(supabase: SupabaseClient<Database>): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(this.objectPath);

    return data.publicUrl;
  }

  public async generateAndUpload(
    supabase: SupabaseClient<Database>,
  ): Promise<string> {
    const pdfBuffer = await generateResume();

    const { error: uploadError } = await supabase.storage
      .from(this.bucketName)
      .upload(this.objectPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    return this.getPublicUrl(supabase);
  }

  public async getOrRegenerate(
    supabase: SupabaseClient<Database>,
    options: { force?: boolean } = {},
  ): Promise<string> {
    if (!options.force) {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list("", {
          search: this.objectPath,
        });

      if (!error && data && data.length > 0) {
        return this.getPublicUrl(supabase);
      }
    }

    return this.generateAndUpload(supabase);
  }
}

export default ResumeService;
