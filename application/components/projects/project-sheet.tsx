"use client";

import { fetchProjectImageAction } from "@/app/(dashboard)/dashboard/projects/actions";
import Form from "@/components/forms/form";
import FormCheckbox from "@/components/forms/form-checkbox";
import FormInput from "@/components/forms/form-input";
import FormTagsInput from "@/components/forms/form-tags-input";
import FormTextarea from "@/components/forms/form-textarea";
import FormTiptap from "@/components/forms/form-tiptap";
import FeaturesInput from "@/components/projects/features-input";
import TechStackInput from "@/components/projects/tech-stack-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Project from "@/models/Project";
import ProjectService from "@/services/ProjectService";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const techStackItemSchema = z.object({
  name: z.string().trim().min(1, "Tech name is required"),
  icon: z.string().trim().min(1, "Tech icon is required"),
  description: z.string().trim().min(1, "Tech description is required"),
});

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  long_description: z.string().trim().optional(),
  project_url: z.string().trim().optional(),
  image_url: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  category: z.string().trim().min(1, "Category is required"),
  employer: z.string().trim().optional(),
  role: z.string().trim().optional(),
  year: z.string().trim().optional(),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  features: z.array(z.string().trim()).default([]),
  tech_stack: z.array(techStackItemSchema).default([]),
  featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
});

type ProjectFormData = z.output<typeof projectSchema>;

const ProjectSheet = ({ project }: { project?: Project }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = Boolean(project);

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
            Create Project
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? `Edit: ${project?.title}` : "Create Project"}
          </SheetTitle>
        </SheetHeader>
        <div className="m-3">
          <Form
            validation={projectSchema}
            defaultValues={getDefaultValues(project)}
            onSubmit={async (data) => {
              const payload = toPayload(data);

              if (project) {
                await ProjectService.make().update(project.id, payload);
                return;
              }

              await ProjectService.make().store(payload);
            }}
            onSuccess={() => {
              toast.success(isEditing ? "Project updated" : "Project created");
              setOpen(false);
              router.refresh();
            }}
            withBackButton={false}
          >
            <ProjectFormFields />
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ProjectFormFields = () => {
  const { setValue, control } = useFormContext<ProjectFormData>();
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const projectUrl = useWatch({ control, name: "project_url" });
  const imageUrl = useWatch({ control, name: "image_url" });

  const handleFetchImage = async () => {
    if (!projectUrl) {
      toast.error("Enter a project URL first");
      return;
    }

    setIsFetchingImage(true);
    const result = await fetchProjectImageAction(projectUrl);
    setIsFetchingImage(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.imageUrl) {
      setValue("image_url", result.imageUrl);
      toast.success("Image fetched and uploaded");
    }
  };

  return (
    <FieldGroup>
      <FormInput name="title" label="Title" />
      <FormTextarea name="description" label="Short Description" rows={3} />
      <FormTiptap
        name="long_description"
        label="Long Description"
        minHeight="200px"
      />
      <FormInput name="project_url" label="Project URL" optional />
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFetchingImage || !projectUrl}
          onClick={handleFetchImage}
          className="self-start"
        >
          {isFetchingImage ? "Fetching..." : "Fetch image from project URL"}
        </Button>
      </div>
      {imageUrl && (
        <FormInput name="image_url" label="Image URL" optional />
      )}
      <FormInput name="category" label="Category" />
      <FormInput name="employer" label="Employer" optional />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput name="role" label="Role" optional />
        <FormInput name="year" label="Year" optional />
      </div>
      <FormTagsInput name="tags" label="Tags" placeholder="Add a tag" />
      <FeaturesInput name="features" label="Features" />
      <FormTiptap name="problem" label="Problem" minHeight="150px" />
      <FormTiptap name="solution" label="Solution" minHeight="150px" />
      <TechStackInput name="tech_stack" label="Tech Stack" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="display_order"
          label="Display Order"
          type="number"
        />
        <FormCheckbox name="featured" label="Featured" />
      </div>
    </FieldGroup>
  );
};

function getDefaultValues(project?: Project): ProjectFormData {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    long_description: project?.long_description ?? "",
    project_url: project?.project_url ?? "",
    image_url: project?.image_url ?? "",
    tags: project?.tags ?? [],
    category: project?.category ?? "",
    employer: project?.employer ?? "",
    role: project?.role ?? "",
    year: project?.year ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    features: project?.features ?? [],
    tech_stack: (project?.tech_stack as ProjectFormData["tech_stack"]) ?? [],
    featured: project?.featured ?? false,
    display_order: project?.display_order ?? 0,
  };
}

function toPayload(data: ProjectFormData) {
  return {
    title: data.title,
    description: data.description,
    long_description: data.long_description || null,
    project_url: data.project_url || null,
    image_url: data.image_url || "",
    tags: data.tags,
    category: data.category,
    employer: data.employer || null,
    role: data.role || null,
    year: data.year || null,
    problem: data.problem || null,
    solution: data.solution || null,
    features: data.features,
    tech_stack: data.tech_stack,
    featured: data.featured,
    display_order: data.display_order,
  };
}

export default ProjectSheet;
