import type { ApiResponse, Category } from "@/types/api";
import { request } from "@/lib/api/client";

export async function getAllCategories(): Promise<Category[]> {
  const json = await request<ApiResponse<Category[]>>(`/api/categories`);
  return json.data ?? [];
}
