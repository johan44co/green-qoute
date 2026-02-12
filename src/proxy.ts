import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Check if user is trying to access protected routes
  if (pathname.startsWith("/quotes") || pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      // Redirect to sign-in if no session cookie
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/quotes/:path*",
    "/admin/:path*",
  ],
};
