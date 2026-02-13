export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> {
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

  // 🔁 Auto refresh if expired
  if (res.status === 401 && !isAuthRoute) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login?expired=true";
      }
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    let errorBody: any = null;
    try {
      errorBody = await res.json();
    } catch {}

    throw new Error(errorBody?.message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return null;
}


export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} - ${path}`);
  return res.json();
}
