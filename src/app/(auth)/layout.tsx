import { validateSession } from "@/lib/auth-validation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession({ redirectIfAuthenticated: true });

  return <>{children}</>;
}
