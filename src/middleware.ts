import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

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
  return NextResponse.redirect(new URL("/", req.url));
}

function redirectAuthedUserHome(req: NextRequest, role?: string) {
  // choose where logged-in users should go
  if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
  return NextResponse.redirect(new URL("/chat", req.url));
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // skip Next internals + api
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.data?.role ?? payload?.role;

  const isLogin = pathname === "/login";
  const isSignup = pathname.startsWith("/signup");

  if ((isLogin || isSignup) && token) {
    // if token exists but can't be decoded, still let them login
    // (prevents lockout on bad/expired tokens)
    if (payload) return redirectAuthedUserHome(req, role);
    return NextResponse.next();
  }

  // Public home stays public
  if (pathname === "/") return NextResponse.next();

  const isChat = pathname.startsWith("/chat");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isProtected = isChat || isDashboard || isAdmin;

  if (!isProtected) return NextResponse.next();

  //  allow chat bootstrap hit (tokens in URL)
  if (
    isChat &&
    searchParams.get("accessToken") &&
    searchParams.get("refreshToken")
  ) {
    return NextResponse.next();
  }

  if (!token) return redirectToLogin(req);

  // If we can't decode, treat as not logged in
  if (!payload) return redirectToLogin(req);

  // If no role, let them through (you chose this behavior)
  if (!role) return NextResponse.next();

  if (isAdmin && role !== "ADMIN") return redirectToForbidden(req);
  if ((isChat || isDashboard) && role !== "USER") return redirectToForbidden(req);

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup/:path*", "/chat/:path*", "/dashboard/:path*", "/admin/:path*"],
};
