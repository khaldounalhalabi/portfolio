"use client";

import FormTextarea from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface FeaturesInputProps {
  name: string;
  label?: string;
}

const FeaturesInput = ({ name, label }: FeaturesInputProps) => {
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
            <FormTextarea
              name={`${name}.${index}`}
              label={`Feature ${index + 1}`}
              rows={3}
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
          onClick={() => append("")}
        >
          <PlusIcon />
          Add Feature
        </Button>
      </div>
    </Field>
  );
};

export default FeaturesInput;
