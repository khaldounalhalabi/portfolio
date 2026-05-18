import useResourceMutation, {
  QueryResourceKey,
} from "@/hooks/use-resource-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseSyntheticEvent,
  createContext,
  HTMLProps,
  ReactNode,
  useContext,
} from "react";
import {
  DefaultValues,
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
  TSchema extends z.ZodTypeAny,
> extends Omit<
  HTMLProps<HTMLFormElement>,
  "children" | "onError" | "onSubmit" | "defaultValue"
> {
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  children?: ReactNode;
  onSubmit?: (
    data: z.infer<TSchema>,
    event: BaseSyntheticEvent<SubmitEvent>,
  ) => Promise<OnSuccessReturn>;
  onSuccess?: (data: OnSuccessReturn) => void;
  onError?: (error: Error) => void;
  validation?: TSchema;
  invalidateQueryKey?: QueryResourceKey<OnSuccessReturn, unknown, unknown>;
  mode?: UseFormProps<z.infer<TSchema>>["mode"];
  reValidateMode?: UseFormProps<z.infer<TSchema>>["reValidateMode"];
}

function Form<
  OnSuccessReturn extends object | void | undefined | null,
  TSchema extends z.ZodTypeAny,
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
  ...props
}: FormProps<OnSuccessReturn, TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
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
      data: z.infer<TSchema>;
      event: BaseSyntheticEvent<SubmitEvent>;
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
    data: z.infer<TSchema>,
    event: BaseSyntheticEvent<SubmitEvent>,
  ) => {
    return mutation.mutate({ data, event });
  };

  const submit = methods.handleSubmit((data, event) =>
    handleSubmit(data, event as BaseSyntheticEvent<SubmitEvent>),
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
        </form>
      </FormProvider>
    </FormMetaData.Provider>
  );
}

export default Form;
