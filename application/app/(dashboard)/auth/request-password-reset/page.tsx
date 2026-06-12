"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import { FieldGroup } from "@/components/ui/field";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const RequestPasswordReset = () => {
  const [disabled, setDisabled] = useState(false);
  const validation = z.object({
    email: z.email(),
  });
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Form
        disabled={disabled}
        validation={validation}
        onSubmit={async (formData) => {
          const { data, error } = await supabase.auth.resetPasswordForEmail(
            formData.email,
            {
              redirectTo: `${window.location.origin}/auth/confirm?next=/auth/reset-password`,
            },
          );

          if (error) {
            throw error;
          }

          return data;
        }}
        onSuccess={() => {
          setDisabled(true);
          toast.success(
            "An Email With An One Time Password Has Been Sent To Your Email",
          );
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <LayoutDashboardIcon className="size-6" />
            </div>
            <h1 className="text-xl font-bold">
              Don&#39;t worry we got your back, use your email to get a password
              reset link
            </h1>
          </div>
          <FormInput
            name={"email"}
            label={"Email"}
            autoComplete={"username"}
            type={"email"}
            placeholder={"example@email.com"}
            disabled={disabled}
          />
        </FieldGroup>
      </Form>
    </div>
  );
};

export default RequestPasswordReset;
