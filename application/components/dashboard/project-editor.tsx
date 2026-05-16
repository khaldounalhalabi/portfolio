"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { FormNotice } from "@/components/dashboard/form-notice";
import {
  fileListToFirstFile,
  getClientErrorMessage,
  useObjectUrl,
} from "@/components/dashboard/form-utils";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { Button } from "@/components/ui/button";
import { deleteProject, saveProject } from "@/lib/dashboard/client-mutations";
import {
  getProjectSchema,
  projectImageAccept,
  type ProjectFormValues,
} from "@/lib/dashboard/schemas";
import type { Project } from "@/lib/portfolio/types";
import { cn } from "@/lib/utils";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/40 transition-colors focus:border-secondary/40 focus:outline-none";
const textAreaClassName = `${inputClassName} min-h-28 resize-y`;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type NoticeState = {
  type: "error" | "success" | "info";
  message: string;
};

function buildProjectDefaults(project?: Project): ProjectFormValues {
  return {
    id: project?.id,
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? "",
    description: project?.description ?? "",
    longDescription: project?.longDescription ?? "",
    role: project?.role ?? "",
    year: project?.year ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    tags: project?.tags.join(", ") ?? "",
    features: project?.features.join("\n") ?? "",
    techStack:
      project?.techStack
        .map((item) => `${item.name}|${item.icon}|${item.detail}`)
        .join("\n") ?? "",
    displayOrder: project?.displayOrder ?? 0,
    featured: project?.featured ?? false,
    existingImagePath: project?.imagePath ?? "",
    removeImage: false,
    imageFile: undefined,
  };
}

function getFieldErrorMessage(message: unknown) {
  return typeof message === "string" ? message : undefined;
}

function hasPersistedProjectId(value: string | undefined) {
  return Boolean(value && UUID_PATTERN.test(value));
}

function RichTextField({
  label,
  name,
  control,
  error,
  placeholder,
}: {
  label: string;
  name: "description" | "longDescription" | "problem" | "solution";
  control: ReturnType<typeof useForm<ProjectFormValues>>["control"];
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-on-surface-variant">
      {label}
      <div className="mt-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          )}
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </label>
  );
}

function ProjectImagePanel({
  title,
  storedImagePath,
  fallbackImageUrl,
  selectedFile,
  removeImage,
  imageError,
}: {
  title: string;
  storedImagePath?: string | null;
  fallbackImageUrl?: string | null;
  selectedFile: File | null;
  removeImage: boolean;
  imageError?: string;
}) {
  const previewUrl = useObjectUrl(selectedFile);
  const previewImageUrl = removeImage ? null : previewUrl ?? fallbackImageUrl;
  const helperText = useMemo(() => {
    if (removeImage) {
      return "The current image will be removed when you save.";
    }

    if (selectedFile) {
      return `Ready to upload: ${selectedFile.name}`;
    }

    return storedImagePath
      ? `Stored path: ${storedImagePath}`
      : "No file uploaded yet.";
  }, [removeImage, selectedFile, storedImagePath]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/6">
        <ProjectMedia imageUrl={previewImageUrl} title={title} />
      </div>
      <p className="text-xs text-on-surface-variant">{helperText}</p>
      {imageError ? <p className="text-xs text-red-300">{imageError}</p> : null}
    </div>
  );
}

async function handleProjectResult(
  result: Awaited<ReturnType<typeof saveProject>>,
  setNotice: (notice: NoticeState | null) => void,
) {
  if (!result.ok) {
    setNotice({ type: "error", message: result.message });
    return false;
  }

  setNotice({ type: "success", message: result.message });
  return true;
}

export function ProjectEditorCard({ project }: { project: Project }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const schema = getProjectSchema(false);
  const canDelete = hasPersistedProjectId(project.id);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: buildProjectDefaults(project),
  });

  const {
    clearErrors,
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form;

  const watchedImageFile = useWatch({ control, name: "imageFile" });
  const removeImage = useWatch({ control, name: "removeImage" });
  const selectedFile = fileListToFirstFile(watchedImageFile);

  useEffect(() => {
    reset(buildProjectDefaults(project));
  }, [project, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    clearErrors();

    try {
      const result = await saveProject(values);
      const didSucceed = await handleProjectResult(result, setNotice);

      if (!didSucceed) {
        return;
      }

      reset({
        ...values,
        removeImage: false,
        imageFile: undefined,
      });
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", message: getClientErrorMessage(error) });
    }
  });

  const onDelete = () => {
    setNotice(null);

    startDeleteTransition(async () => {
      try {
        const result = await deleteProject(project.id);
        if (!result.ok) {
          setNotice({ type: "error", message: result.message });
          return;
        }

        setNotice({ type: "success", message: result.message });
        router.refresh();
      } catch (error) {
        setNotice({ type: "error", message: getClientErrorMessage(error) });
      }
    });
  };

  return (
    <div className="space-y-5 rounded-3xl border border-white/6 bg-surface-container-low p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Public path: `/projects/{project.slug}`
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting || isSubmitting || !canDelete}
          onClick={onDelete}
          className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>

      {notice ? <FormNotice type={notice.type} message={notice.message} /> : null}
      {!canDelete ? (
        <p className="text-xs text-on-surface-variant">
          This item is still fallback content. Save it once before deleting it from the dashboard.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <input type="hidden" {...register("id")} />
        <input type="hidden" {...register("existingImagePath")} />

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm text-on-surface-variant">
            Title
            <input
              className={cn(inputClassName, errors.title && "border-red-400/40")}
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title ? (
              <p className="mt-2 text-xs text-red-300">
                {getFieldErrorMessage(errors.title.message)}
              </p>
            ) : null}
          </label>
          <label className="text-sm text-on-surface-variant">
            Slug
            <input className={inputClassName} {...register("slug")} />
          </label>
          <label className="text-sm text-on-surface-variant">
            Category
            <input
              className={cn(inputClassName, errors.category && "border-red-400/40")}
              aria-invalid={Boolean(errors.category)}
              {...register("category")}
            />
            {errors.category ? (
              <p className="mt-2 text-xs text-red-300">
                {getFieldErrorMessage(errors.category.message)}
              </p>
            ) : null}
          </label>
          <label className="text-sm text-on-surface-variant">
            Role
            <input className={inputClassName} {...register("role")} />
          </label>
          <label className="text-sm text-on-surface-variant">
            Year
            <input className={inputClassName} {...register("year")} />
          </label>
          <label className="text-sm text-on-surface-variant">
            Display Order
            <input
              className={inputClassName}
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/6 bg-surface-container-high px-4 py-3 text-sm text-primary">
            <input type="checkbox" {...register("featured")} />
            Featured project
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <ProjectImagePanel
            title={project.title}
            storedImagePath={project.imagePath}
            fallbackImageUrl={project.imageUrl}
            selectedFile={selectedFile}
            removeImage={Boolean(removeImage)}
            imageError={getFieldErrorMessage(errors.imageFile?.message)}
          />
          <div className="space-y-5">
            <label className="block text-sm text-on-surface-variant">
              Upload Image
              <input
                className={cn(
                  inputClassName,
                  "file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-primary",
                  errors.imageFile && "border-red-400/40",
                )}
                type="file"
                accept={projectImageAccept}
                aria-invalid={Boolean(errors.imageFile)}
                {...register("imageFile")}
              />
            </label>
            <p className="text-xs text-on-surface-variant">
              Supported formats: PNG, JPEG, WebP, GIF, AVIF, SVG.
            </p>
            <label className="flex items-center gap-3 rounded-2xl border border-white/6 bg-surface-container-high px-4 py-3 text-sm text-primary">
              <input type="checkbox" {...register("removeImage")} />
              Remove current image
            </label>
          </div>
        </div>

        <RichTextField
          label="Short Description"
          name="description"
          control={control}
          error={getFieldErrorMessage(errors.description?.message)}
          placeholder="A concise project summary for cards and intros."
        />
        <RichTextField
          label="Long Description"
          name="longDescription"
          control={control}
          error={getFieldErrorMessage(errors.longDescription?.message)}
          placeholder="Expanded case-study introduction."
        />
        <label className="block text-sm text-on-surface-variant">
          Tags
          <input className={inputClassName} {...register("tags")} />
        </label>
        <div className="grid gap-5 lg:grid-cols-2">
          <RichTextField
            label="Problem"
            name="problem"
            control={control}
            error={getFieldErrorMessage(errors.problem?.message)}
            placeholder="Describe the business or technical problem."
          />
          <RichTextField
            label="Solution"
            name="solution"
            control={control}
            error={getFieldErrorMessage(errors.solution?.message)}
            placeholder="Describe the solution approach and decisions."
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block text-sm text-on-surface-variant">
            Features
            <textarea className={textAreaClassName} {...register("features")} />
          </label>
          <label className="block text-sm text-on-surface-variant">
            Tech Stack
            <textarea className={textAreaClassName} {...register("techStack")} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="rounded-full bg-secondary-fixed-dim px-5 py-3 text-sm font-semibold text-on-secondary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {selectedFile ? "Uploading..." : "Saving..."}
              </>
            ) : (
              "Save Project"
            )}
          </Button>
          <span className="text-xs text-on-surface-variant">
            {isSubmitting
              ? "Your changes are being saved to Supabase."
              : isDirty
                ? "Unsaved changes."
                : "Changes saved."}
          </span>
        </div>
      </form>
    </div>
  );
}

export function ProjectCreateForm() {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>({
    type: "info",
    message:
      "New projects are stored in Supabase and appear automatically on the public portfolio after a successful save.",
  });
  const schema = getProjectSchema(true);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: buildProjectDefaults(),
  });

  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form;

  const watchedImageFile = useWatch({ control, name: "imageFile" });
  const selectedFile = fileListToFirstFile(watchedImageFile);

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    clearErrors();

    try {
      const result = await saveProject(values);
      const didSucceed = await handleProjectResult(result, setNotice);

      if (!didSucceed) {
        return;
      }

      reset(buildProjectDefaults());
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", message: getClientErrorMessage(error) });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-3xl border border-dashed border-primary-container/25 bg-surface-container-low p-6"
    >
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-primary">Add Project</h2>
        <p className="text-sm text-on-surface-variant">
          Required fields are validated before upload, and images are sent directly to Supabase Storage.
        </p>
      </div>

      {notice ? <FormNotice type={notice.type} message={notice.message} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm text-on-surface-variant">
          Title
          <input
            className={cn(inputClassName, errors.title && "border-red-400/40")}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          {errors.title ? (
            <p className="mt-2 text-xs text-red-300">
              {getFieldErrorMessage(errors.title.message)}
            </p>
          ) : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Slug
          <input className={inputClassName} {...register("slug")} />
        </label>
        <label className="text-sm text-on-surface-variant">
          Category
          <input
            className={cn(inputClassName, errors.category && "border-red-400/40")}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
          {errors.category ? (
            <p className="mt-2 text-xs text-red-300">
              {getFieldErrorMessage(errors.category.message)}
            </p>
          ) : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Image File
          <input
            className={cn(
              inputClassName,
              "file:mr-4 file:rounded-full file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-primary",
              errors.imageFile && "border-red-400/40",
            )}
            type="file"
            accept={projectImageAccept}
            aria-invalid={Boolean(errors.imageFile)}
            {...register("imageFile")}
          />
          {errors.imageFile ? (
            <p className="mt-2 text-xs text-red-300">
              {getFieldErrorMessage(errors.imageFile.message)}
            </p>
          ) : (
            <p className="mt-2 text-xs text-on-surface-variant">
              {selectedFile
                ? `Ready to upload: ${selectedFile.name}`
                : "Supported formats: PNG, JPEG, WebP, GIF, AVIF, SVG."}
            </p>
          )}
        </label>
      </div>

      <RichTextField
        label="Short Description"
        name="description"
        control={control}
        error={getFieldErrorMessage(errors.description?.message)}
        placeholder="A concise project summary for cards and intros."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {selectedFile ? "Uploading..." : "Creating..."}
            </>
          ) : (
            "Create Project"
          )}
        </Button>
        <span className="text-xs text-on-surface-variant">
          {isSubmitting
            ? "Saving project and uploading media."
            : "The project list refreshes after creation."}
        </span>
      </div>
    </form>
  );
}
