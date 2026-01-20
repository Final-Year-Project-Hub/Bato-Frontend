"use server";

import { cookies } from "next/headers";

const BASE = process.env.API_URL!;

export async function getSignedInUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  console.log("COOKIE HEADER SENT:", cookieHeader); 

  const res = await fetch(`${BASE}/auth/profile`, {
    method: "GET",
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  console.log("PROFILE STATUS:", res.status);

  if (!res.ok) return null;
  return res.json();
}
