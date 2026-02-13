'use client';
import { Button, Form, Field, Input } from "@/components/ui";
import Link from "next/link";
import { useSignInForm } from "./use-sign-in-form";

export function SignInForm() {
  const { errors, errorMessage, isLoading, handleSubmit } = useSignInForm();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="mt-2 text-foreground/60">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <Form errors={errors} onFormSubmit={handleSubmit}>
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Input type="email" placeholder="Enter your email" />
            <Field.Error />
          </Field.Root>

          <Field.Root name="password">
            <Field.Label>Password</Field.Label>
            <Input type="password" placeholder="Enter your password" />
            <Field.Error />
          </Field.Root>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-foreground/60">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </Form>
    </div>
  );
}
