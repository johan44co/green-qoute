import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminQuotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Admin - Quotes Management</h1>
      <p className="text-foreground/70">
        Welcome, Admin {session?.user.name}!
      </p>
      <div className="mt-8">
        <p>Admin quote management interface will appear here.</p>
      </div>
    </div>
  );
}
