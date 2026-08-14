import type { CartCurrency } from "@/features/cart/types/cart";

export type OrderStatus =
  "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderPaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface CreateOrderRequest {
  addressId: string;
  deliveryDate: string;
  timeSlotId: string;
  couponCode?: string;
  note?: string;
}

export interface CreateOrderVariables {
  request: CreateOrderRequest;
  idempotencyKey: string;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface CancelOrderVariables {
  orderId: string;
  request: CancelOrderRequest;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productCode: string;
  productName: string;
  productSlug: string | null;
  thumbnailUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAddressSnapshot {
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  currency: Omit<CartCurrency, "code"> & { code: string };
  items: OrderItem[];
  deliveryAddress: OrderAddressSnapshot | null;
  delivery: {
    date: string;
    timeSlotId: string | null;
    timeSlot: string | null;
    fee: number;
  };
  coupon: {
    id: string | null;
    code: string;
    name: string | null;
    discountAmount: number;
  } | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderListItem = Order;

export type OrderDetail = Order;
