import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/src/utils/adminSession";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except /admin/login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);
    const isValidSession = adminSession
      ? await verifyAdminSessionToken(adminSession.value)
      : false;

    if (!isValidSession) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
