import { apiFetch } from "./client";

export type CartItemPayload = {
  productId: number;
  productVariantId: number | null;
  quantity: number;
};

export type CheckoutRequest = {
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: "KHQR" | "CASH" | "CARD";
  items: CartItemPayload[];
};

export type CheckoutResponse = {
  id: number;
  message?: string;
};

export type KHQRResponse = {
  id: number;
  orderId: number;
  method: string;
  status: string;
  amount: number;
  transactionId: string;
  khqrCode: string;
  md5Hash: string;
  createdAt: string;
  paidAt: string | null;
};

export type CashPaymentResponse = {
  orderId: string;
  paymentId: string;
  status: string;
  message?: string;
};

export type VerifyPaymentResponse = {
  id: number;
  orderId: number;
  method: string;
  status: string; // "PENDING" | "COMPLETED" | "FAILED"
  amount: number;
  transactionId: string;
  khqrCode: string;
  md5Hash: string;
  createdAt: string;
  paidAt: string | null;
};

/**
 * Step 1: Create an order from the cart
 * POST /api/orders/checkout
 */
export function createCheckout(
  payload: CheckoutRequest,
  accessToken?: string | null,
) {
  return apiFetch<CheckoutResponse>(
    "/api/orders/checkout",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    accessToken,
  );
}

/**
 * Step 2: Request KHQR code for the order
 * POST /api/orders/{orderId}/payment/khqr
 */
export function generateKHQR(orderId: string, accessToken?: string | null) {
  return apiFetch<KHQRResponse>(
    `/api/orders/${encodeURIComponent(orderId)}/payment/khqr`,
    {
      method: "POST",
      body: JSON.stringify({ method: "KHQR" }),
    },
    accessToken,
  );
}

/**
 * Process cash on delivery payment
 * POST /api/orders/{orderId}/payment/cash
 */
export function processCashPayment(
  orderId: string,
  accessToken?: string | null,
) {
  return apiFetch<CashPaymentResponse>(
    `/api/orders/${encodeURIComponent(orderId)}/payment/cash`,
    {
      method: "POST",
    },
    accessToken,
  );
}

/**
 * Step 3: Poll payment verification status
 * GET /api/orders/{orderId}/payment/{paymentId}/verify
 */
export function verifyPayment(
  orderId: string,
  paymentId: string,
  accessToken?: string | null,
) {
  return apiFetch<VerifyPaymentResponse>(
    `/api/orders/${encodeURIComponent(orderId)}/payment/${encodeURIComponent(paymentId)}/verify`,
    { method: "GET" },
    accessToken,
  );
}

/**
 * Get user's orders
 * GET /api/orders
 */
export function getOrders(accessToken?: string | null) {
  return apiFetch<{ orders: unknown[] }>(
    "/api/orders",
    { method: "GET" },
    accessToken,
  );
}

/**
 * Get single order details
 * GET /api/orders/{orderId}
 */
export function getOrder(orderId: string, accessToken?: string | null) {
  return apiFetch<{ order: unknown }>(
    `/api/orders/${encodeURIComponent(orderId)}`,
    { method: "GET" },
    accessToken,
  );
}
