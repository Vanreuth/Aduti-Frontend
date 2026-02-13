import type { ApiResponse } from "@/types/api";
import { MeResponse } from "./auth";
import { API_BASE, apiFetch } from "./client";

export type ProfilePayload = {
  name: string;
  address?: string;
  phoneNumber?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

// register user (with FormData, optional photo)
export async function register(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/users/register`, {
    method: "POST",
    body: formData, // ✅ FormData, browser sets Content-Type automatically
  });

  const contentType = res.headers.get("content-type") || "";

  let data: unknown;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message === "string"
          ? data.message
          : "Register failed";
    throw new Error(message);
  }

  return data; // server response
}

export function updateMe(payload: FormData) {
  return apiFetch<MeResponse>("/api/users/me", {
    method: "PUT",
    body: payload,
    credentials: "include", // FormData
  });
}
export type DashboardUser = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  photo: string | null;
  bio: string | null;
  enable: boolean;
  roles: string[];
};

export type UsersPageData = {
  content: DashboardUser[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type GetUsersParams = {
  page?: number;
  size?: number;
  search?: string;
};

function requireResponse<T>(
  response: ApiResponse<T> | null,
  message: string,
): ApiResponse<T> {
  if (response === null) {
    throw new Error(message);
  }
  return response;
}

/** ✅ Cookie auth (no accessToken) */
export async function getUsers(params: GetUsersParams = {}) {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.set("page", String(params.page));
  if (params.size !== undefined) sp.set("size", String(params.size));
  if (params.search?.trim()) sp.set("search", params.search.trim());

  const query = sp.toString();
  const endpoint = query ? `/api/users?${query}` : "/api/users";
  const json = requireResponse(
    await apiFetch<ApiResponse<UsersPageData>>(endpoint, {
      method: "GET",
    }),
    "Users response is empty",
  );

  return json.data;
}

/** ✅ Cookie auth (no accessToken) */
export async function getUserById(id: number | string) {
  const encodedId = encodeURIComponent(String(id));
  const json = requireResponse(
    await apiFetch<ApiResponse<DashboardUser>>(`/api/users/${encodedId}`, {
      method: "GET",
    }),
    "User response is empty",
  );

  return json.data;
}
