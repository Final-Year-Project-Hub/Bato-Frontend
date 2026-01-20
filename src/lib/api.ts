import { ApiRoutes } from "./api/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""; 

export async function apiFetch<K extends keyof ApiRoutes>(
  path: K,
  options?: RequestInit
): Promise<ApiRoutes[K]> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}
