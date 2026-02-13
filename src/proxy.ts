import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { createRequestLogger } from "./lib/logger";

export async function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const logger = createRequestLogger(
    requestId,
    request.method,
    request.nextUrl.pathname
  );

  logger.info("Incoming request");

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    logger.warn("Unauthorized access - redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const response = NextResponse.next();

  // Add request ID to response headers
  response.headers.set("x-request-id", requestId);

  const duration = Date.now() - startTime;
  logger.info({ duration }, "Request completed");

  return response;
}

export const config = {
  matcher: ["/quotes/:path*", "/admin/:path*"],
};
