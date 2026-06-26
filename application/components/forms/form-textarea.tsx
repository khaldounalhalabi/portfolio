"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { getNestedPropertyValue } from "@/lib/utils";
import { FC, TextareaHTMLAttributes, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> {
  label?: string;
  name: string;
  defaultValue?: string;
  optional?: boolean;
}

const FormTextarea: FC<FormTextareaProps> = ({
  label,
  name,
  defaultValue,
  onChange,
  optional,
  ...props
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
          <Textarea
            {...field}
            {...props}
            value={props.value ?? field.value ?? ""}
            onChange={(event) => {
              field.onChange(event);
              onChange?.(event);
            }}
          />
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormTextarea;
