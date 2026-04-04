import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/signin" || pathname === "/signup";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isHomeRoute = pathname === "/";

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard/projects", request.url));
  }

  if (token && isHomeRoute) {
    return NextResponse.redirect(new URL("/dashboard/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
