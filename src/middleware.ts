import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // base64url -> base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function redirectToLogin(req: NextRequest) {
  const url = new URL("/login", req.url);
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToForbidden(req: NextRequest) {
  // create a /403
  return NextResponse.redirect(new URL("/", req.url));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals 
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname === "/" ||
    pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  const isChat = pathname.startsWith("/chat");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  const isProtected = isChat || isDashboard || isAdmin;
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("accessToken")?.value;
  if (!token) return redirectToLogin(req);

  const payload = decodeJwtPayload(token);

  const role = payload?.data?.role ?? payload?.role;

  if (!role) return redirectToLogin(req);

  // Admin page => ADMIN only
  if (isAdmin && role !== "ADMIN") {
    return redirectToForbidden(req);
  }

  if ((isChat || isDashboard) && role !== "USER") {
    return redirectToForbidden(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/dashboard/:path*", "/admin/:path*"],
};
