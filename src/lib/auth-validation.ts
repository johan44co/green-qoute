import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type ValidationOptions = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectIfAuthenticated?: boolean;
};

export async function validateSession(options: ValidationOptions = {}) {
  const { requireAuth, requireAdmin, redirectIfAuthenticated } = options;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect authenticated users away from auth pages
  if (redirectIfAuthenticated && session) {
    const isAdmin = session.user.role?.includes("admin");
    redirect(isAdmin ? "/admin/quotes" : "/quotes");
  }

  // Require authentication
  if (requireAuth && !session) {
    redirect("/sign-in");
  }

  // Require admin role
  if (requireAdmin && !session?.user.role?.includes("admin")) {
    redirect("/quotes");
  }

  return session;
}
