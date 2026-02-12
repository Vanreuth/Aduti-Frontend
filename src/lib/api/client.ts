export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const isAuthRoute =
    url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

  // Auto-add Content-Type for JSON bodies (unless already set or it's FormData)
  const headers: HeadersInit = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && !isAuthRoute) {
    // 🔁 Try refresh
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Retry original request
      res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }

      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

/**
 * Public GET helper (no auth, SSR-safe)
 * 👈 THIS is what product.ts & category.ts expect
 */
export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${path}`);
  }

  return res.json();
}
