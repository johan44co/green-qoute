'use client';
import { Button, Form, Field, Input } from "@/components/ui";
import Link from "next/link";
import { useSignUpForm } from "./use-sign-up-form";

export function SignUpForm() {
  const { errors, errorMessage, isLoading, handleSubmit } = useSignUpForm();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="mt-2 text-foreground/60">
          Create your account to get started.
        </p>
      </div>

      <Form errors={errors} onFormSubmit={handleSubmit}>
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

          <Field.Root name="name">
            <Field.Label>Name</Field.Label>
            <Input type="text" placeholder="Enter your name" />
            <Field.Error />
          </Field.Root>

          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Input type="email" placeholder="Enter your email" />
            <Field.Error />
          </Field.Root>

          <Field.Root name="password">
            <Field.Label>Password</Field.Label>
            <Input type="password" placeholder="Create a password" />
            <Field.Description>
              Must be at least 8 characters long
            </Field.Description>
            <Field.Error />
          </Field.Root>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Form>
    </div>
  );
}
