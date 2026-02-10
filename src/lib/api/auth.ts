import { apiFetch } from "./client";

export interface LoginResponse {
  token: string;
  user: MeResponse;
}

export type MeResponse = {
  bio: string;
  username: string;
  email: string;
  photo: string | null;
  phoneNumber: string | null;
  address: string | null;
};

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await res.json();
  return data;
}

export function logout() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function getMe(accessToken: string) {
  return apiFetch<MeResponse>("/api/auth/me", { method: "GET" }, accessToken);
}
