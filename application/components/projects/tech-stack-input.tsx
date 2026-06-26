"use client";

import FormIconPicker from "@/components/forms/form-icon-picker";
import FormInput from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface TechStackInputProps {
  name: string;
  label?: string;
}

const TechStackInput = ({ name, label }: TechStackInputProps) => {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const value = watch(name);

  useEffect(() => {
    if (!Array.isArray(value)) {
      setValue(name, []);
    }
  }, [name, setValue, value]);

  return (
    <Field>
      {label && <FieldLabel className="font-medium">{label}</FieldLabel>}
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-3 rounded-lg border border-input p-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <FormInput
                  name={`${name}.${index}.name`}
                  label="Name"
                />
              </div>
              <div className="flex-1">
                <FormIconPicker
                  name={`${name}.${index}.icon`}
                  label="Icon"
                />
              </div>
            </div>
            <FormInput
              name={`${name}.${index}.description`}
              label="Description"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="self-start"
              onClick={() => remove(index)}
            >
              <TrashIcon />
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            append({ name: "", icon: "", description: "" })
          }
        >
          <PlusIcon />
          Add Tech
        </Button>
      </div>
    </Field>
  );
};

export default TechStackInput;
