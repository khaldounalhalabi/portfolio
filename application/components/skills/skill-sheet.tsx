"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Skill from "@/models/Skill";
import SkillCategory from "@/models/SkillCategory";
import SkillService from "@/services/SkillService";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  skill_category_id: z.uuid(),
});

type SkillFormData = z.output<typeof skillSchema>;

const SkillSheet = ({
  skill,
  categories,
}: {
  skill?: Skill;
  categories: SkillCategory[];
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = Boolean(skill);

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
            {isEditing ? `Edit: ${skill?.name}` : "Create Skill"}
          </SheetTitle>
        </SheetHeader>
        <div className="m-3">
          <Form
            validation={skillSchema}
            defaultValues={getDefaultValues(skill)}
            onSubmit={async (data) => {
              const payload = toPayload(data);

              if (skill) {
                await SkillService.make().update(skill.id, payload);
                return;
              }

              await SkillService.make().store(payload);
            }}
            onSuccess={() => {
              toast.success(isEditing ? "Skill updated" : "Skill created");
              setOpen(false);
              router.refresh();
            }}
            withBackButton={false}
          >
            <FieldGroup>
              <FormInput name="name" label="Name" />
              <FormSelect
                name={"skill_category_id"}
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
            </FieldGroup>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function getDefaultValues(skill?: Skill) {
  return {
    name: skill?.name ?? "",
    skill_category_id: skill?.skill_category_id ?? undefined,
  };
}

function toPayload(data: SkillFormData) {
  return {
    name: data.name,
    skill_category_id: data.skill_category_id,
  };
}

export default SkillSheet;
