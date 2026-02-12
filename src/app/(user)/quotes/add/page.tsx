import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuoteForm } from "./quote-form";

export default async function AddQuotePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const defaultValues = {
    fullName: session?.user.name || "",
    email: session?.user.email || "",
  };

  return (
    <div className="container py-8 m-auto">
      <QuoteForm defaultValues={defaultValues} />
    </div>
  );
}
