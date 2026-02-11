//
// src/lib/api/auth.ts
import { apiFetch } from "./client";

export type MeResponse = {
  username: string;
  email: string;
  bio: string;
  photo: string | null;
  phoneNumber: string | null;
  address: string | null;
};

export type LoginResponse = {
  token: string;
  user: MeResponse;
};

export async function loginApi(data: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
}

export function getMe(token: string) {
  return apiFetch<MeResponse>("/api/auth/me", { method: "GET" }, token);
}

export function logout() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}
