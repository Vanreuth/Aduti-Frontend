export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Auth-aware fetch (JSON + FormData safe)
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  console.log(`[API] ${options.method || "GET"} ${url}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    console.error(`[API Error] ${res.status} ${url}`, data);
    throw new Error(
      data?.message ||
        data?.error ||
        data?.detail ||
        `Request failed (${res.status})`,
    );
  }

  return data as T;
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