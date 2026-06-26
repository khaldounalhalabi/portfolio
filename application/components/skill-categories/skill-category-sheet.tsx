"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SkillCategory from "@/models/SkillCategory";
import SkillCategoryService from "@/services/SkillCategoryService";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { iconNames } from "lucide-react/dynamic";
import FormIconPicker from "@/components/forms/form-icon-picker";

const iconNamesSet = new Set<string>(iconNames as unknown as string[]);

const skillCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  icon: z
    .string()
    .trim()
    .min(1, "Icon is required")
    .refine((value) => iconNamesSet.has(value), {
      message: "Icon must be a valid Lucide icon",
    }),
});

type SkillCategoryFormData = z.output<typeof skillCategorySchema>;

const SkillCategorySheet = ({ category }: { category?: SkillCategory }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = Boolean(category);

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
            Create Skill Category
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? `Edit: ${category?.name}` : "Create Skill Category"}
          </SheetTitle>
        </SheetHeader>
        <div className="m-3">
          <Form
            validation={skillCategorySchema}
            defaultValues={getDefaultValues(category)}
            onSubmit={async (data) => {
              const payload = toPayload(data);

              if (category) {
                await SkillCategoryService.make().update(category.id, payload);
                return;
              }

              await SkillCategoryService.make().store(payload);
            }}
            onSuccess={() => {
              toast.success(
                isEditing ? "Skill category updated" : "Skill category created",
              );
              setOpen(false);
              router.refresh();
            }}
            withBackButton={false}
          >
            <FieldGroup>
              <FormInput name="name" label="Name" />
              <FormIconPicker name="icon" label="Icon" />
              <FormTextarea name="description" label="Description" rows={5} />
            </FieldGroup>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function getDefaultValues(category?: SkillCategory) {
  return {
    name: category?.name ?? "",
    icon: category?.icon ?? "",
    description: category?.description ?? "",
  };
}

function toPayload(data: SkillCategoryFormData) {
  return {
    name: data.name,
    icon: data.icon,
    description: data.description,
  };
}

export default SkillCategorySheet;
