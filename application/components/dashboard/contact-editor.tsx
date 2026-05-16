"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormNotice } from "@/components/dashboard/form-notice";
import { Button } from "@/components/ui/button";
import {
  deleteContactLink,
  saveContactInfo,
  saveContactLink,
} from "@/lib/dashboard/client-mutations";
import { getClientErrorMessage } from "@/components/dashboard/form-utils";
import {
  contactInfoSchema,
  contactLinkSchema,
  type ContactInfoFormValues,
  type ContactLinkFormValues,
} from "@/lib/dashboard/schemas";
import type { ContactInfo, ContactLink } from "@/lib/portfolio/types";
import { cn } from "@/lib/utils";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-surface-container-high px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/40 transition-colors focus:border-secondary/40 focus:outline-none";
const textAreaClassName = `${inputClassName} min-h-28 resize-y`;

type NoticeState = {
  type: "error" | "success" | "info";
  message: string;
};

export function ContactInfoEditor({ contactInfo }: { contactInfo: ContactInfo }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: contactInfo.location,
      intro: contactInfo.intro,
      availability: contactInfo.availability,
      resumeLabel: contactInfo.resumeLabel ?? "",
      resumeUrl: contactInfo.resumeUrl ?? "",
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
      const result = await saveContactInfo(values);
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

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-3xl border border-white/6 bg-surface-container-low p-6"
    >
      <h2 className="font-heading text-2xl font-bold text-primary">
        Primary Contact Info
      </h2>
      {notice ? <FormNotice type={notice.type} message={notice.message} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm text-on-surface-variant">
          Email
          <input
            className={cn(inputClassName, errors.email && "border-red-400/40")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? <p className="mt-2 text-xs text-red-300">{errors.email.message}</p> : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Phone
          <input
            className={cn(inputClassName, errors.phone && "border-red-400/40")}
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone ? <p className="mt-2 text-xs text-red-300">{errors.phone.message}</p> : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Location
          <input
            className={cn(inputClassName, errors.location && "border-red-400/40")}
            aria-invalid={Boolean(errors.location)}
            {...register("location")}
          />
          {errors.location ? <p className="mt-2 text-xs text-red-300">{errors.location.message}</p> : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Availability
          <input
            className={cn(inputClassName, errors.availability && "border-red-400/40")}
            aria-invalid={Boolean(errors.availability)}
            {...register("availability")}
          />
          {errors.availability ? <p className="mt-2 text-xs text-red-300">{errors.availability.message}</p> : null}
        </label>
        <label className="text-sm text-on-surface-variant">
          Resume Label
          <input className={inputClassName} {...register("resumeLabel")} />
        </label>
        <label className="text-sm text-on-surface-variant">
          Resume URL
          <input
            className={cn(inputClassName, errors.resumeUrl && "border-red-400/40")}
            aria-invalid={Boolean(errors.resumeUrl)}
            {...register("resumeUrl")}
          />
          {errors.resumeUrl ? <p className="mt-2 text-xs text-red-300">{errors.resumeUrl.message}</p> : null}
        </label>
      </div>
      <label className="block text-sm text-on-surface-variant">
        Intro Copy
        <textarea
          className={cn(textAreaClassName, errors.intro && "border-red-400/40")}
          aria-invalid={Boolean(errors.intro)}
          {...register("intro")}
        />
        {errors.intro ? <p className="mt-2 text-xs text-red-300">{errors.intro.message}</p> : null}
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
              "Save Contact Info"
            )}
        </Button>
        <span className="text-xs text-on-surface-variant">
          {isSubmitting
            ? "Saving contact info."
            : isDirty
              ? "Unsaved changes."
              : "Changes saved."}
        </span>
      </div>
    </form>
  );
}

export function ContactLinkEditorCard({ link }: { link: ContactLink }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const form = useForm<ContactLinkFormValues>({
    resolver: zodResolver(contactLinkSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      id: link.id,
      label: link.label,
      url: link.url,
      icon: link.icon,
      displayOrder: link.displayOrder,
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
      const result = await saveContactLink(values);
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
        const result = await deleteContactLink(link.id);

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
        <h2 className="font-heading text-2xl font-bold text-primary">{link.label}</h2>
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
            Label
            <input
              className={cn(inputClassName, errors.label && "border-red-400/40")}
              aria-invalid={Boolean(errors.label)}
              {...register("label")}
            />
            {errors.label ? <p className="mt-2 text-xs text-red-300">{errors.label.message}</p> : null}
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
          <label className="text-sm text-on-surface-variant md:col-span-2">
            URL
            <input
              className={cn(inputClassName, errors.url && "border-red-400/40")}
              aria-invalid={Boolean(errors.url)}
              {...register("url")}
            />
            {errors.url ? <p className="mt-2 text-xs text-red-300">{errors.url.message}</p> : null}
          </label>
          <label className="text-sm text-on-surface-variant">
            Display Order
            <input className={inputClassName} type="number" {...register("displayOrder", { valueAsNumber: true })} />
          </label>
        </div>
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
              "Save Link"
            )}
          </Button>
          <span className="text-xs text-on-surface-variant">
            {isSubmitting
              ? "Saving contact link."
              : isDirty
                ? "Unsaved changes."
                : "Changes saved."}
          </span>
        </div>
      </form>
    </div>
  );
}

export function ContactLinkCreateForm() {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeState | null>({
    type: "info",
    message: "These links feed the contact page and public footer.",
  });
  const form = useForm<ContactLinkFormValues>({
    resolver: zodResolver(contactLinkSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      label: "",
      url: "",
      icon: "link",
      displayOrder: 0,
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
      const result = await saveContactLink(values);
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
      <h2 className="font-heading text-2xl font-bold text-primary">Add Contact Link</h2>
      {notice ? <FormNotice type={notice.type} message={notice.message} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm text-on-surface-variant">
          Label
          <input
            className={cn(inputClassName, errors.label && "border-red-400/40")}
            aria-invalid={Boolean(errors.label)}
            {...register("label")}
          />
          {errors.label ? <p className="mt-2 text-xs text-red-300">{errors.label.message}</p> : null}
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
        <label className="text-sm text-on-surface-variant md:col-span-2">
          URL
          <input
            className={cn(inputClassName, errors.url && "border-red-400/40")}
            aria-invalid={Boolean(errors.url)}
            {...register("url")}
          />
          {errors.url ? <p className="mt-2 text-xs text-red-300">{errors.url.message}</p> : null}
        </label>
      </div>
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
              "Create Contact Link"
            )}
        </Button>
        <span className="text-xs text-on-surface-variant">
          {isSubmitting
            ? "Creating contact link."
            : "New links appear after the list refreshes."}
        </span>
      </div>
    </form>
  );
}
