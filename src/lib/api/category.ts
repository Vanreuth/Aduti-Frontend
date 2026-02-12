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

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/** ✅ Cookie auth (no accessToken) */
export async function createCategory(payload: CategoryRequestPayload) {
  const json = await apiFetch<ApiResponse<Category>>("/api/categories", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return json.data;
}

/** ✅ Cookie auth (no accessToken) */
export async function updateCategory(id: number, payload: CategoryRequestPayload) {
  const encodedId = encodeURIComponent(String(id));
  const json = await apiFetch<ApiResponse<Category>>(
    `/api/categories/${encodedId}`,
    {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    },
  );
  return json.data;
}

/** ✅ Cookie auth (no accessToken) */
export async function deleteCategory(id: number) {
  const encodedId = encodeURIComponent(String(id));
  const json = await apiFetch<ApiResponse<null>>(`/api/categories/${encodedId}`, {
    method: "DELETE",
  });
  return json.data;
}
