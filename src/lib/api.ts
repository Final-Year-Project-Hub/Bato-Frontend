import { ApiRoutes } from "./api/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiFetch<K extends keyof ApiRoutes>(
  path: K,
  options?: RequestInit
): Promise<ApiRoutes[K]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${String(path)}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => null);
  return data;
}
