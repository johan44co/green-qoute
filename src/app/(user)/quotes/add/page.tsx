import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuoteForm } from "./quote-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Calculate your solar panel installation costs, energy savings, and return on investment.",
};

export default async function AddQuotePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const defaultValues = {
    fullName: session?.user.name || "",
    email: session?.user.email || "",
  };

  return <QuoteForm defaultValues={defaultValues} />;
}
