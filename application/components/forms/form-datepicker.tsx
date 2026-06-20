"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getNestedPropertyValue } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { Controller, useFormContext } from "react-hook-form";

type FormDatepickerProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "mode" | "selected" | "onSelect" | "initialFocus"
> & {
  name: string;
  label?: string;
  disableInput?: boolean;
  placeholder?: string;
};

const FormDatepicker: React.FC<FormDatepickerProps> = ({
  name,
  label,
  disableInput = false,
  placeholder = "Pick a date",
  className,
  ...props
}) => {
  const {
    control,
    setValue,
    formState: { defaultValues },
  } = useFormContext();
  const defaultValue = getNestedPropertyValue(defaultValues ?? {}, name);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, normalizeDate(defaultValue));
    }
  }, [defaultValue, name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start font-normal"
                disabled={disableInput}
                data-cy={`${name}-datepicker-button`}
              >
                {normalizeDate(value) ? (
                  format(normalizeDate(value) as Date, "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
                <CalendarIcon className="ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={normalizeDate(value)}
                onSelect={onChange}
                className={cn("pointer-events-auto p-3", className)}
                {...props}
              />
            </PopoverContent>
          </Popover>
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormDatepicker;

function normalizeDate(value: unknown) {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
}
