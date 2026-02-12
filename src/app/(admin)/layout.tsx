import { validateSession } from "@/lib/auth-validation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession({ requireAuth: true, requireAdmin: true });

  return <>{children}</>;
}
