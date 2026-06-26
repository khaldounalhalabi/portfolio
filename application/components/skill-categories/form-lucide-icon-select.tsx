"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconNames } from "lucide-react/dynamic";
import { Controller, useFormContext } from "react-hook-form";

const FormLucideIconSelect = ({
  name,
  label,
}: {
  name: string;
  label?: string;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel className="font-medium">{label}</FieldLabel>}
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {iconNames.map((iconName) => (
                <SelectItem key={iconName} value={iconName}>
                  {iconName}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.value && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {field.value}
            </div>
          )}
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormLucideIconSelect;
