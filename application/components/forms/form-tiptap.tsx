import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { getNestedPropertyValue } from "@/lib/utils";
import { FC, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormTiptapProps {
  name: string;
  label?: string;
  defaultValue?: string;
  minHeight?: string;
}

const FormTiptap: FC<FormTiptapProps> = ({
  name,
  label,
  defaultValue,
  minHeight,
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
          {label && (
            <FieldLabel className="font-medium">{label}</FieldLabel>
          )}
          <TiptapEditor
            defaultValue={field.value ?? ""}
            onChange={field.onChange}
            minHeight={minHeight}
          />
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default FormTiptap;
