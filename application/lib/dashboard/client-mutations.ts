import type {
  TablesInsert,
} from "@/integrations/supabase/database.types";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import {
  parseTechStack,
  slugify,
  splitCommaList,
  splitLines,
} from "@/lib/portfolio/forms";
import {
  projectImageAccept,
  supportedProjectImageTypes,
  type ContactInfoFormValues,
  type ContactLinkFormValues,
  type ProjectFormValues,
  type SkillGroupFormValues,
} from "@/lib/dashboard/schemas";
import {
  fileListToFirstFile,
  type DashboardActionResult,
} from "@/components/dashboard/form-utils";

const PROJECT_IMAGES_BUCKET = "portfolio-images";
const ALLOWED_PROJECT_IMAGE_TYPES = new Set<string>(supportedProjectImageTypes);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function actionSuccess(message: string): DashboardActionResult {
  return { ok: true, message };
}

function actionFailure(message: string): DashboardActionResult {
  return { ok: false, message };
}

function getFileExtension(file: File) {
  const fileNameExtension = file.name.split(".").pop()?.toLowerCase();
  if (fileNameExtension) {
    return fileNameExtension;
  }

  return file.type.split("/")[1]?.toLowerCase() || "bin";
}

function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("mime type image/svg+xml is not supported")) {
      return "Your Supabase storage bucket still rejects SVG uploads. Apply the latest storage migration or use PNG, JPEG, WebP, GIF, or AVIF.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function isUuid(value: string | null | undefined) {
  return Boolean(value && UUID_PATTERN.test(value.trim()));
}

async function ensureAuthenticatedClient() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Your session has expired. Sign in again to continue.");
  }

  return supabase;
}

async function uploadProjectImage(file: File, slug: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Upload an image file.");
  }

  if (!ALLOWED_PROJECT_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `Unsupported image type. Use one of: ${projectImageAccept}.`,
    );
  }

  const supabase = await ensureAuthenticatedClient();
  const filePath = `projects/${slug}-${crypto.randomUUID()}.${getFileExtension(file)}`;
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

async function removeProjectImage(imagePath: string | null | undefined) {
  if (!imagePath) {
    return;
  }

  const supabase = await ensureAuthenticatedClient();
  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove([imagePath]);

  if (error) {
    throw error;
  }
}

export async function saveProject(
  values: ProjectFormValues,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const persistedId = isUuid(values.id) ? values.id!.trim() : null;
    const id = persistedId || crypto.randomUUID();
    const title = values.title.trim();
    const slug = values.slug?.trim() || slugify(title) || id;
    const currentImagePath = values.existingImagePath?.trim() || null;
    const imageFile = fileListToFirstFile(values.imageFile);
    let imagePath = currentImagePath;

    if (imageFile) {
      imagePath = await uploadProjectImage(imageFile, slug);
      if (currentImagePath && currentImagePath !== imagePath) {
        await removeProjectImage(currentImagePath);
      }
    } else if (values.removeImage) {
      await removeProjectImage(currentImagePath);
      imagePath = null;
    }

    const payload: TablesInsert<"projects"> = {
      ...(persistedId ? { id } : {}),
      slug,
      title,
      category: values.category.trim(),
      description: values.description.trim(),
      long_description: values.longDescription?.trim() || null,
      image_path: imagePath,
      tags: splitCommaList(values.tags ?? null),
      role: values.role?.trim() || null,
      year: values.year?.trim() || null,
      problem: values.problem?.trim() || null,
      solution: values.solution?.trim() || null,
      features: splitLines(values.features ?? null),
      tech_stack: parseTechStack(values.techStack ?? null),
      featured: Boolean(values.featured),
      display_order: Number(values.displayOrder ?? 0) || 0,
    };

    const query = persistedId
      ? supabase.from("projects").update(payload).eq("id", persistedId)
      : supabase.from("projects").insert(payload);

    const { error } = await query;
    if (error) {
      throw error;
    }

    return actionSuccess(persistedId ? "Project saved." : "Project created.");
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function deleteProject(
  id: string,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
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

    await removeProjectImage(project?.image_path);
    return actionSuccess("Project deleted.");
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function saveSkillGroup(
  values: SkillGroupFormValues,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const payload: TablesInsert<"skill_groups"> = {
      id: values.id?.trim() || slugify(values.title) || crypto.randomUUID(),
      title: values.title.trim(),
      icon: values.icon.trim(),
      skills: splitLines(values.skills),
      description: values.description?.trim() || null,
      display_order: Number(values.displayOrder ?? 0) || 0,
      is_highlight: Boolean(values.isHighlight),
    };

    const { error } = await supabase.from("skill_groups").upsert(payload);
    if (error) {
      throw error;
    }

    return actionSuccess(
      values.id ? "Skill group saved." : "Skill group created.",
    );
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function deleteSkillGroup(
  id: string,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const { error } = await supabase.from("skill_groups").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return actionSuccess("Skill group deleted.");
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function saveContactInfo(
  values: ContactInfoFormValues,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const payload: TablesInsert<"contact_info"> = {
      id: "primary",
      email: values.email.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      intro: values.intro.trim(),
      availability: values.availability.trim(),
      resume_label: values.resumeLabel?.trim() || null,
      resume_url: values.resumeUrl?.trim() || null,
    };

    const { error } = await supabase.from("contact_info").upsert(payload);
    if (error) {
      throw error;
    }

    return actionSuccess("Contact info saved.");
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function saveContactLink(
  values: ContactLinkFormValues,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const payload: TablesInsert<"contact_links"> = {
      id: values.id?.trim() || slugify(values.label) || crypto.randomUUID(),
      label: values.label.trim(),
      url: values.url.trim(),
      icon: values.icon.trim(),
      display_order: Number(values.displayOrder ?? 0) || 0,
    };

    const { error } = await supabase.from("contact_links").upsert(payload);
    if (error) {
      throw error;
    }

    return actionSuccess(
      values.id ? "Contact link saved." : "Contact link created.",
    );
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}

export async function deleteContactLink(
  id: string,
): Promise<DashboardActionResult> {
  try {
    const supabase = await ensureAuthenticatedClient();
    const { error } = await supabase.from("contact_links").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return actionSuccess("Contact link deleted.");
  } catch (error) {
    return actionFailure(getSupabaseErrorMessage(error));
  }
}
