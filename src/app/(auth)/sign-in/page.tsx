import { SignInForm } from "./sign-in-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Green Quote account to view and manage your solar panel quotes.",
};

export default function SignInPage() {
  return <SignInForm />;
}
