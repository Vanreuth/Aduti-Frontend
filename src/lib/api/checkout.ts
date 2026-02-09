import { apiFetch } from "./client";

export type CartItemPayload = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutRequest = {
  items: CartItemPayload[];
  totalAmount: number;
};

export type CheckoutResponse = {
  orderId: string;
  message?: string;
};

export type KHQRRequest = {
  orderId: string;
};

export type KHQRResponse = {
  khqrCode: string;
  orderId: string;
  amount?: number;
};

export type VerifyPaymentResponse = {
  paid: boolean;
  orderId: string;
  status?: string;
};

/**
 * Step 1: Create an order from the cart
 */
export function createCheckout(
  payload: CheckoutRequest,
  accessToken?: string | null,
) {
  return apiFetch<CheckoutResponse>(
    "/api/checkout",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    accessToken,
  );
}

/**
 * Step 2: Request KHQR code for the order
 */
export function generateKHQR(
  payload: KHQRRequest,
  accessToken?: string | null,
) {
  return apiFetch<KHQRResponse>(
    "/api/payment/khqr",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    accessToken,
  );
}

/**
 * Step 3: Poll payment verification status
 */
export function verifyPayment(orderId: string, accessToken?: string | null) {
  return apiFetch<VerifyPaymentResponse>(
    `/api/verify?orderId=${encodeURIComponent(orderId)}`,
    { method: "GET" },
    accessToken,
  );
}
