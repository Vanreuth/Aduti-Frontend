import { apiFetch } from "./client";

export function register(payload: any) {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: any) {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiFetch("/api/v1/auth/me");
}

export function logout() {
  return apiFetch("/api/v1/auth/logout", { method: "POST" });
}

export type MeResponse = {
  id: number;
  username: string;
  email: string;
  photo: string | null;
};

export function me(accessToken: string) {
  return apiFetch<MeResponse>("/api/auth/me", { method: "GET" }, accessToken);
}
