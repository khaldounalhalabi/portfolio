"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import { FieldGroup } from "@/components/ui/field";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const Page = () => {
  const router = useRouter();
  const validation = z
    .object({
      password: z.string().max(255),
      password_confirmation: z.string().max(255),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    });
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Form
        validation={validation}
        onSubmit={async (formData) => {
          const { data, error } = await supabase.auth.updateUser({
            password: formData.password,
          });

          if (error) {
            throw error;
          }

          return data;
        }}
        onSuccess={() => {
          toast.success("Password Has Been Changed Successfully");
          router.replace("/dashboard");
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <LayoutDashboardIcon className="size-6" />
            </div>
            <h1 className="text-xl font-bold">
              One Final Step: Put your new password
            </h1>
          </div>
          <FormInput
            name={"password"}
            label={"Password"}
            autoComplete={"new-password"}
            type={"password"}
            placeholder={"P@$$w0rd"}
          />

          <FormInput
            name={"password_confirmation"}
            label={"Confirm Your Password"}
            autoComplete={"new-password"}
            type={"password"}
            placeholder={"P@$$w0rd"}
          />
        </FieldGroup>
      </Form>
    </div>
  );
};

export default Page;
