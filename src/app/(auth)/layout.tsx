import { validateSession } from "@/lib/auth-validation";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession({ redirectIfAuthenticated: true });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo */}
      <div className="pt-8 px-8 text-center">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-semibold">Green Quote</span>
        </Link>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
