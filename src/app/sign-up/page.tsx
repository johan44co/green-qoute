import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to quotes if already authenticated
  if (session) {
    redirect("/quotes");
  }

  return <SignUpForm />;
}
