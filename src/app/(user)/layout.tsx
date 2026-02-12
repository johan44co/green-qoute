import { validateSession } from "@/lib/auth-validation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession({ requireAuth: true });

  return <>{children}</>;
}
