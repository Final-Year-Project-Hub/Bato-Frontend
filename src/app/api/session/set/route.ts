import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken, refreshToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ ok: false, message: "Missing accessToken" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost
    path: "/",
  });

  if (refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
  }

  return res;
}
