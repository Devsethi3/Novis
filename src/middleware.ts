// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define the routes that should be protected
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Check if the requested path is in the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login page if there's no token and trying to access a protected route
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else if (
    token &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    // Redirect to dashboard if user is already logged in and trying to access login or register page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
