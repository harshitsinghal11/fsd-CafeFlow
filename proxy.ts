import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/src/lib/adminSession";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes
  if (path.startsWith("/admin")) {
    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);
    const isValidSession = adminSession
      ? await verifyAdminSessionToken(adminSession.value)
      : false;

    if (!isValidSession) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

