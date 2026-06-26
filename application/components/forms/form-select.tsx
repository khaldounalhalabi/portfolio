"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNestedPropertyValue } from "@/lib/utils";
import { Select as SelectPrimitive } from "radix-ui";
import { FC, ReactNode, useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

type SelectOptionObject = {
  label: string;
  value: string;
};

type SelectOption = string | SelectOptionObject;

interface FormSelectProps
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    "name" | "onValueChange" | "value" | "defaultValue"
  > {
  label?: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  optional?: boolean;
  placeholder?: string;
  renderOption?: (option: SelectOptionObject) => ReactNode;
  renderValue?: (option: SelectOptionObject) => ReactNode;
  onChange?: (value: string) => void;
}

const FormSelect: FC<FormSelectProps> = ({
  label,
  name,
  options,
  defaultValue,
  optional,
  placeholder = "Select an option",
  renderOption,
  renderValue = renderOption,
  onChange,
  ...props
}) => {
  const {
    control,
    setValue,
    formState: { defaultValues },
  } = useFormContext();

  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options]
  );

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
          <Select
            {...field}
            {...props}
            value={field.value ?? ""}
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder}>
                {(() => {
                  const selected = normalizedOptions.find(
                    (option) => option.value === field.value
                  );

                  if (!selected) {
                    return undefined;
                  }

                  return renderValue ? renderValue(selected) : selected.label;
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {normalizedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {renderOption ? renderOption(option) : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormSelect;

function normalizeOption(option: SelectOption): SelectOptionObject {
  if (typeof option === "string") {
    return { label: option, value: option };
  }

  return option;
}
