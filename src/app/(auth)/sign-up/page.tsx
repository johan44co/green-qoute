import { SignUpForm } from "./sign-up-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free Green Quote account to start getting solar panel installation quotes for your home.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
