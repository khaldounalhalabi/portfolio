import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
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
  const { control } = useFormContext();
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
                className={"justify-start font-normal"}
                disabled={disableInput}
                data-cy={`${name}-datepicker-button`}
              >
                {value ? format(value, "PPP") : <span>{placeholder}</span>}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={onChange}
                className={cn("pointer-events-auto p-3", className)}
                {...props}
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
};

export default FormDatepicker;
