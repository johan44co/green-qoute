import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";

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
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    const logger = createRequestLogger(
      requestId,
      request.method,
      request.nextUrl?.pathname || "unknown"
    );

    try {
      // Validate session
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        logger.warn("Unauthorized API request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      logger.info({ userId: session.user.id }, "Authenticated request");

      // Check admin role if required
      if (options.requireAdmin) {
        const isAdmin = session.user.role?.includes("admin");
        if (!isAdmin) {
          logger.warn(
            {
              userId: session.user.id,
            },
            "Forbidden - admin role required"
          );
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      // Call the handler with the validated session
      let response: Response;
      if (context !== undefined) {
        // Handler with params
        response = await (handler as AuthenticatedHandlerWithParams<TParams>)({
          request,
          params: context.params,
          session,
        });
      } else {
        // Handler without params
        response = await (handler as AuthenticatedHandler)({
          request,
          session,
        });
      }

      const duration = Date.now() - startTime;
      logger.info(
        {
          status: response.status,
          duration,
        },
        "Request completed"
      );

      // Add request ID to response headers
      response.headers.set("x-request-id", requestId);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error({ err: error, duration }, "Error in authenticated handler");

      const response = NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
      response.headers.set("x-request-id", requestId);

      return response;
    }
  };
}
