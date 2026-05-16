"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { syncServerAuthSession } from "@/lib/auth/browser-session";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  message,
  error,
  ...props
}: React.ComponentProps<"div"> & {
  message?: string;
  error?: string;
}) {
  const router = useRouter();
  const [loginError, setLoginError] = useState(error);
  const [loginMessage] = useState(message);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogin = async (formData: FormData) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    setResetError(null);
    setResetMessage(null);

    try {
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      if (!email || !password) {
        setLoginError("Email and password are required.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.session) {
        setLoginError("Invalid email or password.");
        return;
      }

      await syncServerAuthSession(data.session);
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleReset = async (formData: FormData) => {
    setIsSendingReset(true);
    setResetError(null);
    setResetMessage(null);

    try {
      const email = String(formData.get("email") ?? "").trim();

      if (!email) {
        setResetError("Enter your email to reset your password.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error: resetAuthError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        },
      );

      if (resetAuthError) {
        setResetError("Unable to send reset email.");
        return;
      }

      setResetMessage("Password reset email sent.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {loginMessage ? (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {loginMessage}
        </div>
      ) : null}
      {loginError ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loginError}
        </div>
      ) : null}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in with your Supabase email and password to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Forgot Password?</CardTitle>
          <CardDescription>
            Send a reset link to your admin email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetMessage ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {resetMessage}
            </div>
          ) : null}
          {resetError ? (
            <div className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {resetError}
            </div>
          ) : null}
          <form action={handleReset}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" variant="outline" disabled={isSendingReset}>
                  {isSendingReset ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  After the reset link is verified, you&apos;ll be sent to the password
                  update screen.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Public portfolio: <Link href="/">back to site</Link>
      </FieldDescription>
    </div>
  );
}
