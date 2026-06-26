"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { IconPicker } from "@/components/ui/icon-picker";
import { getNestedPropertyValue } from "@/lib/utils";
import { FC, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormIconPickerProps {
  label?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  optional?: boolean;
}

const FormIconPicker: FC<FormIconPickerProps> = ({
  label,
  name,
  defaultValue,
  placeholder,
  optional,
}) => {
  const {
    control,
    setValue,
    formState: { defaultValues },
  } = useFormContext();

  const resolvedDefaultValue =
    defaultValue ?? getNestedPropertyValue(defaultValues ?? {}, name);

  useEffect(() => {
    if (resolvedDefaultValue !== undefined) {
      setValue(name, resolvedDefaultValue);
    }
  }, [resolvedDefaultValue, name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel className="font-medium">
              {label}{" "}
              {optional && (
                <span className="text-sm text-gray-500">(Optional)</span>
              )}
            </FieldLabel>
          )}
          <IconPicker
            value={field.value ?? ""}
            onChange={(value) => field.onChange(value)}
            placeholder={placeholder}
          />
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormIconPicker;
