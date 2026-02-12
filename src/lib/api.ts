import { ApiRoutes } from "./api/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiFetch<K extends keyof ApiRoutes>(
  path: K,
  options?: RequestInit
): Promise<ApiRoutes[K]> {
  const token = localStorage.getItem("token");

  // Check if body is FormData
  const isFormData = options?.body instanceof FormData;

  // Build headers conditionally
  const headers: Record<string, string> = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Only add Content-Type for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Merge with any additional headers from options
  if (options?.headers) {
    const additionalHeaders = options.headers as Record<string, string>;
    Object.assign(headers, additionalHeaders);
  }

  try {
    console.log("API Fetch - URL:", `${API_BASE_URL}${String(path)}`);
    console.log("API Fetch - Method:", options?.method || "GET");
    console.log("API Fetch - Is FormData:", isFormData);

    const res = await fetch(`${API_BASE_URL}${String(path)}`, {
      credentials: "include",
      headers,
      ...options,
    });

    console.log("API Fetch - Response Status:", res.status);

    if (!res.ok) {
      const rawText = await res.text().catch(() => "");
      console.error("API error - status:", res.status);
      console.error("API error - raw body:", rawText);

      let message = "";
      try {
        const errorData = JSON.parse(rawText);
        message =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          JSON.stringify(errorData);
      } catch {
        message = rawText.trim();
      }

      throw new Error(message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json().catch(() => null);
    console.log("API Fetch - Response Data:", data);

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}