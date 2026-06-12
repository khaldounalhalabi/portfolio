"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { z } from "zod";

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validation = z.object({
    email: z.email(),
    password: z.string().max(255),
  });
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form
        withSubmitButton={false}
        validation={validation}
        onSubmit={async (data) => {
          setLoading(true);
          const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          if (error) {
            throw error;
          }
          setLoading(false);
        }}
        onSuccess={() => {
          router.replace("/dashboard");
        }}
        onError={() => {
          setLoading(false);
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
        </FieldGroup>
        <FieldSeparator className={"my-5"} />
        <FieldGroup>
          <Field>
            <Button disabled={loading} type="submit">
              Login {loading && <Loader2 className={"animate-spin"} />}
            </Button>
          </Field>
          <Field className={"flex flex-row items-center justify-center gap-0"}>
            <p>Forgot Your Password ?</p>
            <Link href={"/auth/request-password-reset"} className={"underline"}>
              Try Resetting it
            </Link>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  );
}
