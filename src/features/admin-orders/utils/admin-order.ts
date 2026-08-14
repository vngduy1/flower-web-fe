import type {
  AdminOrderQuery,
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentRecordStatus,
} from "../types/admin-order";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
export const PAYMENT_STATUSES: OrderPaymentStatus[] = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  MOCK: "モック決済",
  CREDIT_CARD: "クレジットカード",
  BANK_TRANSFER: "銀行振込",
  COD: "代金引換",
};

export const PAYMENT_RECORD_STATUS_LABELS: Record<PaymentRecordStatus, string> = {
  PENDING: "処理中",
  PAID: "支払い済み",
  FAILED: "失敗",
  CANCELLED: "キャンセル",
  REFUNDED: "返金済み",
};

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function getValidNextStatuses(
  status: OrderStatus,
  paymentStatus: OrderPaymentStatus,
) {
  return ORDER_TRANSITIONS[status].filter(
    (next) => next !== "CONFIRMED" || paymentStatus === "PAID",
  );
}

const sortFields = [
  "createdAt",
  "updatedAt",
  "deliveryDate",
  "totalAmount",
  "orderNumber",
] as const;

export function parseAdminOrderQuery(params: URLSearchParams): AdminOrderQuery {
  const page = Number(params.get("page"));
  const status = params.get("status");
  const paymentStatus = params.get("paymentStatus");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  return {
    keyword: params.get("keyword") || undefined,
    status: ORDER_STATUSES.find((value) => value === status),
    paymentStatus: PAYMENT_STATUSES.find((value) => value === paymentStatus),
    createdFrom: params.get("createdFrom") || undefined,
    createdTo: params.get("createdTo") || undefined,
    deliveryFrom: params.get("deliveryFrom") || undefined,
    deliveryTo: params.get("deliveryTo") || undefined,
    sortBy: sortFields.find((value) => value === sortBy),
    sortOrder: sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}
