import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: Request) {
  const { accessToken, refreshToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json(
      { ok: false, message: "Missing accessToken" },
      { status: 400 }
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost
    path: "/",
    maxAge: 60 * 60 * 24, // ← 24 hours (86400 seconds)
  });

  if (refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24  
    })
  }

  return res;
}

// ✅ Google login redirect can hit this
export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("accessToken");
  const refreshToken = url.searchParams.get("refreshToken");
  const next = url.searchParams.get("next") || "/chat";

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = NextResponse.redirect(new URL(next, req.url));

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost
    path: "/",
    maxAge: 60 * 60 * 24, // ← 24 hours
  });

  if (refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 ,
    });
  }

  return res;
}