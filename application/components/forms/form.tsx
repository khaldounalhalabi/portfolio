"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import useResourceMutation, {
  QueryResourceKey,
} from "@/hooks/use-resource-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BaseSyntheticEvent,
  createContext,
  HTMLProps,
  ReactNode,
  useContext,
  useState,
} from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

interface FormMetaData {
  isSubmitting: boolean;
}

const FormMetaData = createContext<FormMetaData>({ isSubmitting: false });

export const useFormMetaData = () => useContext(FormMetaData);

interface FormProps<
  OnSuccessReturn extends object | void | undefined | null,
  TSchema extends z.ZodType<FieldValues, FieldValues>,
> extends Omit<
  HTMLProps<HTMLFormElement>,
  "children" | "onError" | "onSubmit" | "defaultValue"
> {
  defaultValues?: DefaultValues<z.input<TSchema>>;
  children?: ReactNode;
  onSubmit?: (
    data: z.output<TSchema>,
    event?: BaseSyntheticEvent,
  ) => Promise<OnSuccessReturn>;
  onSuccess?: (data: OnSuccessReturn) => void;
  onError?: (error: Error) => void;
  validation?: TSchema;
  invalidateQueryKey?: QueryResourceKey<OnSuccessReturn, unknown, unknown>;
  revalidateOnSuccess?: boolean;
  mode?: UseFormProps<z.input<TSchema>>["mode"];
  reValidateMode?: UseFormProps<z.input<TSchema>>["reValidateMode"];
  withSubmitButton?: boolean;
  withBackButton?: boolean;
}

function Form<
  OnSuccessReturn extends object | void | undefined | null,
  TSchema extends z.ZodType<FieldValues, FieldValues>,
>({
  defaultValues,
  children,
  onSubmit,
  onSuccess,
  onError,
  validation,
  invalidateQueryKey,
  revalidateOnSuccess,
  mode = "onSubmit",
  reValidateMode = "onChange",
  withSubmitButton = true,
  withBackButton = true,
  disabled = false,
  ...props
}: FormProps<OnSuccessReturn, TSchema>) {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const methods = useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    resolver: validation ? zodResolver(validation) : undefined,
    defaultValues,
    mode,
    reValidateMode,
  });

  const mutation = useResourceMutation({
    mutationFn: ({
      data,
      event,
    }: {
      data: z.output<TSchema>;
      event?: BaseSyntheticEvent;
    }) => {
      setError(null);
      if (!onSubmit) {
        throw new Error("onSubmit Prop is required");
      }
      return onSubmit(data, event);
    },
    onSuccess: onSuccess,
    onError: (error) => {
      setError(error);
      onError?.(error);
    },
    resource: invalidateQueryKey,
    revalidate: revalidateOnSuccess,
  });

  const handleSubmit = async (
    data: z.output<TSchema>,
    event?: BaseSyntheticEvent,
  ) => {
    return mutation.mutate({ data, event });
  };

  const submit = methods.handleSubmit((data, event) =>
    handleSubmit(data, event),
  );

  return (
    <FormMetaData.Provider value={{ isSubmitting: mutation.isPending }}>
      <FormProvider {...methods}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await submit(e);
          }}
          {...props}
        >
          {children}
          {(error || withSubmitButton) && <FieldSeparator className={"my-3"} />}
          <FieldGroup>
            {error && (
              <Field>
                <Alert variant={"destructive"}>
                  <AlertTitle>{error.message}</AlertTitle>
                </Alert>
              </Field>
            )}
            {withSubmitButton && (
              <Field>
                <div className={"flex w-full items-center justify-between"}>
                  {withBackButton && (
                    <Button
                      className={"cursor-pointer"}
                      variant={"secondary"}
                      type={"button"}
                      onClick={() => {
                        router.back();
                      }}
                      disabled={disabled || mutation.isPending}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    className={"cursor-pointer"}
                    type={"submit"}
                    disabled={disabled || mutation.isPending}
                  >
                    Submit{" "}
                    {mutation.isPending && (
                      <Loader2 className={"animate-spin"} />
                    )}
                  </Button>
                </div>
              </Field>
            )}
          </FieldGroup>
        </form>
      </FormProvider>
    </FormMetaData.Provider>
  );
}

export default Form;
