import { redirect } from "next/navigation";

import { updatePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getOptionalAuthenticatedUser } from "@/lib/auth/session";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getOptionalAuthenticatedUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?error=Open%20the%20password%20reset%20link%20from%20your%20email%20first.");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md space-y-4">
        {params.error ? (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Set a New Password</CardTitle>
            <CardDescription>
              Update the password for {user.email}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePasswordAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input id="password" name="password" type="password" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit">Update Password</Button>
                  <FieldDescription className="text-center">
                    Use at least 8 characters.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
