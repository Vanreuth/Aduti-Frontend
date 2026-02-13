export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | (string & {});

export type OrderAmount = number | string;

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productVariantId: number | null;
  quantity: number;
  price: OrderAmount;
  subtotal: OrderAmount;
}

export interface Order {
  id: number;
  userId: number | null;
  userEmail: string | null;
  username: string | null;
  items: OrderItem[];
  totalAmount: OrderAmount;
  status: OrderStatus;
  shippingAddress: string | null;
  phoneNumber: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type GetAdminOrdersParams = {
  userId?: number;
};
