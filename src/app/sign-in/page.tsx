import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to quotes if already authenticated
  if (session) {
    redirect("/quotes");
  }

  return <SignInForm />;
}
