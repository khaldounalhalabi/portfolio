import { Field, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { getNestedPropertyValue } from "@/lib/utils";
import { FC, HTMLProps, ReactNode, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps extends Omit<
  HTMLProps<HTMLInputElement>,
  "label" | "name"
> {
  label?: string | (() => ReactNode);
  name: string;
  defaultValue?: string | number | undefined;
  optional?: boolean;
}

const FormInput: FC<FormInputProps> = ({
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

  defaultValue =
    defaultValue ?? getNestedPropertyValue(defaultValues ?? {}, name);
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label &&
            (typeof label == "function" ? (
              label()
            ) : (
              <FieldLabel className="font-medium">
                {label}{" "}
                {optional && (
                  <span className="text-sm text-gray-500">(Optional)</span>
                )}
              </FieldLabel>
            ))}

          <Input
            {...field}
            {...props}
            value={props.value ?? field.value ?? ""}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) {
                onChange(e);
              }
            }}
          />
        </Field>
      )}
    />
  );
};

export default FormInput;
