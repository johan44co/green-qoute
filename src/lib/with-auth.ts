import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface WithAuthOptions {
  requireAdmin?: boolean;
}

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

type AuthenticatedHandler = (args: {
  request: NextRequest;
  session: Session;
}) => Promise<Response>;

type AuthenticatedHandlerWithParams<
  TParams extends Record<string, string | string[]>,
> = (args: {
  request: NextRequest;
  params: Promise<TParams>;
  session: Session;
}) => Promise<Response>;

/**
 * Create an authenticated API route handler
 * Automatically validates session before calling the handler
 *
 * @example
 * // Simple route
 * export const GET = withAuth(async ({ session }) => {
 *   return NextResponse.json({ userId: session.user.id });
 * });
 *
 * @example
 * // Dynamic route with params
 * export const GET = withAuth<{ id: string }>(
 *   async ({ params, session }) => {
 *     const { id } = await params;
 *     // id is typed as string
 *   }
 * );
 */

// Overload for routes without params
export function withAuth(
  handler: AuthenticatedHandler,
  options?: WithAuthOptions
): (request: NextRequest) => Promise<Response>;

// Overload for routes with params
export function withAuth<TParams extends Record<string, string | string[]>>(
  handler: AuthenticatedHandlerWithParams<TParams>,
  options?: WithAuthOptions
): (
  request: NextRequest,
  context: { params: Promise<TParams> }
) => Promise<Response>;

// Implementation
export function withAuth<TParams extends Record<string, string | string[]>>(
  handler: AuthenticatedHandler | AuthenticatedHandlerWithParams<TParams>,
  options: WithAuthOptions = {}
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<TParams> }
  ): Promise<Response> => {
    try {
      // Validate session
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check admin role if required
      if (options.requireAdmin) {
        const isAdmin = session.user.role?.includes("admin");
        if (!isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      // Call the handler with the validated session
      if (context !== undefined) {
        // Handler with params
        return await (handler as AuthenticatedHandlerWithParams<TParams>)({
          request,
          params: context.params,
          session,
        });
      } else {
        // Handler without params
        return await (handler as AuthenticatedHandler)({
          request,
          session,
        });
      }
    } catch (error) {
      console.error("Error in authenticated handler:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
