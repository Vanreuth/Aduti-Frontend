import { apiFetch } from "@/lib/api/client";
import type { GetAdminOrdersParams, Order, OrderStatus } from "@/types/order";

function buildUserIdQuery(params?: GetAdminOrdersParams) {
  const sp = new URLSearchParams();
  if (params?.userId !== undefined) {
    sp.set("userId", String(params.userId));
  }
  return sp.toString();
}

export async function getAdminOrders(params?: GetAdminOrdersParams) {
  const query = buildUserIdQuery(params);
  const endpoint = query ? `/api/orders/all?${query}` : "/api/orders/all";
  const data = await apiFetch<Order[]>(endpoint, { method: "GET" });
  return data ?? [];
}

export async function getMyOrders() {
  const data = await apiFetch<Order[]>("/api/orders", { method: "GET" });
  return data ?? [];
}

export function getOrderById(orderId: number | string) {
  const encodedId = encodeURIComponent(String(orderId));
  return apiFetch<Order>(`/api/orders/${encodedId}`, { method: "GET" });
}

export function updateOrderStatus(orderId: number | string, status: OrderStatus) {
  const encodedId = encodeURIComponent(String(orderId));
  const sp = new URLSearchParams({ status });
  return apiFetch<Order>(`/api/orders/${encodedId}/status?${sp.toString()}`, {
    method: "PUT",
  });
}
