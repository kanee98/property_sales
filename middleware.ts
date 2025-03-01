import { NextRequest, NextResponse } from "next/server";

// List of protected routes
const protectedRoutes = ["/admin", "/dashboard", "/admin/settings"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value; // Assuming you're storing auth token in cookies

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protect specific routes
};
