import { Database } from "@/integrations/supabase/database.types";
import type { DefaultError, QueryClient } from "@tanstack/query-core";
import {
  MutationFunctionContext,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

type TableName = keyof Database["public"]["Tables"];
type ResourceName = TableName | (string & {});
type ResourceValue = ResourceName | ResourceName[];
type ResourceResolver<TData, TVariables, TOnMutateResult> = (
  data: TData,
  variables: TVariables,
  onMutateResult: TOnMutateResult,
  context: MutationFunctionContext,
) => ResourceValue | undefined;

export type QueryResourceKey<TData, TVariables, TOnMutateResult> =
  | ResourceValue
  | ResourceResolver<TData, TVariables, TOnMutateResult>;

type MutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TOnMutateResult = unknown,
> = UseMutationOptions<TData, TError, TVariables, TOnMutateResult> & {
  resource?: QueryResourceKey<TData, TVariables, TOnMutateResult>;
};

const useResourceMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TOnMutateResult = unknown,
>(
  options: MutationOptions<TData, TError, TVariables, TOnMutateResult>,
  queryClient?: QueryClient,
) => {
  const originalQueryClient = useQueryClient();
  const qClient = queryClient ?? originalQueryClient;

  const { resource, ...restOptions } = options;

  const onSuccess = async (
    data: TData,
    variables: TVariables,
    onMutateResult: TOnMutateResult,
    context: MutationFunctionContext,
  ) => {
    await options.onSuccess?.(data, variables, onMutateResult, context);

    const resolvedResource =
      typeof resource == "function"
        ? resource(data, variables, onMutateResult, context)
        : resource;
    const resources = Array.isArray(resolvedResource)
      ? resolvedResource
      : resolvedResource
        ? [resolvedResource]
        : [];

    if (resources.length > 0) {
      await qClient.invalidateQueries({
        predicate: (query) =>
          resources.some((resource) => {
            return (
              query?.queryKey?.includes(resource) ||
              query.queryKey.some(
                (key) => typeof key == "string" && key.includes(resource),
              )
            );
          }),
      });
    }
  };

  return useMutation(
    {
      ...restOptions,
      onSuccess: onSuccess,
    },
    queryClient,
  );
};

export default useResourceMutation;
