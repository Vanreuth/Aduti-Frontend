import type { ApiResponse } from "@/types/api";
import { api, apiFetch } from "@/lib/api/client";
import type { Category } from "@/types/product";

export async function getAllCategories(): Promise<Category[]> {
  const json = await api<ApiResponse<Category[]>>("/api/categories");
  return json.data ?? [];
}

export async function getCategoryById(id: string | number): Promise<Category> {
  const encodedId = encodeURIComponent(String(id));
  const json = await api<ApiResponse<Category>>(`/api/categories/${encodedId}`);
  return json.data;
}

export type CategoryRequestPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
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

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/** ✅ Cookie auth (no accessToken) */
export async function createCategory(payload: CategoryRequestPayload) {
  const json = requireResponse(
    await apiFetch<ApiResponse<Category>>("/api/categories", {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    }),
    "Create category response is empty",
  );
  return json.data;
}

/** ✅ Cookie auth (no accessToken) */
export async function updateCategory(id: number, payload: CategoryRequestPayload) {
  const encodedId = encodeURIComponent(String(id));
  const json = requireResponse(
    await apiFetch<ApiResponse<Category>>(`/api/categories/${encodedId}`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    }),
    "Update category response is empty",
  );
  return json.data;
}

/** ✅ Cookie auth (no accessToken) */
export async function deleteCategory(id: number) {
  const encodedId = encodeURIComponent(String(id));
  const json = requireResponse(
    await apiFetch<ApiResponse<null>>(`/api/categories/${encodedId}`, {
      method: "DELETE",
    }),
    "Delete category response is empty",
  );
  return json.data;
}
