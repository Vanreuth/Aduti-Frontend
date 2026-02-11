export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Auth-aware fetch (JSON + FormData safe)
 */
// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const res = await fetch(`${API_BASE}${url}`, {
//     ...options,
//     credentials: "include", // ensure always included
//   });

//   const contentType = res.headers.get("content-type") || "";
//   const data = contentType.includes("application/json")
//     ? await res.json()
//     : await res.text();

//   if (!res.ok) {
//     throw new Error(
//       data?.message ||
//         data?.error ||
//         data?.detail ||
//         `Request failed (${res.status})`,
//     );
//   }

//   return data as T;
// }

// Version 2
// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const headers: HeadersInit = {
//     ...(options.headers || {}),
//   };

//   // Automatically set JSON header if body is string
//   if (options.body && !(options.body instanceof FormData)) {
//     headers["Content-Type"] = "application/json";
//   }

//   const res = await fetch(`${API_BASE}${url}`, {
//     ...options,
//     headers,
//     credentials: "include",
//   });

//   const contentType = res.headers.get("content-type") || "";
//   const data = contentType.includes("application/json")
//     ? await res.json()
//     : await res.text();

//   if (!res.ok) {
//     throw new Error(
//       data?.message ||
//         data?.error ||
//         data?.detail ||
//         `Request failed (${res.status})`,
//     );
//   }

//   return data as T;
// }

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const isAuthRoute =
    url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
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
