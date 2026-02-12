import { validateSession } from "@/lib/auth-validation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession({ requireAuth: true, requireAdmin: true });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
