"use client";

import { Button } from "@/components/ui/button";
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
  mode?: UseFormProps<z.input<TSchema>>["mode"];
  reValidateMode?: UseFormProps<z.input<TSchema>>["reValidateMode"];
  withSubmitButton?: boolean;
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
  mode = "onSubmit",
  reValidateMode = "onChange",
  withSubmitButton = true,
  ...props
}: FormProps<OnSuccessReturn, TSchema>) {
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
      if (!onSubmit) {
        throw new Error("onSubmit Prop is required");
      }
      return onSubmit(data, event);
    },
    onSuccess: onSuccess,
    onError: onError,
    resource: invalidateQueryKey,
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
          {withSubmitButton && (
            <div className={"my-5 flex w-full justify-between"}>
              <Button
                className={"cursor-pointer"}
                variant={"secondary"}
                type={"button"}
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </Button>
              <Button className={"cursor-pointer"} type={"submit"}>
                Submit{" "}
                {methods.formState.isSubmitting && (
                  <Loader2 className={"animate-spin"} />
                )}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </FormMetaData.Provider>
  );
}

export default Form;
