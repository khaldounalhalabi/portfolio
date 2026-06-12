"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AuthError } from "@supabase/supabase-js";
import { LayoutDashboardIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { z } from "zod";

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const validation = z.object({
    email: z.email(),
    password: z.string().max(255),
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form
        withSubmitButton={false}
        validation={validation}
        onSubmit={async (data) => {
          setLoading(true);
          setError(null);
          try {
            const { error } = await createClient().auth.signInWithPassword({
              email: data.email,
              password: data.password,
            });
            if (!error) {
              router.replace("/dashboard");
            } else {
              setError(error);
            }
          } catch (e: unknown) {
            setError(
              new AuthError(
                (e as unknown as Error)?.message ?? "Failed To Login",
                500,
                "unexpected",
              ),
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <LayoutDashboardIcon className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Welcome back Khaldoun.</h1>
          </div>
          <FormInput
            name={"email"}
            label={"Email"}
            placeholder={"example@email.com"}
            type={"email"}
            autoComplete={"username"}
          />
          <FormInput
            name={"password"}
            label={"Password"}
            type={"password"}
            autoComplete={"current-password"}
          />
          {error && (
            <Field>
              <Alert variant={"destructive"}>
                <AlertTitle>{error.message}</AlertTitle>
              </Alert>
            </Field>
          )}
          <Field>
            <Button type="submit">
              Login {loading && <Loader2 className={"animate-spin"} />}
            </Button>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  );
}
