import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { getNestedPropertyValue } from "@/lib/utils";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { FC, ReactNode, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormCheckboxProps extends Omit<
  CheckboxProps,
  "name" | "defaultValue" | "onChange"
> {
  label?: string | ((checked: boolean) => ReactNode);
  name: string;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
}

const FormCheckbox: FC<FormCheckboxProps> = ({
  label,
  name,
  defaultValue,
  onChange,
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
        <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
          <Checkbox
            checked={field.value ?? false}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              if (onChange) {
                onChange(checked as boolean);
              }
            }}
            {...props}
            name={name}
          />
          {label && (
            <FieldLabel className="font-medium">
              {typeof label === "function"
                ? label(field.value ?? false)
                : label}
            </FieldLabel>
          )}
        </Field>
      )}
    />
  );
};

export default FormCheckbox;
