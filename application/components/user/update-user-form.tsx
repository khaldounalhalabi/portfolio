"use client";
import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const UpdateUserForm = ({ user }: { user: User }) => {
  const validation = z.object({
    first_name: z.string().max(255),
    last_name: z.string().max(255),
    email: z.email(),
  });
  const router = useRouter();
  return (
    <Form
      validation={validation}
      onSubmit={async (formdata) => {
        const { error } = await supabase.auth.updateUser({
          email: formdata.email,
          data: {
            first_name: formdata.first_name,
            last_name: formdata.last_name,
          },
        });
        if (error) {
          throw error;
        }
      }}
      defaultValues={{
        email: user.email,
        first_name: user.user_metadata.first_name,
        last_name: user.user_metadata.last_name,
      }}
      onSuccess={() => {
        toast.success("User details updated successfully");
        router.replace("/dashboard");
      }}
    >
      <div className={"grid grid-cols-2 gap-3"}>
        <FormInput name={"first_name"} label={"First Name"} />
        <FormInput name={"last_name"} label={"Last Nmae"} />
        <FormInput
          name={"email"}
          label={"Email"}
          autoComplete={"new-username"}
          type={"email"}
        />
      </div>
    </Form>
  );
};

export default UpdateUserForm;
