"use server";

import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/integrations/supabase/server";
import { supportedProjectImageTypes } from "@/lib/dashboard/schemas";
import { requireAuthenticatedUserForWrite } from "@/lib/auth/session";
import {
  parseTechStack,
  slugify,
  splitCommaList,
  splitLines,
} from "@/lib/portfolio/forms";

const PROJECT_IMAGES_BUCKET = "portfolio-images";
const ALLOWED_PROJECT_IMAGE_TYPES = new Set<string>(supportedProjectImageTypes);

type ActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

const projectActionSchema = z
  .object({
    id: z.string().trim().optional(),
    title: z.string().trim().min(1, "Title is required"),
    slug: z.string().trim().optional(),
    category: z.string().trim().min(1, "Category is required"),
    description: z.string().trim().min(1, "Description is required"),
    longDescription: z.string().trim().optional(),
    role: z.string().trim().optional(),
    year: z.string().trim().optional(),
    problem: z.string().trim().optional(),
    solution: z.string().trim().optional(),
    tags: z.string().trim().optional(),
    features: z.string().trim().optional(),
    techStack: z.string().trim().optional(),
    displayOrder: z.number().int().min(0),
    featured: z.boolean().default(false),
    existingImagePath: z.string().trim().optional(),
    removeImage: z.boolean().default(false),
    imageFile: z.instanceof(File).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    const hasExistingImage = Boolean(value.existingImagePath);
    const hasUploadedImage = Boolean(value.imageFile && value.imageFile.size > 0);

    if (!hasExistingImage && !hasUploadedImage && !value.removeImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageFile"],
        message: "Project image is required.",
      });
    }

    if (value.imageFile?.size && !value.imageFile.type.startsWith("image/")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageFile"],
        message: "Upload an image file.",
      });
    }

    if (
      value.imageFile?.size &&
      !ALLOWED_PROJECT_IMAGE_TYPES.has(value.imageFile.type)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageFile"],
        message: "Use PNG, JPEG, WebP, GIF, AVIF, or SVG.",
      });
    }
  });

const skillGroupActionSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  skills: z.string().trim().min(1, "Add at least one skill"),
  description: z.string().trim().optional(),
  displayOrder: z.number().int().min(0),
  isHighlight: z.boolean().default(false),
});

const contactInfoActionSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  location: z.string().trim().min(1, "Location is required"),
  intro: z.string().trim().min(1, "Intro copy is required"),
  availability: z.string().trim().min(1, "Availability is required"),
  resumeLabel: z.string().trim().optional(),
  resumeUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: "Enter a valid resume URL",
    }),
});

const contactLinkActionSchema = z.object({
  id: z.string().trim().optional(),
  label: z.string().trim().min(1, "Label is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .refine((value) => z.url().safeParse(value).success, {
      message: "Enter a valid URL",
    }),
  icon: z.string().trim().min(1, "Icon is required"),
  displayOrder: z.number().int().min(0),
});

function revalidatePortfolio() {
  [
    "/",
    "/projects",
    "/experience",
    "/contact",
    "/dashboard",
    "/dashboard/projects",
    "/dashboard/skills",
    "/dashboard/contact",
  ].forEach((path) => revalidatePath(path));
}

function getAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  return createSupabaseAdminClient();
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getImageFile(formData: FormData) {
  const value = formData.get("imageFile");
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getFileExtension(file: File) {
  const fileNameExtension = extname(file.name).replace(".", "").toLowerCase();
  if (fileNameExtension) {
    return fileNameExtension;
  }

  const mimeExtension = file.type.split("/")[1]?.toLowerCase();
  return mimeExtension || "bin";
}

function actionSuccess(message: string): ActionResult {
  return { ok: true, message };
}

function actionFailure(
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionResult {
  return { ok: false, message, fieldErrors };
}

function actionValidationError(error: z.ZodError): ActionResult {
  return actionFailure("Please correct the highlighted fields.", error.flatten().fieldErrors);
}

function getActionErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return "Please correct the highlighted fields.";
  }

  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return "Your session has expired. Sign in again to continue.";
    }

    if (error.message.includes("mime type image/svg+xml is not supported")) {
      return "Your Supabase storage bucket still rejects SVG uploads. Apply the latest storage migration or use PNG, JPEG, WebP, GIF, or AVIF.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

async function getAuthorizedAdminClient(): Promise<SupabaseClient> {
  await requireAuthenticatedUserForWrite();

  const supabase = getAdminClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not fully configured yet. Add the project URL, publishable key, and service role key first.",
    );
  }

  return supabase;
}

async function uploadProjectImage({
  supabase,
  file,
  slug,
}: {
  supabase: NonNullable<ReturnType<typeof getAdminClient>>;
  file: File;
  slug: string;
}) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Project image must be an image file.");
  }

  if (!ALLOWED_PROJECT_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "Unsupported image type. Use PNG, JPEG, WebP, GIF, AVIF, or SVG.",
    );
  }

  const extension = getFileExtension(file);
  const filePath = `projects/${slug}-${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (error) {
    throw error;
  }

  return filePath;
}

async function removeProjectImage({
  supabase,
  imagePath,
}: {
  supabase: NonNullable<ReturnType<typeof getAdminClient>>;
  imagePath: string | null;
}) {
  if (!imagePath) {
    return;
  }

  await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([imagePath]);
}

export async function saveProjectAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const parsed = projectActionSchema.safeParse({
      id: getString(formData, "id") || undefined,
      title: getString(formData, "title"),
      slug: getString(formData, "slug") || undefined,
      category: getString(formData, "category"),
      description: getString(formData, "description"),
      longDescription: getString(formData, "longDescription") || undefined,
      role: getString(formData, "role") || undefined,
      year: getString(formData, "year") || undefined,
      problem: getString(formData, "problem") || undefined,
      solution: getString(formData, "solution") || undefined,
      tags: getString(formData, "tags") || undefined,
      features: getString(formData, "features") || undefined,
      techStack: getString(formData, "techStack") || undefined,
      displayOrder: getNumber(formData, "displayOrder"),
      featured: getBoolean(formData, "featured"),
      existingImagePath: getString(formData, "existingImagePath") || undefined,
      removeImage: getBoolean(formData, "removeImage"),
      imageFile: getImageFile(formData),
    });

    if (!parsed.success) {
      return actionValidationError(parsed.error);
    }

    const isUpdating = Boolean(parsed.data.id);
    const id = parsed.data.id || randomUUID();
    const slug = parsed.data.slug || slugify(parsed.data.title) || id;
    const currentImagePath = parsed.data.existingImagePath || null;

    let imagePath = currentImagePath;

    if (parsed.data.imageFile) {
      imagePath = await uploadProjectImage({
        supabase,
        file: parsed.data.imageFile,
        slug,
      });
      await removeProjectImage({ supabase, imagePath: currentImagePath });
    } else if (parsed.data.removeImage) {
      await removeProjectImage({ supabase, imagePath: currentImagePath });
      imagePath = null;
    }

    const { error } = await supabase.from("projects").upsert({
      id,
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      long_description: parsed.data.longDescription || null,
      image_path: imagePath,
      tags: splitCommaList(parsed.data.tags ?? null),
      category: parsed.data.category,
      role: parsed.data.role || null,
      year: parsed.data.year || null,
      problem: parsed.data.problem || null,
      solution: parsed.data.solution || null,
      features: splitLines(parsed.data.features ?? null),
      tech_stack: parseTechStack(parsed.data.techStack ?? null),
      featured: parsed.data.featured,
      display_order: parsed.data.displayOrder,
    });

    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess(isUpdating ? "Project saved." : "Project created.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function deleteProjectAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const id = getString(formData, "id");
    if (!id) {
      return actionFailure("Project id is missing.");
    }

    const { data: project, error: selectError } = await supabase
      .from("projects")
      .select("image_path")
      .eq("id", id)
      .single();

    if (selectError) {
      throw selectError;
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      throw error;
    }

    await removeProjectImage({ supabase, imagePath: project?.image_path ?? null });
    revalidatePortfolio();
    return actionSuccess("Project deleted.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function saveSkillGroupAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const parsed = skillGroupActionSchema.safeParse({
      id: getString(formData, "id") || undefined,
      title: getString(formData, "title"),
      icon: getString(formData, "icon"),
      skills: getString(formData, "skills"),
      description: getString(formData, "description") || undefined,
      displayOrder: getNumber(formData, "displayOrder"),
      isHighlight: getBoolean(formData, "isHighlight"),
    });

    if (!parsed.success) {
      return actionValidationError(parsed.error);
    }

    const isUpdating = Boolean(parsed.data.id);
    const id = parsed.data.id || slugify(parsed.data.title) || randomUUID();

    const { error } = await supabase.from("skill_groups").upsert({
      id,
      title: parsed.data.title,
      icon: parsed.data.icon || "terminal",
      skills: splitLines(parsed.data.skills),
      description: parsed.data.description || null,
      is_highlight: parsed.data.isHighlight,
      display_order: parsed.data.displayOrder,
    });

    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess(isUpdating ? "Skill group saved." : "Skill group created.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function deleteSkillGroupAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const id = getString(formData, "id");
    if (!id) {
      return actionFailure("Skill group id is missing.");
    }

    const { error } = await supabase.from("skill_groups").delete().eq("id", id);
    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess("Skill group deleted.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function saveContactInfoAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const parsed = contactInfoActionSchema.safeParse({
      email: getString(formData, "email"),
      phone: getString(formData, "phone"),
      location: getString(formData, "location"),
      intro: getString(formData, "intro"),
      availability: getString(formData, "availability"),
      resumeLabel: getString(formData, "resumeLabel") || undefined,
      resumeUrl: getString(formData, "resumeUrl") || undefined,
    });

    if (!parsed.success) {
      return actionValidationError(parsed.error);
    }

    const { error } = await supabase.from("contact_info").upsert({
      id: "primary",
      email: parsed.data.email,
      phone: parsed.data.phone,
      location: parsed.data.location,
      intro: parsed.data.intro,
      availability: parsed.data.availability,
      resume_label: parsed.data.resumeLabel || null,
      resume_url: parsed.data.resumeUrl || null,
    });

    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess("Contact info saved.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function saveContactLinkAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const parsed = contactLinkActionSchema.safeParse({
      id: getString(formData, "id") || undefined,
      label: getString(formData, "label"),
      url: getString(formData, "url"),
      icon: getString(formData, "icon"),
      displayOrder: getNumber(formData, "displayOrder"),
    });

    if (!parsed.success) {
      return actionValidationError(parsed.error);
    }

    const isUpdating = Boolean(parsed.data.id);
    const id = parsed.data.id || slugify(parsed.data.label) || randomUUID();

    const { error } = await supabase.from("contact_links").upsert({
      id,
      label: parsed.data.label,
      url: parsed.data.url,
      icon: parsed.data.icon || "link",
      display_order: parsed.data.displayOrder,
    });

    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess(isUpdating ? "Contact link saved." : "Contact link created.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}

export async function deleteContactLinkAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthorizedAdminClient();

    const id = getString(formData, "id");
    if (!id) {
      return actionFailure("Contact link id is missing.");
    }

    const { error } = await supabase.from("contact_links").delete().eq("id", id);
    if (error) {
      throw error;
    }

    revalidatePortfolio();
    return actionSuccess("Contact link deleted.");
  } catch (error) {
    return actionFailure(getActionErrorMessage(error));
  }
}
