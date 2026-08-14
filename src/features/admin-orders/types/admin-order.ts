import type { OrderPaymentStatus, OrderStatus } from "@/features/orders/types/order";

export type AdminOrderSortBy =
  "createdAt" | "updatedAt" | "deliveryDate" | "totalAmount" | "orderNumber";
export type SortOrder = "ASC" | "DESC";

export interface AdminOrderQuery {
  keyword?: string;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  createdFrom?: string;
  createdTo?: string;
  deliveryFrom?: string;
  deliveryTo?: string;
  sortBy?: AdminOrderSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface AdminOrderCustomer {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
}

export interface AdminOrderCouponSummary {
  id: string | null;
  code: string;
  name: string | null;
}

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customer: AdminOrderCustomer;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  coupon: AdminOrderCouponSummary | null;
  deliveryDate: string;
  deliveryTimeSlot: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderListResponse {
  items: AdminOrderSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  productCode: string;
  productName: string;
  thumbnailUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface AdminOrderAddress {
  id: string;
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
  createdAt: string;
}

export type PaymentMethod = "MOCK" | "CREDIT_CARD" | "BANK_TRANSFER" | "COD";
export type PaymentRecordStatus =
  "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface AdminOrderPayment {
  id: string;
  paymentNumber: string;
  paymentMethod: PaymentMethod;
  status: PaymentRecordStatus;
  amount: number;
  paidAt: string | null;
}

export interface AdminOrderStatusHistory {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: string | null;
  note: string | null;
  createdAt: string;
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  user: AdminOrderCustomer;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  timestamps: {
    confirmedAt: string | null;
    preparingAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    inventoryRestoredAt: string | null;
  };
  items: AdminOrderItem[];
  deliveryAddress: AdminOrderAddress | null;
  delivery: { date: string; timeSlot: string | null };
  coupon: (AdminOrderCouponSummary & { discountAmount: number }) | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  payments: AdminOrderPayment[];
  statusHistories: AdminOrderStatusHistory[];
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export type { OrderPaymentStatus, OrderStatus };
