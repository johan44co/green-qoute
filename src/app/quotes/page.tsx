import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Quotes</h1>
      <p className="text-foreground/70">
        Welcome, {session.user.name}!
      </p>
      <div className="mt-8">
        <p>Your quotes will appear here.</p>
      </div>
    </div>
  );
}
