"use client";

import Form from "@/components/forms/form";
import FormDatepicker from "@/components/forms/form-datepicker";
import FormInput from "@/components/forms/form-input";
import FormTiptap from "@/components/forms/form-tiptap";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Experience from "@/models/Experience";
import ExperienceService from "@/services/ExperienceService";
import { format } from "date-fns";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const experienceSchema = z
  .object({
    company_name: z.string().trim().min(1, "Company name is required"),
    company_website: z
      .string()
      .trim()
      .url("Company website must be a valid URL")
      .optional()
      .or(z.literal("")),
    from: z.date({ error: "From date is required" }),
    to: z.date({ error: "To date must be valid" }).optional().nullable(),
    job_description: z.string().trim().min(1, "Job description is required"),
    company_description: z.string().trim().optional().nullable(),
    location: z.string().min(3),
    position: z.string().min(3),
  })
  .refine((data) => !data.to || data.to >= data.from, {
    message: "To date must be after from date",
    path: ["to"],
  });

type ExperienceFormData = z.output<typeof experienceSchema>;

const ExperienceSheet = ({ experience }: { experience?: Experience }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = Boolean(experience);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEditing ? (
          <Button variant="secondary" size="icon">
            <PencilIcon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Create Experience
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing
              ? `Edit: ${experience?.company_name}`
              : "Create Experience"}
          </SheetTitle>
        </SheetHeader>
        <div className="m-3 flex flex-col gap-6 overflow-y-auto">
          <Form
            validation={experienceSchema}
            defaultValues={getDefaultValues(experience)}
            onSubmit={async (data) => {
              const payload = toPayload(data);

              if (experience) {
                await ExperienceService.make().update(experience.id, payload);
                return;
              }

              await ExperienceService.make().store(payload);
            }}
            onSuccess={() => {
              toast.success(
                isEditing ? "Experience updated" : "Experience created",
              );
              setOpen(false);
              router.refresh();
            }}
            withBackButton={false}
            revalidateOnSuccess
          >
            <ExperienceFields />
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ExperienceFields = () => {
  return (
    <FieldGroup>
      <FormInput name="company_name" label="Company Name" />
      <FormInput name="location" label="Location" />
      <FormInput name="position" label="Position" />
      <FormInput
        name="company_website"
        label="Company Website"
        placeholder="https://example.com"
        optional
        type={"url"}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormDatepicker name="from" label="From" captionLayout="dropdown" />
        <FormDatepicker
          name="to"
          label="To"
          placeholder="Present"
          captionLayout="dropdown"
        />
      </div>
      <FormTiptap
        name="job_description"
        label="Job Description"
        minHeight="260px"
      />
      <FormTiptap
        name="company_description"
        label="Company Description"
        minHeight="220px"
      />
    </FieldGroup>
  );
};

function getDefaultValues(experience?: Experience) {
  return {
    company_name: experience?.company_name ?? "",
    company_website: experience?.company_website ?? "",
    from: experience?.from ? new Date(experience.from) : undefined,
    to: experience?.to ? new Date(experience.to) : null,
    job_description: experience?.job_description ?? "",
    company_description: experience?.company_description ?? "",
    location: experience?.location ?? "",
    position: experience?.position ?? "",
  };
}

function toPayload(data: ExperienceFormData) {
  return {
    company_name: data.company_name,
    company_website: data.company_website || null,
    from: toDateString(data.from),
    to: data.to ? toDateString(data.to) : null,
    job_description: data.job_description,
    company_description: data.company_description || null,
    location: data?.location ?? null,
    position: data?.position ?? null,
  };
}

function toDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export default ExperienceSheet;
