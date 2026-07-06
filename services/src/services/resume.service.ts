import { config } from "../config.js";
import { generateResume } from "../generators/resume/generateResume.js";

import { SupabaseService } from "./supabase.service.js";

export class ResumeService {
  private static instance?: ResumeService;

  private readonly supabaseService: SupabaseService;

  private constructor() {
    this.supabaseService = SupabaseService.make();
  }

  public static make(): ResumeService {
    if (!ResumeService.instance) {
      ResumeService.instance = new ResumeService();
    }

    return ResumeService.instance;
  }

  public getPublicUrl(): string {
    const { data } = this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .getPublicUrl(config.resumeObjectPath);

    return data.publicUrl;
  }

  public async generateAndUpload(): Promise<string> {
    const pdfBuffer = await generateResume(this.supabaseService);

    const { error: uploadError } = await this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .upload(config.resumeObjectPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    return this.getPublicUrl();
  }

  public async getOrRegenerate(
    options: { force?: boolean } = {},
  ): Promise<string> {
    if (!options.force) {
      const { data, error } = await this.supabaseService.client.storage
        .from(config.resumeBucketName)
        .list("", {
          search: config.resumeObjectPath,
        });

      if (!error && data && data.length > 0) {
        return this.getPublicUrl();
      }
    }

    return this.generateAndUpload();
  }
}
