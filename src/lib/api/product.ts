import type { ApiResponse, ProductListData } from "@/types/api";
import { request } from "@/lib/api/client";

export async function getAllProducts(params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}) {
  const sp = new URLSearchParams({
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 12),
    sortBy: params?.sortBy ?? "id",
    direction: params?.direction ?? "DESC",
  });
  const json = await request<ApiResponse<ProductListData>>(`/api/products?${sp}`);
  return json.data;
}
