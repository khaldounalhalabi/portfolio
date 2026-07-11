import { config } from "../config.js";
import { generateResume } from "../generators/resume/generateResume.js";

import { SupabaseService } from "./supabase.service.js";

const RESUME_LINK_SETTING_KEY = "resume_link";

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

  public getPublicUrl(objectPath: string): string {
    const { data } = this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .getPublicUrl(objectPath, {
        download: true,
      });

    return data.publicUrl;
  }

  public async generateAndUpload(): Promise<string> {
    const pdfBuffer = await generateResume(this.supabaseService);
    const objectPath = this.buildVersionedObjectPath();

    const { error: uploadError } = await this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .upload(objectPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const publicUrl = this.getPublicUrl(objectPath);

    // Persist the fresh URL first so the portfolio never points at a file we
    // are about to delete, then prune the previous PDFs.
    await this.storeResumeLink(publicUrl);
    await this.deleteOldResumes(objectPath);

    return publicUrl;
  }

  public async getOrRegenerate(
    options: { force?: boolean } = {},
  ): Promise<string> {
    if (!options.force) {
      const existingUrl = await this.readResumeLink();

      if (existingUrl) {
        return existingUrl;
      }
    }

    return this.generateAndUpload();
  }

  /**
   * Derives a unique, timestamped object path from the configured base path,
   * e.g. `khaldoun-alhalabi-resume.pdf` -> `khaldoun-alhalabi-resume-1720000000000.pdf`.
   * A changing path means a new CDN cache key on every regeneration.
   */
  private buildVersionedObjectPath(): string {
    const basePath = config.resumeObjectPath;
    const extIndex = basePath.lastIndexOf(".");
    const version = Date.now();

    if (extIndex === -1) {
      return `${basePath}-${version}`;
    }

    const name = basePath.slice(0, extIndex);
    const ext = basePath.slice(extIndex);

    return `${name}-${version}${ext}`;
  }

  private getObjectPathPrefix(): string {
    const basePath = config.resumeObjectPath;
    const extIndex = basePath.lastIndexOf(".");

    return extIndex === -1 ? basePath : basePath.slice(0, extIndex);
  }

  /** Removes every resume PDF in the bucket except the freshly uploaded one. */
  private async deleteOldResumes(currentObjectPath: string): Promise<void> {
    const prefix = this.getObjectPathPrefix();

    const { data, error } = await this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .list("");

    if (error || !data) {
      return;
    }

    const stalePaths = data
      .map((object) => object.name)
      .filter((name) => name.startsWith(prefix) && name !== currentObjectPath);

    if (stalePaths.length === 0) {
      return;
    }

    await this.supabaseService.client.storage
      .from(config.resumeBucketName)
      .remove(stalePaths);
  }

  private async readResumeLink(): Promise<string | null> {
    const { data, error } = await this.supabaseService.client
      .from("site_settings")
      .select("value")
      .eq("key", RESUME_LINK_SETTING_KEY)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return typeof data.value === "string" && data.value.length > 0
      ? data.value
      : null;
  }

  private async storeResumeLink(publicUrl: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from("site_settings")
      .upsert(
        {
          key: RESUME_LINK_SETTING_KEY,
          value: publicUrl,
          structure: { type: "string" },
        },
        { onConflict: "key" },
      );

    if (error) {
      throw error;
    }
  }
}
