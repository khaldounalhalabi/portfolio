"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormNotice } from "@/components/dashboard/form-notice";
import { Button } from "@/components/ui/button";
import {
  deleteSkillGroup,
  saveSkillGroup,
} from "@/lib/dashboard/client-mutations";
import { getClientErrorMessage } from "@/components/dashboard/form-utils";
import {
  skillGroupSchema,
  type SkillGroupFormValues,
} from "@/lib/dashboard/schemas";
import type { SkillGroup } from "@/lib/portfolio/types";
import { cn } from "@/lib/utils";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/40 transition-colors focus:border-secondary/40 focus:outline-none";
const textAreaClassName = `${inputClassName} min-h-28 resize-y`;

type NoticeState = {
  type: "error" | "success" | "info";
  message: string;
};

export function SkillEditorCard({ group }: { group: SkillGroup }) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const form = useForm<SkillGroupFormValues>({
    resolver: zodResolver(skillGroupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      id: group.id,
      title: group.title,
      icon: group.icon,
      skills: group.skills.join("\n"),
      description: group.description ?? "",
      displayOrder: group.displayOrder,
      isHighlight: group.isHighlight ?? false,
    },
  });

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    clearErrors();

    try {
      const result = await saveSkillGroup(values);
      if (!result.ok) {
        setNotice({ type: "error", message: result.message });
        return;
      }

      setNotice({ type: "success", message: result.message });
      reset(values);
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", message: getClientErrorMessage(error) });
    }
  });

  const onDelete = () => {
    startDeleteTransition(async () => {
      try {
        setNotice(null);
        const result = await deleteSkillGroup(group.id);

        if (!result.ok) {
          setNotice({ type: "error", message: result.message });
          return;
        }

        setNotice({ type: "success", message: result.message });
        reset();
        router.refresh();
      } catch (error) {
        setNotice({ type: "error", message: getClientErrorMessage(error) });
      }
    });
  };

  return (
    <div className="space-y-5 rounded-3xl border border-white/6 bg-surface-container-low p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h2 className="font-heading text-2xl font-bold text-primary">{group.title}</h2>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
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

      <form onSubmit={onSubmit} className="space-y-5">
        <input type="hidden" {...register("id")} />
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm text-on-surface-variant">
            Title
            <input
              className={cn(inputClassName, errors.title && "border-red-400/40")}
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title ? <p className="mt-2 text-xs text-red-300">{errors.title.message}</p> : null}
          </label>
          <label className="text-sm text-on-surface-variant">
            Icon
            <input
              className={cn(inputClassName, errors.icon && "border-red-400/40")}
              aria-invalid={Boolean(errors.icon)}
              {...register("icon")}
            />
            {errors.icon ? <p className="mt-2 text-xs text-red-300">{errors.icon.message}</p> : null}
          </label>
          <label className="text-sm text-on-surface-variant">
            Display Order
            <input className={inputClassName} type="number" {...register("displayOrder", { valueAsNumber: true })} />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/6 bg-surface-container-high px-4 py-3 text-sm text-primary">
            <input type="checkbox" {...register("isHighlight")} />
            Highlight on public pages
          </label>
        </div>
        <label className="block text-sm text-on-surface-variant">
          Description
          <textarea className={textAreaClassName} {...register("description")} />
        </label>
        <label className="block text-sm text-on-surface-variant">
          Skills
          <textarea
            className={cn(textAreaClassName, errors.skills && "border-red-400/40")}
            aria-invalid={Boolean(errors.skills)}
            {...register("skills")}
          />
          {errors.skills ? <p className="mt-2 text-xs text-red-300">{errors.skills.message}</p> : null}
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-secondary-fixed-dim px-5 py-3 text-sm font-semibold text-on-secondary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Skill Group"
            )}
          </Button>
          <span className="text-xs text-on-surface-variant">
            {isSubmitting
              ? "Saving skill group."
              : isDirty
                ? "Unsaved changes."
                : "Changes saved."}
          </span>
        </div>
      </form>
    </div>
  );
}

export function SkillCreateForm() {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>({
    type: "info",
    message: "Skill groups update the home and experience pages after a successful save.",
  });
  const form = useForm<SkillGroupFormValues>({
    resolver: zodResolver(skillGroupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      icon: "terminal",
      skills: "",
      description: "",
      displayOrder: 0,
      isHighlight: false,
    },
  });

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setNotice(null);
    clearErrors();

    try {
      const result = await saveSkillGroup(values);
      if (!result.ok) {
        setNotice({ type: "error", message: result.message });
        return;
      }

      setNotice({ type: "success", message: result.message });
      reset();
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
      <h2 className="font-heading text-2xl font-bold text-primary">Add Skill Group</h2>
      {notice ? <FormNotice type={notice.type} message={notice.message} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm text-on-surface-variant">
          Title
          <input
            className={cn(inputClassName, errors.title && "border-red-400/40")}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          {errors.title ? <p className="mt-2 text-xs text-red-300">{errors.title.message}</p> : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Icon
          <input
            className={cn(inputClassName, errors.icon && "border-red-400/40")}
            aria-invalid={Boolean(errors.icon)}
            {...register("icon")}
          />
          {errors.icon ? <p className="mt-2 text-xs text-red-300">{errors.icon.message}</p> : null}
        </label>
      </div>
      <label className="block text-sm text-on-surface-variant">
        Skills
        <textarea
          className={cn(textAreaClassName, errors.skills && "border-red-400/40")}
          aria-invalid={Boolean(errors.skills)}
          {...register("skills")}
        />
        {errors.skills ? <p className="mt-2 text-xs text-red-300">{errors.skills.message}</p> : null}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
            ) : (
              "Create Skill Group"
            )}
        </Button>
        <span className="text-xs text-on-surface-variant">
          {isSubmitting
            ? "Creating skill group."
            : "New groups appear after the list refreshes."}
        </span>
      </div>
    </form>
  );
}
